У Django обробка файлів і зображень відбувається через поля моделей
- `FileField` для будь-яких файлів (pdf, zip тощо)
- `ImageField` для зображень (png, jpg тощо).

Для останньої в проєкті повинна міститись бібліотека pillow.

Далі в налаштуваннях `mysite/settings.py` необхідно додати відносну 
адресу та директорію, де зберігатимуться файли 
```python
MEDIA_URL = "/media/"            # URL, через який отримуємо файли
MEDIA_ROOT = BASE_DIR / "media"  # Шлях, де вони зберігатимуться
```

Якщо працюємо без реверс-проксі сервера, який обслуговує статичні та 
медіафайли, то в режимі розробки варто додати в файл `mysite/urls.py` 
дозвіл обслуговування таких файлів
```python
# mysite/urls.py
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    ...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```
У випадку наявності реверс-проксі, необхідно налаштувати його на 
роботу зі статичними файлами. 

Далі переходимо до описання моделей, наприклад,
```python
# myapp/models.py
from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to="docs/") 


class Photo(models.Model):
    caption = models.CharField(max_length=100)
    image = models.ImageField(upload_to="images/")  
```

В результаті файли будуть зберігатися згідно з такою структурою:
```
media/
├── docs/
│   └── mydocument.pdf
└── images/
    └── myphoto.jpg
```

Форма для завантаження може мати вигляд, наприклад, такий
```python
# myapp/forms.py
from django import forms
from .models import Photo

class PhotoForm(forms.ModelForm):
    class Meta:
        model = Photo
        fields = ["caption", "image"]
```

До відображень файли передаються через `request.FILES`, тому 
потрібно обробити як атрибут `POST`, так і атрибут `FILES`
```python
# myapp/views.py
from django.shortcuts import render, redirect
from .forms import PhotoForm

def upload_photo(request):
    if request.method == "POST":
        form = PhotoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect("photo_list")
    else:
        form = PhotoForm()
    return render(request, "upload_photo.html", {"form": form})
```

Потім необхідно описати шаблон HTML-форми, яка обов’язково 
повинна містити атрибут `enctype="multipart/form-data"`, що 
дозволяє передавати текстові та бінарні файли
```html
<form method="post" enctype="multipart/form-data">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Завантажити</button>
</form>
```

Для використання файлу у шаблоні, необхідно звернутися до 
нього за його параметрами 
```html
{% for photo in photos %}
  <p>{{ photo.caption }}</p>
  <img src="{{ photo.image.url }}" alt="{{ photo.caption }}" width="200">
{% endfor %}
```
