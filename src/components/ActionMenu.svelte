<script lang="ts">
    import { getContext } from 'svelte';
    import { get, writable, type Writable } from 'svelte/store';
    import { Search, MapPin } from 'lucide-svelte';
    import SideButton from './SideButton.svelte';

    let { map, searchQuery } = getContext<any>('app');

    let userLocation: Writable<Array<number>>| undefined = writable([]);

    const handleLocation = () => {
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
    };

    const handleSearch = () => {
        const query = prompt("Search kitchens:");
        if (query) searchQuery.set(query);
    };
</script>

<div class="side-buttons">
    <SideButton
        onClick={handleLocation}
        label="Get Location"
    >
        <MapPin size={20} />
    </SideButton>

    <SideButton
        onClick={handleSearch}
        label="Search Kitchens"
    >
        <Search size={20} />
    </SideButton>
</div>

<style>
    .side-buttons {
        position: fixed;
        left: 20px;
        top: 54px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }
</style>
