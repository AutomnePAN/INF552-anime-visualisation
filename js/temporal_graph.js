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

var ctx = {
    w: 720,
    h: 720,
    DM: { RV: "Radial Velocity", PT: "Primary Transit", ML: "Microlensing" },
    DATA: {
        genre_by_year: undefined
    },
    current_year: 2005,
};

var initSVGcanvas = function(genre_by_year) {
    // scales to compute (x,y) coordinates from data values to SVG canvas
    var maxFavorite = 0;

    var maxScore = 0;
    var minScore = 11;

    genres_current_year = genre_by_year[ctx.current_year]

    Object.keys(genres_current_year).forEach((genre) => {
        maxFavorite = genres_current_year[genre]['average_favorite'] > maxFavorite ? genres_current_year[genre]['average_favorite'] : maxFavorite;

        maxScore = genres_current_year[genre]['average_score'] > maxScore ? genres_current_year[genre]['average_score'] : maxScore;
        if (genres_current_year[genre]['average_score'] > 0) {
            minScore = genres_current_year[genre]['average_score'] < minScore ? genres_current_year[genre]['average_score'] : minScore;
        }
    });

    console.log(maxFavorite, maxScore, minScore);

    // scale star_mass -> x-axis
    ctx.xScale = d3.scaleLinear().domain([0, maxFavorite + 1000])
        .range([60, ctx.w - 20]);
    // scale planet_mass -> y-axis
    ctx.yScale = d3.scaleLinear().domain([minScore - 0.5, maxScore + 0.5])
        .range([ctx.h - 60, 20]);
    // x- and y- axes

    d3.select("#bkgG").append("g")
        .attr("transform", `translate(0,${ctx.h-50})`)
        .call(d3.axisBottom(ctx.xScale).ticks(10))
        .selectAll("text")
        .style("text-anchor", "middle");
    d3.select("#bkgG").append("g")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(ctx.yScale).ticks(10))
        .selectAll("text")
        .style("text-anchor", "end");
    // x-axis label
    d3.select("#bkgG")
        .append("text")
        .attr("y", ctx.h - 12)
        .attr("x", ctx.w / 2)
        .classed("axisLb", true)
        .text("Average Favorites");
    // y-axis label
    d3.select("#bkgG")
        .append("text")
        .attr("y", 0)
        .attr("x", 0)
        .attr("transform", `rotate(-90) translate(-${ctx.h/2},18)`)
        .classed("axisLb", true)
        .text("Average Rating");
}

var populateSVGcanvas = function(genre_by_year) {
    var group = d3.select("#rootG");
    genres_current_year = genre_by_year[ctx.current_year];
    // console.log(genres_current_year);
    Object.keys(genres_current_year).forEach((genre) => {
        color_str = genre_color_set[genre].replace("1.0", "0.9");
        group
            .append("circle")
            .attr("class", "genre_label")
            .attr("cx", ctx.xScale(genres_current_year[genre]['average_favorite']))
            .attr("cy", ctx.yScale(genres_current_year[genre]['average_score']))
            .attr("r", 1.5 * genres_current_year[genre]['animes'].length)
            .attr("fill", color_str);
    });


};

var createViz = function() {
    console.log("Using D3 v" + d3.version);
    var svgEl = d3.select("#main").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    var rootG = svgEl.append("g").attr("id", "rootG");
    rootG.append("g").attr("id", "bkgG");
    loadData();
};

var loadData = function() {
    d3.json("./data/genre_by_year.json").then(function(data) {
        // console.log(data);
        ctx.DATA.genre_by_year = data;
        console.log(genre_color_set);
        console.log(ctx.DATA.genre_by_year[ctx.current_year]);
        initSVGcanvas(data);
        populateSVGcanvas(data);

    }).catch(function(error) { console.log(error) });
};