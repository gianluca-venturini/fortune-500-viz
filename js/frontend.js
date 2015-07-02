var config = {
    filter: FILTER.RANKING,
    filter_number: 100,
    filter_offset: 0,
    company_render: RENDER.CONSTANT,
    zoom: 1000,
    scale: 1.0,
    offset: {x: 0, y: 0},
    state_name_visible: true,
    ranking_visible: false,
    company_name_visible: false,
    dropbox_users_heatmap: false,

    // Company circles
    max_radius: 50.0,
    fixed_radius: 5.0,

    // Pie chart
    pie_chart: {
        radius: 80,
        donut_width: 20
    }
};

var cachedData;   // Cached data
var cachedMap;    // Cached map data

function loadData() {

    // Load fortune 500 list
    d3.json("data/fortune_500.json", function(d) {
        cachedData = d;

        render(cachedData);

    }, function(error, rows) {
        console.log("Error on loading fortune_500.csv " + error);
    });
}

function loadMap() {
    d3.json("data/us.json", function (d) {

        cachedMap = d;
        mapRender(cachedMap);

    }, function (error, rows) {
        console.log("Error on loading map");
    });
}

// On window resize fix the rendering
window.addEventListener("resize", function() {
    if(cachedMap != undefined) {
        mapRender(cachedMap, true);
    }

    if(cachedData != undefined) {
        render(cachedData);
    }
});

var previousScale = 1;
var zoom;

// Entry point of the application
window.onload = function(e){

    // Create the layers on the svg
    d3.select("#svg").append("g").attr("id","zoomable");
    d3.select("#svg").append("g").attr("id","fixed");

    d3.select("#zoomable").append("g").attr("id","map");
    d3.select("#zoomable").append("g").attr("id","state_names");
    d3.select("#zoomable").append("g").attr("id","companies");
    d3.select("#zoomable").append("g").attr("id","company_names");

    loadMap();

    // Wait 1 second before loading the data
    setTimeout(function(){ loadData(); }, 1000);

    // Manage the panning
    zoom = d3.behavior.zoom()
        //.scaleExtent([-1, 8])
        .on("zoom", moveMap);

    d3.select("#svg")
        .call(zoom);
};

// Move the map when zoomed
function moveMap() {
    var width = window.innerWidth,
        height = window.innerHeight;

    var t = zoom.translate(),
        s = zoom.scale();

    // TODO: insert constraints
    /*
     t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
     t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
     */
    //t[0] = Math.max(0, Math.min(t[0], width - s*50));
    //t[1] = Math.max(0, Math.min(t[1], height - s*50));
    d3.select("#zoomable").attr("transform", "translate(" + t + ")scale(" + s + ")");
    d3.selectAll(".not_zoomable").attr("transform", "scale(" + (1.0 / s) + ")");

    config.scale = s;

}




