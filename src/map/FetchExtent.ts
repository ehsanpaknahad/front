
import axios from "axios";


const fetchExtent = async (
  extent: Extent,
  layerManagerRef: any,
  config: any
) => {
  const layerNames = Object.keys(layerManagerRef.current);

  if (layerNames.length === 0) {
    console.log("⏳ Waiting for layers to load...");
    return;
  }

  try {
    const response = await axios.post(
      "/api/query-with-extent",
      {
        minX: extent.xmin,
        minY: extent.ymin,
        maxX: extent.xmax,
        maxY: extent.ymax,
        layerNames,
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