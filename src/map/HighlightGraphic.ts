import Graphic from "@arcgis/core/Graphic";

function highlightGraphic(
    graphic: Graphic,
    selectedGraphicRef: any
) {

    // Restore previous selection
    if (selectedGraphicRef.current) {

        selectedGraphicRef.current.symbol =
            selectedGraphicRef.current.attributes.originalSymbol;
    }

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