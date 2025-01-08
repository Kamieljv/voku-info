<script>
  import { onMount, onDestroy } from 'svelte';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import KitchenDetails from '../components/KitchenDetails.svelte';
  import KitchenList from '../components/KitchenList.svelte';
  import { Map } from '$lib/Map';
  import { kitchens, selectedKitchen, currentView } from '$lib/stores';

  let mapInstance;
  let mapContainer;
  
  onMount(() => {
    const apiKey = import.meta.env.VITE_PROTOMAPS_API_KEY;
    mapInstance = new Map(mapContainer, apiKey);
    mapInstance.initialize();
    
    // Subscribe to kitchen updates to update markers
    const unsubscribe = kitchens.subscribe($kitchens => {
      mapInstance.addMarkers($kitchens, kitchen => selectedKitchen.set(kitchen));
    });
    
    return () => {
      unsubscribe();
    };
  });

  onDestroy(() => {
    if (mapInstance) {
      mapInstance.destroy();
    }
  });
</script>

<div class="view-toggle">
  <button 
    class:active={$currentView === 'map'} 
    on:click={() => currentView.set('map')}
  >
    Map
  </button>
  <button 
    class:active={$currentView === 'list'} 
    on:click={() => currentView.set('list')}
  >
    List
  </button>
</div>
<div class="map-container" bind:this={mapContainer}></div>
{#if $currentView === 'list'}
  <div class="list-container">
    <KitchenList 
      kitchens={$kitchens} 
      onKitchenSelect={(kitchen) => selectedKitchen.set(kitchen)}
    />
  </div>
{/if}

{#if $selectedKitchen}
  <KitchenDetails 
    kitchen={$selectedKitchen} 
    onClose={() => selectedKitchen.set(null)}
  />
{/if}

<style>
  :global(body) {
    font-family: 'Outfit', sans-serif;
    margin: 0;
    padding: 0;
  }
  .map-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .list-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f5;
  }

  .view-toggle {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: white;
    border-radius: 20px;
    padding: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .view-toggle button {
    border: none;
    background: none;
    padding: 8px 16px;
    border-radius: 15px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .view-toggle button.active {
    background: #4CAF50;
    color: white;
  }

  :global(.maplibregl-marker) {
    cursor: pointer;
  }
</style>
