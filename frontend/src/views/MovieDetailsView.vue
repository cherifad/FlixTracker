<template>
    <div v-if="movie" class="px-5">
        <div class="relative">
            <span class=" font-extralight"><router-link class=" underline" to="/app">Movie</router-link> / {{ movie.title }}</span>
            <!-- <div class="absolute -z-10 w-full h-full top-0" :style="{'background-image': `url('https://image.tmdb.org/t/p/w500/${movie.backdrop_path}')`}"></div> -->
            <div class="flex gap-5">           
                <img class=" rounded-xl shadow-xl" :src="config.TMDB_API_IMAGE_URL + config.TMDB_API_IMAGE_SIZE_LARGE + movie.poster_path" :alt="movie.title + ' movie poster'">     
                <div class="flex flex-col gap-3">
                    <ul class="flex gap-3">
                        <li class="px-4 py-1 bg-slate-800 rounded-full" v-for="genre in movie.genres" :key="genre.id">{{ genre.name }}</li>
                    </ul>
                    <p v-if="movie.tagline" class=" italic">{{movie.tagline}}</p>
                    <h1 class="text-6xl z-50 font-semibold text-white">{{ movie.title }}</h1>   
                    <a :href="'https://www.themoviedb.org/movie/' + movie.id" target="_blank" class="flex items-center font-semibold gap-3">
                        <img src="../assets/tmdb.svg" class=" h-4" alt="TMDB logo">
                        {{ truncate(movie.vote_average, 2) }} / 10
                    </a> 
                    <div class="flex gap-5 mt-10">
                        <div class="flex items-center gap-3 cursor-pointer font-medium">
                            <i class="bg-white p-3 rounded-xl">                            
                                <svg class="w-6 h-6 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                                </svg>
                            </i>
                            Add to watchlist
                        </div> 
                        <div class="flex items-center gap-3 cursor-pointer font-medium">
                            <i class="bg-white p-3 rounded-xl">                            
                                <svg class="w-6 h-6 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                            </i>
                            Rate this movie
                        </div> 
                    </div>
                    <p>
                        {{ movie.overview }}
                    </p>             
                </div>
            </div>
            
        </div>
        <div>
            <h2 class="text-3xl font-semibold mt-10">Cast</h2>
            <div class="flex flex-wrap gap-5 mt-5">
                <PeopleCardVue v-for="person in cast" :key="person.id" :name="person.name" :id="person.id" :caracter_name="person.character" :profil_path="person.profile_path" />
            </div>
        </div>
        {{ movie }} <br>
        {{ cast }}
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { movieWatchProviders, getMovieDetails, movieCast } from '../api/tmdb';
import { useRoute } from 'vue-router';
import axios from 'axios';
import config from '../config';
import imdbPlugin from '../components/Rating/imdbPlugin.vue';
import { truncate } from '../utils/funcHelper';
import PeopleCardVue from '../components/Cards/PeopleCard.vue';

const route = useRoute();
const id = route.params.id;

const watchproviders = ref(null);
movieWatchProviders(id).then((res) => {
    watchproviders.value = res;
});

const movie = ref(null);
getMovieDetails(id).then((res) => {
    movie.value = res;
});

const cast = ref(null);
movieCast(id).then((res) => {
    cast.value = res;
});

</script>