<script lang="ts">
  let count = $state(0);
</script>

<button onclick={() => count++}>
  Island Hydration Test: {count}
</button>

<style>
  button {
    background: var(--color-accent, #c8a97e);
    color: #0a0a0a;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: opacity 0.2s;
  }

  button:hover {
    opacity: 0.85;
  }
</style>
