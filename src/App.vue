<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// This component now only serves as a container for the router view.
</script>

<style>
:root {
  --primary-color: #00ff00; /* Matrix Green */
  --secondary-color: #008000; /* Darker Green */
  --background-color: #000000; /* Black */
  --text-color: #00ff00; /* Matrix Green */
  --primary-glow: 0 0 15px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.3);
}

body {
  font-family: 'Courier New', Courier, monospace;
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  text-shadow: 0 0 5px var(--primary-color);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* General component styling for the Matrix theme */
.btn-primary {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  box-shadow: var(--primary-glow);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-color);
  color: var(--background-color);
  box-shadow: 0 0 25px rgba(0, 255, 0, 0.7), 0 0 30px rgba(0, 255, 0, 0.5);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Courier New', Courier, monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
}

input, select, textarea {
    background-color: #111;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    padding: 10px;
}

</style>
