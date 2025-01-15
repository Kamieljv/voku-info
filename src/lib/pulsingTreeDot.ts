export const pulsingTreeDot = `
<svg width="20" height="20" viewBox="0 0 20 20" class="pulsing-dot">
  <circle cx="10" cy="10" r="5" fill="#2E7D32" class="dot"/>
  <circle cx="10" cy="10" r="5" fill="#2E7D32" class="pulse"/>
  <style>
    .pulsing-dot {
      transform: translate(-50%, -50%);
    }
    .dot {
      opacity: 1;
    }
    .pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(3);
        opacity: 0;
      }
    }
  </style>
</svg>`;
