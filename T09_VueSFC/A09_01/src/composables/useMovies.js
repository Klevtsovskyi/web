import {ref} from "vue";

const APIKEY = "bb4ca6c8"
const APIURL = 'https://www.omdbapi.com/'


export function useMovies() {
    const movies = ref([])
    const loading = ref(false);
    const error = ref(null);
    const movieDetails = ref(null)

    const searchMovies = async (query) =>{
        loading.value = true
        error.value = null
        //  Panda Kungfu    Panda%20Kungfu
        try{
            const response = await fetch(`${APIURL}?apikey=${APIKEY}&s=${encodeURIComponent(query)}`)
            const data = await response.json();
            if (data.Response === 'True') {
                movies.value = data.Search || []
            } else {
                movies.value = []
                error.value = data.Error || 'Фільми не знайдено'
            }
        }catch (e){
            error.value = "Помилка при завантаженні"
            movies.value = []
        }
        finally {
            loading.value = false
        }
    }

    const getMovieById = async (id) => {
        loading.value= true
        error.value = null

        try{
            const response = await fetch(`${APIURL}?apikey=${APIKEY}&i=${id}&plot=full`)
            const data = await response.json();
            console.log(data)
            if (data.Response === "True"){
                movieDetails.value = data
            }else{
                error.value = data.Error || "Фільм не знайдено"
                movieDetails.value = null
            }
        }catch (e){
            error.value = "Помилка при завантаженні"
            movieDetails.value = null
        }finally {
            loading.value = false
        }
    }

    return{
        movies,loading,error,movieDetails,searchMovies,getMovieById
    }



}
