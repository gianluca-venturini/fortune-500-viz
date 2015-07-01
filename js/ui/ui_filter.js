boolean_filters = [
    {id: "#state_names_filter", variable: "state_name_visible"},
    {id: "#company_names_filter", variable: "company_name_visible"},
    {id: "#dropbox_users_heatmap", variable: "dropbox_users_heatmap"},
    {id: "#ranking_visible", variable: "ranking_visible"}
];

numeric_filters = [
    {id: "#filter_number", variable: "filter_number"},
    {id: "#filter_offset", variable: "filter_offset"}
];

// Add listeners to all boonean filters
boolean_filters.forEach(function(filter) {
    $(filter.id).click(function() {

        // Change the state
        config[filter.variable] = !config[filter.variable];

        updateFilters();
    });
});

// Add listeners to all numeric filters
var timeout;
numeric_filters.forEach(function(filter) {
    $(filter.id).on('input',function(e){

        // Remove the timeout
        if(timeout != undefined) {
            clearTimeout(timeout);
        }

        var self = this;

        // Change the state only if pass more than timeout
        timeout = setTimeout(function(){
            // Change the state
            var number = parseInt($(self).val());

            if(number) {
                config[filter.variable] = number;
            }
            else {
                config[filter.variable] = 0;
            }

            updateFilters();

        }, 300);


    });
});

// Add listeners to filter select list
$("#filter").change(function() {
    config.filter = $("#filter").val();

    updateFilters();
});

// Add listeners to filter select list
$("#render").change(function() {
    config.company_render = $("#render").val();

    updateFilters();
});

// Add listeners on zoom buttons
$("#PLUS").click(function() {
    //zoom.scale(zoom.scale() + 0.5);
    updateZoom(1);
});

// Add listeners on zoom buttons
$("#MINUS").click(function() {
    //zoom.scale(zoom.scale() - 0.5);
    updateZoom(-1);

});

function updateZoom(direction) {

    var width = window.innerWidth,
        height = window.innerHeight,

        factor = 0.6,
        target_zoom = 1,
        center = [width / 2, height / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);

    /*
    zoom.center([width/2.0, height/2.0]);
    zoom.event(d3.select("#svg"));
    //zoom.center(null);
    */
}

function interpolateZoom (translate, scale) {
    var self = this;
    return d3.transition().duration(350).tween("zoom", function () {
        var iTranslate = d3.interpolate(zoom.translate(), translate),
            iScale = d3.interpolate(zoom.scale(), scale);
        return function (t) {
            zoom
                .scale(iScale(t))
                .translate(iTranslate(t));
            moveMap();
        };
    });
}

function updateFilters() {

    boolean_filters.forEach(function(filter) {
        $(filter.id).removeClass("active").removeClass("not_active");

        if(config[filter.variable]) {
            $(filter.id).addClass("active");
        }
        else {
            $(filter.id).addClass("not_active");
        }
    });

    $("#filter").removeClass("active").removeClass("not_active");

    if(config.filter == FILTER.NONE) {
        $("#filter").addClass("not_active");
    }
    else {
        $("#filter").addClass("active");
    }

    $("#filter").val(config.filter);

    $("#render").val(config.company_render);

    $("#filter_number").val(config.filter_number);
    $("#filter_offset").val(config.filter_offset);

    if(cachedData != undefined) {
        render(cachedData);
    }

    if(cachedMap != undefined) {
        mapRender(cachedMap);
    }
}

updateFilters();