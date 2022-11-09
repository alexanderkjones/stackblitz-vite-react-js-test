import {
  ArcRotateCamera,
  Vector3,
  Color3,
  MeshBuilder,
  GizmoManager,
  CubeTexture,
  PBRMetallicRoughnessMaterial,
  HighlightLayer,
  KeyboardEventTypes,
  PointerEventTypes,
  PointerDragBehavior,
  VertexBuffer,
} from '@babylonjs/core';

import { addStandardArcCamera } from '../babylonjs/Cameras';
import { addStandardGrid } from '../babylonjs/Grids';
import { addStandardEnvironment } from '../babylonjs/Environments';
import {
  AluminumCube,
  AluminumSphere,
  AluminumPyramid,
} from '../babylonjs/Objects';

export class SceneManager {
  constructor() {
    this.scene = null;
  }

  buildDefaultScene = (scene) => {
    // Attach scene to manager
    this.scene = scene;

    // Initialize active mesh
    this.activeMesh = null;
    this.activeMeshFaceIDs = [];
    this.activeMeshIndices = [];
    this.activeMeshPositions = [];
    this.activeMeshFaceData = [];

    this.activeModifierKeys = [];

    // Build intitial environment
    this.camera = addStandardArcCamera(scene, 100);
    this.grid = addStandardGrid(scene, 150, 150);
    this.env = addStandardEnvironment(scene);
    this.hl = new HighlightLayer('hl1', scene, {});
    this.hl.addExcludedMesh(this.grid);

    this.dragBehavior = new PointerDragBehavior();

    // Add default cube
    let defaultSize = 10;

    let cube = AluminumCube(scene, defaultSize);
    //let sphere = AluminumSphere(scene, defaultSize);
    let cube2 = AluminumCube(scene, defaultSize);

    this.vert1 = AluminumSphere(scene, 2);
    this.vert2 = AluminumSphere(scene, 2);
    this.vert3 = AluminumSphere(scene, 2);

    //sphere.position.y += defaultSize;
    cube2.position.y += defaultSize;
    cube2.position.x -= defaultSize * 1.5;
    cube.position.y += defaultSize;
    cube.position.x += defaultSize * 1.5;

    // scene.meshes.forEach(m=>{
    //     	console.log(m.name)
    // 	})
  };

  updateMenuSelection = (value) => {
    if (value) {
      this.activeMenuSelection = value;
    }
    if (this.activeMenuSelection == 'home') {
      this.camera.alpha = -Math.PI / 2;
      this.camera.beta = Math.PI / 2 - Math.PI / 10;
    }
  };

  updateSelectedMesh = (type, value) => {
    if (!this.activeMesh) {
      return;
    }

    switch (type) {
      case 'rotation_x':
        this.activeMesh.rotation.x = (value / 100) * 2 * Math.PI;
        break;
      case 'rotation_y':
        this.activeMesh.rotation.y = (value / 100) * 2 * Math.PI;
        break;
    }
  };

  attachMouseInputController = () => {
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          // Click on mesh makes it the new active mesh
          if (pointerInfo.pickInfo.pickedMesh) {
            // Clicking on background deselects active mesh
            if (
              ['ground', 'BackgroundPlane', 'BackgroundSkybox'].includes(
                pointerInfo.pickInfo.pickedMesh.name
              )
            ) {
              if (this.activeMesh) {
                this.hl.removeMesh(this.activeMesh);
                this.activeMesh.removeBehavior(this.dragBehavior);
                this.activeMesh = null;
              }
              return;
            }

            // Remove drag behavior from previous mesh
            if (this.activeMesh) {
              this.hl.removeMesh(this.activeMesh);
              this.activeMesh.removeBehavior(this.dragBehavior);
            }

            // Activate new mesh
            this.activeMesh = pointerInfo.pickInfo.pickedMesh;

            // Temporarily get vertex info here..
            this.activeMeshIndices = this.activeMesh.getIndices();
            this.activeMeshPositions = this.activeMesh.getVerticesData(
              VertexBuffer.PositionKind
            );
            this.activeMeshFaceIDs = this.activeMeshIndices.length / 3;

            //console.log(this.activeMeshPositions);

            // Pack positions into vertices
            var vertices = [];
            for (let i = 0; i < this.activeMeshIndices.length; i++) {
              let vertLocal = Vector3.FromArray(
                this.activeMeshPositions,
                3 * this.activeMeshIndices[i]
              );
              let vertGlobal = Vector3.TransformCoordinates(
                vertLocal,
                this.activeMesh.getWorldMatrix()
              );

              vertices.push(vertGlobal);
            }

            // Pack faces
            for (let i = 0; i < this.activeMeshIndices.length / 3; i++) {
              let thisFace = vertices.splice(0, 3);
              this.activeMeshFaceData.push(thisFace);
            }

            // console.log('faces:')
            // for(let i=0; i<this.activeMeshFaceData.length; i++){
            // 	console.log(this.activeMeshFaceData[i]);
            // }

            // Attach drag behavior to new actiev mesh
            this.activeMesh.addBehavior(this.dragBehavior);
            //this.hl.addMesh(this.activeMesh, Color3.Yellow());
            console.log(pointerInfo.pickInfo.pickedMesh.id + ' selected');
            //console.log(pointerInfo.pickInfo.pickedMesh.getIndices());
            //console.log(pointerInfo.pickInfo.pickedMesh.getVerticesData(VertexBuffer.PositionKind));
          }

          break;
        case PointerEventTypes.POINTERUP:
          //console.log("POINTER UP");

          break;
        case PointerEventTypes.POINTERMOVE:
          //console.log("POINTER MOVE");

          // Don't do anything if we haven't selected an active mesh
          if (!this.activeMesh) {
            return;
          }

          // Get PickingInfo
          var pickInfo = this.scene.pick(
            this.scene.pointerX,
            this.scene.pointerY
          );

          // Reduce noise from moving over static environment
          if (
            ['ground', 'BackgroundPlane', 'BackgroundSkybox'].includes(
              pickInfo.pickedMesh.name
            )
          ) {
            return;
          }

          // If hovering over inactive mesh, ignore
          if (pickInfo.pickedMesh.name !== this.activeMesh.name) {
            return;
          }

          console.log(pickInfo.pickedMesh.name, ' ', pickInfo.faceId); //,": ",pointerInfo.pickInfo.faceId);
          //console.log(this.activeMeshFaceData[pickInfo.faceId])
          console.log('picked_point', pickInfo.pickedPoint);

          let verts = this.activeMeshFaceData[pickInfo.faceId];
          this.vert1.position.x = verts[0].x;
          this.vert1.position.y = verts[0].y;
          this.vert1.position.z = verts[0].z;

          this.vert2.position.x = verts[1].x;
          this.vert2.position.y = verts[1].y;
          this.vert2.position.z = verts[1].z;

          this.vert3.position.x = verts[2].x;
          this.vert3.position.y = verts[2].y;
          this.vert3.position.z = verts[2].z;

          console.log('face data', verts);
          // for(let i=0; i<activeFaceVertices.length; i++){
          // 	this.vertices[i].position = activeFaceVertices;
          // }

          break;
        case PointerEventTypes.POINTERWHEEL:
          //console.log("POINTER WHEEL");
          break;
        case PointerEventTypes.POINTERPICK:
          //console.log("POINTER PICK");

          break;
        case PointerEventTypes.POINTERTAP:
          //console.log("POINTER TAP");
          break;
        case PointerEventTypes.POINTERDOUBLETAP:
          //console.log("POINTER DOUBLE-TAP");
          break;
      }
    });
  };

  attachKeyboardInputController = () => {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          // If we detect a modifier key, save that for later
          if (['Meta', 'Control', 'Alt', 'Shift'].includes(kbInfo.event.key)) {
            this.activeModifierKeys.push(kbInfo.event.key);
            //console.log(this.activeModifierKeys);
            return;
          }

          //console.log(kbInfo.event.key);
          switch (kbInfo.event.key) {
            case 'a':
            case 'A':
              this.activeMesh.position.x -= 1;
              break;
            case 'Shift':
              //console.log('shift');
              break;
            case 'd':
            case 'D':
              this.activeMesh.position.x += 1;
              break;
            case 'w':
            case 'W':
              this.activeMesh.position.y += 1;
              break;
            case 's':
            case 'S':
              this.activeMesh.position.y -= 1;
              break;
          }
          break;

        case KeyboardEventTypes.KEYUP:
          if (['Meta', 'Control', 'Alt', 'Shift'].includes(kbInfo.event.key)) {
            this.activeModifierKeys.splice(
              this.activeModifierKeys.indexOf(kbInfo.event.key),
              1
            );
            return;
          }
          break;
      }
    });
  };
}

// var createScene = function () {
//     // Create basic scene
//     var scene = new BABYLON.Scene(engine);
//     var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 2 - (Math.PI/10), 10, new BABYLON.Vector3(0, 0, 0));
//     // This attaches the camera to the canvas
//     camera.attachControl(canvas, true);
//     var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
//     light.intensity = 0.7;
//     var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
//     sphere.rotation.x = Math.PI/2
//     sphere.position.y = 1;
//     sphere.addBehavior(new BABYLON.PointerDragBehavior());
//     var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

//     return scene;

// };
