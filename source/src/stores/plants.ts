import { writable } from 'svelte/store'
import type { Object3D } from 'three'

export const plants = writable<Object3D[]>([])
