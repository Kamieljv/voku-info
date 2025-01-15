import { writable, derived } from 'svelte/store';

// Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const userLocation = writable<[number, number] | null>(null);

// Try to get user's location
if (typeof window !== 'undefined' && 'geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    userLocation.set([position.coords.latitude, position.coords.longitude]);
  });
}

export const treesGeoJSON = writable({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [4.8896, 52.3740]
      },
      properties: {
        id: 1,
        species: "Giant Sequoia",
        description: "One of the oldest trees in the park, this Giant Sequoia stands as a testament to time.",
        age: 150
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [4.8898, 52.3742]
      },
      properties: {
        id: 2,
        species: "European Beech",
        description: "A magnificent specimen with a broad, spreading crown.",
        age: 85
      }
    }
  ]
});

// Derived store for compatibility with existing code
export const trees = derived(treesGeoJSON, $geojson => 
  $geojson.features.map(feature => ({
    id: feature.properties.id,
    species: feature.properties.species,
    coordinates: feature.geometry.coordinates,
    description: feature.properties.description,
    age: feature.properties.age
  }))
);

// Trees with calculated distances
export const treesWithDistance = derived(
  [trees, userLocation],
  ([$trees, $userLocation]) => {
    return $trees.map(tree => ({
      ...tree,
      distance: $userLocation 
        ? calculateDistance(
            $userLocation[0], 
            $userLocation[1], 
            tree.coordinates[0], 
            tree.coordinates[1]
          )
        : null
    }));
  }
);


