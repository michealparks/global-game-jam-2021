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
    const { pathCompletion, displayingEmotion } = human.userData

    if (pathCompletion > 0.40 && pathCompletion <= 0.5 && displayingEmotion === false) {
      console.log('ONCE')
      text.setScreenTipAbove(human, emotions.get('despair') ?? '')
      human.userData.displayingEmotion = true
    } else if (pathCompletion > 0.50 && displayingEmotion === true) {
      text.clearScreenTip()
      human.userData.displayingEmotion = false
    }
  }
}

const add = (human: any) => {
  human.scene.animations = [...human.animations]
  human.scene.userData.displayingEmotion = false
  animation.playClip(human.scene, 'walk')

  const clone = human.scene.clone()

  console.log(human.scene, clone)
  gl.scene.add(human.scene)

  path.traverse(human.scene, 'Sidewalk')
  humans.add(human.scene)
}

export const human = {
  update,
  add,
}
