import { BoxGeometry, ColorManagement, MeshStandardMaterial } from 'three';

// Fix Colors
ColorManagement.legacyMode = false;

// Geometries
export const geometries = {
  box: new BoxGeometry(1, 1, 1),
};

// Materials
export const materials = {
  floor1: new MeshStandardMaterial({ color: 'limegreen', metalness: 0, roughness: 0 }),
  floor2: new MeshStandardMaterial({ color: 'greenyellow', metalness: 0, roughness: 0 }),
  obstacle: new MeshStandardMaterial({ color: 'orangered', metalness: 0, roughness: 1 }),
  wall: new MeshStandardMaterial({ color: 'slategrey', metalness: 0, roughness: 0 }),
};
