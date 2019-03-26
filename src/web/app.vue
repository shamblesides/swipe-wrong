<template>
  <div id="app">
    <audio controls loop autoplay id="audio" src="hottest-single.mp3"></audio>

    <component v-bind:is="route.name" v-bind="route.params" @nav="route=$event"/>
  </div>
</template>

<script>
  module.exports = {
    components: {
      home: httpVueLoader('home.vue'),
      whoareyou: httpVueLoader('whoareyou.vue'),
      'game-intro': httpVueLoader('game-intro.vue'),
      game: httpVueLoader('game.vue'),
      profile: httpVueLoader('profile.vue'),
    },
    data() {
      return {
        route: {
          name: 'home'
        }
      }
    }
  }
</script>