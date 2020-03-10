<template>
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
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
    name: 'HomeView',
    props: [],
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
    computed: {
    },
    methods: {
        visualize() {
             this.$router.push({
                name: 'visualize', 
                query: {
                    past:  this.past.toISOString(),
                    future: this.future.toISOString()
                }
            })
        }
    },
    components: {
        Datepicker
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
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
        }
    }
}
.vis-button {
    color: #44bbdd;
    border-top: 1px solid #ddd;
    width: 50%;
    margin: 0 auto;
    transition: all 0.3s;
    position: relative;
    * { // any child  
        z-index: 2;
        position: relative;
        // border-bottom: 3px solid color(primary);
    } 
    &:not(.disabled) { cursor: pointer; }
    &.disabled { opacity: 0.5; }

    &:after {
        content: '';
        position: absolute;
        z-index: 1;
        transition: all 0.3s;
        width: 100%;
        height: 0%;
        left: 0;
        top: 0;
        background: #44bbdd;
        // border-left: 1px solid #44bbdd;
        // border-right: 1px solid #44bbdd;
    }
    &:not(.disabled):active, &:not(.disabled):hover { 
        color: black;
    }
    &:not(.disabled):hover:after, &:not(.disabled):active:after {
        height: 100%;
    }
}
</style>
