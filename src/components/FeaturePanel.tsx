import AttributeTable from "./AttributeTable";

import GeometryTable from "./GeometryTable";
import { useState } from "react";

type Props = {
  feature: Record<string, any> | null;
  onClose: () => void;
};

function FeaturePanel({
  onVertexClick,
  onEditModeChange,
  onCoordinatesChange,
  onSave,
  feature,
  onClose,
}: Props) {
  if (!feature) return null;
//
  return (
    <div className="feature-panel">
      <calcite-panel
        heading={feature.layerName}
        description={`Feature ID: ${feature.id}`}
         
      >
        {/* Close button */}
        <calcite-action
          slot="header-actions-end"
          icon="x"
          text="Close"
          onClick={onClose}
        />

        <calcite-accordion>
          <calcite-accordion-item heading="Attributes" icon-start="table">
            <div className="accordion-content">
              <AttributeTable feature={feature} />
            </div>
          </calcite-accordion-item>

          <calcite-accordion-item icon-start="vertex-edit" heading="Geometry">
            <div className="accordion-content">
              <GeometryTable
                coordinates={feature.coordinates}
                onVertexClick={onVertexClick}
                onEditModeChange={onEditModeChange}
                onCoordinatesChange={onCoordinatesChange}
                onSave={onSave}
              />
            </div>
          </calcite-accordion-item>
        </calcite-accordion>
      </calcite-panel>
    </div>
  );
}

export default FeaturePanel;
