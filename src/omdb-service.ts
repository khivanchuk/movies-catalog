import axios from "axios";

const OMDB_URL = "http://www.omdbapi.com/?apikey=c91ae6b1";

export const getOMDBMovie = async (name: string) => {
  try {
    const { status, statusText, data } = await axios.get(
      `${OMDB_URL}&t=${name}`
    );
    return { status, statusText, data };
  } catch (error) {
    console.error(error);
  }
};
