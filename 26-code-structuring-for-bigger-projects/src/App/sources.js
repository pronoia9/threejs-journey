export default [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: Array.from(
      { length: 6 },
      (val, i) => `textures/environmentMap/${['px', 'nx', 'py', 'ny', 'pz', 'nz'][i]}.jpg`
    ),
  },
  { name: 'dirtColorTexture', type: 'texture', path: 'textures/dirt/color.jpg' },
  { name: 'dirtNormalTexture', type: 'texture', path: 'textures/dirt/normal.jpg' },
  { name: 'foxModel', type: 'gltfModel', path: 'models/Fox/glTF/Fox.gltf' },
];