<template>
  <span
    class="imdbRatingPlugin w-fit"
    data-user="ur131878596"
    :data-title="imdbID"
    data-style="p1"
    id="imdbRatingPlugin"
  >
    <a href="https://www.imdb.com/title/tt1630029/?ref_=plg_rt_1"> </a>
  </span>
</template>

<script setup>
import { ref, onMounted } from "vue";
const rating = ref(null);

const props = defineProps({
    imdbID: {
        type: String,
        required: true,
    },
});

function waitForElement(selector) {
  return new Promise((resolve, reject) => {
    requestIdleCallback(() => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else {
        reject(new Error('Element not found'));
      }
    });
  });
}

onMounted(() => {
    (function (d, s, id) {
        var js,
        stags = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
        return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src =
        "https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";
        stags.parentNode.insertBefore(js, stags);
    })(document, "script", "imdb-rating-api");

    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOMContentLoaded");
        waitForElement("#imdbRatingPlugin span.rating").then((element) => {
            console.log(element);
        });
    });

    
});
</script>

<style scoped>
#imdbRatingPlugin {
    display: flex !important;
}
</style>
