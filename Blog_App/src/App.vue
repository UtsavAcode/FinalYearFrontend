<template>
 <Navbar/>

  <div class="content">
    <RouterView />
  </div>
</template>

<script>

import Navbar from "./components/Navbar.vue"
  export default{
    name:'App',
    components:{
      Navbar,
    }
  }
</script>

<style scoped></style>
