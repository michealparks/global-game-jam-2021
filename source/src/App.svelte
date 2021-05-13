<script lang='ts'>
	import { init } from './game'

	init()

	let hidden = false
	
	const handleClick = () => {
		hidden = true
	}
</script>

<section class:hidden>
	<h1>The residents of this city block have lost their connection to nature.</h1>
	<h3>Help them find it again by reclaiming this abandoned lot.</h3>
	<button on:click={handleClick}>Start</button>
</section>

<style>
	section {
		position: absolute;
		color: white;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		transition: opacity 500ms;
		z-index: 1000;
	}

	.hidden {
		opacity: 0;
		pointer-events: none;
	}

	button {
		padding: 8px 16px;
		background: #fff;
		border: 0;
		border-radius: 10px;
		font-weight: 500;
	}

	h1, h3 {
		width: 800px;
	}
</style>