import { Vector3 } from 'three'
import { gl } from './core/gl'
import { assets } from './core/assets'
import { GLTF } from './core/gltf'
import { orbitControls } from './controls/orbit'
import { mouseControls } from './controls/mouse'
import { animation } from './core/animation'
import { text } from './core/text'
import { path } from './systems/path'
import { human } from './systems/human'
import { audio } from './core/audio'

export const init = async () => {
  console.log('hi')
  assets.queue(
    'paths.obj',
    'scene.glb',
    'girl.glb',

    'city-park-ambience.mp3',
    'street-noise.mp3',
    'soundtrack.mp3',

    'note_1.mp3',
    'note_2.mp3',
    'note_3.mp3',
    'note_4.mp3',
    'note_5.mp3',
    'note_6.mp3',
    'note_7.mp3',
    'note_8.mp3',
  )

  await Promise.all([
    gl.init(),
    assets.load(),
    mouseControls.init()
  ])

  path.register('Sidewalk', assets.get('paths.obj'))

  for (let i of Array(1)) {
    human.add('girl.glb', 0.5)
  }
  
  const city = GLTF.parse(assets.get('scene.glb'), {
    shadows: true
  })

  for (let i = 1; i < 9; i++) {
    audio.create(`note_${i}.mp3`, false, 0.5)
  }

  window.addEventListener('click', () => {
    audio.create('city-park-ambience.mp3', true, 0.3).play('city-park-ambience.mp3')
    audio.create('street-noise.mp3', true, 0.3).play('street-noise.mp3')
    audio.create('soundtrack.mp3', true, 0.6).play('soundtrack.mp3')
  }, { once: true })

  gl.scene.add(city.scene)
  gl.ambientLight.intensity = 0.5

  gl.camera.position.set(50, 20, 50)
  orbitControls.target.set(12.5, 0, 12.5)

  requestAnimationFrame(() => {
    gl.camera.lookAt(new Vector3())
  })

  const frame = (dt: number) => {
    orbitControls.update()
    mouseControls.update()
    text.update()
    animation.update(dt)
    path.update(dt)
    human.update()
  }

  gl.setAnimationLoop(frame)
}
