<template>
  <div id="profile">
    <h1>{{ name }}</h1>
    <div class="word" :class="{selected:wordBlock.selected}" :id="'word'+i" v-for="(wordBlock, i) of words" :key="i" :style="{ left: wordBlock.x+'px', top: wordBlock.y+'px' }">
      {{ wordBlock.word }}
    </div>
  </div>
</template>

<script>
  module.exports = {
    data: function() {
      return {
        words: []
      }
    },
    async mounted() {
      const { words, name } = (await axios.get('/api/profile/'+this.$route.params.id)).data
      this.words = words;
      this.name = name;
    },
  };
</script>

<style scoped>
  .word {
    padding: 10px;
    position: absolute;
    animation: wobble 2s infinite;
    animation-direction: alternate;
    font-size: 22px;
    white-space: nowrap;
  }
  @keyframes wobble {
    0% {
      transform: rotate(5deg);
    }
    100% {
      transform: rotate(-5deg);
    }
  }
</style>