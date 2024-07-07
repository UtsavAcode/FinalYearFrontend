<style>
@import "./style/app.css";
</style>

<script setup>
import { ref } from "vue";

const visible = ref(false);
</script>

<template>
  <header>
    <h1 class="title">Test</h1>
    <div class="social">
      <ul class="social-list">
        <li class="links">F</li>
        <li class="links">T</li>
        <li class="links">L</li>
      </ul>
    </div>
  </header>
  <nav>
    <ul class="nav-container">
      <li class="nav-item">Home</li>
      <li class="nav-item">Categories</li>
      <li class="nav-item">Profile</li>
      <li class="nav-item">Blog</li>
    </ul>
  </nav>
</template>
