<template>
  <div v-if="names == null">
    Loading...
  </div>
  <div v-else id="whoareyou">
    <h1>Create Your Profile</h1>
    <div id="image-picker">
      <i class="far fa-arrow-alt-circle-left"></i>
      <div id="profile-image" style="width:480px; height:320px; background-color: blue;"></div>
      <i class="far fa-arrow-alt-circle-right"></i>
    </div>
    <div id="name-picker">
      <div id="name">{{ name }}</div>
      <i class="fas fa-sync-alt" @click="nextName"></i>
    </div>
    <button id="next-button" class="button" @click="submit">Next</button>
  </div>
</template>

<script>
  module.exports = ({
    data: function() {
      return {
        names: null,
      }
    },
    computed: {
      name() {
        return this.names[0];
      }
    },
    async mounted() {
      // get game data from server
      const { names, token } = (await axios.get('/api/names')).data;
      this.names = names;

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

<style>
  #whoareyou {
    text-align: center
  }
  #whoareyou #image-picker,
  #whoareyou #name-picker {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  #whoareyou #profile-image {
    box-shadow: -10px 10px 0 rgba(0,0,0,0.5);
  }
  #whoareyou #name {
    border: solid 5px white;
    border-radius: 20px;
    font-size: 30px;
    padding: 5px 15px;
    width: 250px;
  }
  #whoareyou i {
    cursor: pointer;
    padding: 20px;
    font-size: 40px;
  }
</style>
