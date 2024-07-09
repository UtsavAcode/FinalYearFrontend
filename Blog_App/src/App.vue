<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="title">
      <h1 class="site-title">Bloggy</h1>

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
        <li>
          <RouterLink to="/admin" class="nav-link">Admin</RouterLink>
        </li>
      </ul>
      <div class="right-cover">
        <IconField class="search-field">
          <InputIcon class="pi pi-search" />
          <InputText v-model="value1" placeholder="Search" />
        </IconField>

        <div class="button-cover">
          <button><RouterLink to="/register">Register</RouterLink></button>
          <button><RouterLink to="/login">Login</RouterLink></button>
        </div>
      </div>
    </nav>
  </header>

  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped></style>
