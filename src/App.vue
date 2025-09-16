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
  --primary-color: #ff75a8; /* Dreamy Pink */
  --secondary-color: #a0c4ff; /* Sky Blue */
  --background-color: #faf8ff; /* Soft Lilac */
  --text-color: #4a4a4a; /* Dark Taupe */
  --primary-glow: 0 4px 15px rgba(255, 117, 168, 0.3);
}

body {
  font-family: 'Nunito', sans-serif;
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
