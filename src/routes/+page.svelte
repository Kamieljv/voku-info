<script>
  import { onMount } from 'svelte';
  import maplibre from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import KitchenDetails from '../components/KitchenDetails.svelte';
  import KitchenList from '../components/KitchenList.svelte';

  let map;
  let mapContainer;
  let selectedKitchen = null;
  let currentView = 'map'; // 'map' or 'list'

  const kitchens = [
    {
      id: 1,
      name: "Voku De Peper",
      coordinates: [4.8896, 52.3740],
      address: "Overtoom 301, Amsterdam",
      openingTimes: {
        monday: "18:00 - 20:00",
        wednesday: "18:00 - 20:00",
        friday: "18:00 - 20:00"
      },
      reservationNeeded: true,
      website: "https://depeper.org"
    }
    // Add more kitchens here
  ];

  onMount(() => {
    map = new maplibre.Map({
      container: mapContainer,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [4.9041, 52.3676], // Amsterdam center
      zoom: 12
    });

    kitchens.forEach(kitchen => {
      const marker = new maplibre.Marker()
        .setLngLat(kitchen.coordinates)
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        selectedKitchen = kitchen;
      });
    });
  });
</script>

<div class="view-toggle">
  <button 
    class:active={currentView === 'map'} 
    on:click={() => currentView = 'map'}
  >
    Map
  </button>
  <button 
    class:active={currentView === 'list'} 
    on:click={() => currentView = 'list'}
  >
    List
  </button>
</div>

{#if currentView === 'map'}
  <div class="map-container" bind:this={mapContainer}></div>
{:else}
  <div class="list-container">
    <KitchenList 
      {kitchens} 
      onKitchenSelect={(kitchen) => selectedKitchen = kitchen}
    />
  </div>
{/if}

{#if selectedKitchen}
  <KitchenDetails 
    kitchen={selectedKitchen} 
    onClose={() => selectedKitchen = null}
  />
{/if}

<style>
  .map-container {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .list-container {
    position: absolute;
    top: 50px;
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
