

import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import debounce from 'lodash/debounce';
 

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

function MapViewer({setLoggedIn}) {
  function handleLogout(){
    setLoggedIn(false)
    localStorage.removeItem("token")
    localStorage.removeItem("username")
  }

  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map
    const map = new Map({
      basemap: "osm",  // OpenStreetMap basemap
    });

    // Create the 3D SceneView
    const view = new SceneView({
      container: mapRef.current,
      map,
      camera: {
        position: [54.532, 25.908, 1000],  // [longitude, latitude, altitude]
        tilt: 45,  // 45 degree angle
         
      },
      
    });
   

    // Optional: Log when view is ready
    view.when(() => {
      console.log("3D Map is ready!");
     
      
    });

   
    // Watch for ANY changes
    reactiveUtils.watch(
      () => [view.heightBreakpoint, view.widthBreakpoint, view.size],
      (val) => console.log('📊 Updated:', val)
    );
   

    const fetchExtent = async (extent) => {
      console.log('Fetching data for:', extent);
       
    };
    
    const debouncedFetch = debounce((extent) => {
     // console.log('🔥 ACTUAL FETCH at', Date.now(), 'for extent', extent);
      fetchExtent(extent)
    }, 1000); //wait 1 second ; in case user does nt move screen extent ; then trigger fetchExtent function


     

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
      <div className="map-container">
        <div ref={mapRef} className="map-view" /> 
        <button className="close-overlay-btn" onClick={ handleLogout } >
            Log out
        </button>               
      </div>
  )
}

export default MapViewer


  