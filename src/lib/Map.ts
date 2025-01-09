import maplibre from 'maplibre-gl';

const pulsingDotHTML = `
  <div class="marker-container">
    <div class="pulsing-dot-inner"></div>
    <div class="dot"></div>
  </div>
  <style>
    .marker-container {
      width: 14px;
      height: 14px;
      position: relative;
    }
    .dot {
      width: 10px;
      height: 10px;
      position: absolute;
      background-color: rgb(17, 105, 208);
      border-radius: 50%;
      border: 2px solid white;
      z-index: 2;
    }
    .pulsing-dot-inner {
      width: 14px;
      height: 14px;
      background: rgba(74, 144, 226, 0.7);
      border-radius: 50%;
      position: absolute;
      animation: pulse 2s ease-in-out infinite;
      z-index: 1;
    }
    @keyframes pulse {
      0% {
        transform: scale(0.5);
        opacity: 1;
      }
      70% {
        transform: scale(2.5);
        opacity: 0;
      }
      100% {
        transform: scale(0.5);
        opacity: 0;
      }
    }
  </style>
`;

export class Map {
  constructor(container, apiKey) {
    this.map = null;
    this.markers = [];
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
    this.map.on('click', (e) => {
      // Check if click was on a marker
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['markers']
      });
      
      // Only deselect if click was not on a marker
      if (features.length === 0) {
        onKitchenSelect(null);
      }
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

  setUserLocation(coordinates) {
    if (this.userMarker) {
      this.userMarker.remove();
    }
    
    const el = document.createElement('div');
    el.innerHTML = pulsingDotHTML;
    
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
