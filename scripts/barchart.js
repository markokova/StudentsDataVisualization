const data = [
    { "programType": "Stručni studij", "students": 44580 },
    { "programType": "Stručni kratki studij", "students": 7 },
    { "programType": "Stručni prijediplomski studij", "students": 36928 },
    { "programType": "Stručni diplomski studij", "students": 7645 },
    { "programType": "Sveučilišni studij", "students": 114174 },
    { "programType": "Dodiplomski sveučilišni studij", "students": 54 },
    { "programType": "Sveučilišni prijediplomski studij", "students": 52484 },
    { "programType": "Sveučilišni diplomski studij", "students": 28495 },
    { "programType": "Sveučilišni integrirani studij", "students": 26214 },
    { "programType": "Sveučilišni specijalistički studij", "students": 2199 },
    { "programType": "Doktorski studij", "students": 4728 }
];

const margin = { top: 20, right: 30, bottom: 130, left: 50 }, // Increased bottom margin
      width = 960 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand()
    .domain(data.map(d => d.programType))
    .range([0, width])
    .padding(0.1);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.students)])
    .nice()
    .range([height, 0]);

// Create a tooltip div that is hidden by default
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.append("g")
    .selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.programType))
    .attr("y", d => y(d.students))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.students))
    .on("mouseover", function(event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(d.students)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-30)") // Adjusted rotation angle
    .style("text-anchor", "end");

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));
