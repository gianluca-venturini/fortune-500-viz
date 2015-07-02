// Static variables
var statisticValues = [];

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

    // Calculate the heatmap value and parameters for every state
    var heatmapValues = [];
    statisticValues = [];
    if(cachedData) {
        var data = filterData(cachedData);
        var max = 0;
        states.forEach(function(state) {
            var value = 0;
            var numCompanies = 0;
            var numEmployee = 0;
            var numDropbox = 0;
            data.forEach(function(company) {
                if(company.city_state == state) {
                    numCompanies += 1;
                    numEmployee += company.employee;
                    numDropbox += company.dropbox;
                }
            });
            switch(config.company_render) {
                case RENDER.CONSTANT:
                    value = numCompanies;
                    break;
                case RENDER.PROP_DROPBOX:
                    value = numDropbox;
                    break;
                case RENDER.PROP_EMPLOYEES:
                    value = numEmployee;
                    break;
            }
            statisticValues.push({
                numCompanies: numCompanies,
                numEmployee: numEmployee,
                numDropbox: numDropbox
            });

            // Update the maximum value
            max = Math.max(max, value);
            heatmapValues.push(value);
        });

        // Normalize the values
        heatmapValues = heatmapValues.map(function(value) { return value/max; });
    }

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
        .attr("d", path)
        .style("opacity", 0)
        .on("mouseover", mouseOver)
        .on("mousemove", mouseOver)
        .on("mouseout", function() {
            labelRender(0, 0, null);
        });

    map.selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        //.attr("d", path)
        .transition().duration(1500)
        .style("fill", function(d, i) {
            if(config.dropbox_users_heatmap) {
                // from #ffeda0
                // to #f03b20
                var r = 255 * (1-heatmapValues[i]) + 240 * heatmapValues[i];
                var g = 237 * (1-heatmapValues[i]) + 59 * heatmapValues[i];
                var b = 180 * (1-heatmapValues[i]) + 32 * heatmapValues[i];
                return "rgb("+ r +","+ g +","+ b +")";
            }
            else {
                return null;
            }
        })
        .style("opacity", 1);

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
        .attr("class", "name state")
        .text("name")
        .style("opacity", 0);

    names.selectAll(".name_g")
        .data(topojson.feature(us, us.objects.states).features)
        .attr("transform", function(d) { return "translate(" + (path.centroid(d)[0] | 0) + "," + (path.centroid(d)[1] | 0) +")"});

    names.selectAll(".name")
        .data(topojson.feature(us, us.objects.states).features)
        //.attr("x", function(d) { return path.centroid(d)[0] | 0})
        //.attr("y", function(d) { return path.centroid(d)[1] | 0})
        .text(function(d, i) { return states[i]; })
        .transition().duration(1000)
        .style("opacity", function() {return config.state_name_visible ? 1 : 0});


    // Mouse over function
    function mouseOver(d, i) {
        var value = statisticValues[i];

        if(value == undefined && cachedData != undefined && cachedMap != undefined) {
            mapRender(cachedMap);
            return;
        }
        else if(value == undefined) {
            return;
        }

        var mouse = d3.mouse(this.parentNode.parentNode.parentNode);
        var x = mouse[0];
        var y = mouse[1];

        var text = {
            state: states[i],
            company: value.numCompanies,
            employee: numberToFormattedString(value.numEmployee),
            dropbox: numberToFormattedString(value.numDropbox)};

        labelRender(x, y, text);
    }

}


function render(companies) {
    // Render the companies
    var data = filterData(companies);

    // Insert randomness for companies overlapped
    data.forEach(function(c) {
        if(c.radius == undefined) {
            c.radius = Math.random() * 0.05;
            c.direction = Math.random() * 2 * Math.PI;
        }
    });

    var width = window.innerWidth,
        height = window.innerHeight;

    var projection = d3.geo.albersUsa()
        .scale(config.zoom)
        .translate([
            width / 2 + config.offset.x,
            height / 2 + config.offset.y
        ]);

    var companies = d3.select("#companies");
    var company_names = d3.select("#company_names");

    // Calculate the radius for the companyCircleRadius function
    var max_value = 0;  // Max value of employees or dropbox users

    data.forEach(function(d) {
        switch(config.company_render) {
            case RENDER.PROP_EMPLOYEES:
                max_value = Math.max(max_value, d.employee);
                break;
            case RENDER.PROP_DROPBOX:
                max_value = Math.max(max_value, d.dropbox);
                break;
        }
    });


    // Render company circles
    companies.selectAll(".circle_g")
        .data(data, order)
        .enter().append("g")
        .attr("class", "circle_g")
        .attr("transform", function(d) {
            return "translate("
            + (d.city_lon != undefined ? projection([d.city_lon, d.city_lat])[0] : -10000)
            + ","
            + (d.city_lon != undefined ? projection([d.city_lon, d.city_lat])[1] : -10000)
            + ")";
        })
        .append("g")
        .attr("class", "not_zoomable")
        .attr("transform", function() { return "scale("+ (1.0/config.scale) +")"})
        .append("circle")
        .attr("class", "circle pointer")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0)
        .style("fill", "red")
        .style("opacity", 0.5);
        //.transition()
        //.attr("r", function(d) {return companyCircleRadius(d, max_value); });

    companies.selectAll(".circle_g")
        .data(data, order)
        .attr("transform", function(d) {
            var lat = d.city_lat + Math.sin(d.direction) * d.radius;
            var lon = d.city_lon + Math.cos(d.direction) * d.radius;
            return "translate("
                + (d.city_lon != undefined ? projection([lon, lat])[0]  : -10000)
                + ","
                + (d.city_lon != undefined ? projection([lon, lat])[1]  : -10000)
                + ")";
        });

    companies.selectAll(".circle")
        .data(data, order)
        .on("click", function(d) {
            selected_companies.push(d);
            tableRender();
        })
        .transition().duration(1000)
        .attr("r", function(d) {return companyCircleRadius(d, max_value); })
        .style("opacity", 0.5);

    companies.selectAll(".circle")
        .data(data, order)
        .exit()
        .transition().duration(1500)
        .style("opacity", 0)
        .attr("r", 0);

    // Render company names
    company_names.selectAll(".name_g")
        .data(data, order)
        .enter().append("g")
        .attr("class", "name_g")
        .attr("transform", function(d) {
            var lat = d.city_lat + Math.sin(d.direction) * d.radius;
            var lon = d.city_lon + Math.cos(d.direction) * d.radius;
            return "translate("
                + (d.city_lon != undefined ? projection([lon, lat])[0]  : -10000)
                + ","
                + (d.city_lon != undefined ? projection([lon, lat])[1]  : -10000)
                + ")";
        })
        .append("g")
        .attr("class", "not_zoomable")
        .attr("transform", function() { return "scale("+ (1.0/config.scale) +")"})
        .append("text")
        .attr("class", "name")
        .attr("x", 0)
        .attr("y", 0)
        .style("opacity", 0);

    company_names.selectAll(".name_g")
        .data(data, order)
        .attr("transform", function(d) {
            var lat = d.city_lat + Math.sin(d.direction) * d.radius;
            var lon = d.city_lon + Math.cos(d.direction) * d.radius;
            return "translate("
                + (d.city_lon != undefined ? projection([lon, lat])[0]  : -10000)
                + ","
                + (d.city_lon != undefined ? projection([lon, lat])[1]  : -10000)
                + ")";
        });

    company_names.selectAll(".name")
        .data(data, order)
            // Place the name in the top right of the circle
        .attr("x", function(d) {return  companyCircleRadius(d, max_value) * Math.cos(Math.PI / 4) })
        .attr("y", function(d) {return -companyCircleRadius(d, max_value) * Math.sin(Math.PI / 4) })
        .text(function(d) {
            var label = "";
            if(config.ranking_visible)
                label += d.ranking;
            if(config.company_name_visible && config.ranking_visible)
                label += " - ";
            if(config.company_name_visible)
                label += d.name;

            return label;
        })
        .transition().duration(1000)
        .style("opacity", function() { return config.company_name_visible || config.ranking_visible  ? 1 : 0});

    company_names.selectAll(".name")
        .data(data, order)
        .exit()
        .transition().duration(1000)
        .style("opacity", 0);
}

function labelRender(x, y, text) {

    if(!text) {
        d3.select("#fixed")
            .selectAll("g")
            .remove();
    }
    else {
        var data = [[]];

        // Create new text
        var fixed = d3.select("#fixed")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("id", "label_g")
            .append("text");

        fixed.append('tspan')
            .attr('x', 5)
            .attr('dy', 0)
            .attr("id", "label_state");

        fixed.append('tspan')
            .attr('x', 5)
            .attr('dy', 10)
            .attr("id", "label_company");

        fixed.append('tspan')
            .attr('x', 5)
            .attr('dy', 10)
            .attr("id", "label_employee");

        fixed.append('tspan')
            .attr('x', 5)
            .attr('dy', 10)
            .attr("id", "label_dropbox");

        // Update the text
        d3.select("#label_g")
            .attr("transform", "translate(" + x + "," + y + ")");

        d3.select("#label_state")
            .text("State: " + text.state);

        d3.select("#label_company")
            .text("Company: " + text.company);

        d3.select("#label_employee")
            .text("Employee: " + text.employee);

        d3.select("#label_dropbox")
            .text("Dropbox: " + text.dropbox);
    }
}
