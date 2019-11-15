<template>
    <div>
        <div id="replace"></div>
    </div>
</template>

<script>
import * as d3 from "d3";
let moment = require("moment");

export default {
    name: 'PieChart',
    props: ["future", "past"],
    data() { return {
        size: {
            width: 1000,
            height: 500
        },
        now: new Date()
    }},
    computed: {
        total() { return this.past + this.future },
        visdata() { 
            var now = moment();
            let start = moment(this.past)
            let end = moment(this.future)
            var totalMillisInRange = end.valueOf() - start.valueOf();
            var elapsedMillis = now.valueOf() - start.valueOf();
            // This will bound the number to 0 and 100
            let percentElapsed = Math.max(0, Math.min(100, 100 * (elapsedMillis / totalMillisInRange)));
            percentElapsed = percentElapsed.toFixed(4) + "%"
            return [
            {
                "label": [
                    "Time since " + moment(this.past).format("MMM Do YYYY"),
                    moment(this.past).fromNow(),
                    percentElapsed
                    
                ],
                "value":  this.since,
                "color": "#5179ad"
                // "value":  Math.random()
            },
            {
                "label": [
                    "Time until " + moment(this.future).format("MMM Do YYYY"),
                    moment(this.future).fromNow()
                ],
                "value": this.until,
                "color": "#dddddd"
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
    mounted() {
        this.redraw();
    },
    methods: {
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
                .attr("width", this.size.width)
                .attr("height", this.size.height)
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
                .attr("dy", ".35em")
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


        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
polyline{
	opacity: .3;
	stroke: black;
	stroke-width: 2px;
	fill: none;
}
tspan:first-child {
    font-weight: bold;
}
</style>
