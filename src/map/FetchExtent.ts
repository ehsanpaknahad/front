import axios from "axios";
 import Extent from "@arcgis/core/geometry/Extent.js";

const fetchExtent = async (extent: Extent ,layerManagerRef ,config) => {
      const layerNames = Object.keys(layerManagerRef.current);
      
      if (layerNames.length === 0) {
        console.log('⏳ Waiting for layers to load...');
        return;
      }

      try {
        // we send extent to server side - base on it server query database and return data of layers
        const response = await axios.post(
          "/api/query-with-extent",
          {
            minX: extent.xmin,
            minY: extent.ymin,
            maxX: extent.xmax,
            maxY: extent.ymax,
            layerNames: Object.keys(layerManagerRef.current),
          },
          config,
        );  
        
         return response.data;
       
      } catch (error) {
        console.error("Database query failed:", error);
        throw error;
      }
  };
  export default fetchExtent;