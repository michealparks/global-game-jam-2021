import type {
  Object3D,
  Quaternion,
  Vector3
} from 'three'

import { gl } from '../core/gl'
import { plant } from './plant'

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

  plant.add(addable)

  return addable
}

const register = (object: Object3D) => {
  addables.set(object.name, object)
  console.log(addables)
}

export const adder = {
  register,
  addToWorld
}
