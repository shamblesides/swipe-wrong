<template>
  <div v-if="names == null">
    Loading...
  </div>
  <div v-else>
    {{ names[0] }} <button @click="nextName">My name is</button>
  <button @click="submit">Profile time!</button>
  </div>
</template>

<script>
  module.exports = ({
    data: function() {
      return {
        name: null,
        names: null,
      }
    },
    async mounted() {
      // get game data from server
      const { names, token } = (await axios.get('/api/names')).data;
      this.names = names;
      this.name = this.names[0];

      // auth bearer to submit data
      axios.defaults.headers.common.authorization = 'Bearer ' + token;
    },
    methods: {
      nextName() {
        this.names.push(this.names.shift());
      },
      submit() {
        this.$router.push({ name: 'game', params: { name: this.name }})
      }
    },
  })
</script>
