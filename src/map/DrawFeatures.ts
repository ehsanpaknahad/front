import createGraphic from "./CreateGraphic";

const drawFeatures = (
  layerName: string,
  features: any[],
  layerManagerRef: any,
) => {
  const layerInfo = layerManagerRef.current[layerName];
  if (!layerInfo) return;

  const graphicsMap = layerInfo.graphicsMap;
  const graphicsLayer = layerInfo.graphicsLayer;

 

  const graphics = [];

  for (const feature of features) {
     
    if (graphicsMap.has(String(feature.id))) {
      continue;
    }
    const graphic = createGraphic(feature, layerInfo);

    if (!graphic) continue;

    graphics.push(graphic);

    graphicsMap.set(String(feature.id), graphic);
  }

  graphicsLayer.addMany(graphics);
};

export default drawFeatures;
