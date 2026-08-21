import Graphic from "@arcgis/core/Graphic";

function highlightGraphic(graphic: Graphic, selectedGraphicRef: any) {
  // Restore previous selection
  if (selectedGraphicRef.current) {
    const previousGraphic = selectedGraphicRef.current;

    if (previousGraphic.attributes?.originalSymbol) {
      previousGraphic.symbol =
        previousGraphic.attributes.originalSymbol;
    }
  }

  // Save the original symbol of the new graphic
  if (!graphic.attributes) {
    graphic.attributes = {};
  }

  graphic.attributes.originalSymbol =
    graphic.symbol.clone();

  // Save newly selected graphic
  selectedGraphicRef.current = graphic;

  //------------------------------------
  // Highlight
  //------------------------------------

  const symbol = graphic.symbol.clone();

  switch (symbol.type) {
    case "line-3d": {
      const pathLayer = symbol.symbolLayers.getItemAt(0);

      pathLayer.width = pathLayer.width * 1.03;
      pathLayer.material.color = "cyan";

      break;
    }

    case "simple-line":
      symbol.width = 5;
      symbol.color = "cyan";
      break;
    // case "line-3d":

    case "simple-marker":
      symbol.size = 14;
      symbol.color = "cyan";
      break;

    case "simple-fill":
      symbol.outline.color = "cyan";
      symbol.outline.width = 4;
      break;
  }

  graphic.symbol = symbol;
}

export default highlightGraphic;
