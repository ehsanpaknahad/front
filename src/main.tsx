 
import { createRoot } from 'react-dom/client'
import esriConfig from '@arcgis/core/config.js'
 
import './index.css'
import App from './App.tsx'
import "@fontsource/poppins"; // Defaults to 400 weight
import { AuthProvider } from './auth/AuthProvider.js'


//  import "@esri/calcite-components/dist/calcite/calcite.css";
// import { defineCustomElements } from "@esri/calcite-components/dist/loader";

// defineCustomElements(window);
  import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";

defineCustomElements(window, {
  resourcesUrl: "/assets"
});

// CRITICAL: Set this BEFORE importing any ArcGIS widgets
esriConfig.assetsPath = '/assets'  // Points to public/assets folder

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App /> 
  </AuthProvider>
)
