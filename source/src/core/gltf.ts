import {
  DirectionalLight,
  MeshStandardMaterial,
  SpotLight,
} from 'three'

import type {
  GLTFParams
} from './types'

import {
  Object3D,
  Mesh,
  PointLight,
  Light
} from 'three'

import { PLANTS } from './constants'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { animation } from './animation'
import { mouseControls } from '../controls/mouse'
import { audio } from './audio'
import { adder } from '../systems/adder'
import { plants } from '../stores/plants'

const gltfLoader = new GLTFLoader()

const init = (path: string) => {
  gltfLoader.setPath(path)
}

const parse = (gltf: any, params: GLTFParams) => {
  const remove = new Set<Object3D>()

  // TODO: Move a lot of this to compile time with:
  // https://github.com/donmccurdy/glTF-Transform
  gltf.scene.traverse((object: Object3D) => {
    const { userData } = object
    const { components = '' } = userData

    // Set object options
    if (userData.visible === 'false') {
      object.visible = false
    }

    // Set param options
    if (params.shadows === true) {
      if (object instanceof Light) {
        if (object instanceof PointLight || object instanceof SpotLight) {
          object.castShadow = true
          object.shadow.bias = -0.0005
          object.shadow.camera.fov = 5
          object.shadow.mapSize.width = 1024 * 4
          object.shadow.mapSize.height = 1024 * 4
          // object.shadow.camera.far = 15
          object.shadow.camera.near = 1
        } else if (object instanceof DirectionalLight) {
          object.castShadow = true

          const SIZE = 20
          object.shadow.camera.left = -SIZE
          object.shadow.camera.right = SIZE
          object.shadow.camera.top = SIZE
          object.shadow.camera.bottom = -SIZE
          object.shadow.bias = -0.0001
          object.shadow.mapSize.width = 1024 * 4
          object.shadow.mapSize.height = 1024 * 4
          // object.shadow.camera.far = 15
          // object.shadow.camera.near = 1
        }
      } else {
        const castShadow = userData.castShadow === 'false' ? false : true
        const receiveShadow = userData.receiveShadow === 'false' ? false : true
        object.castShadow = castShadow
        object.receiveShadow = receiveShadow
      }
    }

    if (object instanceof Mesh) {
      const material = object.material

      if (material instanceof MeshStandardMaterial) {
        material.flatShading = true
      }
    }

    if (components.includes('ground') === true) {
      mouseControls.addIntersectObject(object)
    }

    // Init audio component
    if (components.includes('audio') === true) {
      audio.createPositional(userData.audio_file, object, userData.audio_refDistance)
        .then(() => audio.play(userData.audio_file))
    }

    if (components.includes('addable') === true) {
      adder.register(object)
    }

    if (components.includes('plant') === true) {
      plants.update(arr => [...arr, object])
      PLANTS.push(object.name)
    }
  })

  gltf.scene.animations = gltf.animations

  for (const animationClip of gltf.animations) {
    if (animationClip.name.includes('Default') === false) {
      continue
    }

    animation.playClip(gltf.scene, animationClip.name)
  }

  return gltf
}

export const GLTF = {
  init,
  parse
}
