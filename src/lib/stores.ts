import { writable } from 'svelte/store';

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
