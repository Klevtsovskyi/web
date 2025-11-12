<template>
 <div class="movie-card">
   <img v-if="movie.Poster && movie.Poster!=='N/A'" :src="movie.Poster" :alt="movie.Title">
   <div v-else class="no-poster">Немає Постеру</div>
   <div class="movie-info">
     <h3>{{movie.Title}}</h3>
     <p>{{movie.Year}}</p>
   </div>
 </div>
</template>


<script setup>
defineProps({
  movie:{
    type: Object,
    required: true
  }
})
</script>


<style scoped>
.movie-card{
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.movie-card:hover{
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
img{
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.no-poster{
  width: 100%;
  height: 300px;
  background: #ddd;
  display: flex;
  align-content: center;
  color: #666;
}
.movie-info{
  padding: 1rem;

}

.movie-info h3{
  margin-bottom: 0.5rem;
  color: #2c3e50;
}
.movie-info p{
  margin: 0.25rem 0;
  color: #666;
}
</style>