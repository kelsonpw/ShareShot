import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import { defaultClient as apolloClient } from './main';
import { GET_CURRENT_USER, GET_POSTS, SIGNIN_USER } from './queries';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    posts: [],
    loading: false,
    error: null
  },
  mutations: {
    setUser: (state, payload) => (state.user = payload),
    clearUser: state => (state.user = null),
    setPosts: (state, payload) => (state.posts = payload),
    setLoading: (state, payload) => (state.loading = payload),
    setError: (state, payload) => (state.error = payload),
    clearError: state => (state.error = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false);
          commit('setUser', data.getCurrentUser);
          console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false);
          console.err(err);
        });
    },
    getPosts: ({ commit }) => {
      commit('setLoading', true);
      // use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          // get data from actions to state via mutations
          // commit passes data from actions to mutations
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
          console.log(data.getPosts);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);
      // clear token to prevent errors if malformed
      localStorage.setItem('token', '');
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);

          localStorage.setItem('token', data.signinUser.token);
          // to make sure created method is run in main.js is run refresh the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);

          commit('setError', err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user in state
      commit('clearUser');
      // remove token in localStorage
      localStorage.setItem('token', '');
      // end session
      await apolloClient.resetStore();
      // redirect home - kick users out of private pages
      router.push('/');
    }
  },
  getters: {
    user: state => state.user,
    posts: state => state.posts,
    loading: state => state.loading,
    error: state => state.error
  }
});
