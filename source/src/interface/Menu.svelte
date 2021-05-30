<script lang='ts'>
	import { plants } from '../stores/plants'
	import { selectedPlant } from '../stores/selectedPlant'

	const handleSelectPlant = (e: MouseEvent) => {
		if (e.target === null) {
			return
		}

		$selectedPlant = e.target.dataset.name
	}
</script>

<section on:click={handleSelectPlant}>
	{#each $plants as { name }}
		<button
			class:selected={$selectedPlant === name}
			data-name={name}>
			{name}
		</button>
	{/each}
</section>

<style lang='scss'>
	section {
		position: absolute;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		padding: 5px;
	}

	button {
		padding: 8px 12px;
		background: none;
		color: white;
		border: 1px solid white;
		border-radius: 10px;

		&.selected {
			background: white;
			color: black;
		}
	}
</style>
