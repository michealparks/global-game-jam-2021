import type { Object3D } from 'three'

import {
  CatmullRomCurve3,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  Line
} from 'three'

import { gl } from '../core/gl'

const paths = new Map<string, any>()
const objects = new Map<string, Object3D>()

let time = 0.0

const position = new Vector3()
const target = new Vector3()
const offset = 0.01

const update = (dt: number) => {
  time += (dt * 0.00001)

  for (const [path, object] of objects) {
    const { startingPoint } = object.userData
    const { curve, curveObject } = paths.get(path)

    if (curve === undefined) {
      throw new Error('Path is undefined')
    }

    curve.getPointAt((time + startingPoint) % 1, position)
    position.applyMatrix4(curveObject.matrixWorld)

    curve.getPointAt((time + startingPoint + offset) % 1, target)
    target.applyMatrix4(curveObject.matrixWorld)

    object.position.copy(position)
    object.lookAt(target)

    object.position.lerpVectors(position, target, 0.5)
    object.position.y += 0.4
    
    object.userData.pathCompletion = (time + startingPoint) % 1
  }
}

const register = (name: string, source: string) => {
  const points = []

  for (const str of source.split(/\n/).filter(str => str.startsWith('v '))) {
    const [, x, y, z] = str.split(/\s/)
    points.push(new Vector3(parseInt(x, 10), parseInt(y, 10), parseInt(z, 10)))
  }

  const curve = new CatmullRomCurve3(points)
  const pts = curve.getPoints( 50 )
  const geometry = new BufferGeometry().setFromPoints( pts )
  const material = new LineBasicMaterial( { color : 0xff0000 } )
  const curveObject = new Line( geometry, material )

  paths.set(name, { curve, curveObject })

  gl.scene.add(curveObject)
}

const traverse = (obj: Object3D, path: string, startingPoint = 0) => {
  obj.userData.startingPoint = startingPoint
  objects.set(path, obj)
}

export const path = {
  update,
  register,
  traverse
}
