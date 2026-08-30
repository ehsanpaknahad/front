class RenderedTileManager {
  // Tiles currently rendered
  private renderedTiles = new Set<string>();

  // tileId -> layerName -> feature IDs
  private tileFeatures = new Map<
    string,
    Map<string, Set<string>>
  >();

  // layerName -> featureId -> number of visible tiles using this feature
  private featureReferences = new Map<
    string,
    Map<string, number>
  >();

  hasTile(tileId: string): boolean {
    return this.renderedTiles.has(tileId);
  }

  addTile(
    tileId: string,
    tileData: Record<string, any[]>,
  ): Record<string, any[]> {
    // Features that really need to be added to GraphicsLayer
    const featuresToAdd: Record<string, any[]> = {};

    if (this.renderedTiles.has(tileId)) {
      return featuresToAdd;
    }

    this.renderedTiles.add(tileId);

    const layerFeatures = new Map<
      string,
      Set<string>
    >();

    Object.entries(tileData).forEach(
      ([layerName, features]) => {
        const featureIds = new Set<string>();

        features.forEach((feature: any) => {
          const featureId = String(feature.id);

          featureIds.add(featureId);

          if (!this.featureReferences.has(layerName)) {
            this.featureReferences.set(
              layerName,
              new Map(),
            );
          }

          const layerRefs =
            this.featureReferences.get(layerName)!;

          const currentCount =
            layerRefs.get(featureId) || 0;

          layerRefs.set(
            featureId,
            currentCount + 1,
          );

          // First visible reference → must render
          if (currentCount === 0) {
            if (!featuresToAdd[layerName]) {
              featuresToAdd[layerName] = [];
            }

            featuresToAdd[layerName].push(feature);
          }
        });

        layerFeatures.set(
          layerName,
          featureIds,
        );
      },
    );

    this.tileFeatures.set(
      tileId,
      layerFeatures,
    );

    return featuresToAdd;
  }

  removeTile(
    tileId: string,
  ): Record<string, string[]> {
    // Feature IDs that should really be removed
    const featuresToRemove: Record<
      string,
      string[]
    > = {};

    if (!this.renderedTiles.has(tileId)) {
      return featuresToRemove;
    }

    const layerFeatures =
      this.tileFeatures.get(tileId);

    if (!layerFeatures) {
      this.renderedTiles.delete(tileId);

      return featuresToRemove;
    }

    layerFeatures.forEach(
      (featureIds, layerName) => {
        const layerRefs =
          this.featureReferences.get(layerName);

        if (!layerRefs) return;

        featureIds.forEach((featureId) => {
          const currentCount =
            layerRefs.get(featureId) || 0;

          const newCount =
            currentCount - 1;

          if (newCount <= 0) {
            layerRefs.delete(featureId);

            if (!featuresToRemove[layerName]) {
              featuresToRemove[layerName] = [];
            }

            featuresToRemove[layerName].push(
              featureId,
            );
          } else {
            layerRefs.set(
              featureId,
              newCount,
            );
          }
        });

        if (layerRefs.size === 0) {
          this.featureReferences.delete(
            layerName,
          );
        }
      },
    );

    this.tileFeatures.delete(tileId);

    this.renderedTiles.delete(tileId);

    return featuresToRemove;
  }

  getRenderedTileIds(): string[] {
    return Array.from(
      this.renderedTiles,
    );
  }

  clear(): void {
    this.renderedTiles.clear();
    this.tileFeatures.clear();
    this.featureReferences.clear();
  }
}

export default RenderedTileManager;