import config from '../config';
import axios from 'axios';

async function getGenre() {
    try {
        const response = await axios.get(
        `${config.LOCAL_DB_URL}items/genre`,
        {
            headers: {
                Authorization: `Bearer ${config.LOCAL_DB_TOKEN}`
            }
        }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export { getGenre };
