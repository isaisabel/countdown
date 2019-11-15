<template>
    <div>
        {{until}} {{future}}, {{since}} {{past}}
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
        visdata() { return [
            {
                "label": ["past",
                    moment(this.past),
                    moment(this.past).toNow()
                ],
                "value":  this.since,
                "color": "#5179ad"
                // "value":  Math.random()
            },
            {
                "label": ["future",
                    moment(this.future),
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
                .text(function(d) {
                    return d.data.label;
                })
                .attr("transform", function(d) {
                    let pos = outerArc.centroid(d)
                    pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
                    return "translate(" + pos + ")"
                })
                .attr("text-anchor", function(d) {
                    return midAngle(d) < Math.PI ? "start":"end"
                });

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

            polyline.transition().duration(1000)
                .attrTween("points", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };			
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
</style>
