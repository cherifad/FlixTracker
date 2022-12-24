<template>
    <div id="card-main" class="flex p-10 pt-40 flex-col justify-end" v-bind:style="{ 'background-image': 'url(' + imageUrl + ')' }">
        <div class="w-1/2">
            <h1 class="mb-5 font-semibold text-5xl">{{ title }}</h1>
            <div class="flex gap-5 border-t border-slate-200 pt-5">
                <div>
                    <p class="font-bold mb-3">RELASED</p>
                    <p>{{ getYear(release_date) }}</p>
                </div>
                <div>
                    <p class="font-bold mb-3">RATING</p>
                    <p class="">{{ twoDigits(vote_average) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import config from '../../config';

const props = defineProps({
    title: String,
    poster_path: String,
    release_date: String,
    vote_average: Number,
});

const imageUrl = ref(config.TMDB_API_IMAGE_URL + config.TMDB_API_IMAGE_SIZE_ORIGINAL + props.poster_path);

const getYear = (string) => {
    return string.split('-')[0];
}

// function to add two dogits after the decimal point
const twoDigits = (number) => {
    return number.toFixed(2);
}

</script>

<style scoped>
*{
    transition: all 0.2s ease-in-out;
}
#card-main {
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
    height: 500px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;
    cursor: pointer;
}

#card-main:hover {
    background-size: 110%;
}
</style>