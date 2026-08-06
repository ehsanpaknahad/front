import axios from "axios";

// Get layers list from postgis
const getLayersList = async (
    config:any,
  ) => {

      try {
        const response = await axios.get(
          "/api/layers",
          config
        );
        return response.data;

      } catch(error) {
          console.error(error);
      }
    };

export default getLayersList;