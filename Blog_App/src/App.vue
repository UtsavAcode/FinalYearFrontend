<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="container-fluid">
    <div class="border-bottom border-secondary p-4">
      <h1 class="w-25 position-relative mx-auto">Bloggy</h1>
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
    <!-- This is the beginning -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#"
              >Home <span class="sr-only">(current)</span></a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#">Disabled</a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>
      </div>
    </nav>
    <!-- This is the end -->
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

  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped></style>
