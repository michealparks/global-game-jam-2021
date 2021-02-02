import type { Quaternion } from 'three'

import { Object3D, Vector3, Box3 } from 'three'
import { gl } from '../core/gl'
import { audio } from '../core/audio'
import { environment } from './environment'

const vec3 = new Vector3()
const box3 = new Box3()

const selectionMenuScale = 0.05

const addables = new Map<string, Object3D>()
const selectionMenu = new Object3D()
selectionMenu.name = 'Selection Menu'
gl.camera.add(selectionMenu)
gl.camera.getWorldDirection(vec3)
selectionMenu.position.add(vec3)
selectionMenu.position.y -= 0.2
selectionMenu.position.x -= 0.35

selectionMenu.scale.set(selectionMenuScale, selectionMenuScale, selectionMenuScale)
setTimeout(() => {
  console.log(vec3)
  gl.camera.lookAt(selectionMenu.position)
}, 1000)


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
  audio.play(note, true)

  return addable
}

let y = 0

const register = (object: Object3D) => {
  addables.set(object.name, object)
  const clone = object.clone()
  clone.position.set(0, y, 0)
  clone.castShadow = false
  clone.receiveShadow = false

  box3.setFromObject(clone)
  box3.getSize(vec3)

  y += vec3.y + 0.2

  selectionMenu.add(clone)
  
}

export const adder = {
  register,
  addToWorld
}
