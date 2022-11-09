import { useEffect, useRef, useState } from 'react';
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
import { Grid } from '@mui/material';
import SceneComponent from '../babylon/SceneComponent';
import SliderComponent from './SliderComponent';
import ButtonBarComponent from './ButtonBarComponent';

import { SceneManager } from '../../babylonjs/SceneManager';

const EditorComponent = (props) => {
  let sceneManager = new SceneManager();

  // Will execute once when scene is ready
  const onSceneReady = (scene) => {
    sceneManager.buildDefaultScene(scene);
    sceneManager.attachMouseInputController();
    sceneManager.attachKeyboardInputController();
  };

  //Will run on every frame render.  We are spinning the box on y-axis.
  const onRender = (scene) => {
    var test;
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SceneComponent
            antialias
            onSceneReady={onSceneReady}
            onRender={onRender}
            id="viewport"
          ></SceneComponent>
        </Grid>

        <Grid item xs={12}>
          <ButtonBarComponent
            toUpdate={sceneManager.updateMenuSelection}
            activeButton={sceneManager.menuSelection}
          ></ButtonBarComponent>
        </Grid>

        <Grid item xs={6}>
          <SliderComponent
            toUpdate={sceneManager.updateSelectedMesh}
            type={'rotation_y'}
          ></SliderComponent>
        </Grid>
        <Grid item xs={6}>
          <SliderComponent
            toUpdate={sceneManager.updateSelectedMesh}
            type={'rotation_x'}
          ></SliderComponent>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditorComponent;
