import {
  ArcRotateCamera,
  Vector3,
  Color3,
  MeshBuilder,
  GizmoManager,
  CubeTexture,
  PBRMetallicRoughnessMaterial,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';

export const addStandardGrid = (scene, width, height) => {
  // Material for our grid
  var gridMaterial = new GridMaterial('groundMaterial', scene);
  gridMaterial.majorUnitFrequency = 10;
  gridMaterial.minorUnitVisibility = 0.1;
  gridMaterial.gridRatio = 1;
  gridMaterial.backFaceCulling = false;
  gridMaterial.mainColor = new Color3(1, 1, 1);
  gridMaterial.lineColor = new Color3(1.0, 1.0, 1.0);
  gridMaterial.opacity = 0.4;

  // Our built-in 'ground' shape.
  var grid = MeshBuilder.CreateGround(
    'ground',
    { width: width, height: height },
    scene
  );
  grid.material = gridMaterial;

  return grid;
};
