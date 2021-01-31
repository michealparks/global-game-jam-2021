import { Tween, Easing } from '@tweenjs/tween.js'
import type { Mesh } from 'three'

import { Vector3 } from 'three'
import { gl } from './gl'

const screenTipNode = document.createElement('div')
screenTipNode.classList.add('screen-tip')
document.body.appendChild(screenTipNode)

const ANIMATE_DURATION = 400
const vec3 = new Vector3()

let mesh: Mesh | null = null

const animate = {
  scale: 0
}

const update = (dt: number) => {
  if (mesh === null) {
    return
  }

  mesh.updateMatrix()
  mesh.updateWorldMatrix(true, false)
  mesh.getWorldPosition(vec3)
  vec3.project(gl.camera)

  const x = (vec3.x *  0.5 + 0.5) * gl.canvas.clientWidth
  const y = (vec3.y * -0.5 + 0.5) * gl.canvas.clientHeight

  screenTipNode.style.transform = `translate(-50%, -50%) translate(${x}px, ${y - 150}px) scale(${animate.scale})`
}

const setScreenTipAbove = (newMesh: Mesh, text: string) => {
  mesh = newMesh
  screenTipNode.innerHTML = text

  new Tween(animate)
    .easing(Easing.Bounce.Out)
    .to({ scale: 1 }, ANIMATE_DURATION)
    .start()
}

const clearScreenTip = () => {
  new Tween(animate)
    .easing(Easing.Quadratic.Out)
    .to({ scale: 0 }, ANIMATE_DURATION)
    .onComplete(handleScreenTipEnd)
    .start()
}

const handleScreenTipEnd = () => {
  mesh = null
}

export const text = {
  update,
  setScreenTipAbove,
  clearScreenTip
}
