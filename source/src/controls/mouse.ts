import type { Object3D } from 'three'

import {
  Intersection,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3
} from 'three'

import {
  FAR,
  PASSIVE,
  VECTOR_UP_Y
} from '../core/constants'

import { get } from 'svelte/store'
import { Tween, Easing } from '@tweenjs/tween.js'
import { selectedPlant  } from '../stores/selectedPlant'
import { gl } from '../core/gl'
import { adder } from '../systems/adder'

const raycaster = new Raycaster()
raycaster.far = FAR

const down = new Vector2()
const mouse = new Vector2()
const pos = new Vector3()
const quat = new Quaternion()
const intersectObjects: Object3D[] = []

let intersect: Intersection

const init = () => {
  gl.canvas.addEventListener('mousemove', handleMouseMove, PASSIVE)
  gl.canvas.addEventListener('pointerdown', handleMouseDown)
  gl.canvas.addEventListener('pointerup', handleMouseUp)
}

const uninit = () => {
  gl.canvas.removeEventListener('mousemove', handleMouseMove)
  gl.canvas.removeEventListener('pointerdown', handleMouseDown)
  gl.canvas.removeEventListener('pointerup', handleMouseUp)
}

const update = () => {
  raycaster.setFromCamera(mouse, gl.camera)

  const intersects = raycaster.intersectObjects(intersectObjects)

  intersect = intersects[0]
}

const handleMouseMove = (e: MouseEvent) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
}

const handleMouseDown = (e: MouseEvent) => {
  down.x = (e.clientX / window.innerWidth) * 2 - 1
  down.y = -(e.clientY / window.innerHeight) * 2 + 1
}

const handleMouseUp = (e: MouseEvent) => {
  const selected = get(selectedPlant)

  if (selected === null) {
    return
  }

  const x = (e.clientX / window.innerWidth) * 2 - 1
  const y = -(e.clientY / window.innerHeight) * 2 + 1
  const absX = Math.abs(x - down.x)
  const absY = Math.abs(y - down.y)

  if (absX > 0.02 || absY > 0.02) {
    return
  }

  if (!intersect.face) {
    throw new Error()
  }

  const { normal } = intersect.face

  pos.copy(intersect.point)
  quat.setFromUnitVectors(VECTOR_UP_Y, normal.clone().normalize())

  const added = adder.addToWorld(selected, pos, quat)

  added.rotation.y = Math.random() * Math.PI * 2
  added.scale.set(0, 0, 0)
 
  new Tween(added.scale)
    .easing(Easing.Quintic.Out)
    .to({ x: 1, y: 1, z: 1 }, 2000)
    .start()
}

const getIntersection = () => {
  return intersect
}

const addIntersectObject = (object: Object3D) => {
  intersectObjects.push(object)
}

export const mouseControls = {
  init,
  uninit,
  update,
  getIntersection,
  addIntersectObject
}