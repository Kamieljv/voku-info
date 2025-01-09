<script>
  export let onClick = () => {};
  export let icon = '';
  export let label = '';
  export let disabled = false;
</script>

<button
  class="side-button"
  on:click={onClick}
  {disabled}
  aria-label={label}
>
  <i class="material-icons">{icon}</i>
</button>

<style>
  .side-button {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin: 8px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .side-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .side-button:hover:not(:disabled) {
    background: #f5f5f5;
  }
</style>
