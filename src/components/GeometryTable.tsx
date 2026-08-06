import "@arcgis/core/assets/esri/themes/light/main.css";

function GeometryTable({ coordinates }) {
  return (
    <calcite-table
     
      bordered
      current-page="0"
      interaction-mode="interactive"
      layout="auto"
      numbered
      page-size="0"
      scale="s"
      selection-display="none"
      selection-mode="single"
      striped
    >
      <calcite-table-row slot="table-header">
        <calcite-table-header heading="Easting"></calcite-table-header>
        <calcite-table-header heading="Northing"></calcite-table-header>
        <calcite-table-header heading="Elevation"></calcite-table-header>
      </calcite-table-row>

      {coordinates.map((coord) => (
        <calcite-table-row>
          <calcite-table-cell>{coord[0].toFixed(3)}</calcite-table-cell>
          <calcite-table-cell>{coord[1].toFixed(3)}</calcite-table-cell>
          <calcite-table-cell>
            {coord[2]?.toFixed(3) ?? "0.000"}
          </calcite-table-cell>
        </calcite-table-row>
      ))}
    </calcite-table>
  );
}
export default GeometryTable;
