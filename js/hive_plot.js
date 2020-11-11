var hivePlotCfg = {
    width: window.innerWidth,
    height: window.innerHeight,
    innerRadius: 40,
    outerRadius: 240,
};

var groupings = 3; ///number of groups
var nnodes = 25; ///number of nodes
var nlinks = 150; /// number of links

var angle = d3
        .scalePoint()
        .domain(d3.range(groupings + 1))
        .range([0, 2 * Math.PI]),
    radius = d3
        .scaleLinear()
        .range([hivePlotCfg.innerRadius, hivePlotCfg.outerRadius]),
    color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(20));

// Original input format:
var nodes = [
    { x: 0, y: 0.1 },
    { x: 0, y: 0.9 },
    { x: 1, y: 0.2 },
    { x: 1, y: 0.3 },
    { x: 2, y: 0.1 },
    { x: 2, y: 0.8 },
];

var links = [
    { source: nodes[0], target: nodes[2] },
    { source: nodes[1], target: nodes[3] },
    { source: nodes[2], target: nodes[4] },
    { source: nodes[2], target: nodes[5] },
    { source: nodes[3], target: nodes[5] },
];

// var nodes = [
//     { x: 0, y: 0.1 },
//     { x: 0, y: 0.9 },
//     { x: 1, y: 0.2 },
// ];
// var links = [
//     { source: nodes[0], target: nodes[2] },
//     { source: nodes[1], target: nodes[2] }, //use net
// ];

// var nodes = d3.range(nnodes).map((d) => {
//     return { x: ~~(Math.random() * groupings), y: Math.random() };
// });

// var links = d3.range(nlinks).map((d) => {
//     return {
//         source: nodes[~~(Math.random() * nnodes)],
//         target: nodes[~~(Math.random() * nnodes)],
//     };
// });

var createViz = function () {
    console.log("Using D3 v" + d3.version);
    // var svgEl = d3.select("#main").append("svg");
    // svgEl.attr("width", ctx.w);
    // svgEl.attr("height", ctx.h);
    // var rootG = svgEl.append("g").attr("id", "rootG");
    // rootG.append("g").attr("id", "bkgG");
    // loadData();

    var svg = d3
        .select("#main")
        .append("svg")
        .attr("width", hivePlotCfg.width)
        .attr("height", hivePlotCfg.height)
        .append("g")
        .attr(
            "transform",
            "translate(" +
                hivePlotCfg.width / 2 +
                "," +
                hivePlotCfg.height / 2 +
                ")"
        );

    svg.selectAll(".axis")
        .data(d3.range(groupings))
        .enter()
        .append("line")
        .attr("class", "axis")
        .attr("transform", function (d) {
            return "rotate(" + degrees(angle(d)) + ")";
        })
        .attr("x1", radius.range()[0])
        .attr("x2", radius.range()[1]);

    svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
            "d",
            d3.hive
                .link()
                .angle(function (d) {
                    return angle(d.x);
                })
                .radius(function (d) {
                    return radius(d.y);
                })
        )
        .style("stroke", function (d) {
            return color(d.source.x);
        })
        .on("mouseover", function (d) {
            linkMouseover(d3.select(this)._groups[0][0].__data__);
        })
        .on("mouseout", mouseout);

    svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "rotate(" + degrees(angle(d.x)) + ")";
        })
        .attr("cx", function (d) {
            return radius(d.y);
        })
        .attr("r", 5)
        .style("fill", function (d) {
            return color(d.x);
        })
        .on("mouseover", (d) => {
            nodeMouseover(d.srcElement);
        })
        .on("mouseout", mouseout);
    // clear highlighted nodes or links
    function mouseout() {
        svg.selectAll(".turnedOn").classed("turnedOn", false);
        svg.selectAll(".turnedOff").classed("turnedOff", false);
    }

    // highlight link and connected nodes on mouseover
    function linkMouseover(d) {
        svg.selectAll(".link")
            .classed("turnedOn", function (dl) {
                var node = d3.select(this)._groups[0][0].__data__;
                return node == d;
            })
            .classed("turnedOff", function (dl) {
                var node = d3.select(this)._groups[0][0].__data__;
                return !(node == d);
            });
        svg.selectAll(".node").classed("turnedOn", function (dl) {
            var node = d3.select(this)._groups[0][0].__data__;
            return dl === node.source || dl === node.target;
        });
    }

    // highlight node and connected links on mouseover
    function nodeMouseover(d) {
        svg.selectAll(".link")
            .classed("turnedOn", function (dl) {
                var node = d3.select(this)._groups[0][0].__data__;
                return node.source === d.__data__ || node.target === d.__data__;
            })
            .classed("turnedOff", function (dl) {
                var node = d3.select(this)._groups[0][0].__data__;
                return !(
                    node.source === d.__data__ || node.target === d.__data__
                );
            });
        d3.select(d).classed("turnedOn", true);
    }
};

function degrees(radians) {
    return (radians / Math.PI) * 180 - 90;
}
