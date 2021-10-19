<template>
  <div id="app">
    <Header/>
    <router-view />
    <Footer/>
    <Loading/>
  </div>
</template>


<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
export default {
  components: {Loading, Footer, Header},
}
</script>

<style>
#app {
  font-family: "Firs Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFFFFF;
  background: #0A0A0A;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>