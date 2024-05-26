const parameterSelect = document.getElementById("parameter-select");

function getColorScale(parameter) {
    switch (parameter) {
        case "studenata":
            return d3.scale.log().domain([500, 90000]).range(["#008000", "#FFFF00", "#FF0000"]);
        case "stanovnika":
            return d3.scale.log().domain([5000, 900000]).range(["#008000", "#FFFF00", "#FF0000"]);
        case "postotak-studenata":
            return d3.scale.linear().domain([0, 10]).range(["#008000", "#FFFF00", "#FF0000"]);
        case "broj-fakulteta":
            return d3.scale.linear().domain([0, 50]).range(["#008000", "#FFFF00", "#FF0000"]);
        // return d3.scale.linear().domain([0, 50]).range(["#008000", "#83F28F", "#FFFF00"]);
    }
}

function initializeLegend() {
    const legendWidth = 120;
    const legendHeight = 300;

    const legendSvg = d3.select("#legend")
        .append("svg")
        .attr("id", "legendSvg")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("background", "white");

    const gradient = legendSvg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "100%")
        .attr("y2", "-40%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#008000")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "60%")
        .attr("stop-color", "#FFFF00")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#FF0000")
        .attr("stop-opacity", 1);

    legendSvg.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("x", 0)
        .style("fill", "url(#gradient)");

    const yScale = d3.scale.linear()
        .domain([2000, 90000])
        .range([legendHeight, 0]);

    const yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(5);

    legendSvg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(40,0)")
        .call(yAxis);
}

function updateLegend(color) {
    const legendSvg = d3.select("#legendSvg");

    // Update gradient stops based on the color scale
    const gradient = legendSvg.select("#gradient");

    gradient.select("stop[offset='0%']")
        .attr("stop-color", color.range()[0]);

    gradient.select("stop[offset='60%']")
        .attr("stop-color", color.range()[1]);

    gradient.select("stop[offset='100%']")
        .attr("stop-color", color.range()[2]);

    // Update the axis scale based on the color scale domain
    const yScale = d3.scale.linear()
        .domain(color.domain())
        .range([295, 0]);

    const yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(5);

    legendSvg.select(".y.axis")
        .transition()
        .call(yAxis);
}

function createBarChart(data) {
    // Remove any existing chart
    d3.select("#chart").selectAll("*").remove();

    // Group data by category and sum students
    var categoryData = d3.nest()
        .key(function (d) { return d.category; })
        .rollup(function (v) { return d3.sum(v, function (d) { return d.students; }); })
        .entries(data);

    console.log(categoryData.length);

    var margin = { top: 20, right: 20, bottom: 100, left: 80 },
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.2); // Increase spacing between the bands

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(categoryData.map(function (d) { return d.key; }));
    y.domain([0, d3.max(categoryData, function (d) { return d.values; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle") // Center-align the text
        .attr("dx", "0em") // Adjust the horizontal position
        .attr("dy", ".75em"); // Adjust the vertical position

    svg.append("text") // Append text element for x-axis label
        .attr("x", width + 20) // Position at the center of the x-axis
        .attr("y", height + 40) // Position below the x-axis
        .attr("dy", "1em") // Adjust vertical position
        .style("text-anchor", "end") // Center align the text
        .text("[Usmjerenje]"); // Set the label text

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("y", 6)
        .attr("dy", "-.90em")
        .style("text-anchor", "end")
        .text("[Studenti]");

    // Create a tooltip div that is hidden by default
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.append("g").selectAll(".bar")
        .data(categoryData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.values); })
        .attr("height", function (d) { return height - y(d.values); })
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.students)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

function updateMap() {
    const parameter = parameterSelect.value;
    const color = getColorScale(parameter);
    updateLegend(color);

    d3.json("data/cro_regv3_ext.json", function (error, cro) {
        if (error) throw error;

        var data = topojson.feature(cro, cro.objects.layer1);

        const paths = d3.select("#map").selectAll("path.county")
            .data(data.features);

        paths.enter()
            .append("path")
            .attr("class", "county")
            .attr("id", function (d) { return d.id; })
            .attr("d", d3.geo.path().projection(d3.geo.mercator().center([0, 10]).scale(6000).translate([17600, 4500]).rotate([-180, 0])))
            .style("stroke", "gray")
            .style("stroke-width", 1)
            .style("stroke-opacity", 1)
            .on("mouseover", function (d) {
                d3.select("#zupanija").text("Županija: " + d.properties.name);
                d3.select("#studenata").text("Studenata: " + d.properties.studenata);
                d3.select("#stanovnika").text("Stanovnika: " + d.properties.stanovnika);
                d3.select('#postotak-studenata').text(`Postotak studenata: ${((d.properties.studenata / d.properties.stanovnika) * 100).toFixed(2)}%`);
                d3.select("#grad_opcina").text("Gradova/općina: " + d.properties.gradovi_opcine);
                d3.select("#broj-fakulteta").text("Broj fakulteta: " + d.properties.broj_fakulteta);
            })
            .on("click", showDistrictDetails);

        paths.transition().duration(750)
            .style("fill", function (d) {
                switch (parameter) {
                    case "studenata":
                        return color(d.properties.studenata);
                    case "stanovnika":
                        return color(d.properties.stanovnika);
                    case "postotak-studenata":
                        return color((d.properties.studenata / d.properties.stanovnika) * 100);
                    case "broj-fakulteta":
                        return color(d.properties.broj_fakulteta);
                }
            });

        paths.exit().remove();

        function showDistrictDetails(d) {
            var centroid = d3.geo.path().projection(d3.geo.mercator().center([0, 10]).scale(6000).translate([17600, 4500]).rotate([-180, 0])).centroid(d);
            var x = centroid[0];
            var y = centroid[1];

            var districtName = d.properties.name;
            districtName = districtName.toUpperCase();

            d3.json("data/students2.json", function (error, dataset) {
                if (error) throw error;

                var filteredUniversities = dataset.filter(function (uni) {
                    return uni.district === districtName;
                });

                var modal = document.getElementById("districtModal");
                var modalDetails = document.getElementById("modalDetails");

                modalDetails.innerHTML = "<h3>Fakulteti u " + districtName + ":</h3>";
                filteredUniversities.forEach(function (uni) {
                    modalDetails.innerHTML += "<p>" + uni.university + ": " + uni.students + " studenata, " + uni.category + "</p>";
                });
                modalDetails.innerHTML += "<p>" + "Broj fakulteta: " + filteredUniversities.length + "</p>";

                modal.style.display = "block";

                var span = document.getElementsByClassName("close")[0];
                span.onclick = function () {
                    modal.style.display = "none";
                };

                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                };
                createBarChart(filteredUniversities);
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    parameterSelect.addEventListener("change", updateMap);
    initializeLegend(); // Initialize the legend on page load
    updateMap(); // Initial map rendering
});