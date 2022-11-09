import {
  ArcRotateCamera,
  Vector3,
  Color3,
  MeshBuilder,
  GizmoManager,
  CubeTexture,
  PBRMetallicRoughnessMaterial,
  HighlightLayer,
  PointerEventTypes,
} from '@babylonjs/core';
import { AluminumPBRMaterial } from '../babylonjs/PBRMaterials';
import { v4 as uuidv4 } from 'uuid';

export const AluminumCube = (scene, size) => {
  let mat = AluminumPBRMaterial(scene);
  let mesh = MeshBuilder.CreateBox(
    'aluminum_cube_' + uuidv4(),
    { size: size },
    scene
  );
  mesh.material = mat;
  mesh.position.x += size;
  return mesh;
};

export const AluminumPyramid = (scene, size) => {
  let mat = AluminumPBRMaterial(scene);
  let mesh = MeshBuilder.CreatePolyhedron(
    'aluminum_pyramid_' + uuidv4(),
    { type: 8, size: size },
    scene
  );
  mesh.material = mat;
  mesh.position.x += size;
  return mesh;
};

export const AluminumSphere = (scene, diameter) => {
  let mat = AluminumPBRMaterial(scene);
  let mesh = MeshBuilder.CreateSphere(
    'aluminum_sphere_' + uuidv4(),
    { diameter: diameter },
    scene
  );
  mesh.material = mat;
  mesh.position.x += diameter;
  return mesh;
};
