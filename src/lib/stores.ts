import { writable, derived } from 'svelte/store';
import * as fs from 'fs';

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


// Define the interface for GeoJSON
interface GeoJSONFeature {
  type: string;
  properties: { [key: string]: any };
  geometry: {
      type: string;
      coordinates: any;
  };
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

// Load GeoJSON data from a file
let treeData: GeoJSONData;
fs.readFileSync('/src/trees_amsterdam_oost.geojson', 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading GeoJSON file:', err);
      return;
  }

  treeData = JSON.parse(data);
});


export const treesGeoJSON = writable(treeData);

console.log(treeData)

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


