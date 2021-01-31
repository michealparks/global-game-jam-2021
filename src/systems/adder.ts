import type {
  Object3D,
  Quaternion,
  Vector3
} from 'three'

import { gl } from '../core/gl'
import { environment } from './environment'

const addables = new Map<string, Object3D>()

const addToWorld = (name: string, pos: Vector3, rot: Quaternion) => {
  const addable = addables.get(name)

  if (addable === undefined) {
    throw new Error()
  }

  const clone = addable.clone()
  clone.visible = true

  gl.scene.add(clone)
  addable.position.copy(pos)
  addable.quaternion.copy(rot)

  environment.registerPlant(addable)

  return addable
}

const register = (object: Object3D) => {
  addables.set(object.name, object)
}

export const adder = {
  register,
  addToWorld
}
