<script lang="ts">
    import { getContext, onDestroy, onMount } from "svelte";
    import { Map } from "$lib/Map";

    export let filteredTrees;
    let { map, selectedTree } = getContext<any>("app");
    let mapContainer: HTMLDivElement;
    

    onMount(() => {
        const apiKey = import.meta.env.VITE_PROTOMAPS_API_KEY;
        map.set(new Map(mapContainer, apiKey));
        $map.initialize();

        // Subscribe to tree updates to update markers
        const unsubscribe = filteredTrees.subscribe(($filteredTrees) => {
            $map.addMarkers($filteredTrees);
        });

        return () => {
            unsubscribe();
        };
    });

    onDestroy(() => {
        if ($map) {
            $map.destroy();
        }
    });
</script>

<div class="map-container" bind:this={mapContainer}></div>

<style>
    .map-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>
