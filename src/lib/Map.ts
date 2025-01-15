import maplibre from 'maplibre-gl';
import { treesGeoJSON } from '$lib/stores';
import { writable, type Writable } from 'svelte/store';
import { pulsingDot } from './pulsingDot';
import { pulsingTreeDot } from './pulsingTreeDot';


export class Map {

  map: maplibre.Map | null;
  markers: maplibre.Marker[];
  selectedFeature: Writable<any>;
  selectedMarker: maplibre.Marker | null;
  userMarker: maplibre.Marker | null;
  container: string;
  apiKey: string

  constructor(container: string, apiKey: string) {
    this.map = null;
    this.markers = [];
    this.selectedFeature = writable(null);
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
      // Add GeoJSON source from store
      this.map.addSource('trees', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Subscribe to store updates
      treesGeoJSON.subscribe(data => {
        const source = this.map.getSource('trees');
        if (source) {
          (source as maplibre.GeoJSONSource).setData(data);
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

      // Add click handler for map background
      this.map.on('click', (e) => {
        // Check if click was on a tree point
        const features = this.map.queryRenderedFeatures(e.point, 
          { layers: ['tree-points'] }
        );
        // Only deselect if click was not on a tree point
        if (features.length === 0) {
          if (this.selectedMarker) {
            this.selectedMarker.remove();
            this.selectedMarker = null;
          }
          this.selectedFeature.set(null);
        } else {
          this.selectedFeature.set(features[0]);
          
          // Remove previous selected marker if exists
          if (this.selectedMarker) {
            this.selectedMarker.remove();
          }
          
          // Create pulsing marker for selected tree
          const el = document.createElement('div');
          el.innerHTML = pulsingTreeDot;
          
          this.selectedMarker = new maplibre.Marker({
            element: el,
            anchor: 'center'
          })
            .setLngLat(features[0].geometry.coordinates)
            .addTo(this.map);
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
  }

  // Method kept for compatibility but now just a no-op since the source 
  // is automatically updated via store subscription
  addMarkers(_trees: Array<any>) {
    // No-op - data is handled by store subscription
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
