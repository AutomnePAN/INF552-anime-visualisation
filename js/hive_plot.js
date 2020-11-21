var width = window.innerWidth,
    height = window.innerHeight,
    innerRadius = 40,
    outerRadius = window.innerHeight / 2,
    majorAngle = (4 * Math.PI) / 3,
    minorAngle = (1 * Math.PI) / 6;

var angle = d3
    .scalePoint()
    .domain(["anime", "genre", "studio"])
    .range([-minorAngle, majorAngle, 2 * majorAngle - minorAngle]);

var animeRadius = d3.scaleLinear().range([innerRadius, outerRadius]);
var genreRadius = d3.scaleLinear().range([innerRadius, outerRadius]);
var studioRadius = d3.scaleLinear().range([innerRadius, outerRadius]);

var animeScoreScale = d3
    .scaleSequential()
    .domain([7.8, 10])
    .interpolator(d3.interpolateRdPu);
var genreCountScale = d3.scaleLinear().range(["#f6fbfd", "#3F76EB"]);
var studioCountScale = d3.scaleLinear().range(["#ffffe5", "#57EBAF"]);

var default_display_text = [
    [{
            text: "Showing high-scored anime dependencies among",
        },
        { text: " Production Studio ", color: "#2d6a4f" },
        { text: "&" },
    ],
    [{ text: " Genre ", color: "#023e8a" }, { text: "" }, { text: "" }],
];

// var createViz = function () {
//     console.log("Using D3 v" + d3.version);
//     var svg = d3
//         .select("#hivePlot")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .append("g")
//         .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//     loadData(svg);
// };

// var loadData = function (svg) {
//     var promises = [
//         d3.csv("data/data_anime_hive.csv"),
//         d3.json("data/genres.json"),
//         d3.json("data/studios.json"),
//         d3.json("data/anime_genre.json"),
//         d3.json("data/anime_studio.json"),
//         d3.json("data/studio_genre.json"),
//     ];
//     Promise.all(promises)
//         .then((data) => {
//             prePocessingData(data);
//             myHivePlot(svg, data);
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// };

var prePocessingDataHive = function(data) {
    var keyList = [
        "anime",
        "genre",
        "studio",
        "anime_genre",
        "anime_studio",
        "studio_genre",
    ];
    keyList.forEach((elem, index) => {
        data[index].forEach((d) => {
            d.key = elem;
        });
        data[index].key = elem;
    });

    data[1].forEach((d) => {
        d.studioCount = sum(data[5].map((q) => q.genre_id == d.id));
    });

    data[2].forEach((d) => {
        d.genreCount = sum(data[5].map((q) => q.studio_id == d.id));
    });
    // Set the radius domain.
    animeRadius.domain(d3.extent(data[0], (d) => d.id));
    genreRadius.domain(d3.extent(data[1], (d) => d.id));
    studioRadius.domain(d3.extent(data[2], (d) => d.id));
    genreCountScale.domain(d3.extent(data[1], (d) => d.count));
    studioCountScale.domain(d3.extent(data[2], (d) => d.count));
};

var myHivePlot = function(svg, data) {
    drawAxis(svg, data.slice(0, 3));
    drawLinks(svg, data);
    drawNodes(svg, data);
    d3.select("#infoHivePlot")
        .selectAll("text")
        .data(default_display_text)
        .enter()
        .append("text")
        .selectAll("tspan")
        .data((d) => d)
        .enter()
        .append("tspan")
        .style("color", (d) => d.color)
        .text((d) => d.text);
};

var drawAxis = function(svg, data) {
    var axisType = data.map((elem) => {
        return { key: elem.key, count: elem.length };
    });

    svg.selectAll(".axis")
        .data(axisType)
        .enter()
        .append("line")
        .attr("class", "axis")
        .attr("transform", (d) => {
            return "rotate(" + HivePlot_degrees(angle(d.key)) + ")";
        })
        .attr("x1", animeRadius(-2))
        .attr("x2", (d) => animeRadius(d.count + 2));
};

var drawLinks = function(svg, data) {
    // Draw the links.
    // console.log(data[0][1]);
    var animeGenreData = data[3].map((d) => {
        return { source: data[0][d.anime_id], target: data[1][d.genre_id] };
    });
    var animeStudioData = data[4].map((d) => {
        return { source: data[2][d.studio_id], target: data[0][d.anime_id] };
    });
    var studioGenreData = data[5].map((d) => {
        return { source: data[2][d.studio_id], target: data[1][d.genre_id] };
    });
    [animeGenreData, animeStudioData, studioGenreData].forEach((data) => {
        svg.append("g")
            .attr("class", "links")
            .selectAll(".link")
            .data(data)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr(
                "d",
                HivePlot_link()
                .angle((d) => angle(d.key))
                .radius((d) => {
                    if (d.key == "genre") return genreRadius(d.id);
                    if (d.key == "studio") return studioRadius(d.id);
                    return animeRadius(d.id);
                })
            )
            .on("mouseover", (event, d) => HivePlot_linkMouseover(d, svg))
            .on("mouseout", () => HivePlot_mouseout(svg));
    });
};

var drawNodes = function(svg, data) {
    var nodes = data[0].concat(data[1]).concat(data[2]);

    var width = {
        genre: genreRadius(1) - genreRadius(0),
        studio: studioRadius(1) - studioRadius(0),
        anime: animeRadius(1) - animeRadius(0),
    };
    var height = 16;

    svg.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .selectAll("rect")
        .data(nodes)
        .enter()
        .append("rect")
        .attr("x", (d) => {
            if (d.key == "genre") return genreRadius(d.id);
            if (d.key == "studio") return studioRadius(d.id);
            return animeRadius(d.id);
        })
        .attr("width", (d) => {
            if (d.key == "genre") return width.genre;
            if (d.key == "studio") return width.studio;
            return width.anime;
        })
        .attr("height", height)
        .attr("transform", (d) => {
            if (d.key == "genre")
                return `rotate(${HivePlot_degrees(angle(d.key))}), translate(${
                    -width.genre / 2
                },0)`;
            if (d.key == "studio")
                return `rotate(${HivePlot_degrees(angle(d.key))}), translate(${
                    -width.studio / 2
                },0)`;
            return `rotate(${HivePlot_degrees(angle(d.key))}), translate(${
                -width.anime / 2
            },0)`;
        })
        .style("fill", (d) => {
            if (d.key == "genre") return genreCountScale(d.count);
            if (d.key == "studio") return studioCountScale(d.count);
            return animeScoreScale(d.Score);
        })
        .on("mouseover", (event, d) => HivePlot_nodeMouseover(event, d, svg))
        .on("mouseout", () => HivePlot_mouseout(svg));
};

// Highlight the link and connected nodes on mouseover.
function HivePlot_linkMouseover(d, svg) {
    svg.selectAll(".link").classed("active", (p) => p === d);
    svg.selectAll(".node circle").classed(
        "active",
        (p) => p === d.source || p === d.target
    );
    displayLinkInfo(d);
}

// Highlight the node and connected links on mouseover.
function HivePlot_nodeMouseover(event, d, svg) {
    svg.selectAll(".link").classed(
        "active",
        (p) => p.source === d || p.target === d
    );
    d3.select(event.srcElement).classed("active", true);
    displayNodeInfo(d);
}

// Clear any highlighted nodes or links.
function HivePlot_mouseout(svg) {
    svg.selectAll(".active").classed("active", false);
    updateDisplayText(default_display_text);
}

var displayLinkInfo = function(d) {
    if ("anime" == d.source.key && "genre" == d.target.key) {
        let display_text = [
            [
                { text: d.source.Title },
                { text: " is of genre ", color: "#023e8a" },
                { text: d.target.genre },
            ],
            [{ text: "" }, { text: "" }, { text: "" }],
        ];

        updateDisplayText(display_text);
    }
    if ("studio" == d.source.key && "anime" == d.target.key) {
        let display_text = [
            [
                { text: d.target.Title },
                { text: " is made by ", color: "#2d6a4f" },
                { text: d.source.studio },
            ],
            [{ text: "" }, { text: "" }, { text: "" }],
        ];

        updateDisplayText(display_text);
    }

    if ("studio" == d.source.key && "genre" == d.target.key) {
        let display_text = [
            [
                { text: d.source.studio },
                { text: " produces anime of genre ", color: "#6930c3" },
                { text: d.target.genre },
            ],
            [{ text: "" }, { text: "" }, { text: "" }],
        ];

        updateDisplayText(display_text);
    }
};

var displayNodeInfo = function(d) {
    if (d.key == "anime") {
        let display_text = [
            [
                { text: d.Title },
                { text: " is scored by ", color: "#dc2f02" },
                { text: d.Score },
            ],
            [{ text: "" }, { text: "" }, { text: "" }],
        ];
        updateDisplayText(display_text);
    }
    if (d.key == "genre") {
        let display_text = [
            [
                { text: d.genre },
                { text: " apprears " },
                { text: d.count, color: "#dc2f02" },
            ],
            [
                { text: " times in the high-scored anime, and involves " },
                { text: d.studioCount, color: "#dc2f02" },
                { text: " studio in this subject" },
            ],
        ];
        updateDisplayText(display_text);
    }
    if (d.key == "studio") {
        let display_text = [
            [
                { text: d.studio },
                { text: " has made in total " },
                { text: d.count, color: "#dc2f02" },
            ],
            [
                { text: " high-scored anime, and works on " },
                { text: d.genreCount, color: "#dc2f02" },
                { text: " kinds of genre" },
            ],
        ];
        updateDisplayText(display_text);
    }
};
var updateDisplayText = function(display_data) {
    d3.select("#infoHivePlot")
        .selectAll("text")
        .data(display_data)
        .selectAll("tspan")
        .data((d) => d)
        .style("color", (d) => d.color)
        .text((d) => d.text);
};

// A shape generator for Hive links, based on a source and a target.
// The source and target are defined in polar coordinates (angle and radius).
// Ratio links can also be drawn by using a startRadius and endRadius.
// This class is modeled after d3.svg.chord.
function HivePlot_link() {
    var source = (d) => d.source,
        target = (d) => d.target,
        angle = (d) => d.angle,
        startRadius = (d) => d.radius,
        endRadius = startRadius,
        arcOffset = -Math.PI / 2;

    function link(d, i) {
        var s = node(source, this, d, i),
            t = node(target, this, d, i),
            x;
        if (t.a < s.a)(x = t), (t = s), (s = x);
        if (t.a - s.a > Math.PI) s.a += 2 * Math.PI;
        var a1 = s.a + (t.a - s.a) / 3,
            a2 = t.a - (t.a - s.a) / 3;
        return s.r0 - s.r1 || t.r0 - t.r1 ?
            "M" +
            Math.cos(s.a) * s.r0 +
            "," +
            Math.sin(s.a) * s.r0 +
            "L" +
            Math.cos(s.a) * s.r1 +
            "," +
            Math.sin(s.a) * s.r1 +
            "C" +
            Math.cos(a1) * s.r1 +
            "," +
            Math.sin(a1) * s.r1 +
            " " +
            Math.cos(a2) * t.r1 +
            "," +
            Math.sin(a2) * t.r1 +
            " " +
            Math.cos(t.a) * t.r1 +
            "," +
            Math.sin(t.a) * t.r1 +
            "L" +
            Math.cos(t.a) * t.r0 +
            "," +
            Math.sin(t.a) * t.r0 +
            "C" +
            Math.cos(a2) * t.r0 +
            "," +
            Math.sin(a2) * t.r0 +
            " " +
            Math.cos(a1) * s.r0 +
            "," +
            Math.sin(a1) * s.r0 +
            " " +
            Math.cos(s.a) * s.r0 +
            "," +
            Math.sin(s.a) * s.r0 :
            "M" +
            Math.cos(s.a) * s.r0 +
            "," +
            Math.sin(s.a) * s.r0 +
            "C" +
            Math.cos(a1) * s.r1 +
            "," +
            Math.sin(a1) * s.r1 +
            " " +
            Math.cos(a2) * t.r1 +
            "," +
            Math.sin(a2) * t.r1 +
            " " +
            Math.cos(t.a) * t.r1 +
            "," +
            Math.sin(t.a) * t.r1;
    }

    function node(method, thiz, d, i) {
        var node = method.call(thiz, d, i),
            a = +(typeof angle === "function" ?
                angle.call(thiz, node, i) :
                angle) + arcOffset,
            r0 = +(typeof startRadius === "function" ?
                startRadius.call(thiz, node, i) :
                startRadius),
            r1 =
            startRadius === endRadius ?
            r0 :
            +(typeof endRadius === "function" ?
                endRadius.call(thiz, node, i) :
                endRadius);
        return { r0: r0, r1: r1, a: a };
    }

    link.source = function(_) {
        if (!arguments.length) return source;
        source = _;
        return link;
    };

    link.target = function(_) {
        if (!arguments.length) return target;
        target = _;
        return link;
    };

    link.angle = function(_) {
        if (!arguments.length) return angle;
        angle = _;
        return link;
    };

    link.radius = function(_) {
        if (!arguments.length) return startRadius;
        startRadius = endRadius = _;
        return link;
    };

    link.startRadius = function(_) {
        if (!arguments.length) return startRadius;
        startRadius = _;
        return link;
    };

    link.endRadius = function(_) {
        if (!arguments.length) return endRadius;
        endRadius = _;
        return link;
    };

    return link;
}

var HivePlot_degrees = (radians) => (radians / Math.PI) * 180 - 90;

const sum = (arr) => arr.reduce((a, b) => a + b, 0);