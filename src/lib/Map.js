import maplibre from 'maplibre-gl';

export class Map {
  constructor(container, apiKey) {
    this.map = null;
    this.markers = [];
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
      style: `https://api.protomaps.com/styles/v4/light/en.json?key=${this.apiKey}`,
      center: [4.9041, 52.3676], // Amsterdam center
      zoom: 12
    });
  }

  addMarkers(kitchens, onKitchenSelect) {
    this.clearMarkers();
    
    kitchens.forEach(kitchen => {
      const marker = new maplibre.Marker()
        .setLngLat(kitchen.coordinates)
        .addTo(this.map);

      marker.getElement().addEventListener('click', () => {
        onKitchenSelect(kitchen);
      });
      
      this.markers.push(marker);
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  destroy() {
    if (this.map) {
      this.clearMarkers();
      this.map.remove();
      this.map = null;
    }
  }
}
