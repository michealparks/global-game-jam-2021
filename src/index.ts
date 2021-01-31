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
import { environment } from './systems/environment'
import { audio } from './core/audio'

const init = async () => {
  assets.queue(
    'paths.obj',
    'scene.glb',
    'girl.glb',

    'city-park-ambience.mp3',
    'street-noise.mp3',
    'soundtrack.mp3'
  )

  await Promise.all([
    gl.init(),
    assets.load(),
    mouseControls.init()
  ])

  path.register('Sidewalk', assets.get('paths.obj'))

  
  human.add(GLTF.parse(assets.get('girl.glb'), {
    shadows: true
  }))
  
  const city = GLTF.parse(assets.get('scene.glb'), {
    shadows: true
  })

  audio.create('city-park-ambience.mp3', true, 0.5).play('city-park-ambience.mp3')
  audio.create('street-noise.mp3', true, 0.5).play('street-noise.mp3')
  audio.create('soundtrack.mp3').play('soundtrack.mp3')

  gl.scene.add(city.scene)
  gl.ambientLight.intensity = 0.5

  gl.camera.position.set(50, 20, 50)
  orbitControls.target.set(12.5, 0, 12.5)

  requestAnimationFrame(() => {
    gl.camera.lookAt(new Vector3())
  })

  setInterval(() => {
    console.log(environment.getHealth())
  }, 1000)

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

init()
