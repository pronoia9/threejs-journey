import { BoxGeometry, ColorManagement, MeshStandardMaterial } from 'three';

// Fix Colors
ColorManagement.legacyMode = false;

// Geometries
export const geometries = {
  box: new BoxGeometry(1, 1, 1),
};

// Materials
export const materials = {
  floor1: new MeshStandardMaterial({ color: 'limegreen' }),
  floor2: new MeshStandardMaterial({ color: 'greenyellow' }),
  obstacle: new MeshStandardMaterial({ color: 'orangered' }),
  wall: new MeshStandardMaterial({ color: 'slategrey' }),
};
