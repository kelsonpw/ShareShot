<template>
  <v-app style="background: #E3E3EE">
    <NavBar />
    <!-- App Content -->
    <main>
      <v-container class="mt-5">
        <transition name="fade">
          <router-view />
        </transition>
        <!-- Auth Snackbar  ONLY SHOWS WHEN USER SIGNS IN
          IT WATCHES FOR USER VALUE TO CHANGE FROM NULL TO VALID
           -->
        <v-snackbar v-model="authSnackbar" color="success" :timeout="5000" bottom left>
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in!</h3>
          <v-btn @click="authSnackBar = false" dark>Close</v-btn>
        </v-snackbar>

        <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="error" :timeout="5000" bottom left>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark flat to="/signin">Signin</v-btn>
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
      authSnackbar: false,
      authErrorSnackbar: false
    };
  },
  computed: {
    ...mapGetters(['user', 'authError'])
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
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
