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

const init = async () => {
  assets.queue(
    'paths.obj',
    'scene.glb',
    'girl.glb'
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

  gl.scene.add(city.scene)
  gl.ambientLight.intensity = 0.5

  gl.camera.position.set(50, 20, 50)
  orbitControls.target.set(12.5, 0, 12.5)

  requestAnimationFrame(() => {
    gl.camera.lookAt(new Vector3())
  })

  text.setScreenTipAbove(city.scene.getObjectByName('Grass'), 'hi')

  setTimeout(() => {
    text.clearScreenTip()
  }, 2000)

  const frame = (dt: number) => {
    orbitControls.update()
    mouseControls.update()
    text.update(dt)
    animation.update(dt)
    path.update(dt)
    human.update()
  }

  gl.setAnimationLoop(frame)
}

init()
