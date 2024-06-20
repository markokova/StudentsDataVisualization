const parameterSelect = document.getElementById("parameter-select");

function getColorScale(parameter) {
    switch (parameter) {
        case "studenata":
            return d3.scale.log().domain([100, 90000]).range(["#008000", "#FFFF00"]);
        case "stanovnika":
            return d3.scale.log().domain([5000, 900000]).range(["#008000", "#FFFF00"]);
        case "postotak-studenata":
            return d3.scale.linear().domain([0, 10]).range(["#008000", "#FFFF00"]);
        case "broj-fakulteta":
            return d3.scale.linear().domain([1, 50]).range(["#008000", "#FFFF00"]);
    }
}

function renderMap() {
    const parameter = parameterSelect.value;
    const color = getColorScale(parameter);
    updateLegend(color);

    // json file is downloaded from FERIT Osijek subject Data Visualisation, LV5
    d3.json("data/cro_regv3_ext.json", function (error, cro) {
        if (error) throw error;

        var data = topojson.feature(cro, cro.objects.layer1);

        const paths = d3.select("#map").selectAll("path.county")
            .data(data.features);
            console.log(data.features);
            paths.enter()
            .append("path")
            .attr("class", "county")
            .attr("id", function (d) { return d.id; })
            .attr("d", d3.geo.path().projection(d3.geo.mercator().center([0, 10]).scale(6000).translate([17600, 4500]).rotate([-180, 0])))
            .style("stroke", "gray")
            .style("stroke-width", 1)
            .style("stroke-opacity", 1)
            .on("mouseover", function (d) {
                d3.select(this)
                    .transition()
                    .duration(50)
                    .style("stroke-width", 3)
                    .style("stroke", "black");
        
                d3.select("#zupanija").text("Županija: " + d.properties.name);
                d3.select("#studenata").text("Studenata: " + d.properties.studenata);
                d3.select("#stanovnika").text("Stanovnika: " + d.properties.stanovnika);
                d3.select('#postotak-studenata').text(`Postotak studenata: ${((d.properties.studenata / d.properties.stanovnika) * 100).toFixed(2)}%`);
                d3.select("#grad_opcina").text("Gradova/općina: " + d.properties.gradovi_opcine);
                d3.select("#broj-fakulteta").text("Broj fakulteta: " + d.properties.broj_fakulteta);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(50)
                    .style("stroke-width", 1)
                    .style("stroke", "gray");
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

        function showDistrictDetails(d) {
            var districtName = d.properties.name;
            districtName = districtName.toUpperCase();

            d3.json("data/students2.json", function (error, dataset) {
                if (error) throw error;

                console.log(districtName);

                var filteredUniversities = dataset.filter(function (uni) {
                    return uni.district === districtName;
                });
                console.log(filteredUniversities);
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
    parameterSelect.addEventListener("change", renderMap);
    initializeLegend();
    renderMap(); 
});