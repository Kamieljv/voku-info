<script>
  export let onClick = () => {};
  export let label = '';
  export let disabled = false;
</script>

<button
  class="side-button"
  on:click={onClick}
  {disabled}
  aria-label={label}
>
  <slot />
</button>

<style>
  .side-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 6px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .side-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .side-button:hover:not(:disabled) {
    background: #f0f0f0;
  }
</style>
