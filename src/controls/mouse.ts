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
  PLANTS,
  VECTOR_UP_Y
} from '../core/constants'

import { Tween, Easing } from '@tweenjs/tween.js'
import { gl } from '../core/gl'
import { adder } from '../systems/adder'
import { orbitControls } from './orbit'

const raycaster = new Raycaster()
raycaster.far = FAR

const down = new Vector2()
const mouse = new Vector2()
const pos = new Vector3()
const quat = new Quaternion()

let intersect: Intersection
let didChange = false

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

  const intersects = raycaster.intersectObjects(gl.scene.children, true)

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
  const x = (e.clientX / window.innerWidth) * 2 - 1
  const y = -(e.clientY / window.innerHeight) * 2 + 1
  
  if (x !== down.x || y !== down.y) {
    return
  }

  if (intersect.face === null || intersect.face === undefined) {
    return
  }

  if (intersect.object.name.includes('Ground') === false) {
    return
  }

  const { normal } = intersect.face

  pos.copy(intersect.point)
  quat.setFromUnitVectors(VECTOR_UP_Y, normal.clone().normalize())
  
  const name = PLANTS[Math.random() * PLANTS.length | 0]
  const added = adder.addToWorld(name, pos, quat)

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

export const mouseControls = {
  init,
  uninit,
  update,
  getIntersection
}