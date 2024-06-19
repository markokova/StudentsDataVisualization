function initializeLegend() {
    const legendWidth = 120;
    const legendHeight = 320;

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
        .attr("offset", "50%")
        .attr("stop-color", "#FFFF00")
        .attr("stop-opacity", 1);

    legendSvg.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("x", 0)
        .style("fill", "url(#gradient)");

    const yScale = d3.scale.linear()
        .domain([100, 90000])
        .range([legendHeight, 0]);

    const yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right");

    legendSvg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(40,10)")
        .call(yAxis);
}

function updateLegend(color) {
    const legendHeight = 320;
    const legendSvg = d3.select("#legendSvg");
    const gradient = legendSvg.select("#gradient");

    gradient.select("stop[offset='0%']")
        .attr("stop-color", color.range()[0]);

    gradient.select("stop[offset='60%']")
        .attr("stop-color", color.range()[1]);

    const yScale = d3.scale.linear()
        .domain(color.domain())
        .range([legendHeight - 25, 0]);

    const yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(5);

    legendSvg.select(".y.axis")
        .transition()
        .call(yAxis);
}