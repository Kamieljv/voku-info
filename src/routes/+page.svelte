<script lang="ts">
  import { setContext } from "svelte";
  import { derived, writable, type Writable } from "svelte/store";
  import "maplibre-gl/dist/maplibre-gl.css";
  import ActionMenu from "../components/ActionMenu.svelte";
  import KitchenDetails from "../components/KitchenDetails.svelte";
  import KitchenList from "../components/KitchenList.svelte";
  import Map from "../components/Map.svelte";
  import {
    kitchens
  } from "$lib/stores";

  const selectedKitchen = writable(null);
  const currentView = writable('map');

  let map: Writable<Map | undefined> = writable(undefined);
  let searchQuery: Writable<String> = writable("");

  setContext("app", { map, searchQuery, selectedKitchen });

  const handleKitchenSelect = (kitchen) => {
    console.log(kitchen)
    selectedKitchen.set(kitchen);
    currentView.set("map");
  };

  let filteredKitchens = derived(
    [kitchens, searchQuery],
    ([$kitchens, $searchQuery]) => {
      if (!$searchQuery) return $kitchens;
      
      const query = $searchQuery.toLowerCase();
      return $kitchens.filter(kitchen => {
        return kitchen.name.toLowerCase().includes(query) ||
              kitchen.address.toLowerCase().includes(query) ||
              Object.values(kitchen.openingTimes).some(time => 
                time.toLowerCase().includes(query)
              );
      });
    }
  );
</script>

{#if $currentView === "map"}
  <ActionMenu />
{/if}

<div class="view-toggle">
  <button
    class:active={$currentView === "map"}
    on:click={() => currentView.set("map")}
  >
    Map
  </button>
  <button
    class:active={$currentView === "list"}
    on:click={() => currentView.set("list")}
  >
    List
  </button>
</div>
<Map filteredKitchens={filteredKitchens} />
{#if $currentView === "list"}
  <div class="list-container">
    <KitchenList kitchens={$kitchens} onKitchenSelect={handleKitchenSelect} />
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
    font-family: "Outfit", sans-serif;
    margin: 0;
    padding: 0;
  }
  .list-container {
    position: absolute;
    height: 100vh;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f5;
    padding-top: 4rem;
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
    background: #4caf50;
    color: white;
  }

  :global(.maplibregl-marker) {
    cursor: pointer;
  }
</style>
