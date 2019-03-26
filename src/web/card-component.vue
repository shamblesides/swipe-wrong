<template>
  <div class="card">
    <img :src="pic" id="profile-image">
    <h2>{{ name }}</h2>
    <div id="words-area">
      <div class="word" v-for="(wordBlock, i) of words" :key="'word'+i" :style="{ left: wordBlock.x+'px', top: wordBlock.y+'px' }">
        {{ wordBlock.word }}
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: {
      pic: String,
      name: String,
      words: Array,
    }
  }
</script>

<style scoped>
  .card {
    background-color: #F9D0DA;
    width: 420px;
    margin: auto;
    box-shadow: -10px 10px 0 rgba(0,0,0,0.5);
  }
  #profile-image {
    margin: 20px auto 0;
    width: 90%;
  }
  .card h2 {
    margin: 5px auto 0;
  }
  #words-area {
    position: relative;
    height: 290px;
    margin: 0 20px 40px;
  }
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
