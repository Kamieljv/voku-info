<script lang="ts">
  export let kitchen;
  export let onClose;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
</script>

<div class="details-panel">
  <button class="close-button" on:click={onClose}>&times;</button>
  
  <h2>{kitchen.name}</h2>
  <p class="address">{kitchen.address}</p>

  <h3>Opening Times</h3>
  <div class="opening-times">
    {#each days as day}
      {#if kitchen.openingTimes[day]}
        <div class="time-slot">
          <span class="day">{day}</span>
          <span class="time">{kitchen.openingTimes[day]}</span>
        </div>
      {/if}
    {/each}
  </div>

  <p class="reservation">
    {kitchen.reservationNeeded ? 'Reservation required' : 'No reservation needed'}
  </p>

  <a href={kitchen.website} target="_blank" rel="noopener noreferrer" class="website-button">
    Visit Website
  </a>
</div>

<style>
  .details-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 20px;
    margin: 0 3px;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
    overflow-y: auto;
  }

  .close-button {
    position: absolute;
    right: 20px;
    top: 20px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  h2 {
    margin: 0 0 10px 0;
    font-size: 24px;
  }

  .address {
    color: #666;
    margin-bottom: 20px;
  }

  h3 {
    margin: 20px 0 10px 0;
  }

  .opening-times {
    margin-bottom: 20px;
  }

  .time-slot {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #eee;
  }

  .day {
    text-transform: capitalize;
  }

  .reservation {
    margin: 20px 0;
    font-weight: bold;
  }

  .website-button {
    display: block;
    background: #4CAF50;
    color: white;
    text-align: center;
    padding: 12px;
    border-radius: 5px;
    text-decoration: none;
    margin-top: 20px;
  }
</style>
