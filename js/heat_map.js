var createMaps = function(data, svgEl, title) {
    if (ctx.showProportion) {
        ctx.color = d3.scaleLinear()
            .domain([0, .01,
                .2, 1
            ])
            .range(["#FFFFFF00", genre_color_set[title].replace("1.0", "0.3"), genre_color_set[title], "black"]);
    } else {
        ctx.color = d3.scaleLinear()
            .domain([0, 1,
                3, 15
            ])
            .range(["#FFFFFF00", genre_color_set[title].replace("1.0", "0.3"), genre_color_set[title], "black"]);

    }


    ctx.BAND_H = (ctx.totalStripWidth - ctx.scoreLabelWidth) / Object.keys(data).length;
    target_property = ctx.showScore ? 'score_count_distribution' : 'favorite_count_distribution';

    // for each band (city series)

    Object.keys(data).forEach(function(s, i) {
        // create a <g> and put it in the right place
        // so that bands are juxtaposed vertically

        var mapG = svgEl.append("g")
            .attr("class", "lineG")
            .classed("plot", true)
            .attr("transform",
                "translate(" + (ctx.hmargin + i * ctx.BAND_H) + "," + ctx.hmargin + ")");
        // populate each band with vertical lines,
        // one for each value in the series (a line corresponds to a year)
        // the line being colored according to the value for that year

        mapG.selectAll("line")
            .data(data[s][target_property])
            .enter()
            .append("line")
            .attr("y1", (d, j) => (ctx.stripWidth * (data[2000][target_property].length - j)))
            .attr("x1", 0)
            .attr("y2", (d, j) => (ctx.stripWidth * (data[2000][target_property].length - j)))
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
    data[2000][target_property].forEach(function(s, i) {

        if (ctx.showScore) {
            if (i % 3 === 0) {
                svgEl.append("text")
                    .attr("x", ctx.totalStripWidth - ctx.scoreLabelWidth + 2 * ctx.hmargin)
                    .attr("class", "scoreLabel")
                    .attr("y", ctx.hmargin + ctx.stripWidth * (data[2000][target_property].length - i))
                    .attr("font-size", "1rem")
                    // .attr("color", "black")
                    .text(7 + i * 0.1);
            }
        } else {
            if (i % 5 === 0) {
                svgEl.append("text")
                    .attr("x", ctx.totalStripWidth - ctx.scoreLabelWidth + 2 * ctx.hmargin)
                    .attr("class", "scoreLabel")
                    .attr("y", ctx.hmargin + ctx.stripWidth * (data[2000][target_property].length - i))
                    .attr("font-size", "1rem")
                    // .attr("color", "black")
                    .text("1e" + (i / 5).toString());
            }
        }

    })

    svgEl.append("text")
        .attr("transform",
            "translate(" + ctx.hmargin + "," + (ctx.stripWidth * (data[2000][target_property].length + 10)) + ")")
        .attr("class", "h3-title")
        .text(title)

    // time axis
    var timeScale = d3.scaleTime()
        .domain(d3.extent(Object.keys(data), (d) => ctx.timeParser(d)))
        .rangeRound([0, ctx.BAND_H * Object.keys(data).length]);

    svgEl.append("g")
        .attr("id", "timeAxis")
        .attr("transform",
            "translate(" + ctx.hmargin + "," + (ctx.stripWidth * (data[2000][target_property].length + 3)) + ")")
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

var setShowParam = function(evt) {
    ctx.showScore = document.querySelector('#showParam').value === "score";
    console.log(ctx.showScore);
    loadData();
}

// var loadData = function() {
//     d3.json("./data/genre_by_year.json").then(function(data) {
//         Object.keys(data).forEach(function(g, i) {
//             var svgEl = d3.select("#temporalGraph").append("svg");
//             svgEl.attr("width", ctx.w);
//             svgEl.attr("height", ctx.h);
//             svgEl.attr("class", "canvas");
//             svgEl.attr("id", `canvas-${g}`);
//             createMaps(data[g], svgEl, g);
//         });
//     }).catch(function(error) { console.log(error) });
// };