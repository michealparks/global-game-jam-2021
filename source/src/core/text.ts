import { Tween, Easing } from '@tweenjs/tween.js'
import { Box3, Object3D } from 'three'

import { Vector3 } from 'three'
import { gl } from './gl'

const vec3 = new Vector3()
const vec3_2 = new Vector3()
const box3 = new Box3()

const textBubbles = new Set<ScreenTextBubble>()

export class ScreenTextBubble {
  active = false
  node = document.createElement('div')
  animationDuration = 400
  animate = { scale: 0 }

  object: Object3D

  constructor (object: Object3D) {
    this.object = object
    this.node.classList.add('screen-tip')
    this.node.id = object.name
    document.body.appendChild(this.node)

    this.setScreenTipAbove = this.setScreenTipAbove.bind(this)
    this.clearScreenTip = this.clearScreenTip.bind(this)
    this.handleScreenTipEnd = this.handleScreenTipEnd.bind(this)

    textBubbles.add(this)
  }

  update () {
    if (this.active === false) {
      return
    }

    this.object.updateMatrix()
    this.object.updateWorldMatrix(true, false)
    this.object.getWorldPosition(vec3)
    box3.setFromObject(this.object)
    box3.getSize(vec3_2)

    vec3.y += (vec3_2.y)

    vec3.project(gl.camera)

    const x = (vec3.x *  0.5 + 0.5) * gl.canvas.clientWidth
    const y = (vec3.y * -0.5 + 0.5) * gl.canvas.clientHeight

    this.node.style.transform = `translate(-50%, calc(-50%)) translate(${x}px, ${y - 50}px) scale(${this.animate.scale})`
  }

  setScreenTipAbove (text: string) {
    console.log(this.node.id)
    this.active = true
    this.node.innerHTML = text

    new Tween(this.animate)
      .easing(Easing.Bounce.Out)
      .to({ scale: 1 }, this.animationDuration)
      .start()
  }

  clearScreenTip () {
    new Tween(this.animate)
      .easing(Easing.Quadratic.Out)
      .to({ scale: 0 }, this.animationDuration)
      .onComplete(this.handleScreenTipEnd)
      .start()
  }

  handleScreenTipEnd () {
    this.active = false
  }
}

const update = () => {
  for (const bubble of textBubbles) {
    bubble.update()
  }
}

export const text = {
  update
}
