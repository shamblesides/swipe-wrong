<template>
  <div id="profile">
    <template v-if="!profile">
      Loading profiles...
    </template>
    <template v-else>
      <i id="back-button" class="far fa-arrow-alt-circle-left" @click="playAgain"></i>
      <card :name="profile.name" :pic="profile.pic" :words="profile.words"></card>
      <button id="swipe-left-button" class="button" @click="swipeLeft">NO</button>
      <button id="swipe-right-button" class="button" @click="swipeRight">YES</button>
    </template>
  </div>
</template>

<script>
  module.exports = {
    data: function() {
      return {
        profiles: []
      }
    },
    watch: {
      profiles: function(profiles) {
        if (profiles.length === 0) this.loadProfiles();
      }
    },
    mounted: function() {
      this.loadProfiles();
    },
    computed: {
      profile: function() {
        return this.profiles[0];
      }
    },
    methods: {
      loadProfiles: async function() {
        this.profiles = (await axios.get('/api/profile')).data
      },
      playAgain: function() {
        this.$emit('nav', { name: 'home' });
      },
      swipeRight: function() {
        this.profiles.shift();
      },
      swipeLeft: function() {
        this.profiles.shift();
      }
    },
    components: {
      'card': httpVueLoader('card-component.vue'),
    },
  };
</script>

<style scoped>
  #back-button {
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    padding: 20px;
    font-size: 60px;
  }
  #profile {
    text-align: center;
    padding-top: 5px;
  }
  .button {
    position: absolute;
    top: 300px;
    font-size: 24px;
  }
  #swipe-left-button {
    left: 20px;
    background-color: #ff698e;
  }
  #swipe-right-button {
    right: 20px;
    background-color: #A7FCE9 ;
  }
</style>
