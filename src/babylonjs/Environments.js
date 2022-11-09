import { CubeTexture } from '@babylonjs/core';

export const addStandardEnvironment = (scene) => {
  // Our environment
  scene.createDefaultEnvironment({
    createSkybox: true,
    skyboxSize: 200,
    enableGroundShadow: true,
    groundYBias: 1,
    createGround: true,
    groundSize: 200,
  });

  // HDRI environment texture
  scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
    './environment.env',
    scene
  );

  return null;
};
