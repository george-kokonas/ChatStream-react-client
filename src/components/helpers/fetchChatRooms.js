import axios from "axios";
import getAuthHeaders from "./authHeaders";

const fetchChatRooms = async (url) => {
    try {
        const response = await axios.get(url, getAuthHeaders());
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error("Error fetching data");
      }
}

export default fetchChatRooms;