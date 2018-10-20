<template>
  <v-app style="background: #E3E3EE">
    <NavBar />
    <!-- App Content -->
    <main>
      <v-container class="mt-5">
        <transition name="fade">
          <router-view />
        </transition>
      </v-container>
    </main>
  </v-app>
</template>


<script>
import NavBar from './components/Shared/NavBar.vue';
export default {
  name: `App`,
  components: {
    NavBar
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateY(-25px);
}
</style>
