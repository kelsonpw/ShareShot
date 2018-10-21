<template>
  <v-app style="background: #E3E3EE">
    <NavBar />
    <!-- App Content -->
    <main>
      <v-container class="mt-5">
        <transition name="fade">
          <router-view />
        </transition>
        <!-- Auth Snackbar -->
        <v-snackbar v-model="authSnackbar" color="success" :timeout="5000" bottom left>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn @click="authSnackBar = false" dark flat>Close</v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>


<script>
import NavBar from './components/Shared/NavBar.vue';

import { mapGetters } from 'vuex';

export default {
  name: `App`,
  components: {
    NavBar
  },
  data() {
    return {
      authSnackbar: false
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    }
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
