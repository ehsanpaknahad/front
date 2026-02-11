

import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';


function MapView({setLoggedIn}) {
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
        position: [54.532, 25.908, 500],  // [longitude, latitude, altitude]
        tilt: 45,  // 45 degree angle
      },
    });

    // Optional: Log when view is ready
    view.when(() => {
      console.log("3D Map is ready!");
    });

    // Cleanup on component unmount
    return () => {
      if (view) {
        view.destroy();
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

export default MapView


  