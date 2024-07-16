<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="container-fluid">
    <div class="border-bottom border-secondary p-4">
      <h1 class="w-25 position-relative mx-7">Bloggy</h1>
      <div>
        <ul
          class="list-group position-absolute my-4 end-0 mx-4 top-0 list-group-horizontal float-end"
        >
          <li class="list-group-item bg-dark text-light rounded-circle m-1">
            F
          </li>
          <li class="list-group-item bg-dark text-light rounded-circle m-1">
            T
          </li>
          <li class="list-group-item bg-dark text-light rounded-circle m-1">
            L
          </li>
        </ul>
      </div>
    </div>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <!-- <a class="navbar-brand" href="#">Navbar</a> -->
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
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
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
            <li class="nav-item">
              <a class="nav-link disabled" aria-disabled="true">Disabled</a>
            </li>
          </ul>
          <form class="d-flex ms-auto" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>

    <!-- <nav class="navbar">
      <ul class="nav-container">
        <li>
          <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
        </li>
      </ul>
      <div class="right-cover">
        <div class="button-cover">
          <button><RouterLink to="/register">Register</RouterLink></button>
          <button><RouterLink to="/login">Login</RouterLink></button>
        </div>
      </div>
    </nav> -->
  </header>
  <!-- This is the beginning -->
  <div class="move"></div>
  <!-- This is the end -->
  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped></style>
