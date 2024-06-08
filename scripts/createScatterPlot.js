//https://github.com/perossing/d3-data-visualizations/blob/master/d3-scatter-plot/interactive-plot/script.js
function createScatterPlot(data) {
    d3.select("#scatter-plot").selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 100, left: 80 },
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const x = d3.scale.linear()
        .range([0, width]);

    const y = d3.scale.linear()
        .range([height, 0]);

    const xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    const yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    const svg = d3.select("#scatter-plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain([0, d3.max(data, function (d) { return d.properties.stanovnika; })]);
    y.domain([0, d3.max(data, function (d) { return d.properties.studenata; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width)
        .attr("y", -10)
        .style("text-anchor", "end")
        .text("Populacija");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Studenti");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function (d) { return x(d.properties.stanovnika); })
        .attr("cy", function (d) { return y(d.properties.studenata); })
        .style("fill", function (d) { return "#1f77b4"; })
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("District: " + d.properties.name + "<br/>" + "Population: " + d.properties.stanovnika + "<br/>" + "Students: " + d.properties.studenata)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

}


d3.json("../data/cro_regv3_ext.json", function (error, cro) {
    if (error) throw error;
    var data = topojson.feature(cro, cro.objects.layer1).features;
    createScatterPlot(data);
});