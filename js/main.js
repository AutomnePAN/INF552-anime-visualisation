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
    valueExtentOverAllSeries: [0, 0],
    showScore: true,

    w1: 700,
    h1: 550,
    mapMode: false,
    MIN_COUNT: 3000,
    ANIM_DURATION: 600, // ms
    NODE_SIZE_NL: 5,
    NODE_SIZE_MAP: 3,
    LINK_ALPHA: 0.2,
    nodes: [],
    links: [],

    w2: 1000,
    h2: 1000,

};


var genre_color_set = {
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

var createViz = function() {
    console.log("Using D3 v" + d3.version);
    loadData();
};

var loadData = function() {


    data_promises = [
        d3.json("./data/genre_by_year.json"),
        d3.json("./data/genres_node.json"),
        d3.json("./data/genres_link.json"),
        d3.csv("data/data_anime_hive.csv"),
        d3.json("data/genres.json"),
        d3.json("data/studios.json"),
        d3.json("data/anime_genre.json"),
        d3.json("data/anime_studio.json"),
        d3.json("data/studio_genre.json"),
        d3.csv("data/fans_by_genre.csv")
    ];


    Promise.all(data_promises).then(function(data) {

        score_distribution_by_year = data[0];


        Object.keys(score_distribution_by_year).forEach(function(g, i) {
            var svgEl = d3.select("#temporalGraph").append("svg");
            svgEl.attr("width", ctx.w);
            svgEl.attr("height", ctx.h);
            svgEl.attr("class", "canvas");
            svgEl.attr("id", `canvas-${g}`);
            createMaps(score_distribution_by_year[g], svgEl, g);
        });

        ctx.nodes = data[1];
        ctx.links = data[2];

        // console.log(simulation);
        var svgE2 = d3.select("#clusterGraph").append("svg");

        svgE2.attr("width", ctx.w1);
        svgE2.attr("height", ctx.h1);
        svgE2.attr("class", "canvas");
        createGraphLayout(svgE2);

        var svgE4 = d3.select("#clusterGraph").append("svg");

        svgE4.attr("width", ctx.w1);
        svgE4.attr("height", ctx.h1);
        svgE4.attr("class", "canvas");
        createMatrix(svgE4, data[9]);


        var svgE3 = d3
            .select("#hivePlot")
            .append("svg")
            .attr("width", ctx.w2)
            .attr("height", ctx.h2)
            .attr("class", "canvas_dark")
            .append("g")
            .attr("transform", "translate(" + ctx.w2 / 2 + "," + ctx.h2 / 2 + ")");
        // console.log([data[3], data[4], data[5], data[6], data[7], data[8]]);
        prePocessingDataHive(data.slice(3, 9));
        myHivePlot(svgE3, data.slice(3, 9));

    }).catch(function(error) { console.log(error); });
};