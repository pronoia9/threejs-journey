import { BoxGeometry, ColorManagement, MeshStandardMaterial } from 'three';

// Fix Colors
ColorManagement.legacyMode = false;

// Geometries
export const geometries = {
  box: new BoxGeometry(1, 1, 1),
};

// Materials
export const materials = {
  floor1: new MeshStandardMaterial({ color: '#111111', metalness: 0, roughness: 0 }),
  floor2: new MeshStandardMaterial({ color: '#222222', metalness: 0, roughness: 0 }),
  obstacle: new MeshStandardMaterial({ color: '#ff0000', metalness: 0, roughness: 1 }),
  wall: new MeshStandardMaterial({ color: '#887777', metalness: 0, roughness: 0 }),
};
