<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="container-fluid">
    <div class="border-bottom border-gray p-4">
      <h1 class="w-25 mx-7">Bloggy</h1>
      <div>
        <ul
          class="list-group position-absolute my-5 end-0 mx-4 top-0 list-group-horizontal float-end"
        >
          <li
            class="list-group-item bg-dark text-light rounded-circle m-1 display-7"
          >
            <i class="bi bi-facebook"></i>
          </li>
          <li
            class="list-group-item bg-dark text-light rounded-circle m-1 display-7"
          >
            <i class="bi bi-twitter"></i>
          </li>
          <li
            class="list-group-item bg-dark text-light rounded-circle m-1 display-7"
          >
            <i class="bi bi-linkedin"></i>
          </li>
        </ul>
      </div>
    </div>
    <nav class="navbar navbar-expand-lg p-4">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"></a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            class="navbar-nav mb-2 mb-lg-0 mx-6"
            style="justify-content: center"
          >
            <li class="nav-item">
              <RouterLink class="nav-link active" to="home">Home</RouterLink>
            </li>
            <!-- <li class="nav-item">
              <RouterLink class="nav-link active" to='/'href="#">Profile</RouterLink>
            </li> -->
            <li class="nav-item">
              <a class="nav-link" href="#"></a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item" href="#">Something else here</a>
                </li>
              </ul>
            </li>
          </ul>
          <form class="d-flex ms-6" role="search">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="value1" placeholder="Search" />
            </IconField>
          </form>
          <div class="ms-5">
            <RouterLink to="/register" class="btn btn-dark mx-2"
              >Register</RouterLink
            >
            <RouterLink to="/login" class="btn btn-dark">Login</RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped></style>
