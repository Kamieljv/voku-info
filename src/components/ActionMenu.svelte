<script lang="ts">
    import { getContext } from 'svelte';
    import { get, writable, type Writable } from 'svelte/store';
    import { Search, MapPin } from 'lucide-svelte';

    let { map } = getContext<any>('app');

    let userLocation: Writable<Array<number>>| undefined = writable([]);
    let searchQuery: Writable<String> = writable('');

</script>

<div class="side-buttons">
    <button
        class="round-button"
        on:click={() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const coords = [
                            position.coords.longitude,
                            position.coords.latitude,
                        ];
                        userLocation.set(coords);
                        $map.setUserLocation(coords);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        alert("Unable to get your location");
                    },
                );
            } else {
                alert("Geolocation is not supported by your browser");
            }
        }}
    >
        <MapPin size={20} />
    </button>

    <button
        class="round-button"
        on:click={() => {
            const query = prompt("Search kitchens:");
            if (query) searchQuery.set(query);
        }}
    >
        <Search size={20} />
    </button>
</div>

<style>
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
</style>
