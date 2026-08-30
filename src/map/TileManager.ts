const TILE_SIZE = 100;

const ORIGIN_X = 250000;
const ORIGIN_Y = 2860000;

export interface Tile {
  x: number;
  y: number;
  id: string;
}

class TileManager {
  private cache = new Map<string, any>();

  getTileId(x: number, y: number): string {
    const tileX = Math.floor((x - ORIGIN_X) / TILE_SIZE);
    const tileY = Math.floor((y - ORIGIN_Y) / TILE_SIZE);

    return `${tileX}_${tileY}`;
  }

  getTile(x: number, y: number) {
    const tileId = this.getTileId(x, y);
    return this.cache.get(tileId);
  }

  hasTile(x: number, y: number): boolean {
    const tileId = this.getTileId(x, y);
    return this.cache.has(tileId);
  }

  setTile(x: number, y: number, data: any): void {
    const tileId = this.getTileId(x, y);
    this.cache.set(tileId, data);
  }

  getTilesForExtent(extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }): Tile[] {
    const minTileX = Math.floor((extent.xmin - ORIGIN_X) / TILE_SIZE);

    const maxTileX = Math.floor((extent.xmax - ORIGIN_X) / TILE_SIZE);

    const minTileY = Math.floor((extent.ymin - ORIGIN_Y) / TILE_SIZE);

    const maxTileY = Math.floor((extent.ymax - ORIGIN_Y) / TILE_SIZE);

    const tiles: Tile[] = [];

    for (let x = minTileX; x <= maxTileX; x++) {
      for (let y = minTileY; y <= maxTileY; y++) {
        tiles.push({
          x,
          y,
          id: `${x}_${y}`,
        });
      }
    }

    return tiles;
  }

  has(tileId: string): boolean {
    return this.cache.has(tileId);
  }

  get(tileId: string) {
    return this.cache.get(tileId);
  }

  set(tileId: string, data: any): void {
    this.cache.set(tileId, data);
  }

  getTileExtent(tile: Tile) {
    const xmin = ORIGIN_X + tile.x * TILE_SIZE;
    const ymin = ORIGIN_Y + tile.y * TILE_SIZE;

    return {
      xmin,
      ymin,
      xmax: xmin + TILE_SIZE,
      ymax: ymin + TILE_SIZE,
    };
  }

  clear(): void {
    this.cache.clear();
  }
}

export default TileManager;
