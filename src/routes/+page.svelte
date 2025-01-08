<script>
  import { onMount } from 'svelte';
  import maplibre from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import KitchenDetails from '../components/KitchenDetails.svelte';

  let map;
  let mapContainer;
  let selectedKitchen = null;

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

<div class="map-container" bind:this={mapContainer}></div>

{#if selectedKitchen}
  <KitchenDetails 
    kitchen={selectedKitchen} 
    onClose={() => selectedKitchen = null}
  />
{/if}

<style>
  .map-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  :global(.maplibregl-marker) {
    cursor: pointer;
  }
</style>
