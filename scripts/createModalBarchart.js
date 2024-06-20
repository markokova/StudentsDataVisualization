function createBarChart(data) {
    d3.select("#chart").selectAll("*").remove();
  
    var categoryData = d3.nest()
      .key(function(d) { return d.category; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.students; }); })
      .entries(data);
  
    var margin = { top: 20, right: 20, bottom: 100, left: 80 },
      width = 600 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.2);
  
    var y = d3.scale.linear()
      .range([height, 0]);
  
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(3);
  
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(3)
      .ticks(10);
  
    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + 20 + ")");
  
    x.domain(categoryData.map(function(d) { return d.key; }));
    y.domain([0, d3.max(categoryData, function(d) { return d.values; })]);
  
    var xAxisText = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(-3," + height + ")")
      .call(xAxis)
      .selectAll("text");
  
    if(categoryData.length > 4){
      xAxisText
        .style("text-anchor", "middle")
        .attr("dx", "-.8em") 
        .attr("dy", "1.2em")
        .attr("transform", "rotate(-10)");
    } else {
      xAxisText
        .style("text-anchor", "middle")
        .attr("dx", "0em")
        .attr("dy", ".75em");
    }
  
    svg.append("text") 
      .attr("x", width + 20)
      .attr("y", height + 40)
      .attr("dy", "1em") 
      .style("text-anchor", "end") 
      .text("[Usmjerenje]"); 
  
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("y", 6)
      .attr("dy", "-.90em")
      .style("text-anchor", "end")
      .text("[Studenti]");
  
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
}