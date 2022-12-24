<template>
    <div v-if="profil_path" id="card-main" :style="{'background-image': background_image}" class="flex rounded-xl flex-col justify-end p-5">
        <h1 class=" mt-52 font-bold">{{ name }}</h1>
        <h2>{{ caracter_name }}</h2>
    </div>
</template>

<script setup>
import config from '../../config';

const props = defineProps({
    name: String,
    id: Number,
    caracter_name: String,
    profil_path: String
})

const background_image = `url('${config.TMDB_API_IMAGE_URL}${config.TMDB_API_IMAGE_SIZE_PROFILE}/${props.profil_path}')`
</script>

<style scoped>
*{
    transition: all 0.2s ease-in-out;
}
#card-main {
    background-size: cover;
    background-clip: border-box;
    background-position: center;
    background-repeat: no-repeat;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    width: 10%;
    height: 300px;
}
</style>