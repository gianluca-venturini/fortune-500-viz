boolean_filters = [
    {id: "#state_names_filter", variable: "state_name_visible"},
    {id: "#company_names_filter", variable: "company_name_visible"}
];

// Add listeners to all boonean filters
boolean_filters.forEach(function(filter) {
    $(filter.id).click(function() {

        // Change the state
        config[filter.variable] = !config[filter.variable];

        updateFilters();
    });
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


    if(cachedData != undefined) {
        render(cachedData);
    }

    if(cachedMap != undefined) {
        mapRender(cachedMap);
    }
}

updateFilters();