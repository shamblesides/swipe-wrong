<template>
  <div id="profile">
    <template v-if="!profile">
      Loading profiles...
    </template>
    <template v-else>
      <h2>How about They</h2>
      <card :name="profile.name" :pic="profile.pic" :words="profile.words"></card>
      <button id="play-again-button" class="button" @click="playAgain">All Done</button>
      <button id="next-button" class="button" @click="swipeRight">Next Please</button>
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

      }
    },
    components: {
      'card': httpVueLoader('card-component.vue'),
    },
  };
</script>

<style scoped>
  #profile {
    text-align: center;
  }
  .button {
    position: absolute;
    top: 300px;
    font-size: 24px;
  }
  #play-again-button {
    left: 20px;
  }
  #next-button {
    right: 20px;
  }
</style>
