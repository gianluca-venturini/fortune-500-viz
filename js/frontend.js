var config = {
    filter: FILTER.NONE,
    filter_number: 100,
    company_render: RENDER.CONSTANT,
    zoom: 1000,
    scale: 1.0,
    offset: {x: 0, y: 0},
    state_name_visible: true,
    company_name_visible: false,

    // Company circles
    max_radius: 50.0,
    fixed_radius: 5.0
};

var cachedData;   // Cached data
var cachedMap;

function loadData() {

    // Load fortune 500 list
    d3.json("data/fortune_500.json", function(d) {
        cachedData = d;

        render(cachedData);

    }, function(error, rows) {
        console.log("Error on loading fortune_500.csv");
    });
}

function loadMap() {
    d3.json("data/us.json", function(d) {

        cachedMap = d;
        mapRender(cachedMap);

    }, function(error, rows) {
        console.log("Error on loading map");
    });
}

// On window resize fix the rendering
window.addEventListener("resize", function() {
    if(cachedMap != undefined) {
        mapRender(cachedMap);
    }

    if(cachedData != undefined) {
        render(cachedData);
    }
});

// Entry point of the application
window.onload = function(e){

    // Create the layers on the svg
    d3.select("#svg").append("g").attr("id","zoomable");

    d3.select("#zoomable").append("g").attr("id","map");
    d3.select("#zoomable").append("g").attr("id","state_names");
    d3.select("#zoomable").append("g").attr("id","companies");
    d3.select("#zoomable").append("g").attr("id","company_names");

    loadMap();
    loadData();

    // Manage the panning
    var zoom = d3.behavior.zoom()
        //.scaleExtent([-1, 8])
        .on("zoom", moveMap);

    d3.select("#svg")
        .call(zoom);

    function moveMap() {
        var width = window.innerWidth,
            height = window.innerHeight;

        var t = d3.event.translate,
            s = d3.event.scale;
        // TODO: insert constraints
        /*
        t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
        t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
        */
        //t[0] = Math.max(0, Math.min(t[0], width - s*50));
        //t[1] = Math.max(0, Math.min(t[1], height - s*50));
        zoom.translate(t);
        d3.select("#zoomable").attr("transform", "translate(" + t + ")scale(" + s + ")");
        d3.selectAll(".not_zoomable").attr("transform", "scale(" + (1.0 / s) + ")");

        config.scale = s;

    }
};



