<template>
    <div class="pie-wrapper" v-bind:class="[pieWrapperClass]">
        <a v-on:click="gohome()" class="back"><span>&#8249; choose a date</span></a>
        <div id="replace"></div>
    </div>
</template>

<script>
import * as d3 from "d3";
let moment = require("moment");

export default {
    name: 'PieChartView',
    // props: ["future", "past"],
    data() { return {
        size: {
            width: 1000,
            height: 500
        },
        now: new Date(),
        pieWrapperClass: "transition in"
    }},
    mounted() {
        this.pieWrapperClass = "transition in";
        this.redraw();
        setTimeout(() => {this.pieWrapperClass = ""}, 1); //give it time to draw, and then remove the transition
    },
    computed: {
        future () { return new Date(this.$route.query.future); },
        past () { return new Date(this.$route.query.past); },
        total() { return this.past + this.future },
        visdata() { 
            var now = moment();
            let start = moment(this.past).endOf("day")
            let end = moment(this.future).startOf("day")
            var totalMillisInRange = end.valueOf() - start.valueOf();
            var elapsedMillis = now.valueOf() - start.valueOf();
            // This will bound the number to 0 and 100
            let percentElapsed = Math.max(0, Math.min(100, 100 * (elapsedMillis / totalMillisInRange)));
            let formatPercent = function (pct) { return pct.toFixed(4) + "%"; }
            return [
            {
                "label": [
                    "Time since " + moment(this.past).format("MMM Do, YYYY"),
                    moment(this.past).fromNow(),
                    formatPercent(percentElapsed)
                    
                ],
                "value":  this.since,
                "color": "#44bbdd"
                // "value":  Math.random()
            },
            {
                "label": [
                    "Time until " + moment(this.future).format("MMM Do, YYYY"),
                    moment(this.future).fromNow(),
                    // formatPercent(100 - percentElapsed)
                ],
                "value": this.until,
                "color": "#363238"
                // "value": Math.random()
            }
        ] },
        since() { return this.now - this.past },
        until() { return this.future - this.now }
    },
    watch: {
        future: function() { this.redraw(); },
        past: function() { this.redraw(); }
    },
    
    methods: {
        gohome() {
            this.pieWrapperClass = "transition out";
            setTimeout(() => {this.$router.push({ name: 'home'  })}, 500); //give it time to draw, and then remove the transition
        },
        redraw() {
            this.now = new Date();
            this.draw();
            // setTimeout(this.redraw, 1000);
        },
        draw() {
            var element = document.getElementById("replace");
                element.innerHTML = "";

            var margin = {top: 20, right: 20, bottom: 45, left: 40},
                width = +this.size.width - margin.left - margin.right,
                height = +this.size.height - margin.top - margin.bottom,
                radius = Math.min(width, height) / 2;

            //select the unique ID provided by the alias
            var svg = d3.select("#replace").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");
            svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            // var g = svg.append("g")
            //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            svg.append("g")
                .attr("class", "slices");
            svg.append("g")
                .attr("class", "labels");
            svg.append("g")
                .attr("class", "lines");

            var pie = d3.pie()
                .sort(null)
                .value(function(d) {
                    return d.value;
                });
            var arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.4);
            var outerArc = d3.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9);

            var key = function(d){ return d.data.label; };

            var slice = svg.select(".slices").selectAll("path.slice")
                .data(pie(this.visdata), key);

            slice.enter()
                .insert("path")
                .style("fill", function(d) { return d.data.color; })
                // .style("stroke", "#353535")
                .attr("class", "slice")
                .attr("d", arc);

            slice.exit()
                .remove();

            /* ------- TEXT LABELS -------*/

            var text = svg.select(".labels").selectAll("text")
                .data(pie(this.visdata), key);
            
            function midAngle(d) {
                return d.startAngle + (d.endAngle - d.startAngle)/2;
            }

            text.enter()
                .append("text")
                // .text(function(d) {
                //     return d.data.label;
                // })
                .attr("transform", function(d) {
                    let pos = outerArc.centroid(d)
                    pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
                    return "translate(" + pos + ")"
                })
                .attr("text-anchor", function(d) {
                    return midAngle(d) < Math.PI ? "start":"end"
                })
                .attr("dominant-baseline", "middle")
                .selectAll("tspan").data((d) => d.data.label)
                    .enter().append("tspan")
                    .text((d) => d)
                    .attr("y", function(d, i, j) {
                        let centerIndex = (j.length-1) / 2
                        // console.log(centerIndex, i)
                        if (i > centerIndex) return 22 * -(centerIndex - i)
                        else if (i < centerIndex) return 22 * (i - centerIndex);
                        else return 0;
                    })
                    .attr("x", 0);

            text.exit()
                .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline = svg.select(".lines").selectAll("polyline")
                .data(pie(this.visdata), key);
            
            polyline.enter()
                .append("polyline")
                .attr("points", function(d) {
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos];
                });
            
            polyline.exit()
                .remove();

            // svg.selectAll(".lines")
            //     .append("line")
            //     .attr("transform", "translate(0," + -arc.innerRadius()() + ")")
            //     .attr("x1", 0)
            //     .attr("x2", 0)
            //     .attr("y1", -2*arc.innerRadius()())
            //     .attr("y2", 0)

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "./swoosh-button";
.pie-wrapper {
    width: 100vw;
    transition: all ease 0.5s;
    &.transition.in, &.transition.out {
        transform: translateX(100vw);
    }
}
polyline, line{
	opacity: .6;
	stroke: white;
	stroke-width: 2px;
	fill: none;
}
text {
    fill: white;
}
tspan:first-child {
    
    font-weight: bold;
}

.back {
    position: absolute;
    top: 100%;
    text-decoration: none;
    color: #44bbdd;
    padding: 10px;
    @include swoosh-button(#44bbdd);
    
}
</style>
