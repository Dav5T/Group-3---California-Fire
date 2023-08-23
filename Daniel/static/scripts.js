// Color mapping for causes
var causeColors = {
    "Lightning": "#f1c40f",
    "Equipment Use": "#3498db",
    "Smoking": "#e74c3c",
    "Campfire": "#2ecc71",
    "Debris": "#9b59b6",
    "Transportation": "#34495e",
    "Arson": "#e67e22",
    "Playing with fire": "#1abc9c",
    "Unknown / Miscellaneous": "#7f8c8d",
    "Vehicle": "#2980b9",
    "Powerline": "#c0392b",
    "Structure": "#d35400",
    "Escaped Prescribed Burn": "#8e44ad"
};

// Fetch counties GeoJSON data
$.getJSON('/api/get_counties_data', function(counties_gdf) {

// Load map
var map = L.map('map', {
    center: [37.7749, -119.4194],
    zoom: 6,
    zoomControl: false,
    dragging: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    touchZoom: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Title Control
var titleControl = L.control({ position: 'topleft' });

titleControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'map-title');
    div.innerHTML = "Most Common Cause by County";
    return div;
};

titleControl.addTo(map);

// Fetch most common cause per county and add to map
    $.getJSON('/api/most_common_cause_per_county', function(data) {
        var geojsonLayer = L.geoJSON(counties_gdf, {
            style: function(feature) {
                // Style based on the most common cause
                var cause = data[feature.properties.NAME];
                return {color: causeColors[cause]};
            },
            onEachFeature: function(feature, layer) {
                // Tooltip info
                var cause = data[feature.properties.NAME];
                layer.bindTooltip("County: " + feature.properties.NAME + "<br>Most Common Cause: " + cause);
            }
        }).addTo(map);

        timeSliderControl.addTo(map);
    });
});

// Fetch most common cause per year and create heatmap
$.getJSON('/api/most_common_cause_per_year', function(data) {
    
    // Convert data to array
    var heatmapData = Object.keys(data).map(year => {
        return {year: parseFloat(year), cause: data[year]};
    });

    // Get unique causes and sort
    var causes = [...new Set(heatmapData.map(d => d.cause))].sort();

    // Define SVG, margins, dimensions
    var svg = d3.select("#heatmap");
    var margin = {top: 30, right: 180, bottom: 30, left: 100};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    var x = d3.scaleBand().domain(heatmapData.map(d => d.year)).range([0, width]).padding(0.05);
    var y = d3.scaleBand().domain(causes).range([0, height]).padding(0.05);
    var color = d3.scaleOrdinal(Object.values(causeColors));


    // Add cells
    g.selectAll("rect")
        .data(heatmapData)
        .enter().append("rect")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.cause))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => color(d.cause))
        .attr("stroke", "black");

    // Add X Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Create Legend
    var legend = g.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(700, 0)")
        .selectAll("g")
        .data(causes)
        .enter().append("g");
    
    legend.append("rect")
        .attr("y", (d, i) => i * 20)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => color(d));
    
    legend.append("text")
        .attr("x", 24)
        .attr("y", (d, i) => i * 20 + 9)
        .attr("dy", ".35em")
        .style("font-size", "12px")
        .text(d => d);

    // Add title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Most Common Cause Per Year");
});


// Fetch average size per cause and create bar chart
$.getJSON('/api/average_size_per_cause', function(data) {
    var svg = d3.select("#barChart");
    var margin = {top: 30, right: 150, bottom: 30, left: 100};
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    var y = d3.scaleLinear().rangeRound([height, 0]);

    // Define color scale
    var color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, d3.max(Object.values(data))]);

    // Convert data to suitable format
    var barChartData = Object.keys(data).map(cause => {
        return {cause: cause, size: data[cause]};
    });

    // Define scales
    x.domain(barChartData.map(d => d.cause));
    y.domain([0, d3.max(barChartData, d => d.size)]);

    // Add the bars
    g.selectAll(".bar")
        .data(barChartData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.cause))
        .attr("y", d => y(d.size))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.size))
        .attr("fill", d => color(d.size));

        // Add the X Axis
        var xAxis = g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        xAxis.selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");

            // Add X axis label
            g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 100)
            .style("text-anchor", "middle")
            .style("font-family", "Roboto")
            .text("CAUSE");

        // Add the Y Axis
        g.append("g")
        .call(d3.axisLeft(y));

            // Add Y axis label
            g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -80)
            .attr("x", -height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-family", "Roboto")
            .text("Average Acres Burned");

    // Add title
    g.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .style("text-anchor", "middle")
     .text("Severity of Fire Damage by Cause");

});


// Time Slider
var timeSliderControl = L.control({ position: 'center' });

timeSliderControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'time-slider');
    div.innerHTML = '<input type="range" id="timeSlider" min="2018" max="2022" step="1">';

    var slider = div.querySelector("#timeSlider");
    slider.addEventListener("input", function() {
        var selectedYear = parseInt(this.value);
        updateMap(selectedYear);
    });

    return div;

};

function updateMap(selectedYear) {
    // Remove existing layers from map
    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });

    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Fetch data for the selected year
    $.getJSON('/api/most_common_cause_per_county', function(data) {
        var geojsonLayer = L.geoJSON(counties_gdf, {
            style: function(feature) {
                // Style based on the most common cause for the selected year
                var cause = data[feature.properties.NAME][selectedYear.toString()];
                return {color: causeColors[cause]};
            },
            onEachFeature: function(feature, layer) {
                // Tooltip information for the selected year
                var cause = data[feature.properties.NAME][selectedYear.toString()];
                layer.bindTooltip("County: " + feature.properties.NAME + "<br>Most Common Cause (" + selectedYear + "): " + cause);
            }
        }).addTo(map);
    });
}

// Interactive Legend
var legend = L.control({ position: 'topright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    var causes = Object.keys(causeColors);
    var labels = Object.values(causeColors);

    // Loop through causes and generate legend HTML
    for (var i = 0; i < causes.length; i++) {
        div.innerHTML += '<i style="background:' + labels[i] + '"></i> ' + causes[i] + '<br>';
    }

    return div;
};