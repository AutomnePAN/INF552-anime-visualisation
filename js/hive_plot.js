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

// var angle = d3
//     .scalePoint()
//     .domain(["source", "source-target", "target-source", "target"])
//     .range([
//         0,
//         majorAngle - minorAngle,
//         majorAngle + minorAngle,
//         2 * majorAngle,
//     ]);

var animeRadius = d3.scaleLinear().range([innerRadius, outerRadius]);
var genreRadius = d3.scaleLinear().range([innerRadius, outerRadius]);
var studioRadius = d3.scaleLinear().range([innerRadius, outerRadius]);

//TODO: change this
var color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(20));
var animeScoreScale = d3
    .scaleLinear()
    .domain([8.5, 10])
    .range(["white", "blue"]);
var animeScoreScale = d3
    .scaleSequential()
    .domain([7, 10])
    .interpolator(d3.interpolateRdPu);
var genreCountScale = d3.scaleLinear().range(["#f6fbfd", "blue"]);
var studioCountScale = d3.scaleLinear().range(["#ffffe5", "green"]);
// ["#ffffe5","#ffffe4","#feffe2","#feffe1","#feffdf","#feffde","#fdfedd","#fdfedb","#fdfeda","#fdfed9","#fcfed7","#fcfed6","#fcfed5","#fbfed3","#fbfed2","#fbfdd1","#fbfdcf","#fafdce","#fafdcd","#f9fdcc","#f9fdca","#f9fdc9","#f8fcc8","#f8fcc7","#f7fcc5","#f7fcc4","#f6fcc3","#f6fcc2","#f5fbc1","#f5fbc0","#f4fbbf","#f4fbbe","#f3fabd","#f3fabc","#f2fabb","#f1faba","#f1f9b9","#f0f9b8","#eff9b7","#eff9b6","#eef8b5","#edf8b4","#ecf8b3","#ebf7b2","#ebf7b2","#eaf7b1","#e9f6b0","#e8f6af","#e7f6ae","#e6f5ae","#e5f5ad","#e4f4ac","#e3f4ab","#e2f4ab","#e1f3aa","#e0f3a9","#dff2a8","#def2a8","#ddf2a7","#dcf1a6","#dbf1a6","#daf0a5","#d9f0a4","#d8efa4","#d6efa3","#d5eea2","#d4eea2","#d3eda1","#d2eda0","#d0eca0","#cfec9f","#ceeb9e","#cdeb9e","#cbea9d","#caea9c","#c9e99c","#c7e89b","#c6e89a","#c5e79a","#c3e799","#c2e698","#c1e598","#bfe597","#bee496","#bde496","#bbe395","#bae294","#b8e294","#b7e193","#b5e192","#b4e092","#b2df91","#b1df90","#afde90","#aedd8f","#acdd8e","#abdc8e","#a9db8d","#a8db8c","#a6da8c","#a5d98b","#a3d98a","#a2d88a","#a0d789","#9ed788","#9dd688","#9bd587","#9ad586","#98d486","#96d385","#95d284","#93d284","#92d183","#90d082","#8ed082","#8dcf81","#8bce80","#89cd80","#88cd7f","#86cc7e","#84cb7d","#83ca7d","#81ca7c","#7fc97b","#7ec87a","#7cc77a","#7ac779","#79c678","#77c577","#75c477","#73c376","#72c375","#70c274","#6ec174","#6dc073","#6bbf72","#69be71","#68be70","#66bd6f","#64bc6f","#63bb6e","#61ba6d","#5fb96c","#5eb96b","#5cb86a","#5ab76a","#59b669","#57b568","#56b467","#54b366","#53b265","#51b164","#50b064","#4eaf63","#4dae62","#4bad61","#4aac60","#48ab5f","#47aa5e","#46a95e","#44a85d","#43a75c","#42a65b","#40a55a","#3fa459","#3ea359","#3da258","#3ca157","#3aa056","#399f55","#389d55","#379c54","#369b53","#359a52","#349951","#339851","#329750","#31964f","#30944e","#2f934e","#2e924d","#2d914c","#2c904b","#2a8f4b","#298e4a","#288d49","#278b49","#268a48","#258947","#248847","#238746","#228645","#218545","#208444","#1f8344","#1e8243","#1d8143","#1c8042","#1b7f42","#1a7e41","#197d41","#187c40","#177b40","#167a3f","#15793f","#14783e","#13773e","#12763d","#11753d","#10743c","#10733c","#0f723c","#0e723b","#0d713b","#0c703a","#0b6f3a","#0b6e3a","#0a6d39","#096c39","#086b38","#086a38","#076938","#066837","#066737","#056636","#056536","#046435","#046335","#046235","#036134","#036034","#025f33","#025e33","#025d33","#025c32","#015b32","#015a31","#015931","#015730","#015630","#015530","#00542f","#00532f","#00522e","#00512e","#00502d","#004f2d","#004e2d","#004d2c","#004c2c","#004a2b","#00492b","#00482a","#00472a","#004629","#004529"]
// ["#f7fcfd","#f6fbfd","#f6fbfc","#f5fafc","#f4fafc","#f3f9fc","#f3f9fb","#f2f8fb","#f1f8fb","#f0f7fa","#f0f7fa","#eff6fa","#eef6fa","#eef5f9","#edf5f9","#ecf4f9","#ebf4f8","#eaf3f8","#eaf3f8","#e9f2f7","#e8f2f7","#e7f1f7","#e7f0f7","#e6f0f6","#e5eff6","#e4eff6","#e3eef5","#e3eef5","#e2edf5","#e1ecf4","#e0ecf4","#dfebf3","#deeaf3","#ddeaf3","#dce9f2","#dce8f2","#dbe8f2","#dae7f1","#d9e6f1","#d8e6f0","#d7e5f0","#d6e4f0","#d5e4ef","#d4e3ef","#d3e2ee","#d2e1ee","#d1e1ee","#d0e0ed","#cfdfed","#cedeec","#cddeec","#ccddec","#cbdceb","#cadbeb","#c9dbea","#c8daea","#c7d9ea","#c6d8e9","#c5d8e9","#c4d7e8","#c3d6e8","#c2d5e7","#c1d5e7","#c0d4e7","#bfd3e6","#bed2e6","#bdd2e5","#bcd1e5","#bbd0e5","#bacfe4","#b9cfe4","#b8cee3","#b7cde3","#b5cce3","#b4cce2","#b3cbe2","#b2cae1","#b1c9e1","#b0c9e1","#afc8e0","#afc7e0","#aec6df","#adc5df","#acc5de","#abc4de","#aac3de","#a9c2dd","#a8c1dd","#a7c0dc","#a6c0dc","#a5bfdb","#a4bedb","#a3bdda","#a3bcda","#a2bbd9","#a1bad9","#a0b9d8","#9fb8d8","#9fb7d7","#9eb6d7","#9db5d6","#9cb4d6","#9cb3d5","#9bb2d5","#9ab1d4","#9ab0d4","#99afd3","#98aed3","#98add2","#97acd1","#97aad1","#96a9d0","#95a8d0","#95a7cf","#94a6ce","#94a5ce","#93a3cd","#93a2cc","#92a1cc","#92a0cb","#929fcb","#919dca","#919cc9","#909bc9","#909ac8","#9098c7","#8f97c7","#8f96c6","#8f95c6","#8f93c5","#8e92c4","#8e91c4","#8e8fc3","#8e8ec2","#8e8dc2","#8d8cc1","#8d8ac0","#8d89c0","#8d88bf","#8d86be","#8d85be","#8d84bd","#8c82bc","#8c81bc","#8c80bb","#8c7eba","#8c7dba","#8c7cb9","#8c7ab9","#8c79b8","#8c78b7","#8c76b7","#8c75b6","#8c74b5","#8c72b5","#8c71b4","#8c70b3","#8b6eb3","#8b6db2","#8b6cb1","#8b6ab1","#8b69b0","#8b68af","#8b66af","#8b65ae","#8b64ae","#8b62ad","#8b61ac","#8b60ac","#8b5eab","#8a5daa","#8a5caa","#8a5aa9","#8a59a8","#8a58a8","#8a56a7","#8a55a6","#8a54a6","#8a52a5","#8951a4","#894fa3","#894ea3","#894da2","#894ba1","#894aa1","#8949a0","#88479f","#88469e","#88449d","#88439d","#88419c","#88409b","#873f9a","#873d99","#873c98","#873a98","#873997","#863796","#863695","#863494","#863393","#853192","#853091","#852f90","#852d8f","#842c8e","#842a8d","#84298c","#83278b","#83268a","#822589","#822388","#812287","#812186","#801f84","#801e83","#7f1d82","#7e1c81","#7e1a80","#7d197f","#7c187d","#7b177c","#7b167b","#7a1579","#791478","#781377","#771276","#761174","#741073","#730f72","#720f70","#710e6f","#700d6d","#6e0c6c","#6d0c6b","#6c0b69","#6a0a68","#690a66","#680965","#660863","#650862","#630760","#62075f","#60065d","#5f055c","#5d055a","#5c0459","#5a0457","#580356","#570354","#550253","#540251","#520150","#50014e","#4f004d","#4d004b"]
var ctx = {};

var display_text = [
    [
        { text: "d.source.Title", color: "#cbc0d3" },
        { text: " of people killed were " },
        { text: "BLACK", color: "#d9534f" },
    ],
    [{ text: "" }, { text: "" }, { text: "" }],
];

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
    animeRadius.domain(
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
    genreCountScale.domain(
        d3.extent(data[1], function (d) {
            return d.count;
        })
    );
    studioCountScale.domain(
        d3.extent(data[2], function (d) {
            return d.count;
        })
    );

    drawAxis(svg, data.slice(0, 3));
    drawLinks(svg, data);
    drawNodes(svg, data);
    var defaultInfo;
    // Initialize the info display.
    // var info = d3
    //     .select("#infoHivePlot")
    //     .text(
    //         (defaultInfo =
    //             "Showing high-scored anime's dependencies among " +
    //             "Production studio" +
    //             " and " +
    //             "Genre")
    //     );

    var tspans = d3
        .select("#infoHivePlot")
        .selectAll("text")
        .data(display_text)
        .enter()
        .append("text")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "hanging")
        .selectAll("tspan")
        .data((d) => d)
        .enter()
        .append("tspan")
        .style("color", function (d) {
            return d.color;
        })
        .text(function (d) {
            console.log(d.text);
            return d.text;
        });
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
        .attr("x1", animeRadius(-2))
        .attr("x2", function (d) {
            return animeRadius(d.count + 2);
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
                    return animeRadius(d.id);
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
                    return animeRadius(d.id);
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

    var width = {
        genre: genreRadius(1) - genreRadius(0),
        studio: studioRadius(1) - studioRadius(0),
        anime: animeRadius(1) - animeRadius(0),
    };
    var height = 10;

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
        // .attr("cx", function (d) {
        //     if (d.key == "genre") return genreRadius(d.id);
        //     if (d.key == "studio") return studioRadius(d.id);
        //     return animeRadius(d.id);
        // })
        .attr("x", function (d) {
            if (d.key == "genre") return genreRadius(d.id);
            if (d.key == "studio") return studioRadius(d.id);
            return animeRadius(d.id);
        })
        // .attr("r", 4)
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

    if (
        ["anime", "genre"].includes(d.source.key) &&
        ["anime", "genre"].includes(d.target.key)
    ) {
        console.log(d.source.Title);
        var y_position = 10;
        d3.selectAll("text")
            .data(display_text)
            .selectAll("tspan")
            .data((d) => d)
            .exit();
        d3.selectAll("text").data(display_text).exit();

        display_text = [
            [
                { text: d.source.Title, color: "#cbc0d3" },
                { text: " of people killed were " },
                { text: "BLACK", color: "#d9534f" },
            ],
            [
                { text: d.target.genre, color: "#cbc0d3" },
                { text: " of people killed were " },
                { text: "BLACK", color: "#d9534f" },
            ],
        ];

        d3.select("#infoHivePlot")
            .selectAll("text")
            .data(display_text)
            .attr("x", function (d, i) {
                return 0;
            })
            .attr("y", function (d, i) {
                return i * 10;
            })
            .attr("text-anchor", "start")
            .attr("alignment-baseline", "hanging")
            .selectAll("tspan")
            .data((d) => d)
            .style("color", function (d) {
                return d.color;
            })
            .attr("x", 0)
            .attr("dy", (d, i) => i * 4)
            .text(function (d) {
                console.log(d.text);
                return d.text;
            });
    }
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
