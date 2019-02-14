<template>
  <div id="game">
    <template v-if="words == null">
      Loading!
    </template>
    <template v-else>
      <div id="bio-area">
        <span v-if="instructionsVisible">Drag&amp;Drop Words Here!</span>
      </div>
      <div id="timer">
        {{ timer }}
      </div>
      <button id="submit-button" @click="submit" v-if="timerRaw < -6">All Done</button>
      <div class="word" :class="{selected:wordBlock.selected}" :id="'word'+wordBlock.i" v-for="wordBlock of words" :key="wordBlock.i" :style="{ left: x(wordBlock), top: y(wordBlock), 'z-index': wordBlock.inProfile ? 15 : 0 }">
        {{ wordBlock.word }}
      </div>
    </template>
  </div>
</template>

<script>
  module.exports = ({
    data: function() {
      return {
        startTime: null,
        t: 0,
        words: null,
        instructionsVisible: true,
      }
    },
    async mounted() {
      // get game data from server
      let data;
      try {
        const [name, pic] = atob(this.$route.params.whoareyou).split(',')
        data = (await axios.post('/api/game', { name, pic })).data;
      } catch (err) {
        this.$router.replace({ name: 'whoareyou' })
        return;
      }
      const { words, time, token } = data;
      this.words = [];
      this.startTime = time;

      // auth bearer to submit data
      axios.defaults.headers.common.authorization = 'Bearer ' + token;

      // drop words over the time interval
      const interval = this.startTime * 1000 / words.length;
      words.forEach((word, i) => setTimeout(() => this.dropWord(word, i), i * interval));

      // increase current time counter
      let t0 = null;
      window.requestAnimationFrame(function frame(t1) {
        if (t0 != null) {
          const dt = t1 - t0;
          this.t += (dt / 1000);
        }
        t0 = t1;
        window.requestAnimationFrame(frame.bind(this));
      }.bind(this))

      // mark bio as a drop zone
      interact('#bio-area').dropzone({
        accept: '.word',
        ondragenter: evt => {
          const id = +evt.relatedTarget.id.substr(4)
          const wordBlock = this.words.find(({i}) => i === id);
          wordBlock.inProfile = true;
          this.instructionsVisible = false;
        },
        ondragleave: evt => {
          const id = +evt.relatedTarget.id.substr(4)
          const wordBlock = this.words.find(({i}) => i === id);
          wordBlock.inProfile = false;
        }
      })
    },
    computed: {
      timer() {
        return Math.max(0, this.startTime - this.t).toFixed(2);
      },
      timerRaw() {
        return this.startTime - this.t;
      }
    },
    methods: {
      dropWord(word, i) {
        const bioWidth = document.querySelector('#bio-area').clientWidth;
        const wordDropWidth = document.querySelector('#game').clientWidth - bioWidth;
        const x = bioWidth*0.95 + Math.random() * wordDropWidth*0.9;
        const y0 = -30;
        const t0 = this.t;
        const wordBlock = { word, x, y0, t0, i };
        this.words.push(wordBlock)

        this.$nextTick(() => {
          const el = document.querySelector('#word'+i);
          interact(document.querySelector('#word'+i))
            .origin('parent')
            .draggable({
              intertia: true,
              onstart: evt => {
                wordBlock.selected = true;
                wordBlock.x = evt.x0 - el.clientWidth/2;
                wordBlock.y = evt.y0 - el.clientHeight/2;
              },
              onmove: evt => {
                wordBlock.x += evt.dx;
                wordBlock.y += evt.dy;
              },
              onend: () => {
                wordBlock.selected = false;
                if (!wordBlock.inProfile) {
                  wordBlock.y0 = wordBlock.y;
                  wordBlock.t0 = this.t;
                  delete wordBlock.x;
                  delete wordBlock.y;
                }
              }
            })
        })

        const removalTimer = setInterval(() => {
          const y = +this.y(wordBlock).slice(0, -2); //remove 'px'
          if (y > 900) {
            clearInterval(removalTimer)
            this.words.splice(this.words.indexOf(wordBlock), 1);
          }
        }, 1000)
      },
      x(word) {
        return word.x + 'px';
      },
      y(word) {
        if (word.y != null) return word.y + 'px';

        const t = (this.t - word.t0);
        const y = (5*(t**2) + 30*t + word.y0);
        return y + 'px';
      },
      async submit() {
        const { offsetLeft, offsetTop } = document.querySelector('#bio-area');
        const words = this.words
          .filter(word => word.inProfile)
          .map(({ word, x, y }) => ({
            word,
            x: x - offsetLeft,
            y: y - offsetTop
          }))

        const res = await axios.post('/api/profile', words);
        localStorage.setItem("profileToken", res.data.token)
        this.$router.push({ name: 'profile', params: { id: res.data.slug }})
      }
    },
  })
</script>

<style scoped>
  #game {
    background-color: #FDFDFC;
  }
  #timer {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: black;
    color: white;
    font-size: 22px;
    padding: 10px;
    z-index: 30;
    text-align: right;
    font-family: monospace
  }
  #bio-area {
    position: absolute;
    background-color: #F9D0DA;
    left: 20px;
    top: 200px;
    bottom: 0;
    right: initial;
    width: 380px;
    height: 270px;
    z-index: 10;
    border: dashed 10px rgb(255, 152, 178);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #bio-area span {
    opacity: 0.5;
    font-size: 20px;
  }
  .word {
    padding: 10px;
    position: absolute;
    animation: wobble 2s infinite;
    animation-direction: alternate;
    font-size: 22px;
    white-space: nowrap;
  }
  .word:hover {
    color: red;
  }
  .word.selected {
    text-shadow: rgba(255, 0, 0, 0.767) 0px 0px 20px;
    z-index: 20;
  }
  @keyframes wobble {
    0% {
      transform: rotate(5deg);
    }
    100% {
      transform: rotate(-5deg);
    }
  }
  #submit-button {
    position: absolute;
    right: 10px;
    top: 80px;
  }
</style>