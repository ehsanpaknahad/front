

import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import debounce from 'lodash/debounce';
import axios from "axios"



import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

function MapViewer({setLoggedIn}) {

  const config = {
    headers: {
      Authorization: `Bearer ${appState.user.token}`
    }
  };

  function handleLogout(){
    setLoggedIn(false)
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    localStorage.removeItem("geometryEditing")
    localStorage.removeItem("attributeEditing")  
  }

  const mapRef = useRef(null);


  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map
    const map = new Map({
     // basemap: "osm",  // 🚫 NO BASEMAP
          // 🚫 NO ELEVATION (no hillshade, no terrain, no CORS)
         basemap: 'topo-vector'
    });

    // Create the 3D SceneView
    const view = new SceneView({
      container: mapRef.current,
    //  spatialReference: { wkid: 32640 },  // 🟢 tell ArcGIS to use UTM Zone 40N
      map,
      camera: {
       // position: [54.532, 25.908, 1000],  // [longitude, latitude, altitude]
       position: [54.532, 25.908, 500],
        tilt: 45,  // 45 degree angle
       // spatialReference: { wkid: 32640 }
      },
      ui: { components: [] } // ⚡ disable all default widgets
    });








    view.when(() => {


    });




    const fetchExtent = async (extent) => {

       
      try {
        // we send extent to server side - base on it server query database and return data of layers
        const response = await axios.post('/api/query-with-extent',
        {          
            minX: extent.xmin,
            minY: extent.ymin,
            maxX: extent.xmax,
            maxY: extent.ymax,
        
         }, ...config
        );

        console.log(response.data);
        return
      } catch (error) {
        console.error('Database query failed:', error);
        throw error;
      }


      // 🔥🔥🔥 need to think




    };

    const debouncedFetch = debounce((extent) => {
     // console.log('🔥 ACTUAL FETCH at', Date.now(), 'for extent', extent);
      fetchExtent(extent)
    }, 1500); //wait 1 second ; in case user does nt move screen extent ; then trigger fetchExtent function




    const handleWatch = reactiveUtils.watch(
      () => view.stationary,
      (isStationary) => {
        if (isStationary && view.extent) {
          debouncedFetch(view.extent);
        }
      }
    );




    // Cleanup on component unmount
    return () => {
      if (view) {
        view.destroy();
        handleWatch.remove();
        debouncedFetch.cancel();
      }
    };
  }, []); // Empty dependency array = runs once on mount


  return (
      <div className="map-container"  >
        <div ref={mapRef} className="map-view"   />
        <button className="close-overlay-btn-logout" onClick={ handleLogout } >
            Log out
        </button>
      </div>
  )
}

export default MapViewer


