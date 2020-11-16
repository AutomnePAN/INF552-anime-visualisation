var width = window.innerWidth,
    height = window.innerHeight,
    innerRadius = 40,
    outerRadius = window.innerHeight / 2,
    majorAngle = (4 * Math.PI) / 3,
    minorAngle = (1 * Math.PI) / 6;

var angle = d3
    .scalePoint()
    .domain(["anime", "genre", "studio"])
    .range([-minorAngle, majorAngle, 2 * majorAngle]);

// var angle = d3
//     .scalePoint()
//     .domain(["source", "source-target", "target-source", "target"])
//     .range([
//         0,
//         majorAngle - minorAngle,
//         majorAngle + minorAngle,
//         2 * majorAngle,
//     ]);

var radius = d3.scaleLinear().range([innerRadius, outerRadius]);
var genreRadius = d3.scaleLinear().range([innerRadius, outerRadius]);
var studioRadius = d3.scaleLinear().range([innerRadius, outerRadius]);

var color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(20));

var ctx = {};

var createViz = function () {
    console.log("Using D3 v" + d3.version);
    var svg = d3
        .select("#hivePlot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    loadData(svg);
};

var loadData = function (svg) {
    var promises = [
        d3.csv("data/data_anime_hive.csv"),
        d3.json("data/genres.json"),
        d3.json("data/studios.json"),
        d3.json("data/anime_genre.json"),
        d3.json("data/anime_studio.json"),
        d3.json("data/studio_genre.json"),
    ];
    Promise.all(promises)
        .then((data) => {
            // createMap(data[3], svgEl);
            // restructureData(data[0], data[1], data[2]);
            // createGraphLayout(svgEl);
            prePocessingData(data);
            console.log(data);
            myHivePlot(svg, data);
        })
        .catch((error) => {
            console.log(error);
        });
    // d3.json(
    //     "https://rawgit.com/cschen1205/js-d3-charts-made-simple/master/data/flare-imports.json"
    // ).then(function (nodes) {
    //     var plot = new HivePlot("hivePlot", "infoHivePlot", nodes);
    // });
};

var prePocessingData = function (data) {
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
};

var myHivePlot = function (svg, data) {
    // Set the radius domain.
    radius.domain(
        d3.extent(data[0], function (d) {
            return d.id;
        })
    );
    genreRadius.domain(
        d3.extent(data[1], function (d) {
            return d.id;
        })
    );
    studioRadius.domain(
        d3.extent(data[2], function (d) {
            return d.id;
        })
    );

    drawAxis(svg, data.slice(0, 3));
    drawLinks(svg, data);
    drawNodes(svg, data);
};

var drawAxis = function (svg, data) {
    var axisType = data.map((elem) => {
        return { key: elem.key, count: elem.length };
    });

    // console.log(axisType);

    svg.selectAll(".axis")
        .data(axisType)
        .enter()
        .append("line")
        .attr("class", "axis")
        .attr("transform", function (d) {
            return "rotate(" + HivePlot_degrees(angle(d.key)) + ")";
        })
        .attr("x1", radius(-2))
        .attr("x2", function (d) {
            return radius(d.count + 2);
        });
};

var drawLinks = function (svg, data) {
    // Draw the links.
    // console.log(data[0][1]);
    var animeGenreData = data[3].map((d) => {
        return { source: data[0][d.anime_id], target: data[1][d.genre_id] };
    });
    svg.append("g")
        .attr("class", "links")
        .selectAll(".link")
        .data(animeGenreData)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
            "d",
            HivePlot_link()
                .angle(function (d) {
                    return angle(d.key);
                })
                .radius(function (d) {
                    if (d.key == "genre") return genreRadius(d.id);
                    return radius(d.id);
                })
        )
        .on("mouseover", (event, d) => HivePlot_linkMouseover(event, d, svg))
        .on("mouseout", () => HivePlot_mouseout(svg));

    var animeStudioData = data[4].map((d) => {
        return { source: data[2][d.studio_id], target: data[0][d.anime_id] };
    });
    svg.append("g")
        .attr("class", "links")
        .selectAll(".link")
        .data(animeStudioData)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
            "d",
            HivePlot_link()
                .angle(function (d) {
                    return angle(d.key);
                })
                .radius(function (d) {
                    if (d.key == "studio") return studioRadius(d.id);
                    return radius(d.id);
                })
        )
        .on("mouseover", (event, d) => HivePlot_linkMouseover(event, d, svg))
        .on("mouseout", () => HivePlot_mouseout(svg));

    var studioGenreData = data[5].map((d) => {
        return { source: data[2][d.studio_id], target: data[1][d.genre_id] };
    });
    svg.append("g")
        .attr("class", "links")
        .selectAll(".link")
        .data(studioGenreData)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
            "d",
            HivePlot_link()
                .angle(function (d) {
                    return angle(d.key);
                })
                .radius(function (d) {
                    if (d.key == "studio") return studioRadius(d.id);
                    return genreRadius(d.id);
                })
        )
        .on("mouseover", (event, d) => HivePlot_linkMouseover(event, d, svg))
        .on("mouseout", () => HivePlot_mouseout(svg));
};

var drawNodes = function (svg, data) {
    var nodes = data[0].concat(data[1]).concat(data[2]);
    svg.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .style("fill", function (d) {
            if (d.key == "anime") return color(d.Rating);
            if (d.key == "studio") return color(d.studio);
            return color(d.genre);
        })
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("transform", function (d) {
            return "rotate(" + HivePlot_degrees(angle(d.key)) + ")";
        })
        .attr("cx", function (d) {
            if (d.key == "genre") return genreRadius(d.id);
            if (d.key == "studio") return studioRadius(d.id);
            return radius(d.id);
        })
        .attr("r", 4)
        .on("mouseover", (event, d) => HivePlot_nodeMouseover(event, d, svg))
        .on("mouseout", (event, d) => HivePlot_mouseout(svg));
};

var HivePlot = function (chartElementId, infoElementId, nodes) {
    var svg = d3
        .select("#hivePlot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var nodesByName = {},
        links = [],
        formatNumber = d3.format(",d"),
        defaultInfo;

    // Construct an index by node name.
    nodes.forEach((d) => {
        d.connectors = [];
        d.packageName = d.name.split(".")[1];
        nodesByName[d.name] = d;
    });

    // Convert the import lists into links with sources and targets.
    nodes.forEach((source) => {
        source.imports.forEach((targetName) => {
            var target = nodesByName[targetName];
            if (!source.source)
                source.connectors.push(
                    (source.source = { node: source, degree: 0 })
                );
            if (!target.target)
                target.connectors.push(
                    (target.target = { node: target, degree: 0 })
                );
            links.push({ source: source.source, target: target.target });
        });
    });

    // Determine the type of each node, based on incoming and outgoing links.
    nodes.forEach(function (node) {
        if (node.source && node.target) {
            node.type = node.source.type = "target-source";
            node.target.type = "source-target";
        } else if (node.source) {
            node.type = node.source.type = "source";
        } else if (node.target) {
            node.type = node.target.type = "target";
        } else {
            node.connectors = [{ node: node }];
            node.type = "source";
        }
    });

    // Initialize the info display.
    var info = d3
        .select("#" + infoElementId)
        .text(
            (defaultInfo =
                "Showing " +
                formatNumber(links.length) +
                " dependencies among " +
                formatNumber(nodes.length) +
                " classes.")
        );

    // Normally, Hive Plots sort nodes by degree along each axis. However, since
    // this example visualizes a package hierarchy, we get more interesting
    // results if we group nodes by package. We don't need to sort explicitly
    // because the data file is already sorted by class name.
    // Nest nodes by type, for computing the rank.

    var nodesByType = d3
        .nest()
        .key(function (d) {
            return d.type;
        })
        .sortKeys(d3.ascending)
        .entries(nodes);

    // Duplicate the target-source axis as source-target.
    nodesByType.push({ key: "source-target", values: nodesByType[2].values });

    // Compute the rank for each type, with padding between packages.
    nodesByType.forEach(function (type) {
        var lastName = type.values[0].packageName,
            count = 0;
        type.values.forEach(function (d, i) {
            if (d.packageName != lastName)
                (lastName = d.packageName), (count += 2);
            d.index = count++;
        });
        type.count = count - 1;
    });

    // Set the radius domain.
    radius.domain(
        d3.extent(nodes, function (d) {
            return d.index;
        })
    );

    console.log(nodes);
    console.log(links);
    // Draw the axes.
    svg.selectAll(".axis")
        .data(nodesByType)
        .enter()
        .append("line")
        .attr("class", "axis")
        .attr("transform", function (d) {
            return "rotate(" + HivePlot_degrees(angle(d.key)) + ")";
        })
        .attr("x1", radius(-2))
        .attr("x2", function (d) {
            return radius(d.count + 2);
        });

    // Draw the links.
    svg.append("g")
        .attr("class", "links")
        .selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
            "d",
            HivePlot_link()
                .angle(function (d) {
                    return angle(d.type);
                })
                .radius(function (d) {
                    return radius(d.node.index);
                })
        )
        .on("mouseover", (event, d) => HivePlot_linkMouseover(event, d))
        .on("mouseout", (event, d) => HivePlot_mouseout(event, d));

    // Draw the nodes. Note that each node can have up to two connectors,
    // representing the source (outgoing) and target (incoming) links.
    svg.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .style("fill", function (d) {
            return color(d.packageName);
        })
        .selectAll("circle")
        .data(function (d) {
            return d.connectors;
        })
        .enter()
        .append("circle")
        .attr("transform", function (d) {
            return "rotate(" + HivePlot_degrees(angle(d.type)) + ")";
        })
        .attr("cx", function (d) {
            return radius(d.node.index);
        })
        .attr("r", 4)
        .on("mouseover", (event, d) => HivePlot_nodeMouseover(event, d))
        .on("mouseout", (event, d) => HivePlot_mouseout(event, d));

    // Highlight the link and connected nodes on mouseover.
    function HivePlot_linkMouseover(event, d) {
        svg.selectAll(".link").classed("active", function (p) {
            return p === d;
        });
        svg.selectAll(".node circle").classed("active", function (p) {
            return p === d.source || p === d.target;
        });
        info.text(d.source.node.name + " ¡ú " + d.target.node.name);
    }

    // Highlight the node and connected links on mouseover.
    function HivePlot_nodeMouseover(event, d) {
        svg.selectAll(".link").classed("active", function (p) {
            return p.source === d || p.target === d;
        });
        d3.select(event.srcElement).classed("active", true);
        info.text(d.node.name);
    }

    // Clear any highlighted nodes or links.
    function HivePlot_mouseout() {
        svg.selectAll(".active").classed("active", false);
        info.text(defaultInfo);
    }
};

// A shape generator for Hive links, based on a source and a target.
// The source and target are defined in polar coordinates (angle and radius).
// Ratio links can also be drawn by using a startRadius and endRadius.
// This class is modeled after d3.svg.chord.
function HivePlot_link() {
    var source = function (d) {
            return d.source;
        },
        target = function (d) {
            return d.target;
        },
        angle = function (d) {
            return d.angle;
        },
        startRadius = function (d) {
            return d.radius;
        },
        endRadius = startRadius,
        arcOffset = -Math.PI / 2;

    function link(d, i) {
        var s = node(source, this, d, i),
            t = node(target, this, d, i),
            x;
        if (t.a < s.a) (x = t), (t = s), (s = x);
        if (t.a - s.a > Math.PI) s.a += 2 * Math.PI;
        var a1 = s.a + (t.a - s.a) / 3,
            a2 = t.a - (t.a - s.a) / 3;
        return s.r0 - s.r1 || t.r0 - t.r1
            ? "M" +
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
                  Math.sin(s.a) * s.r0
            : "M" +
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
            a =
                +(typeof angle === "function"
                    ? angle.call(thiz, node, i)
                    : angle) + arcOffset,
            r0 = +(typeof startRadius === "function"
                ? startRadius.call(thiz, node, i)
                : startRadius),
            r1 =
                startRadius === endRadius
                    ? r0
                    : +(typeof endRadius === "function"
                          ? endRadius.call(thiz, node, i)
                          : endRadius);
        return { r0: r0, r1: r1, a: a };
    }

    link.source = function (_) {
        if (!arguments.length) return source;
        source = _;
        return link;
    };

    link.target = function (_) {
        if (!arguments.length) return target;
        target = _;
        return link;
    };

    link.angle = function (_) {
        if (!arguments.length) return angle;
        angle = _;
        return link;
    };

    link.radius = function (_) {
        if (!arguments.length) return startRadius;
        startRadius = endRadius = _;
        return link;
    };

    link.startRadius = function (_) {
        if (!arguments.length) return startRadius;
        startRadius = _;
        return link;
    };

    link.endRadius = function (_) {
        if (!arguments.length) return endRadius;
        endRadius = _;
        return link;
    };

    return link;
}

function HivePlot_degrees(radians) {
    return (radians / Math.PI) * 180 - 90;
}

// Highlight the link and connected nodes on mouseover.
function HivePlot_linkMouseover(event, d, svg) {
    svg.selectAll(".link").classed("active", function (p) {
        return p === d;
    });
    svg.selectAll(".node circle").classed("active", function (p) {
        return p === d.source || p === d.target;
    });
    // info.text(d.source.node.name + " ¡ú " + d.target.node.name);
}

// Highlight the node and connected links on mouseover.
function HivePlot_nodeMouseover(event, d, svg) {
    svg.selectAll(".link").classed("active", function (p) {
        return p.source === d || p.target === d;
    });
    d3.select(event.srcElement).classed("active", true);
    // info.text(d.node.name);
}

// Clear any highlighted nodes or links.
function HivePlot_mouseout(svg) {
    svg.selectAll(".active").classed("active", false);
    // info.text(defaultInfo);
}
