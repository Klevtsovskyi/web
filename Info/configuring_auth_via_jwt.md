# Налаштування автентифікації через JWT

### 1. Додати в залежності бібліотеку для роботи з JWT 
```text
djangorestframework-simplejwt
```
Увімкнути підтримку JWT у файлі settings.py 
```python
# settings.py
from datetime import timedelta

...

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ]
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=10),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}
```
### 2. Описати точки доступу в Django для отримання токенів
```python 
# api/views.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        refresh_token = response.data["refresh"]

        response.set_cookie(
            "refresh_token",           # Назва cookie
            refresh_token,             # Значення cookie
            max_age=7 * 24 * 60 * 60,  # Коли пройде 7 діб, браузер видалить cookie
            httponly=True,      # Cookie не можна буде прочитати через JS
            secure=True,        # Cookie передається тільки через HTTPS
            samesite="Lax",     # Політика передачі cookie між доменами.
                                # Cookie надсилається при переходах між сторінками (link, redirect),
                                # але не надсилається через функцію fetch()
            path="/api/token/"  # Cookie надсилається лише на URL, що починається з path
        )
        del response.data["refresh"]

        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token is None:
            return Response({"detail": "Refresh-токен не надано"}, status=401)

        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Вихід із системи"})
        # Видалення cookie з заданим path, оскільки можуть існувати декілька cookie
        # з однаковим імʼям, але різними значеннями path
        response.delete_cookie("refresh_token", path="/api/token/")
        return response
```
```python
# api/urls.py
from django.urls import path
from .views import CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView

urlpatterns = [
    path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="api_logout"),
]
```
### 3. Описати утиліти для створення запитів на REST API
```javascript
// utils/apiPublic.js
import axios from "axios";

const apiPublic = axios.create({
  baseURL: "/api",
  withCredentials: true  // чи відправляти cookies
});

export default apiPublic;
```
```javascript
// utils/apiPrivate.js
import axios from "axios";

const apiPrivate = axios.create({
  baseURL: "/api",
  withCredentials: true 
});

export function setAccessTokenToHeaders(token) {
  if (token) {
    apiPrivate.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiPrivate.defaults.headers.common["Authorization"];
  }
}

export default apiPrivate;
```
### 4 Описати Pinia-сховище для роботи з автентифікацією на фронтальній частині
```javascript
// stores/authStore.js
import {defineStore} from 'pinia';
import apiPrivate, {setAccessTokenToHeaders} from '@/utils/apiPrivate.js';
import apiPublic from "@/utils/apiPublic.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        access: null,
        isRefreshing: false,
        queue: []
    }),

    actions: {
        async login(username, password) {
            const {data} = await apiPublic.post('/token/', {username, password});

            this.access = data.access;
            setAccessTokenToHeaders(data.access);

            return true;
        },

        async logout() {
            await apiPrivate.post('/logout/');
            this.access = null;
            setAccessTokenToHeaders(null);
        },

        async refreshAccessToken() {
            if (this.isRefreshing) {
                return new Promise(r => {
                    this.queue.push(r)
                });
            }

            this.isRefreshing = true;
            try {
                const {data} = await apiPublic.post('/token/refresh/');
                this.access = data.access;

                setAccessTokenToHeaders(data.access);

                this.queue.forEach(r => r(data.access));
                this.queue.length = 0;

                return data.access;
            } catch (err) {
                return null;
            } finally {
                this.isRefreshing = false;
            }
        },
    }
});
```
### 5. Описати перехоплювачі для автоматичного отримання JWT
```javascript
// utils/interseptors.js
import apiPrivate from "@/utils/apiPrivate.js";
import {useAuthStore} from "@/stores/authStore.js";
import axios from "axios";


export function installInterceptors() {

    apiPrivate.interceptors.request.use(async (config) => {
        const authStore = useAuthStore();

        if (!authStore.access) {
            const token = await authStore.refreshAccessToken();
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            else {
                throw new axios.Cancel();
            }
        }

        return config;
    });

    // Цей перехоплювач потрібен для випадку, коли токен буде прострочений
    apiPrivate.interceptors.response.use(res => res, async error => {
        const authStore = useAuthStore();

        if (error.response?.status === 401 && error.config._retry === undefined) {
          error.config._retry = true;
          const newToken = await authStore.refreshAccessToken();
          if (newToken) {
              error.config.headers["Authorization"] = `Bearer ${newToken}`;
              return apiPrivate.request(error.config);
          }
        }

        return Promise.reject(error);
      }
    )
}
```
### 6. Увімкнути перехоплювачі у кореневому компоненті
```vue
<!-- App.vue -->
<script setup>
import {installInterceptors} from "@/utils/interceptors.js";
import {onMounted} from "vue";
import {useAuthStore} from "@/stores/authStore.js";

installInterceptors();

const authStore = useAuthStore();
onMounted(async () => {
  try {
    await authStore.refreshAccessToken();
  } catch (e) {
  }
});
</script>
...
```
### 7. Описати форму для входу в систему
```vue
<!-- views/Login.vue -->
<script setup>
import {ref} from "vue";
import {useAuthStore} from "@/stores/authStore.js";
import router from "@/utils/router.js";

const authStore = useAuthStore();

const form = ref({
  username: "",
  password: ""
});
const error = ref(null);
const loading = ref(false);

async function handleLogin() {
  error.value = null;
  loading.value = true;

  try {
    const ok = await authStore.login(form.value.username, form.value.password);
    if (ok)
      await router.push({name: "Home"});

  } catch (e) {
    console.log(e);
    error.value = "Хибне імʼя користувача або пароль!";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div v-if="error" v-text="error" class="alert alert-danger"></div>
  <h1>Вхід</h1>
  <form @submit.prevent="handleLogin" class="flex flex-col gap-4 max-w-md">
    <div class="form-group">
      <label>
        Логін
        <input class="form-control" type="text" v-model="form.username" required>
      </label>
    </div>
    <div class="form-group">
      <label>
        Пароль
        <input class="form-control" type="password" v-model="form.password" required>
      </label>
    </div>
    <div class="form-group">
      <input
          class="btn btn-success"
          type="button"
          :disabled="loading"
          :value="loading ? 'Зачекайте' : 'Увійти' "
          @click="handleLogin"
      >
    </div>

  </form>
</template>
```
### 8. Зареєструвати форму входу в routers.js
```js
// utils/routes.js
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
      ...
    {
      path:"/login",
      name:"Login",
      component: () => import("@/views/Login.vue")
    }
  ],
});

export default router;
```


# Налаштування прав доступу 
### 1. Описати шлях для отримання даних про поточного користувача
```python
# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers


class UserMeSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True, slug_field="name", read_only=True
    )
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "groups", "permissions"]

    def get_permissions(self, obj):
        perms = obj.get_all_permissions()
        return list(perms)
```
```python
# views.py
...

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserMeSerializer(request.user).data)
```
```python
# urls.py
...

urlpatterns += [
    path("me/", MeView.as_view(), name="api_me"),
]
```
### 2. Додати до файлу authStore.js 
```javascript
// stores/authStore.js
...
    state: () => ({
        ...
        user: null,
        groups: [],
        permissions: [],
    }),
    
    actions: {
        ...
            async loadUser() {
            try {
                const response = await apiPrivate.get("/me/");
                this.user = response.data;
                this.groups = response.data.groups;
                this.permissions = response.data.permissions;
            } catch {
                this.removeUser();
            }
        },

        removeUser() {
            this.user = null;
            this.groups = [];
            this.permissions = [];
        },

        hasGroup(name) {
            return this.groups.includes(name);
        },

        hasPermission(perm) {
            return this.permissions.includes(perm);
        }
    }
```
### 3. Додати команду 
```javascript
await this.loadUser();
```
у файлі authStore.js після кожного отримання токена доступу та команду
```javascript
this.removeUser();
```
після вилучення токена. 
