

import { useEffect, useRef,useContext } from 'react';
import Map from '@arcgis/core/Map';
import SceneView from '@arcgis/core/views/SceneView';
import debounce from 'lodash/debounce';
import axios from "axios"
import DispatchContext from '../DispatchContext';
import StateContext from '../stateContext';



import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

function MapViewer() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext);

  const config = {
    headers: {
      Authorization: `Bearer ${appState.user.token}`
    }
  };

  function handleLogout(){
    appDispatch({type: 'logout'}) 
  }

  const mapRef = useRef(null);


  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map
    const map = new Map({
      basemap: null,   // No basemap
      ground: null     // No elevation surface
    });

    // Create the 3D SceneView
    const view = new SceneView({
      container: mapRef.current,
      spatialReference: { wkid: 32640 },  // 🟢 tell ArcGIS to use UTM Zone 40N
      map,
      camera: {
        position: [253395.7, 2867731.1, 500],
        tilt: 45,  // 45 degree angle
        spatialReference: { wkid: 32640 }
      },
      ui: { components: [] } // ⚡ disable all default widgets
    });

    view.when(() => {
      console.log(view.extent)
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


