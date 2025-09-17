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
  --accent-color: #fddde6; /* Pale Pink */
  --background-start: #faf8ff; /* Soft Lilac */
  --background-end: #e0cffc;   /* Lavender */
  --text-color: #3e3c42;      /* Deeper Taupe */
  
  --primary-glow: 
    0 0 5px rgba(255, 117, 168, 0.7),
    0 0 10px rgba(255, 117, 168, 0.5),
    0 0 20px rgba(255, 117, 168, 0.3),
    0 0 30px rgba(160, 196, 255, 0.4);

  --shadow-deep: 
    0 4px 6px rgba(62, 60, 66, 0.1),
    0 1px 3px rgba(62, 60, 66, 0.08);
  --shadow-lifted: 
    0 10px 15px rgba(62, 60, 66, 0.1),
    0 4px 6px rgba(62, 60, 66, 0.05);
}

body {
  font-family: 'Nunito', sans-serif;
  margin: 0;
  background: linear-gradient(160deg, var(--background-start) 0%, var(--secondary-color) 50%, var(--background-end) 100%);
  color: var(--text-color);
  overflow-y: scroll; /* Always show scrollbar to prevent layout shift */
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* General component styling for the enhanced Unicorn theme */
.btn-primary {
  background: linear-gradient(45deg, var(--primary-color), #ff8ab4);
  border: none;
  color: white;
  border-radius: 50px;
  box-shadow: var(--shadow-deep);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.btn-primary:hover, .btn-primary:focus {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-lifted), var(--primary-glow);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  color: var(--primary-color);
  text-shadow: 0 2px 4px rgba(255, 117, 168, 0.2);
}

input, select, textarea {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid var(--accent-color);
    border-radius: 15px;
    color: var(--text-color);
    padding: 12px 15px;
    transition: all 0.2s ease;
    backdrop-filter: blur(2px);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 117, 168, 0.3);
}

/* Custom Scrollbar for a more thematic feel */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-start);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(var(--accent-color), var(--primary-color));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(var(--primary-color), #ff8ab4);
}

</style>