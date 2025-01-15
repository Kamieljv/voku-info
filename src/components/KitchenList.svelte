<script lang="ts">
  export let trees;
  export let onTreeSelect;

  function handleTreeClick(tree) {
    onTreeSelect(tree);
  }
</script>

<div class="tree-list">
  {#each trees as tree}
    <div class="tree-card" on:click={() => handleTreeClick(tree)}>
      <h3>{tree.species}</h3>
      <p class="description">{tree.description}</p>
      <div class="age">
        Age: {tree.age} years
      </div>
    </div>
  {/each}
</div>

<style>
  .tree-list {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
  }

  .tree-card {
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
