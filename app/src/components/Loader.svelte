<div class="spinner"></div>

<style>
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid var(--white);
		border-top: 4px solid var(--orange-200);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 2rem auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
