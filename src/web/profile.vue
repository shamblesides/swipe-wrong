<template>
  <div id="profile">
    <template v-if="!words">
      Loading profile...
    </template>
    <template v-else>
      <h2>Looking good!</h2>
      <card :name="name" :pic="pic" :words="words"/>
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
  };
</script>

<style scoped>
  #profile {
    text-align: center;
  }
</style>
