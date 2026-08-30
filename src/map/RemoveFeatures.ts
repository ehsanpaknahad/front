const removeFeatures = (
  layerName: string,
  featureIds: string[],
  layerManagerRef: any,
) => {
  const layerInfo =
    layerManagerRef.current[layerName];

  if (!layerInfo) return;

  const graphicsToRemove: any[] = [];

  featureIds.forEach((featureId) => {
    const graphic =
      layerInfo.graphicsMap.get(featureId);

    if (!graphic) return;

    graphicsToRemove.push(graphic);

    layerInfo.graphicsMap.delete(
      featureId,
    );
  });

  if (graphicsToRemove.length > 0) {
    layerInfo.graphicsLayer.removeMany(
      graphicsToRemove,
    );
  }
};

export default removeFeatures;