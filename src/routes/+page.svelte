<script>
  import { onMount, onDestroy } from 'svelte';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import KitchenDetails from '../components/KitchenDetails.svelte';
  import KitchenList from '../components/KitchenList.svelte';
  import { Map } from '$lib/Map';
  import { kitchens, selectedKitchen, currentView, searchQuery, userLocation } from '$lib/stores';
  import { Search, MapPin } from 'lucide-svelte';

  let mapInstance;
  let mapContainer;
  
  onMount(() => {
    const apiKey = import.meta.env.VITE_PROTOMAPS_API_KEY;
    mapInstance = new Map(mapContainer, apiKey);
    mapInstance.initialize();
    
    // Subscribe to kitchen updates to update markers
    const unsubscribe = filteredKitchens.subscribe($filteredKitchens => {
      mapInstance.addMarkers($filteredKitchens, kitchen => selectedKitchen.set(kitchen));
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

<div class="side-buttons">
  <button 
    class="round-button"
    on:click={() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = [position.coords.longitude, position.coords.latitude];
            userLocation.set(coords);
            mapInstance.setUserLocation(coords);
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Unable to get your location');
          }
        );
      } else {
        alert('Geolocation is not supported by your browser');
      }
    }}
  >
    <MapPin size={20} />
  </button>
  
  <button 
    class="round-button"
    on:click={() => {
      const query = prompt('Search kitchens:');
      if (query) searchQuery.set(query);
    }}
  >
    <Search size={20} />
  </button>
</div>

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

  .side-buttons {
    position: fixed;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .round-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .round-button:hover {
    background: #f0f0f0;
  }

  :global(.maplibregl-marker) {
    cursor: pointer;
  }
</style>
