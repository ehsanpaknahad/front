## public.layers_list this table includes layers info

## pipelines always should have a Size field . s should be Capital . this field use for rendering .

Troubleshooting: ArcGIS / Calcite Assets Missing

If the application starts but the map does not render and the browser console shows errors such as:

Localization strings not found at /assets/components/assets/...
calcite ... icon failed to load
Failed to execute 'importScripts'
WebAssembly.instantiate() ... expected magic word

the problem is most likely that the local ArcGIS/Calcite assets in public/assets are missing or incomplete.

Rebuild public/assets

Do not modify the React source code. Rebuild the assets from the installed npm packages.

First remove the existing public folder:

rm -rf public
mkdir -p public/assets

Copy ArcGIS Core assets:

cp -R node_modules/@arcgis/core/assets/. public/assets/

Copy ArcGIS Map Components assets:

cp -R node_modules/@arcgis/map-components/dist/cdn/assets/. public/assets/

Copy Calcite component assets:

mkdir -p public/assets/components
cp -R node_modules/@esri/calcite-components/dist/components/. public/assets/components/

Then clear Vite's cache and restart:

rm -rf node_modules/.vite
npm run dev
Important

The Calcite package used by this project does not contain a dist/cdn directory. Its component assets are located at:

node_modules/@esri/calcite-components/dist/components/

Therefore, do not look for:

node_modules/@esri/calcite-components/dist/cdn/

The rebuilt structure should contain:

public/
└── assets/
├── components/
│ ├── calcite-action/
│ ├── calcite-action-bar/
│ ├── calcite-action-group/
│ ├── ...
│ └── ...
├── ...
└── ArcGIS Core assets

This issue can occur after switching Git branches, pulling the project on another computer, reinstalling node_modules, or rebuilding the project when the manually copied public/assets files are not present.

geometry type inside public.layers_list table should have this types : "Point" | "LineString" | "Polygon";
