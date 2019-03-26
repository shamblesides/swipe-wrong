<template>
  <div id="profile">
    <template v-if="!words">
      Loading profile...
    </template>
    <template>
    <h2>Looking Good!</h2>
    <div class="card">
      <img :src="pic" id="profile-image">
      <h2>{{ name }}</h2>
      <div id="words-area">
        <div class="word" :class="{selected:wordBlock.selected}" :id="'word'+i" v-for="(wordBlock, i) of words" :key="i" :style="{ left: wordBlock.x+'px', top: wordBlock.y+'px' }">
          {{ wordBlock.word }}
        </div>
      </div>
    </div>
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
  };
</script>

<style scoped>
  #profile {
    text-align: center;
  }
  #words-area {
    position: relative;
    height: 290px;
    margin: 0 20px 40px;
  }
  .card {
    background-color: #F9D0DA;
    width: 420px;
    margin: auto;
    box-shadow: -10px 10px 0 rgba(0,0,0,0.5);
  }
  .card h2 {
    margin: 5px auto 0;
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
  #profile-image {
    margin: 20px auto 0;
    width: 90%;
  }
</style>