<template>
  <div class="movie-details-page">
    <div v-if="loading" class="loading">Завантаження ...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="movieDetails" class="movie-details">
      <div class="poster">
        <img :src="movieDetails.Poster" :alt="movieDetails.title"
             v-if="movieDetails.Poster&& movieDetails.Poster!=='N/A'">
        <div v-else> Немає постеру</div>
      </div>
      <div class="details">
        <h1>{{movieDetails.Title}}</h1>
        <p><strong>Рік:</strong>{{movieDetails.Year}}</p>
        <p><strong>Жанр:</strong>{{movieDetails.Genre}}</p>
        <p><strong>Режисери:</strong>{{movieDetails.Director}}</p>
        <p><strong>Актори:</strong>{{movieDetails.Actors}}</p>
        <p><strong>Збори:</strong>{{movieDetails.BoxOffice}}</p>
        <p><strong>Рейтинг:</strong>{{movieDetails.imdbRating}}</p>
        <p><strong>Час:</strong>{{movieDetails.Runtime}}</p>
        <p><strong>Опис:</strong>{{movieDetails.Plot}}</p>
      </div>
    </div>


  </div>
</template>

<script setup>
import {watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useMovies} from "../composables/useMovies.js";

const router = useRouter();
const route = useRoute();
const {movieDetails, loading, error, getMovieById} = useMovies();

watch(() => route.params.id, (id) => {
  if (id) getMovieById(id)
}, {immediate: true})

</script>

<style scoped>
.movie-details-page{
  margin: 0 auto;
}

.loading,.error{
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
.movie-details{
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  background: whitesmoke;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.poster{
  width: 100%;
  border-radius: 8px;
}

.no-poster{
  width: 100%;
  height: 400px;
  background: #ddd;
  display: flex;
  align-items: center;
  border-radius: 8px;
}

.details h1 {
  margin-bottom: 1rem;
}
.details p{
  margin-bottom: 0.75rem;
  line-height: 1.6;
}
.details strong{
  color: #2c3e50;
}



</style>