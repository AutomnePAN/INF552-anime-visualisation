var ctx = {
    w: 320,
    h: 250,
    GREY_NULL: "#DFDFDF",
    STAGE_DURATION: 1000,
    DOUBLE_CLICK_THRESHOLD: 300,
    totalStripWidth: 300,
    scoreLabelWidth: 20,
    totalLinePlotHeight: 900,
    stripWidth: 6,
    vmargin: 4,
    hmargin: 10,
    timeParser: d3.timeParse("%Y"),
    timeAxisHeight: 20,
    linePlot: false,
    valueExtentOverAllSeries: [0, 0],

    currentGenre: "Action",
};

genre_color_set = {
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
    'Military': 'rgba(29,132,108,1.0)',
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
    'Slice of Life': 'rgba(252,208,70,1.0)',
    'Space': 'rgba(7,17,54,1.0)',
    'Sports': 'rgba(40,132,40,1.0)',
    'Super Power': 'rgba(37,86,133,1.0)',
    'Supernatural': 'rgba(138,40,12,1.0)',
    'Thriller': 'rgba(96,93,84,1.0)',
    'Vampire': 'rgba(112,14,16,1.0)',
    '\xa0Adventure': 'rgba(67,97,180,1.0)'
};

var createMaps = function(data, svgEl, title) {

    ctx.color = d3.scaleLinear()
        .domain([0, 1,
            3, 15
        ])
        .range(["#FFFFFF00", genre_color_set[title].replace("1.0", "0.3"), genre_color_set[title], "black"]);

    ctx.BAND_H = (ctx.totalStripWidth - ctx.scoreLabelWidth) / Object.keys(data).length;
    // for each band (city series)

    Object.keys(data).forEach(function(s, i) {
        // create a <g> and put it in the right place
        // so that bands are juxtaposed vertically

        var mapG = svgEl.append("g")
            .classed("plot", true)
            .attr("transform",
                "translate(" + (ctx.hmargin + i * ctx.BAND_H) + "," + ctx.hmargin + ")");
        // populate each band with vertical lines,
        // one for each value in the series (a line corresponds to a year)
        // the line being colored according to the value for that year

        mapG.selectAll("line")
            .data(data[s].score_distribution)
            .enter()
            .append("line")
            .attr("y1", (d, j) => (ctx.stripWidth * (data[2000].score_distribution.length - j)))
            .attr("x1", 0)
            .attr("y2", (d, j) => (ctx.stripWidth * (data[2000].score_distribution.length - j)))
            .attr("x2", 3)
            .attr("stroke", (d) => ((d == null) ? ctx.GREY_NULL : ctx.color(d)))
            .attr("stroke-width", ctx.stripWidth);
        // add the series' name after the color map
        // if (i % 5 === 0) {
        //     mapG.append("text")
        //         .attr("y", ctx.stripWidth * 30 + 2 * ctx.hmargin)
        //         .attr("x", ctx.BAND_H - ctx.vmargin - 3)
        //         .attr("font-size", "0.5rem")
        //         .text(s);
        // }
    });

    // Score axis
    data[2000].score_distribution.forEach(function(s, i) {
        if (i % 3 === 0) {
            svgEl.append("text")
                .attr("x", ctx.totalStripWidth - ctx.scoreLabelWidth + 2 * ctx.hmargin)
                .attr("class", "scoreLabel")
                .attr("y", ctx.hmargin + ctx.stripWidth * (data[2000].score_distribution.length - i))
                .attr("font-size", "1rem")
                // .attr("color", "black")
                .text(7 + i * 0.1);
        }
    })

    svgEl.append("text")
        .attr("transform",
            "translate(" + ctx.hmargin + "," + (ctx.stripWidth * (data[2000].score_distribution.length + 10)) + ")")
        .attr("class", "h3-title")
        .text(title)

    // time axis
    var timeScale = d3.scaleTime()
        .domain(d3.extent(Object.keys(data), (d) => ctx.timeParser(d)))
        .rangeRound([0, ctx.BAND_H * Object.keys(data).length]);

    svgEl.append("g")
        .attr("id", "timeAxis")
        .attr("transform",
            "translate(" + ctx.hmargin + "," + (ctx.stripWidth * (data[2000].score_distribution.length + 3)) + ")")
        .call(d3.axisBottom(timeScale).ticks(d3.timeYear.every(5)));


    // legend
    // var valueRange4legend = d3.range(ctx.valueExtentOverAllSeries[0],
    //     ctx.valueExtentOverAllSeries[1], 2).reverse();

    // var scale4colorLegend = d3.scaleLinear()
    //     .domain(ctx.valueExtentOverAllSeries)
    //     .rangeRound([valueRange4legend.length, 0]);

    // var legendG = svgEl.append("g")
    //     .attr("id", "colorLegend")
    //     .attr("opacity", 1)
    //     .attr("transform", "translate(" + 500 + "," + 50 + ")");
    // legendG.selectAll("line")
    //     .data(valueRange4legend)
    //     .enter()
    //     .append("line")
    //     .attr("x1", 0)
    //     .attr("y1", (d, j) => (j))
    //     .attr("x2", ctx.BAND_H)
    //     .attr("y2", (d, j) => (j))
    //     .attr("stroke", (d) => (ctx.color(d)));
    // legendG.append("g")
    //     .attr("transform", "translate(" + (ctx.BAND_H + 4) + ",0)")
    //     .call(d3.axisRight(scale4colorLegend).ticks(5));
};

var createViz = function() {
    console.log("Using D3 v" + d3.version);
    loadData();
};

var loadData = function(svgEl) {
    d3.json("./data/genre_by_year.json").then(function(data) {
        Object.keys(data).forEach(function(g, i) {
            var svgEl = d3.select("#temporalGraph").append("svg");
            svgEl.attr("width", ctx.w);
            svgEl.attr("height", ctx.h);
            svgEl.attr("class", "canvas");
            svgEl.attr("id", `canvas-${g}`);
            createMaps(data[g], svgEl, g);
        });
        console.log(data[ctx.currentGenre]);
    }).catch(function(error) { console.log(error) });
};