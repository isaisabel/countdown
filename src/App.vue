<template>
  <div id="app">
      <!-- <script src="/countdown.js"></script> -->
    <PieChart v-bind:future="future" v-bind:past="past"/>
  </div>
</template>

<script>
import PieChart from './components/PieChart.vue'
// let moment = require("moment");

export default {
    name: 'app',
    data() { return {
        future: new Date(2021, 10, 1),
        past: new Date(2019, 9, 3)
    }},
    mounted() {
        
    },
    components: {
        PieChart
    }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
