import { writable } from 'svelte/store';

export const trees = writable([
  {
    id: 1,
    species: "Giant Sequoia",
    coordinates: [4.8896, 52.3740],
    description: "One of the oldest trees in the park, this Giant Sequoia stands as a testament to time.",
    age: 150
  },
  {
    id: 2,
    species: "European Beech",
    coordinates: [4.8898, 52.3742],
    description: "A magnificent specimen with a broad, spreading crown.",
    age: 85
  }
]);
