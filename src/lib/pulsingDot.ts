
export const pulsingDot = `
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