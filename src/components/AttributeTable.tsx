type Props = {
  feature: Record<string, any>;
};
import { useState } from "react";

function AttributeTable({ feature }: Props) {
    const [isEditMode, setIsEditMode] = useState(false);
     const handleEditClick = () => {
      setIsEditMode(true);
      // Optionally: reset selection when entering edit mode
     // setSelectedVertex(null);
    };
      const handleSaveClick = () => {
      // Perform save logic with selectedVertex
     
      setIsEditMode(false);
      //setSelectedVertex(null);
    };
  
    const handleUndoClick = () => {
      setIsEditMode(false);
     // setSelectedVertex(null);
    };

  return (
    <div>
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

      <calcite-table bordered striped scale="s" layout="auto">
        <calcite-table-row slot="table-header">
          <calcite-table-header heading="Field" />
          <calcite-table-header heading="Value" />
        </calcite-table-row>

        {Object.entries(feature)
          .filter(([field]) => field !== "geom" && field !== "geometry")
          .map(([field, value]) => (
            <calcite-table-row key={field}>
              <calcite-table-cell>{field}</calcite-table-cell>

              <calcite-table-cell>{String(value)}</calcite-table-cell>
            </calcite-table-row>
          ))}
      </calcite-table>
    </div>
  );
}

export default AttributeTable;
