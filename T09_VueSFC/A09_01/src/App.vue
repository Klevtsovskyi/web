<template>
  <div id="app">
    <nav>
      <router-link to="/">Головну</router-link>
    </nav>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>
<script setup>
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
}

nav {
  background: #2c3e50;
  padding: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  margin-right: 1rem;
}

nav a:hover {
  text-decoration: underline;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

</style>
