<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// This component now only serves as a container for the router view.
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

:root {
  --primary-color: #ff75a8; /* Dreamy Pink */
  --secondary-color: #a0c4ff; /* Sky Blue */
  --background-color: #faf8ff; /* Soft Lilac */
  --text-color: #4a4a4a; /* Dark Taupe */
  --primary-glow: 0 0 15px rgba(255, 117, 168, 0.4), 0 0 20px rgba(255, 117, 168, 0.2);
}

body {
  font-family: 'Nunito', sans-serif;
  margin: 0;
  background: linear-gradient(135deg, var(--background-color), #f0e6ff);
  color: var(--text-color);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* General component styling for the Unicorn theme */
.btn-primary {
  background-color: var(--primary-color);
  border: none;
  color: white;
  border-radius: 25px;
  box-shadow: var(--primary-glow);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 117, 168, 0.5);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  color: var(--primary-color);
}

input, select, textarea {
    background-color: white;
    border: 1px solid #e0cffc;
    border-radius: 10px;
    color: var(--text-color);
    padding: 10px;
}

</style>
