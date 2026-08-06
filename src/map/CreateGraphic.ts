import Graphic from "@arcgis/core/Graphic.js";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";
import Point from "@arcgis/core/geometry/Point.js";
import createPipeline3DSymbol from "./CreatePipeline3DSymbol"

function darkenColor(color: number[], factor = 0.6) {
            return color.map(c => Math.round(c * factor));
}

const createGraphic = (feature,layerInfo) => {

   // get color from layers_list and convert it into array
  const color = layerInfo.color;
  const rgbStringToArray = (rgb: string) => {
     return rgb.match(/\d+/g)?.map(Number) ?? [0,0,0];
   };
  const colorArray = rgbStringToArray(color);


  const geo = JSON.parse(feature.geometry);

  let geometry;
  let symbol;

 


  switch (geo.type) {

    case "MultiLineString":

      geometry = new Polyline({
        paths: geo.coordinates,
        spatialReference: { wkid: 32640 }
      });

      
      if (layerInfo.renderer_type === "pipeline3d") {

          const widthMeters = (feature.Size ?? 2) * 0.0254;

         

          const locationType = feature.location_type || "above_ground";
          const pipeColor =
            locationType === "under_ground"
              ? darkenColor(colorArray, 0.6) // make it darker
              : colorArray
 

          symbol = createPipeline3DSymbol(
              pipeColor,
              widthMeters
          );
 

      } else {

          symbol = {
              type: "simple-line",
              color: colorArray,
              width: 2
          };

      }
      break;


    case "Point":

      geometry = new Point({
        x: geo.coordinates[0],
        y: geo.coordinates[1],
        spatialReference: { wkid: 32640 }
      });

      symbol = {
        type: "simple-marker",
        color: colorArray,
        size: 8
      };

      break;


    case "MultiPolygon":

      geometry = new Polygon({
        rings: geo.coordinates.flat(),
        hasZ: true,
        spatialReference: { wkid: 32640 }
      });

      symbol = {
        type: "simple-fill",
        outline: {
          color: colorArray,
          width: 2
        }
      };

      break;


    default:
      return null;
  }

  return new Graphic({
    geometry,
    attributes: {
      id: feature.id,
      layerName:layerInfo.layerName,
      originalSymbol: symbol
    },
    symbol
  });
};

export default createGraphic;