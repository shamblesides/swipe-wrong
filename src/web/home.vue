<template>
  <div id="title">
    <h1>Swipe Wrong</h1>
    <router-link class="button" :to="{name:'whoareyou'}">Start</router-link>
  </div>
</template>

<style scoped>
  #title {
    background-color: #C7E5EC;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #title h1 {
    font-size: 120px;
    margin-top: 0;
  }
</style>