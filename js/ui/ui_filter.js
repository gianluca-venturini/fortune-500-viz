boolean_filters = [
    {id: "#state_names_filter", variable: "state_name_visible"},
    {id: "#company_names_filter", variable: "company_name_visible"}
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
                updateFilters();
            }

        }, 300);


    });
});

// Add listeners to filter select list
$("#filter").change(function() {
    config.filter = FILTER[$("#filter").val()];

    updateFilters();
});


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


    if(cachedData != undefined) {
        render(cachedData);
    }

    if(cachedMap != undefined) {
        mapRender(cachedMap);
    }
}

updateFilters();