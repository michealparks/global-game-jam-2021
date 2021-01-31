
import type {
  Quaternion,
} from 'three'

import { Object3D, Vector3 } from 'three'
import { gl } from '../core/gl'
import { audio } from '../core/audio'
import { environment } from './environment'

const vec3 = new Vector3()

const addables = new Map<string, Object3D>()
const selectionMenu = new Object3D()
selectionMenu.name = 'Selection Menu'
gl.camera.add(selectionMenu)
gl.camera.getWorldDirection(vec3)
selectionMenu.position.add(vec3)

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
  
  const note = `note_${(Math.random() * 7 | 0) + 1}.mp3`
  console.log(note)
  audio.play(note, true)

  return addable
}

const register = (object: Object3D) => {
  addables.set(object.name, object)
  selectionMenu.add(object.clone())
  
}

export const adder = {
  register,
  addToWorld
}
