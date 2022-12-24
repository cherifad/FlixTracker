<template>
    <div class="">
        <h1 class="text-5xl font-semibold text-white my-5">Trending Movies</h1>
        <div v-if="movies" class="flex flex-wrap">
            <RouterLink class="px-3 w-1/2  py-5" v-for="movie in movies" :to="{ name: 'MovieDetails', params: { slug: slugify(movie.title), id: movie.id } }" :key="movie.id">
                <SingleMovieCardVue
                    :title="movie.title"
                    :poster_path="movie.backdrop_path"
                    :release_date="movie.release_date"
                    :vote_average="movie.vote_average"
                    />
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SingleMovieCardVue from '../components/Cards/SingleMovieCard.vue';
import { getMovieTrending } from '../api/tmdb';
import { slugify } from '../utils/funcHelper';
import { RouterLink } from 'vue-router';

const movies = ref(null);

onMounted(() => {
    getMovieTrending().then((res) => {
        movies.value = res;
    });
});

</script>

<style scoped>

</style>