import config from '../config'
import axios from 'axios';

const baseUrl = config.TMDB_API_URL;
const apiKey = config.TMDB_API_KEY;

async function getGenres() {
  try {
    const response = await axios.get(
      `${config.TMDB_API_URL}/genre/movie/list`,
      {
        params: {
          api_key: config.TMDB_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

async function getMoviesByGenre(genreId) {
    try {
        const response = await axios.get(
            `${config.TMDB_API_URL}/discover/movie`,
            {
                params: {
                    api_key: config.TMDB_API_KEY,
                    with_genres: genreId,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

async function getMovieTrending() {
    try {
        const response = await axios.get(
            `${config.TMDB_API_URL}/trending/movie/week`,
            {
                params: {
                    api_key: config.TMDB_API_KEY,
                },
            }
        );
        return response.data["results"];
    } catch (error) {
        console.error(error);
    }
};

const getMovieDetails = (movieId) => {
  const endpoint = `/movie/${movieId}`;
  const url = `${baseUrl}${endpoint}?api_key=${apiKey}`;
  return axios.get(url).then((response) => response.data);
}

const movieWatchProviders = (movieId) => {
  const endpoint = `/movie/${movieId}/watch/providers`;
  const url = `${baseUrl}${endpoint}?api_key=${apiKey}`;
  return axios.get(url).then((response) => response.data);
}

const movieVideos = (movieId) => {
  const endpoint = `/movie/${movieId}/videos`;
  const url = `${baseUrl}${endpoint}?api_key=${apiKey}`;
  return axios.get(url).then((response) => response.data);
}

const movieCast = (movieId) => {
  const endpoint = `/movie/${movieId}/credits`;
  const url = `${baseUrl}${endpoint}?api_key=${apiKey}`;
  return axios.get(url).then((response) => response.data["cast"]);
}

export { getGenres, getMovieTrending, getMoviesByGenre, movieWatchProviders, getMovieDetails, movieVideos, movieCast };

