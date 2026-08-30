import axios from "axios";
import TileManager from "./TileManager";

const fetchExtent = async (
  tiles: any[],
  layerManagerRef: any,
  tileManager: TileManager,
  config: any,
) => {
  const layerNames = Object.keys(layerManagerRef.current);

  if (layerNames.length === 0) {
    console.log("⏳ Waiting for layers to load...");
    return;
  }

  if (tiles.length === 0) {
    return;
  }

  try {
    const tilesWithExtent = tiles.map((tile) => {
      const tileExtent = tileManager.getTileExtent(tile);

      return {
        ...tile,
        ...tileExtent,
      };
    });

    const response = await axios.post(
      "/api/query-with-extent",
      {
        layerNames,
        tiles: tilesWithExtent,
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
