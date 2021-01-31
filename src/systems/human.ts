import { gl } from '../core/gl'
import { animation } from '../core/animation'
import { text } from '../core/text'
import { path } from '../systems/path'
import type { Object3D } from 'three'

const humans = new Set<any>()
const emotions = new Map<string, string>()
emotions.set('love', '<img src="assets/png/heart.png">')
emotions.set('despair', '<img src="assets/png/despair.png">')

const update = () => {
  for (const human of humans) {
    const { pathCompletion, displayingEmotion } = human.scene.userData

    if (pathCompletion > 0.40 && displayingEmotion === false) {
      text.setScreenTipAbove(human.scene, emotions.get('despair') ?? '')
      human.scene.userData.displayingEmotion = true
    } else if (pathCompletion > 0.50 && displayingEmotion === true) {
      text.clearScreenTip()
      human.scene.userData.displayingEmotion = false
    }
  }
}

const add = (human: any) => {
  human.scene.animations = human.animations
  human.scene.userData.displayingEmotion = false
  animation.playClip(human.scene, 'walk')
  gl.scene.add(human.scene)

  path.traverse(human.scene, 'Sidewalk')
  humans.add(human)
}

export const human = {
  update,
  add,
}
