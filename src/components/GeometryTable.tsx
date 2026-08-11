import "@arcgis/core/assets/esri/themes/light/main.css";
import { useState } from "react";

function GeometryTable({ coordinates, onVertexClick, onEditModeChange, }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const handleEditClick = () => {
    setIsEditMode(true);
    // Optionally: reset selection when entering edit mode
    // setSelectedVertex(null);
     onEditModeChange(true);
  };
  const handleSaveClick = () => {
    // Perform save logic with selectedVertex

    setIsEditMode(false);
    //setSelectedVertex(null);
     onEditModeChange(false);
  };

  const handleUndoClick = () => {
    setIsEditMode(false);
    // setSelectedVertex(null);
     onEditModeChange(false);
  };

  return (
    <div className="geometry-table-container">
      <div className="geometry-table-toolbar">
        {!isEditMode ? (
          <calcite-button
            kind="neutral"
            icon-start="pencil"
            title="Edit"
            onClick={handleEditClick}
          ></calcite-button>
        ) : (
          <>
            <calcite-button
              kind="neutral"
              icon-start="save"
              title="Save"
              onClick={handleSaveClick}
            ></calcite-button>

            <calcite-button
              kind="neutral"
              icon-start="trash"
              title="Delete"
            ></calcite-button>
            <calcite-button
              kind="neutral"
              icon-start="undo"
              title="Undo"
              onClick={handleUndoClick}
            ></calcite-button>
          </>
        )}
      </div>
      <div className="geometry-table-scroll">
        <calcite-table
          bordered
          current-page="0"
          interaction-mode="interactive"
          layout="auto"
          numbered
          page-size="0"
          scale="s"
          striped
          selection-mode={isEditMode ? "single" : "none"}
          oncalciteTableSelect={(event) => {
            const selectedRow = event.target.selectedItems[0];
               console.log(selectedRow)
                console.log(event.target.selectedItems)
            if (!selectedRow) return;

            const index = Number(selectedRow.dataset.index);
 
            onVertexClick(coordinates[index],index)
          }}
        >
          <calcite-table-row slot="table-header">
            <calcite-table-header heading="Easting"></calcite-table-header>
            <calcite-table-header heading="Northing"></calcite-table-header>
            <calcite-table-header heading="Elevation"></calcite-table-header>
          </calcite-table-row>

          {coordinates.map((coord, index) => (
            <calcite-table-row key={index} data-index={index}>
              <calcite-table-cell>{coord[0].toFixed(3)}</calcite-table-cell>
              <calcite-table-cell>{coord[1].toFixed(3)}</calcite-table-cell>
              <calcite-table-cell>
                {coord[2]?.toFixed(3) ?? "0.000"}
              </calcite-table-cell>
            </calcite-table-row>
          ))}
        </calcite-table>
      </div>
    </div>
  );
}
export default GeometryTable;
