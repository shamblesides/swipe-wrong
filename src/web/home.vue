<template>
  <div id="title">
    <img src="/logo.png" width="700" class="word">
    <div v-for="n in 5" class="heart-container" :id="'heart'+n" :key="'heart'+n">
      <div class="heart">♥</div>
    </div>
    <router-link class="button" :to="{name:'whoareyou'}">Start</router-link>
    <p style="padding-top:30px">
    <a href="https://github.com/shamblesides/swipe-wrong" target="_blank">Source Code + Credits</a>
    </p>
  </div>
</template>

<style scoped>
  #title {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #title img {
    animation: wobble 2s infinite;
    animation-direction: alternate;
  }
  @keyframes wobble {
    0% {
      transform: rotate(5deg);
    }
    100% {
      transform: rotate(-5deg);
    }
  }
  .heart-container {
    position:absolute;
  }
  @keyframes float {
    0% {
      transform: translateY(-20px);
    }
    50% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-20px);
    }
  }
  .heart {
    animation: float 5s infinite;
    transition-timing-function: ease-in-out;
  }
  #heart1 {
    color: #A7FCE9;
    font-size: 100px;
    left: 700px;
    top: 500px;
    transform: rotate(30deg);
  }
  #heart2 {
    color: #F3F9B3;
    font-size: 140px;
    left: 700px;
    top: 90px;
    transform: rotate(10deg);
  }
  #heart3 {
    color: #ff698e;
    font-size: 80px;
    left: 270px;
    top: 40px;
    transform: rotate(20deg);
  }
  #heart4 {
    color: #F9D0DA;
    font-size: 90px;
    left: 300px;
    top: 450px;
    transform: rotate(-20deg);
  }
  #heart5 {
    color: #D8BEE7;
    font-size: 130px;
    left: 70px;
    top: 100px;
    transform: rotate(-30deg);
  }
</style>