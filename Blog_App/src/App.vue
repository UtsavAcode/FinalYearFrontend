<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="title">
      <h1 class="site-title">Bloggy</h1>
      <div><Button label="Register" class="p-button-primary" /></div>
      <div class="social">
        <ul class="social-group">
          <li class="social-link">F</li>
          <li class="social-link">I</li>
          <li class="social-link">T</li>
        </ul>
      </div>
    </div>
    <nav class="navbar">
      <ul class="nav-container">
        <li><RouterLink to="/" class="nav-link">Home</RouterLink></li>
        <li>
          <RouterLink to="/category" class="nav-link">Category</RouterLink>
        </li>
        <li><RouterLink to="/profile" class="nav-link">Profile</RouterLink></li>
      </ul>
    </nav>
  </header>

  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped></style>
