<template>
    <div id="app">
        <router-view></router-view>
        <!-- <div class="dateinput">
            <div>
                <h1>past</h1>
                <Datepicker v-model="past" v-bind:inline="true" v-bind:disabledDates="disabled.past"/>
            </div>
            <div>
                <h1>future</h1>
                <Datepicker v-model="future" v-bind:inline="true" v-bind:disabledDates="disabled.future"/>
            </div>
        </div> -->
        <!-- <div class="visualization"> -->
            <!-- <PieChart v-bind:future="future" v-bind:past="past"/> -->
        <!-- </div> -->
    </div>
</template>

<script>
// import PieChart from './components/PieChart.vue'
// import Datepicker from 'vuejs-datepicker';

export default {
    name: 'app',
    data() { return {
        future: new Date(2021, 10, 1),
        past: new Date(2019, 9, 3),
        // disabled dates
        disabled: {
            past: {
                from: new Date(),
                dates: [ new Date() ] //make it inclusive of today
            },
            future: {
                to: new Date()
            }
        }
    }},
    mounted() {},
    // components: {
    //     PieChart,
    //     Datepicker
    // }
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    // color: #2c3e50;
    
}
body {
    background: #1d1b1e;
    color: white; 
}
</style>
