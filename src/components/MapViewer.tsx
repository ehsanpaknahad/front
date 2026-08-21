import { useEffect, useRef, useState } from "react";
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
import Polyline from "@arcgis/core/geometry/Polyline.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import Polygon from "@arcgis/core/geometry/Polygon.js";

export interface LayerManagerItem {
  graphicsLayer: GraphicsLayer;
  color: string;
  graphicsMap: Map<string, any>; // or use proper Graphic type
  minZoom: number;
  maxZoom: number;
  layerName: string;
  renderer_type: string;
}

export interface LayerManager {
  [key: string]: LayerManagerItem; // Index signature
}

function MapViewer() {
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const layerManagerRef = useRef<LayerManager>({});
  const selectedGraphicRef = useRef<any>(null);
  const selectedFeatureRef = useRef<{
    layerName: string;
    id: string | number;
  } | null>(null);
  const [selectedVertex, setSelectedVertex] = useState(null);
  const selectedVertexLayerRef = useRef(null);
  const editVerticesLayerRef = useRef(null);
  const editModeRef = useRef(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

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
          x: 54.537, // longitude
          y: 25.904, // latitude
          z: 400, // height in meters
          spatialReference: { wkid: 4326 }, // WGS84 geographic
        },
        tilt: 40,
      },
    });

    // the callout
    const vertexLayer = new GraphicsLayer({
      title: "Selected Vertex",
      elevationInfo: {
        mode: "absolute-height",
      },
    });
    selectedVertexLayerRef.current = vertexLayer;
    map.add(vertexLayer);

    // all vertices
    const editVerticesLayer = new GraphicsLayer({
      title: "Edit Vertices",
      elevationInfo: {
        mode: "absolute-height",
      },
    });
    editVerticesLayerRef.current = editVerticesLayer;
    map.add(editVerticesLayer);

    const initialize = async () => {
      const layers = await getLayersList(config);

      layers.forEach((layerInfo: LayerInfo) => {
        const graphicsLayer = new GraphicsLayer({
          title: layerInfo.alias,
          visible: layerInfo.visible,
          elevationInfo: { mode: "absolute-height" },
        });

        map.add(graphicsLayer);
        layerManagerRef.current[layerInfo.layer_name] = {
          graphicsLayer,
          color: layerInfo.color,
          graphicsMap: new Map(),
          minZoom: layerInfo.min_zoom,
          maxZoom: layerInfo.max_zoom,
          layerName: layerInfo.layer_name,
          renderer_type: layerInfo.renderer_type,
        };
      });
    };
    initialize();

    const debouncedFetch = debounce(async (extent: Extent) => {
      const data = await fetchExtent(extent, layerManagerRef, config);

      if (!data) return;

      Object.entries(data).forEach(([layerName, features]) => {
        if (layerName.includes("_error")) {
          console.error(features);
          return;
        }

        drawFeatures(layerName, features, layerManagerRef);

        // Re-apply selection after the layer has been redrawn
        const selected = selectedFeatureRef.current;

        if (selected && selected.layerName === layerName) {
          const layerInfo = layerManagerRef.current[layerName];

          const newGraphic = layerInfo?.graphicsMap.get(String(selected.id));

          if (newGraphic) {
            highlightGraphic(newGraphic, selectedGraphicRef);
          }
        }
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
        Object.values(layerManagerRef.current).forEach((layer: any) => {
          layer.graphicsLayer.visible =
            zoom >= layer.minZoom && zoom <= layer.maxZoom;
        });
      },
    );

    view.on("click", async (event) => {
      // Don't allow selecting another feature while editing
      if (editModeRef.current) {
        return;
      }

      const response = await view.hitTest(event);

      if (!response.results.length) return;

      const hit = response.results[0] as __esri.GraphicHit;
      const graphic = hit.graphic;

      // Remove previous vertex callout and text
      const vertexLayer = selectedVertexLayerRef.current;
      if (vertexLayer) {
        vertexLayer.removeAll();
      }

      setSelectedVertex(null);

      // Remember which feature is selected
      selectedFeatureRef.current = {
        layerName: graphic.attributes.layerName,
        id: graphic.attributes.id,
      };

      // Highlight the newly selected feature
      highlightGraphic(graphic, selectedGraphicRef);

      const result = await axios.post(
        "/api/feature-info",
        {
          layerName: graphic.attributes.layerName,
          id: graphic.attributes.id,
        },
        config,
      );
      console.log("selected:", result.data);
      setSelectedFeature({
        ...result.data,
        layerName: graphic.attributes.layerName,
      });
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

  useEffect(() => {
    const layer = selectedVertexLayerRef.current;
    if (!layer || !selectedVertex) return;

    // Clear previous graphics and labels
    layer.removeAll();

    const [x, y, z] = selectedVertex.coordinate;

    // Create point geometry
    const point = new Point({
      x: x,
      y: y,
      z: z || 0,
      spatialReference: { wkid: 32640 },
    });
    const graphic = new Graphic({
      geometry: point,

      symbol: {
        type: "point-3d",

        symbolLayers: [
          {
            type: "icon",
            resource: {
              primitive: "circle",
            },
            size: 10,
            material: {
              color: "#974dff",
            },
          },
        ],

        verticalOffset: {
          screenLength: 20,
          maxWorldLength: 2,
          minWorldLength: 2,
        },

        callout: {
          type: "line",
          size: 1.5,
          color: "#974dff",
        },
      },
    });

    // 2. Text at the top of the callout
    const textPoint = new Point({
      x,
      y,
      z: (z || 0) + 2.8,
      spatialReference: { wkid: 32640 },
    });

    const textGraphic = new Graphic({
      geometry: textPoint,

      symbol: {
        type: "point-3d",

        symbolLayers: [
          {
            type: "text",

            text: `Z: ${z.toFixed(3)} m`,

            size: 14,

            material: {
              color: "#974dff" /* #282260 */,
            },

            halo: {
              color: "#ffffff",
              size: 1,
            },

            horizontalAlignment: "center",
            verticalAlignment: "middle",
          },
        ],
      },
    });

    layer.addMany([graphic, textGraphic]);
  }, [selectedVertex]);

  const handleVertexClick = (coordinate, index) => {
    setSelectedVertex({
      coordinate,
      index,
    });
  };

  const handleClose = () => {
    //  ***  DIALOG WILL APPEAR HERE  ***

    if (editModeRef.current) {
      setShowUnsavedDialog(true);
      return;
    }

    closeFeature();
  };
  const closeFeature = () => {
    if (selectedGraphicRef.current) {
      selectedGraphicRef.current.symbol =
        selectedGraphicRef.current.attributes.originalSymbol;

      selectedGraphicRef.current = null;
    }

    // Clear persistent selection
    selectedFeatureRef.current = null;

    setSelectedFeature(null);

    const vertexLayer = selectedVertexLayerRef.current;
    if (vertexLayer) {
      vertexLayer.removeAll();
    }

    setSelectedVertex(null);
  };

  const handleEditModeChange = (editMode) => {
    // it get edit mode as ref . it will use on view.onClick to avoid get geometry when user is in editing mode
    editModeRef.current = editMode;

    // get graphic layer that all vertices will draw on it
    const editLayer = editVerticesLayerRef.current;

    // Draw all vertex circles
    editLayer?.removeAll();

    if (editMode && selectedFeature) {
      const pipeSizeInch = Number(selectedFeature?.Size);

      // Convert pipe diameter from inches to meters
      const pipeDiameterMeter = pipeSizeInch ? pipeSizeInch * 0.0254 : 0.2;

      // Make the vertex sphere slightly larger than the pipe diameter
      const vertexSize = pipeDiameterMeter * 1.3;

      selectedFeature.coordinates.forEach((coord, index) => {
        const vertexGraphic = new Graphic({
          geometry: new Point({
            x: coord[0],
            y: coord[1],
            z: coord[2] || 0,
            spatialReference: { wkid: 32640 },
          }),

          symbol: {
            type: "point-3d",

            symbolLayers: [
              {
                type: "object",

                resource: {
                  primitive: "sphere",
                },

                width: vertexSize,
                height: vertexSize,
                depth: vertexSize,

                material: {
                  color: "#974dff",
                },
              },
            ],
          },
        });

        editLayer?.add(vertexGraphic);
      });
    }

    if (!editMode) {
      // remove all vertices when user is not in edit mode
      editLayer?.removeAll();

      const vertexLayer = selectedVertexLayerRef.current;

      if (vertexLayer) {
        vertexLayer.removeAll();
      }

      setSelectedVertex(null);
    }
  };

  // NEW: Update only the already-rendered feature after a successful save
  const updateRenderedGraphic = (
    layerName: string,
    id: string | number,
    geometryType: string,
    coordinates: any[],
  ) => {
    const layerInfo = layerManagerRef.current[layerName];

    if (!layerInfo) {
      console.warn(`Layer "${layerName}" not found`);
      return;
    }

    // Find the already-rendered Graphic
    const graphic = layerInfo.graphicsMap.get(String(id));

    if (!graphic) {
      console.warn(`Graphic with id "${id}" is not currently rendered`);
      return;
    }

    // Create the new geometry
    let newGeometry;

    if (geometryType === "POINT") {
      const [x, y, z] = coordinates[0];

      newGeometry = new Point({
        x,
        y,
        z: z ?? 0,
        spatialReference: { wkid: 32640 },
      });
    }

    // LINESTRING
    else if (geometryType === "LINESTRING") {
      newGeometry = new Polyline({
        paths: coordinates,
        spatialReference: { wkid: 32640 },
      });
    }

    // MULTILINESTRING
    else if (geometryType === "MULTILINESTRING") {
      newGeometry = new Polyline({
        paths: coordinates,
        spatialReference: { wkid: 32640 },
      });
    }

    // POLYGON
    else if (geometryType === "POLYGON") {
      console.log("geometryType:", geometryType);
      console.log("coordinates:", coordinates);
      console.log("newGeometry:", newGeometry);
      console.log("isEmpty:", newGeometry?.isEmpty);
      console.log("extent:", newGeometry?.extent);

      newGeometry = new Polygon({
        rings: coordinates,
        spatialReference: { wkid: 32640 },
      });

      console.log("POLYGON rings:", coordinates);
    }

    // MULTIPOLYGON
    else if (geometryType === "MULTIPOLYGON") {
      newGeometry = new Polygon({
        rings: [coordinates],
        spatialReference: { wkid: 32640 },
      });
    } else {
      console.warn(`Unsupported geometry type: ${geometryType}`);
      return;
    }

    // IMPORTANT: only this Graphic is updated
    graphic.geometry = newGeometry;
  };

  const handleSaveCoordinates = async (coordinates) => {
    try {
      await axios.post(
        "/api/update-geometry",
        {
          layerName: selectedFeature.layerName,
          id: selectedFeature.id,
          geometryType: selectedFeature.geometryType,
          coordinates: coordinates,
        },
        config,
      );

      // NEW:
      // Server successfully saved the geometry.
      // Now update only the existing Graphic on the map.
      updateRenderedGraphic(
        selectedFeature.layerName,
        selectedFeature.id,
        selectedFeature.geometryType,
        coordinates,
      );
      // IMPORTANT:
      // Update React state so GeometryTable receives the new coordinates
      setSelectedFeature((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          coordinates: coordinates,
        };
      });

      console.log("Geometry saved successfully");
    } catch (error) {
      console.error("Failed to save geometry:", error);
    }
  };

  const handleCoordinatesChange = (coordinates) => {
    const editLayer = editVerticesLayerRef.current;

    if (!editLayer) return;

    if (!selectedFeature) return;

    updateRenderedGraphic(
      selectedFeature.layerName,
      selectedFeature.id,
      selectedFeature.geometryType,
      coordinates,
    );

    coordinates.forEach((coord, index) => {
      const graphic = editLayer.graphics.getItemAt(index);

      if (!graphic) return;

      graphic.geometry = new Point({
        x: coord[0],
        y: coord[1],
        z: coord[2] || 0,
        spatialReference: { wkid: 32640 },
      });
    });
  };

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-view" />

      <FeaturePanel
        onVertexClick={handleVertexClick}
        onEditModeChange={handleEditModeChange}
        onCoordinatesChange={handleCoordinatesChange}
        onSave={handleSaveCoordinates}
        feature={selectedFeature}
        onClose={handleClose}
      />
      {showUnsavedDialog && (
        <calcite-dialog
          open
          width="s"
          heading="Unsaved changes"
          id="example-dialog"
          drag-enabled
          resizable
          close-disabled
          kind="brand"
          placement="center"
        >
          <p>Are you sure you want to continue?</p>
          <p>
            There are unsaved changes, and if you proceed the changes will be
            lost.
          </p>
          <calcite-button
            slot="footer-start"
            appearance="outline"
            kind="neutral"
            class="example-dialog-button"
          >
            Cancel
          </calcite-button>
          <calcite-button slot="footer-end" class="example-dialog-button">
            Proceed without saving
          </calcite-button>
        </calcite-dialog>
      )}

      <button className="close-overlay-btn-logout" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}

export default MapViewer;
