import { gl } from '../core/gl'
import { animation } from '../core/animation'
import { ScreenTextBubble } from '../core/text'
import { path } from '../systems/path'
import { environment } from '../systems/environment'
import { assets } from '../core/assets'
import { GLTF } from '../core/gltf'

const humans = new Set<any>()
const emotions = new Map<string, string>()
const textBubbles = new Map<number, ScreenTextBubble>()

emotions.set('love', '<img src="assets/png/heart.png">')
emotions.set('despair', '<img src="assets/png/despair.png">')

const EMOTION_START = 0.35
const EMOTION_END = 0.6

const update = () => {
  for (const human of humans) {
    const { pathCompletion, displayingEmotion } = human.userData

    const text = textBubbles.get(human.id)

    if (pathCompletion > EMOTION_START && pathCompletion <= EMOTION_END && displayingEmotion === false) {
      const health = environment.getHealth()
      let emotion: string

      if (health > 0.6) {
        emotion = emotions.get('love') ?? ''
      } else {
        emotion = emotions.get('despair') ?? ''
      }

      text?.setScreenTipAbove(emotion)
      human.userData.displayingEmotion = true
    } else if (pathCompletion > EMOTION_END && displayingEmotion === true) {
      text?.clearScreenTip()
      human.userData.displayingEmotion = false
    }
  }
}

const add = async (name: string) => {
  const human = GLTF.parse(await assets.gltfLoader.loadAsync('girl.glb'), {
    shadows: true
  })

  human.scene.animations = human.animations
  human.scene.userData.displayingEmotion = false

  textBubbles.set(human.scene.id, new ScreenTextBubble(human.scene))

  animation.playClip(human.scene, 'walk')

  gl.scene.add(human.scene)

  path.traverse(human.scene, 'Sidewalk', Math.random())
  humans.add(human.scene)
}

export const human = {
  update,
  add,
}
