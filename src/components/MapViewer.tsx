 
 
import { useEffect, useRef ,useState} from "react";
import ArcGISMap from "@arcgis/core/Map.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import debounce from "lodash/debounce";
import axios from "axios";
import FeaturePanel from "./FeaturePanel.js";


import drawFeatures from "../map/DrawFeatures.js";
import { useAuth } from "../auth/AuthProvider.js";
import Extent from "@arcgis/core/geometry/Extent.js";
import fetchExtent from "../map/FetchExtent.js";
import getLayersList from "../map/GetLayersList.js";
import highlightGraphic from "../map/HighlightGraphic.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import type { LayerInfo } from "../types/interface.js";

export interface LayerManagerItem {
  graphicsLayer: GraphicsLayer;
  color: string;
  graphicsMap: Map<string, any>; // or use proper Graphic type
  minZoom: number;
  maxZoom: number;
  layerName:string;
   renderer_type:string;
}

export interface LayerManager {
  [key: string]: LayerManagerItem; // Index signature
}


function MapViewer() {
   
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const layerManagerRef = useRef<LayerManager>({});
  const selectedGraphicRef = useRef<any>(null);

  const { state, logout } = useAuth();
  const config = {
    headers: {
      Authorization: state.user?.token ? `Bearer ${state.user.token}` : "",
    },
  };

  function handleLogout() {
    logout();
  }

  useEffect(() => {

    if (!mapRef.current) return;

    const map = new ArcGISMap({}); 

    const view = new SceneView({
      container: mapRef.current,
      spatialReference: { wkid: 32640 },
      map,
      camera: {
        position: {
            x: 54.537,  // longitude
            y: 25.904,  // latitude
            z: 400,     // height in meters
            spatialReference: { wkid: 4326 }  // WGS84 geographic
         },
        tilt: 40,
      },
    });

    const initialize = async () => {
       const layers =  await getLayersList(config,);
      
       layers.forEach((layerInfo:LayerInfo) => {
          const graphicsLayer = new GraphicsLayer({
            title: layerInfo.alias,
            visible: layerInfo.visible,
            elevationInfo: { mode: "absolute-height" }
          });
          
          map.add(graphicsLayer);
          layerManagerRef.current[layerInfo.layer_name] = {
            graphicsLayer,
            color: layerInfo.color,
            graphicsMap: new Map(),
            minZoom: layerInfo.min_zoom,
            maxZoom: layerInfo.max_zoom,
            layerName:layerInfo.layer_name,
            renderer_type:layerInfo.renderer_type,
             
          };
        });
    };
    initialize();

    const debouncedFetch = debounce(async(extent: Extent) => {
     const data = await fetchExtent(
        extent,
        layerManagerRef,
        config
      );

      if (!data) return;

      Object.entries(data).forEach(([layerName, features]) => {
         
        if (layerName.includes("_error")) {
          console.error(features);
          return;
        }

        drawFeatures(
          layerName,
          features,
          layerManagerRef
        );

      });

    }, 1500);
   
    const handleWatch = reactiveUtils.watch(
      () => view.stationary,
      (isStationary: boolean) => {
        if (isStationary && view.extent) {
          debouncedFetch(view.extent);
        }
      },
    );

    const zoomHandle = reactiveUtils.watch(
        () => view.zoom,
        (zoom) => {
            //console.log('Current zoom:', zoom); // Add this line
            Object.values(layerManagerRef.current)
                .forEach((layer:any) => {

                    layer.graphicsLayer.visible =
                        zoom >= layer.minZoom &&
                        zoom <= layer.maxZoom;

                });
        }
    );

    view.on("click", async (event) => {
        const response = await view.hitTest(event);

        if (!response.results.length)
            return;

        //const graphic = response.results[0].graphic;

       

        const hit = response.results[0] as __esri.GraphicHit;
        const graphic = hit.graphic;
        
        highlightGraphic(
            graphic,
            selectedGraphicRef
        );
       
        const result = await axios.post(
          "/api/feature-info",
          {
            layerName: graphic.attributes.layerName,
            id: graphic.attributes.id
          },
          config
        );

        setSelectedFeature({...result.data,layerName: graphic.attributes.layerName});
        
    });

    return () => {
      if (view) {
        view.destroy();
        handleWatch.remove();
        debouncedFetch.cancel();
        zoomHandle.remove();
      }
    };
  }, []);  

  const handleClose = () => {

    if (selectedGraphicRef.current) {

        selectedGraphicRef.current.symbol =
            selectedGraphicRef.current.attributes.originalSymbol;

        selectedGraphicRef.current = null;
    }

    setSelectedFeature(null);
};


  return (
    
    <div className="map-container">
      <div ref={mapRef} className="map-view" />
    
 
      <FeaturePanel
      feature={selectedFeature}
      onClose={handleClose}
      />


      <button className="close-overlay-btn-logout" onClick={handleLogout}>
        Log out
      </button>
    </div>
   
  );
}

export default MapViewer;
