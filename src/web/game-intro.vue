<template>
  <div id="tell-us">
    <p>Tell us a little bit about yourself...</p>
    <button id="next-button" class="button" @click="ready">Ready!</button>
  </div>
</template>

<script>
  module.exports = ({
    props: {
      name: String,
      pic: String,
    },
    methods: {
      ready: function() {
        this.$emit('nav', { name: 'game', params: { name: this.name, pic: this.pic }});
      }
    }
  })
</script>

<style>
  #tell-us {
    text-align: center
  }
  #tell-us p {
    margin-top: 250px;
    font-size: 48px;
  }
</style>
