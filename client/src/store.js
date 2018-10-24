import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import { defaultClient as apolloClient } from './main';
import {
  GET_CURRENT_USER,
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  ADD_POST
} from './queries';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    posts: [],
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setUser: (state, payload) => (state.user = payload),
    clearUser: state => (state.user = null),
    setPosts: (state, payload) => (state.posts = payload),
    setLoading: (state, payload) => (state.loading = payload),
    setError: (state, payload) => (state.error = payload),
    clearError: state => (state.error = null),
    setAuthError: (state, payload) => (state.authError = payload)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('clearError');
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false);
          commit('setUser', data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    getPosts: ({ commit }) => {
      commit('clearError');
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
    addPost: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // First read the query you want to update
            // From this we get entire array of posts from homepage
            const data = cache.readQuery({ query: GET_POSTS });
            data.getPosts.unshift(addPost);
            // Write updated data back to query with the new value
            console.log(data.getPosts, 'Getpostsdata');
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // opt res ensures data written to cache is updated immediatly
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          }
        })
        .then(({ data }) => {
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);

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
    },
    signupUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false);

          localStorage.setItem('token', data.signupUser.token);
          // to make sure created method is run in main.js is run refresh the page
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);

          commit('setError', err);
          console.error(err);
        });
    }
  },
  getters: {
    user: state => state.user,
    posts: state => state.posts,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
