<template>
<div class="home-wrapper" v-bind:class="[homeWrapperClass]">
    <table>
        <thead>
            <tr>
                <td><h1>past</h1></td>
                <td><h1>future</h1></td>
            </tr>
        </thead>
        <tbody>
            <tr class="dateinput">
                <td>
                    <Datepicker v-model="past" v-bind:inline="true" v-bind:disabledDates="disabled.past"/>
                </td>
                <td>
                    <Datepicker v-model="future" v-bind:inline="true" v-bind:disabledDates="disabled.future"/>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan=2 class="vis-button" v-on:click="visualize()">
                    <h1>visualize</h1>
                </td>
            </tr>
        </tfoot>
    </table>
</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
let moment = require("moment");

export default {
    name: 'HomeView',
    props: [],
    data() { return {
        future: moment().add(1, "d").toDate(), //start of yesterday
        past: moment().subtract(1, "d").toDate(), //start of tomorrow
        // disabled dates
        disabled: {
            past: {
                from: new Date(),
                dates: [ new Date() ] //make it inclusive of today
            },
            future: {
                to: new Date()
            }
        },
        homeWrapperClass: "transition in"
    }},
    mounted() {
        this.homeWrapperClass = "transition in";
        setTimeout(() => {this.homeWrapperClass = ""}, 1); //give it time to draw, and then remove the transition
    },
    methods: {
        visualize() {
            this.homeWrapperClass = "transition out";
            // wait for 500ms of transition
            setTimeout(() => {
                 this.$router.push({
                    name: 'visualize', 
                    query: {
                        past:  this.past.toISOString(),
                        future: this.future.toISOString()
                    }
                })
            }, 500)
        }
    },
    components: {
        Datepicker
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "./swoosh-button";
.home-wrapper {
    overflow-x: hidden;
    transition: all ease 0.5s;
    &.transition {
        transform: translateX(-100vw);
    }
}
table { 
    border-collapse: collapse; 
    width: 1px;
    margin: 30px auto; 
    tbody td {
        border: 1px solid #ddd;
    }
}
h1 {
    margin: 15px;
    // font-variant: small-caps;
    // text-transform: capitalize;
}
.dateinput {
    td {
        padding: 15px;
        padding-top: 0;
        // height: 100%;
        .vdp-datepicker__calendar {
            background: #1d1b1e;
            border: none;
            header { 
                .next{ 
                    &::after { border-left-color: white; } 
                    &:hover {background: #363238;}
                }
                .prev {
                    &::after { border-right-color: white; }
                    &:hover {background: #363238;}
                }
                .up:not(.disabled):hover { background: #363238;}
            }
            .selected {color: black;}
            .cell.day.disabled {
                color: rgba(white, 0.5);
            }
            .cell.day.today {
                color: white;
                // font-weight: bold;
                background: #363238;
            }
        }
    }
}
.vis-button {
    color: #44bbdd;
    border-top: 1px solid #ddd;
    width: 50%;
    margin: 0 auto;
    
    @include swoosh-button(#44bbdd, "up");
}
</style>
