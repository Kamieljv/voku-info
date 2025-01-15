<script lang="ts">
    import { getContext, onDestroy, onMount } from "svelte";
    import { Map } from "$lib/Map";

    export let filteredTrees;
    export let onTreeSelect;
    let { map, selectedTree } = getContext<any>("app");
    let mapContainer: HTMLDivElement;
    

    onMount(() => {
        const apiKey = import.meta.env.VITE_PROTOMAPS_API_KEY;
        map.set(new Map(mapContainer, apiKey));
        $map.initialize();

        // Subscribe to tree updates to update markers
        const unsubscribeFiltered = filteredTrees.subscribe(($filteredTrees) => {
            $map.addMarkers($filteredTrees);
        });

        // Subscribe to selected feature changes
        const unsubscribeSelected = $map.selectedFeature.subscribe((feature) => {
            onTreeSelect(feature?.properties);
        });

        return () => {
            unsubscribeFiltered();
            unsubscribeSelected();
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
