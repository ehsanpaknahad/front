 
import createGraphic from "./CreateGraphic";

const drawFeatures = (
  layerName: string,
  features: any[],
  layerManagerRef: any
) => {
  const layerInfo = layerManagerRef.current[layerName];
  if (!layerInfo) return;

  const graphicsMap = layerInfo.graphicsMap;
  const graphicsLayer = layerInfo.graphicsLayer;

 

  const newIds = new Set(
    features.map(feature => feature.id)
  );

  // Remove features that are no longer in the current extent
  graphicsMap.forEach((graphic, id) => {
    if (!newIds.has(id)) {
      graphicsLayer.remove(graphic);
      graphicsMap.delete(id);
    }
  });

  const graphics = [];

  for (const feature of features) {

    if (graphicsMap.has(feature.id))
      continue;

    const graphic = createGraphic(feature,layerInfo);

    if (!graphic)
     continue;

    graphics.push(graphic);

    graphicsMap.set(String(feature.id), graphic);

  }

  graphicsLayer.addMany(graphics);
};

export default drawFeatures;