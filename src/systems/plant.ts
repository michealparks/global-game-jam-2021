import type { Object3D } from 'three'

const plants = new Set()

const add = (plant: Object3D) => {
  plants.add(plant)
}

export const plant = {
  add
}
