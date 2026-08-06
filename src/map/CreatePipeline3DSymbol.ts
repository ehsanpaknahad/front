import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D.js";
import PathSymbol3DLayer from "@arcgis/core/symbols/PathSymbol3DLayer.js";

const createPipeline3DSymbol = (
    color: number[],
    width:number
) => {

    return new LineSymbol3D({
        symbolLayers: [
            new PathSymbol3DLayer({
                profile: "circle",
                width,
                material: {
                    color
                }
            })
        ]
    });

};

export default createPipeline3DSymbol;