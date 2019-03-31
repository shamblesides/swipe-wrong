<template>
  <div id="profile">
    <template v-if="!words">
      Loading profile...
    </template>
    <template v-else>
      <h2>Looking good!</h2>
      <card :name="name" :pic="pic" :words="words"></card>
      <button id="play-again-button" class="button" @click="playAgain">New Profile</button>
      <button id="next-button" class="button" @click="next">Time to Date!</button>
    </template>
  </div>
</template>

<script>
  module.exports = {
    props: {
      id: String,
    },
    data: function() {
      return {
        name: null,
        pic: null,
        words: [],
      }
    },
    async mounted() {
      const { words, name, pic } = (await axios.get('/api/profile/'+this.id)).data
      this.words = words;
      this.name = name;
      this.pic = pic;
    },
    components: {
      'card': httpVueLoader('card-component.vue'),
    },
    methods: {
      playAgain: function() {
        this.$emit('nav', { name: 'home' });
      },
      next: function() {
        this.$emit('nav', { name: 'date' });
      }
    }
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
