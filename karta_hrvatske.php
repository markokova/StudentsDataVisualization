<!DOCTYPE html>
<html>

<head>
    <title>Statistika studenata</title>
    <script src="http://d3js.org/d3.v3.min.js"></script>
    <script src="http://d3js.org/topojson.v1.min.js"></script>
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div>
        <h1 id="title">Prikaz podataka o studentima u Hrvatskoj</h1>
    </div>
    <div id="nav-placeholder"></div>
    <script>
        $(function() {
            $("#nav-placeholder").load("header.html");
        });
    </script>
    <a href="./barchart.html"><button>Vrste studija</button></a>
    <!-- <div class="district-data">
        <h2>Detalji o županiji</h2>
        <p id="zupanija">Županija:</p>
        <p id="stanovnika">Broj stanovnika:</p>
        <p id="studenata">Broj studenata:</p>
        <p id="grad_opcina">Broj gradova/općina:</p>
    </div> -->
    <div class="container">
        <svg id="map" width="600" height="400"></svg>
        <div class="district-data">
            <h2>Detalji o županiji</h2>
            <p id="zupanija">Županija:</p>
            <p id="stanovnika">Broj stanovnika:</p>
            <p id="studenata">Broj studenata:</p>
            <p id="grad_opcina">Broj gradova/općina:</p>
        </div>
    </div>
    <script>
        var width = 960;
        var height = 700;
        var projection = d3.geo.mercator()
            .center([0, 10])
            .scale(6000)
            .translate([17600, 4500])
            .rotate([-180, 0]);
        var path = d3.geo.path()
            .projection(projection);
        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background", "white");
        d3.json("cro_regv3_ext.json", function(error, cro) {
            var data = topojson.feature(cro, cro.objects.layer1);

            var color = d3.scale.linear()
                .domain([50000, 800000])
                .range(["#008000", "#FFFF00", "#FF0000"]);

            var states = svg.selectAll("path.county")
                .data(data.features)
                .enter()
                .append("path")
                .attr("class", "county")
                .attr("id", function(d) {
                    return d.id;
                })
                .attr("d", path)
                .style("fill", function(d) {
                    return color(d.properties.stanovnika);
                })
                .style("stroke", "gray")
                .style("stroke-width", 1)
                .style("stroke-opacity", 1)
                .on("mouseover", function(d) {
                    d3.select("#zupanija").text("Zupanija : " + d.properties.name);
                    d3.select("#studenata").text("Studenata: " + d.properties.studenata);
                    d3.select("#stanovnika").text("Stanovnika : " + d.properties.stanovnika);
                    d3.select("#grad_opcina").text("Gradova/opcina : " + d.properties.gradovi_opcine);
                });
        });
    </script>
    <div class="district-data">
        <p id="zupanija">Zupanija</p>
        <p id="stanovnika">Broj stanovnika</p>
        <p id="studenata">Studenata</p>
        <p id="grad_opcina">Broj gradova/opcina</p>
    </div>
</body>

</html>