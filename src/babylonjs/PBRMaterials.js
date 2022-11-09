import { PBRMetallicRoughnessMaterial, Color3 } from '@babylonjs/core';

export const AluminumPBRMaterial = (scene) => {
  let material = new PBRMetallicRoughnessMaterial('aluminum', scene);
  material.baseColor = new Color3(0.3, 0.3, 0.3);
  material.metallic = 0.8;
  material.roughness = 0.2;
  return material;
};
