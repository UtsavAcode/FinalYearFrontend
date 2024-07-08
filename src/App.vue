<style>
/* @import "./style/app.css"; */
</style>

<script setup>
import { ref } from "vue";

const visible = ref(false);
</script>

<template>
  <header>
    <h1 class="title">Test</h1>
    <div class="search">
      <IconField id="searchfield">
        <InputIcon id="searchicon" class="pi pi-search" />
        <InputText id="searchbar" placeholder="Search" />
      </IconField>
    </div>
    <div class="social">
      <ul class="social-list">
        <li class="social_links">F</li>
        <li class="social_links">T</li>
        <li class="social_links">L</li>
      </ul>
    </div>
  </header>
  <nav>
    <ul class="nav-container">
      <li class="nav-item">
        <router-link to="homecomp" class="routes">Home</router-link>
      </li>

      <li class="nav-item">Categories</li>
      <li class="nav-item">Profile</li>
      <li class="nav-item">Blog</li>
    </ul>
  </nav>
  <div>
    <router-view />
  </div>
</template>
