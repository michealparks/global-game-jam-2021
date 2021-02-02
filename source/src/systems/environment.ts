import type { Object3D } from 'three'

let totalPlants = 7

const plants: Object3D[] = []
const trash: Object3D[] = []

const registerTotalPlants = (n: number) => {
  totalPlants = n
}

const registerPlant = (plant: Object3D) => {
  plants.push(plant)
}

const registerTrash = (trashItem: Object3D) => {
  trash.push(trashItem)
}

/**
 * 40% Volume
 * 60% Diversity
 * -50% Trash
 */
const getHealth = () => {
  let health = 0

  if (plants.length === 0) {
    return 0
  }

  health += (plants.length / 100)
  health *= 0.6

  let uniques = new Set<string>()

  for (const plant of plants) {
    uniques.add(plant.name)
  }

  let diversityScore = uniques.size / totalPlants * 100 * 0.4

  return health + diversityScore
}

export const environment = {
  registerTotalPlants,
  registerPlant,
  registerTrash,
  getHealth
}
