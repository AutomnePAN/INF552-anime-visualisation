var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
        .id(function(d) { return d.id; })
        .distance(function(d) {
            return 2000 * Math.sqrt((1 / d.count));
        }).strength(0.1))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(600 / 2, 600 / 2));

var createGraphLayout = function(svg) {
    var lines = svg.append("g").attr("id", "links");

    var circles = svg.append("g").attr("id", "nodes");

    const genre_color_set = {
        'Action': 'rgba(224,42,5,1.0)',
        'Adventure': 'rgba(67,97,180,1.0)',
        'Cars': 'rgba(121,195,212,1.0)',
        'Comedy': 'rgba(79,81,178,1.0)',
        'Dementia': 'rgba(0,139,44,1.0)',
        'Demons': 'rgba(46,66,86,1.0)',
        'Drama': 'rgba(222,61,139,1.0)',
        'Fantasy': 'rgba(40,52,64,1.0)',
        'Game': 'rgba(0,141,128,1.0)',
        'Harem': 'rgba(223,27,91,1.0)',
        'Historical': 'rgba(184,48,20,1.0)',
        'Horror': 'rgba(119,135,157,1.0)',
        'Josei': 'rgba(172,47,105,1.0)',
        'Kids': 'rgba(245,186,16,1.0)',
        'Magic': 'rgba(79,81,178,1.0)',
        'Martial Arts': 'rgba(228,82,32,1.0)',
        'Mecha': 'rgba(7,75,212,1.0)',
        'Military': 'rgba(89,132,78,1.0)',
        'Music': 'rgba(103,103,202,1.0)',
        'Mystery': 'rgba(124,121,114,1.0)',
        'Parody': 'rgba(245,75,75,1.0)',
        'Police': 'rgba(42,49,57,1.0)',
        'Psychological': 'rgba(236,237,241,1.0)',
        'Romance': 'rgba(229,109,254,1.0)',
        'Samurai': 'rgba(164,23,26,1.0)',
        'School': 'rgba(251,141,131,1.0)',
        'Sci-Fi': 'rgba(19,33,120,1.0)',
        'Seinen': 'rgba(33,46,137,1.0)',
        'Shoujo': 'rgba(88,163,223,1.0)',
        'Shoujo Ai': 'rgba(255,180,194,1.0)',
        'Shounen': 'rgba(15,124,136,1.0)',
        'Shounen Ai': 'rgba(172,215,221,1.0)',
        'Slice of Life': 'rgba(252,168,70,1.0)',
        'Space': 'rgba(7,17,54,1.0)',
        'Sports': 'rgba(40,132,40,1.0)',
        'Super Power': 'rgba(37,86,133,1.0)',
        'Supernatural': 'rgba(138,40,12,1.0)',
        'Thriller': 'rgba(96,93,84,1.0)',
        'Vampire': 'rgba(112,14,16,1.0)',
    };

    lines.selectAll("line")
        .data(ctx.links)
        .enter()
        .append("line")
        .attr("opacity", (d, i) => d['count'] / 1200)
        .attr("stroke-width", (d, i) => {
            return d['count'] / 70
        })
        .attr("stroke", (d, i) => {
            return genre_color_set[d['source']]
        })
        .append("svg:title")
        .text(function(d, i) { return `${d['count']}`; });

    circles.selectAll("circle")
        .data(ctx.nodes)
        .enter()
        .append("circle")
        .attr("r", (d, i) => {
            return Math.max(d['fans_number'] / 70, 5)
        })
        .attr("fill", (d, i) => {
            return genre_color_set[d['id']].replace("1.0", "0.95");
        })
        .append("svg:title")
        .text(function(d, i) { return `${d['id']}`; });

    simulation.nodes(ctx.nodes)
        .on("tick", simStep);
    simulation.force("link")
        .links(ctx.links);

    function simStep() {
        // code run at each iteration of the simulation
        // updating the position of nodes and links
        d3.selectAll("#links line").attr("x1", (d) => (d.source.x))
            .attr("y1", (d) => (d.source.y))
            .attr("x2", (d) => (d.target.x))
            .attr("y2", (d) => (d.target.y));
        d3.selectAll("#nodes circle").attr("cx", (d) => (d.x))
            .attr("cy", (d) => (d.y));
    }

};

var createMatrix = function(svg, data) {
    var ctx_matrix = {
        totalStripHeight: 400,
        vmargin: 2,
        hmargin: 2,
        BAND_H: 22,
        titleMargin: 100,
    };

    color = d3.scaleLinear()
        .domain([50,
            200,
            500,
            700,
            900,
            1200
        ])
        .range(["#c2c2c2", "#a2a2a2", "#929292", "#727272", "#525252", "#323232", "#020202"]);

    var title = Object.keys(data[0]);

    data.forEach(function(s, i) {
        console.log(s);
        var mapG = svg.append("g")
            .classed("plot", true)
            .attr("transform",
                "translate(" + ctx_matrix.hmargin + "," + (50 + i * ctx_matrix.BAND_H) + ")");
        console.log(Object.values(s));

        mapG.append("text")
            .attr("font-size", "16px")
            .attr("fill", genre_color_set[Object.keys(s)[i + 1]])
            .attr("transform",
                "translate(0, " + 3 / 4 * ctx_matrix.BAND_H + ")")
            .text(Object.keys(s)[i + 1]);

        mapG.selectAll("line")
            .data(Object.values(s).slice(1, Object.values(s).length))
            .enter()
            .append("line")
            .attr("x1", (d, j) => (ctx_matrix.titleMargin + ctx_matrix.hmargin + ctx_matrix.BAND_H * j))
            .attr("y1", ctx_matrix.vmargin)
            .attr("x2", (d, j) => (ctx_matrix.titleMargin + ctx_matrix.hmargin + ctx_matrix.BAND_H * j))
            .attr("y2", ctx_matrix.BAND_H - ctx_matrix.vmargin)
            .attr("stroke", (d, j) => (color(d)))
            .attr("stroke-width", ctx_matrix.BAND_H - 2 * ctx_matrix.vmargin);

    });

    var legendG = svg.append("g")
        .attr("id", "colorLegend")
        .attr("transform", "translate(" + 600 + "," + 50 + ")");

    var valueRange4legend = d3.range(0, 1200, 10).reverse();
    var scale4colorLegend = d3.scaleLinear()
        .domain([0, 1200])
        .rangeRound([2 * valueRange4legend.length, 0]);

    legendG.selectAll("line")
        .data(valueRange4legend)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("y1", (d, j) => (2 * j))
        .attr("x2", ctx_matrix.BAND_H)
        .attr("y2", (d, j) => (2 * j))
        .attr("stroke-width", 2)
        .attr("stroke", (d) => (color(d)));


    legendG.append("g")
        .attr("transform", "translate(" + (ctx_matrix.BAND_H + 4) + ",0)")
        .call(d3.axisRight(scale4colorLegend).ticks(5));

}