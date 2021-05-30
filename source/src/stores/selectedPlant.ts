import { writable } from 'svelte/store'

export const selectedPlant = writable<null | string>(null)
