<template>
  <div class="home-page">
    <h1>Пошук Фільмів</h1>
    <MovieSearch v-model="searchQuery"></MovieSearch>
  </div>

  <div v-if="loading" class="loading">Завантаження .....</div>
  <div v-if="error" class="error"> {{ error }}</div>

  <div v-if="movies.length>0" class="movies-grid">
    <MovieCard v-for="movie in movies"
               :key="movie.imdbID"
               :movie="movie"
               @click="router.push(`/movie/${movie.imdbID}`)"
    />

  </div>
  <div v-if="movies.length===0 && !loading && !error && searchQuery" class="no-results">
    Фільми не знайдено
  </div>
</template>


<script setup>
import {ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useMovies} from "../composables/useMovies.js"
import MovieSearch from "@/components/MovieSearch.vue";
import MovieCard from "@/components/MovieCard.vue";

const router = useRouter();
const {movies, loading, error, searchMovies} = useMovies();

const searchQuery = ref("");
watch(searchQuery, (query) => {
  if (query.length > 2) {
    searchMovies(query)
    console.log(query)
  } else {
    movies.value = []
  }
})

</script>


<style scoped>

.home-page h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.error {
  color: red;
}

.no-results {
  color: #666;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}
</style>