<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- Add post Title -->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">Add a post!</h1>
      </v-flex>
    </v-layout>

    <!-- Add post Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form v-model="isFormValid" lazy-validation @submit.prevent="handleAddPost" ref="form">
          <!-- Title input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="titleRules" v-model="title" label="Title" type="text" required>
              </v-text-field>
            </v-flex>
          </v-layout>
          <!-- Image url -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="imageRules" v-model="imageUrl" label="Image URL" type="text" required>
              </v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image preview  -->
          <v-layout row>
            <v-flex xs12>
              <img :src="imageUrl" height="300px">
            </v-flex>
          </v-layout>

          <!-- Categories select -->
          <v-layout row>
            <v-flex xs12>
              <v-select v-model="categories" :rules="categoriesRules" :items="['Art', 'Education', 'Travel', 'Photography', 'Music',
              'Technology', 'Social', 'Tattoos', 'Political']" multiple label="Categories"></v-select>
            </v-flex>
          </v-layout>

          <!-- description field -->

          <v-layout row>
            <v-flex xs12>
              <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn :loading="loading" :disabled="!isFormValid || loading" color="info" type="submit">
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
                Submit</v-btn>

            </v-flex>
          </v-layout>

        </v-form>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: `AddPost`,
  data() {
    return {
      isFormValid: true,
      title: '',
      imageUrl: '',
      description: '',
      categories: [],
      titleRules: [
        title => !!title || 'Title is requird',
        title =>
          title.length < 26 || 'Title cannot be longer than 25 characters'
      ],
      imageUrles: [image => !!image || 'Image is required'],
      categoriesRules: [
        categories =>
          categories.length >= 1 || 'Atleast one category is required'
      ],
      descRules: [
        desc => !!desc || 'Description is required',
        desc => desc.length <= 200 || 'Cannot be longer than 200 characters'
      ]
    };
  },
  computed: {
    ...mapGetters(['loading', 'user'])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        // add post action
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
      }
    }
  }
};
</script>