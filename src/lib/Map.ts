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

  addMarkers(locations: Array<any>) {
    this.clearMarkers();
    
    locations.forEach(location => {
      const marker = new maplibre.Marker()
        .setLngLat(location.coordinates)
        .addTo(this.map);

      marker.getElement().addEventListener('click', (marker) => { this.selectedMarker = marker });
      
      this.markers.push(marker);
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
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
