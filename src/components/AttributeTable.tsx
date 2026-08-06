 type Props = {
  feature: Record<string, any>;
};

function AttributeTable({ feature }: Props) {
  return (
    <calcite-table
      bordered
      striped
      scale="s"
      layout="auto"
    >
      <calcite-table-row slot="table-header">
        <calcite-table-header heading="Field" />
        <calcite-table-header heading="Value" />
      </calcite-table-row>

      {Object.entries(feature)
        .filter(([field]) => field !== "geom" && field !== "geometry")
        .map(([field, value]) => (
          <calcite-table-row key={field}>
            <calcite-table-cell>
              {field}
            </calcite-table-cell>

            <calcite-table-cell>
              {String(value)}
            </calcite-table-cell>
          </calcite-table-row>
        ))}

    </calcite-table>
  );
}

export default AttributeTable;