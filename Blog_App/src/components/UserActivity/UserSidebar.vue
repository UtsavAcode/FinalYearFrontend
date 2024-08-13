<template>
  <div class="container-fluid position-fixed">
    <div class="row flex-nowrap">
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-white border-end">
        <div
          class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 dark min-vh-100"
        >
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <!-- <li class="nav-item">
              <a href="#" class="nav-link align-middle px-0 text-dark">
                <i class="fs-4 bi-house"></i>
                <span class="ms-1 d-none d-sm-inline">Home</span>
              </a>
            </li> -->
            <li>
              <a
                href="#submenu1"
                data-bs-toggle="collapse"
                class="nav-link px-0 align-middle text-dark"
              >
                <i class="fs-4 bi-speedometer2"></i>
                <span class="ms-1 d-none d-sm-inline">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" class="nav-link px-0 align-middle text-dark">
                <i class="fs-4 bi-table"></i>
                <RouterLink class="ms-1 d-none d-sm-inline text-dark display-7" to="/userBlogs"
                  >Blogs</RouterLink
                >
              </a>
            </li>
            <!-- <li>
              <a
                href="#submenu2"
                data-bs-toggle="collapse"
                class="nav-link px-0 align-middle text-dark"
              >
                <i class="fs-4 bi-bootstrap"></i>
                <span class="ms-1 d-none d-sm-inline">Bootstrap</span>
              </a>
              <ul
                class="collapse nav flex-column ms-1"
                id="submenu2"
                data-bs-parent="#menu"
              >
                <li class="w-100">
                  <a href="#" class="nav-link px-0 text-dark">
                    <span class="d-none d-sm-inline">Item</span> 1
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link px-0 text-dark">
                    <span class="d-none d-sm-inline">Item</span> 2
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a
                href="#submenu3"
                data-bs-toggle="collapse"
                class="nav-link px-0 align-middle text-dark"
              >
                <i class="fs-4 bi-grid"></i>
                <span class="ms-1 d-none d-sm-inline">Products</span>
              </a>
              <ul
                class="collapse nav flex-column ms-1"
                id="submenu3"
                data-bs-parent="#menu"
              >
                <li class="w-100">
                  <a href="#" class="nav-link px-0 text-dark">
                    <span class="d-none d-sm-inline">Product</span> 1
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link px-0 text-dark">
                    <span class="d-none d-sm-inline">Product</span> 2
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link px-0 text-dark">
                    <span class="d-none d-sm-inline">Product</span> 3
                  </a>
                </li>
                <li>
                  <a href="#" class="nav-link px-0 text-dark">
                    <span class="d-none d-sm-inline">Product</span> 4
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#" class="nav-link px-0 align-middle text-dark">
                <i class="fs-4 bi-people"></i>
                <span class="ms-1 d-none d-sm-inline">Customers</span>
              </a>
            </li> -->
          </ul>
          <hr />
          <div class="dropdown pb-4">
            <a
              href="#"
              class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <!-- <img
                src=""
                alt="hugenerd"
                width="30"
                height="30"
                class="rounded-circle"
              /> -->
              <span class="d-none d-sm-inline mx-1">loser</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
              <li><a class="dropdown-item" href="#">New project...</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><a class="dropdown-item" href="#">Profile</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Smooth background transition on hover */
.nav-link {
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  width: 14.5rem;
}

/* Change background and text color on hover */
.nav-link:hover {
  background-color: #eee;
}
</style>
