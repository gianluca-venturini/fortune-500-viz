function mapRender(us) {
    // Render the map

    var width = window.innerWidth,
        height = window.innerHeight;

    var projection = d3.geo.albersUsa()
        .scale(config.zoom)
        .translate([
            width / 2 + config.offset.x,
            height / 2 + config.offset.y
        ]);

    var path = d3.geo.path()
        .projection(projection);

    var map = d3.select("#map");
    var names = d3.select("#state_names");

    /*
     map.insert("path", ".graticule")
        .datum(topojson.feature(us, us.objects.land))
        .attr("class", "land")
        .attr("d", path);

     map.insert("path", ".graticule")
        .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
        .attr("class", "county-boundary")
        .attr("d", path);

     map.insert("path", ".graticule")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "state-boundary")
        .attr("d", path);
    */

    // Render the states
    map.selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path);

    map.selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .transition()
        .attr("d", path);

    // Render the state names
    names.selectAll(".name_g")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("g")
        .attr("class", "name_g")
        .attr("transform", function(d) { return "translate(" + (path.centroid(d)[0] | 0) + "," + (path.centroid(d)[1] | 0) +")"})
        .append("g")
        .attr("class", "not_zoomable")
        .attr("transform", function() { return "scale("+ (1.0/config.scale) +")"})
        .append("text")
        .attr("class", "name")
        .text("name");

    names.selectAll("name")
        .data(topojson.feature(us, us.objects.states).features)
        //.attr("x", function(d) { return path.centroid(d)[0] | 0})
        //.attr("y", function(d) { return path.centroid(d)[1] | 0})
        .text("name");


    // Render the state names
}


function render(data) {
    // Render the companies

    var width = window.innerWidth,
        height = window.innerHeight;

    var projection = d3.geo.albersUsa()
        .scale(config.zoom)
        .translate([
            width / 2 + config.offset.x,
            height / 2 + config.offset.y
        ]);

    var companies = d3.select("#companies");

    console.log(data);

    // Render company circles
    companies.selectAll("circle_g")
        .data(data)
        .enter().append("g")
        .attr("class", "circle_g")
        .attr("transform", function(d) {
            return "translate("
            + (d.city_lon != undefined ? projection([d.city_lon, d.city_lat])[0] : -1)
            + ","
            + (d.city_lon != undefined ? projection([d.city_lon, d.city_lat])[1] : -1)
            + ")";
        })
        .append("g")
        .attr("class", "not_zoomable")
        .attr("transform", function() { return "scale("+ (1.0/config.scale) +")"})
        .append("circle")
        .attr("class", "circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", companyCircleRadius)
        .style("fill", "red")
        .style("opacity", 0.5);

    companies.selectAll(".circle")
        .attr("r", companyCircleRadius);

}
