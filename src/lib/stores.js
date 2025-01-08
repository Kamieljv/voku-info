import { writable } from 'svelte/store';

export const searchQuery = writable('');
export const userLocation = writable(null);
export const kitchens = writable([
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
]);

export const selectedKitchen = writable(null);
export const currentView = writable('map');

export const filteredKitchens = derived(
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
