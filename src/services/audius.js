import axios from "axios";

// Fetch trending tracks
export async function getTrendingTracks(genre) {
    const API_HOST = process.env.NEXT_PUBLIC_AUDIUS_HOST;
    const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
    
    const url = `${API_HOST}/v1/tracks/trending?genre=${genre}&limit=50&app_name=${APP_NAME}`;
    console.log(API_HOST);
    console.log(APP_NAME);
    try {
        const response = await axios.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching trending tracks:", error);
        return [];
    }
}

// Fetch actual streaming URL for a track
export async function getTrackStreamUrl(trackId) {
    const API_HOST = process.env.NEXT_PUBLIC_AUDIUS_HOST;
    const url = `${API_HOST}/v1/tracks/${trackId}/stream`;

    try {
        const response = await axios.get(url, { responseType: "blob" });
        return URL.createObjectURL(response.data); // Convert the stream data into a blob URL for the <audio> tag
    } catch (error) {
        console.error("Error fetching stream URL:", error);
        return null;
    }
}

// Fetch available genres
export async function getGenres() {
    const API_HOST = process.env.NEXT_PUBLIC_AUDIUS_HOST;
    const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

    const url = `${API_HOST}/v1/genres?app_name=${APP_NAME}`;

    try {
        const response = await axios.get(url);
        return response.data.data.genres;
    } catch (error) {
        console.error("Error fetching genres:", error);
        return [];
    }
}

