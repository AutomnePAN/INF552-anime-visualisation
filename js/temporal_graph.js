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
    console.log(genres_current_year);
    Object.keys(genres_current_year).forEach((genre) => {

        group
            .append("circle")
            .attr("class", "genre_label")
            .attr("cx", ctx.xScale(genres_current_year[genre]['average_favorite']))
            .attr("cy", ctx.yScale(genres_current_year[genre]['average_score']))
            .attr("r", 1.2 * genres_current_year[genre]['animes'].length)
            .attr("fill", "rgba(255,0,0, 0.5)");
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
        console.log(ctx.DATA.genre_by_year[ctx.current_year]);
        initSVGcanvas(data);
        populateSVGcanvas(data);

    }).catch(function(error) { console.log(error) });
};