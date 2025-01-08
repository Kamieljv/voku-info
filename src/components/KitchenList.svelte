<script>
  export let kitchens;
  export let onKitchenSelect;

  function handleKitchenClick(kitchen) {
    onKitchenSelect(kitchen);
  }
</script>

<div class="kitchen-list">
  {#each kitchens as kitchen}
    <div class="kitchen-card" on:click={() => handleKitchenClick(kitchen)}>
      <h3>{kitchen.name}</h3>
      <p class="address">{kitchen.address}</p>
      <div class="next-open">
        Next open: {Object.entries(kitchen.openingTimes)[0]?.[0] || 'Not available'}
      </div>
    </div>
  {/each}
</div>

<style>
  .kitchen-list {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }

  .kitchen-card {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
  }

  .kitchen-card:hover {
    transform: translateY(-2px);
  }

  h3 {
    margin: 0 0 8px 0;
  }

  .address {
    color: #666;
    margin: 0 0 8px 0;
    font-size: 0.9em;
  }

  .next-open {
    font-size: 0.8em;
    color: #4CAF50;
  }
</style>
