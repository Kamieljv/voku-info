import maplibre from 'maplibre-gl';
import { pulsingDot } from './pulsingDot';


export class Map {

  map: maplibre.Map | null;
  markers: maplibre.Marker[];
  selectedMarker: maplibre.Marker | null;
  userMarker: maplibre.Marker | null;
  container: string;
  apiKey: string

  constructor(container: string, apiKey: string) {
    this.map = null;
    this.markers = [];
    this.selectedMarker = null;
    this.userMarker = null;
    this.container = container;
    this.apiKey = apiKey;
  }

  initialize() {
    if (!this.apiKey) {
      console.error('PROTOMAPS_API_KEY environment variable is not set');
      return;
    }

    this.map = new maplibre.Map({
      container: this.container,
      style: `https://api.protomaps.com/styles/v3/light/en.json?key=${this.apiKey}`,
      center: [4.9041, 52.3676], // Amsterdam center
      zoom: 12
    });

    this.map.on('load', () => {
      // Add empty GeoJSON source
      this.map.addSource('trees', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Add circle layer for trees
      this.map.addLayer({
        'id': 'tree-points',
        'type': 'circle',
        'source': 'trees',
        'paint': {
          'circle-radius': 8,
          'circle-color': '#2E7D32',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });

      // Add click handler for tree points
      this.map.on('click', 'tree-points', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const tree = feature.properties;
          // Create a custom event that includes the tree data
          const event = new CustomEvent('treeclick', { detail: tree });
          this.map.getContainer().dispatchEvent(event);
        }
      });

      // Change cursor on hover
      this.map.on('mouseenter', 'tree-points', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'tree-points', () => {
        this.map.getCanvas().style.cursor = '';
      });
    });

    // Add click handler to deselect kitchen when clicking on the map
    // this.map.on('click', (e) => {
    //   // Check if click was on a marker
    //   const features = this.map.queryRenderedFeatures(e.point, 
    //     { layers: ['markers'] }
    //   );
      
    //   // Only deselect if click was not on a marker
    //   if (features.length === 0) {
    //     this.selectedMarker = null;
    //   }
    // });
  }

  addMarkers(trees: Array<any>) {
    if (!this.map) return;
    
    // Convert trees to GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: trees.map(tree => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: tree.coordinates
        },
        properties: {
          id: tree.id,
          species: tree.species,
          age: tree.age,
          description: tree.description,
          distance: tree.distance
        }
      }))
    };

    // Update the source data
    const source = this.map.getSource('trees');
    if (source) {
      (source as maplibre.GeoJSONSource).setData(geojson);
    }
  }

  clearMarkers() {
    if (!this.map) return;
    
    // Clear the GeoJSON source
    const source = this.map.getSource('trees');
    if (source) {
      (source as maplibre.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  }

  setUserLocation(coordinates: maplibre.LngLatLike) {
    if (this.userMarker) {
      this.userMarker.remove();
    }
    
    const el = document.createElement('div');
    el.innerHTML = pulsingDot;
    
    this.userMarker = new maplibre.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat(coordinates)
      .addTo(this.map);
    
    this.map.flyTo({
      center: coordinates,
      zoom: 14
    });
  }

  destroy() {
    if (this.map) {
      this.clearMarkers();
      if (this.userMarker) {
        this.userMarker.remove();
      }
      this.map.remove();
      this.map = null;
    }
  }
}
