import AttributeTable from "./AttributeTable";

import GeometryTable from "./GeometryTable";

type Props = {
  feature: Record<string, any> | null;
  onClose: () => void;
};

function FeaturePanel({ feature, onClose }: Props) {
  if (!feature) return null;

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
            <div className="accordion-toolbar">
              <calcite-button
                kind="neutral"
                icon-start="pencil"
                text="Edit"
              ></calcite-button>

              <calcite-button 
                kind="neutral" 
                icon-start="save"
              ></calcite-button>

              <calcite-button
                kind="neutral"
                icon-start="trash"
              ></calcite-button>
            </div>
            <div className="accordion-content">
              <AttributeTable feature={feature} />
            </div>
          </calcite-accordion-item>

          <calcite-accordion-item icon-start="vertex-edit" heading="Geometry">
             <div className="accordion-toolbar">
              <calcite-button
                kind="neutral"
                icon-start="pencil"
                text="Edit"
              ></calcite-button>

              <calcite-button 
                kind="neutral" 
                icon-start="save"
              ></calcite-button>

              <calcite-button
                kind="neutral"
                icon-start="trash"
              ></calcite-button>
            </div>
            <div className="accordion-content">
              <GeometryTable coordinates={feature.coordinates} />
            </div>
          </calcite-accordion-item>
        </calcite-accordion>
      </calcite-panel>
    </div>
  );
}

export default FeaturePanel;
