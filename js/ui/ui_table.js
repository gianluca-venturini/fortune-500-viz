selected_companies = [];

// TODO: delete this
function lol() {
    selected_companies.push(cachedData[0]);
}

function tableRender() {

    // Eliminate duplicates
    selected_companies = selected_companies.filter(function(company1, index1) {
        return selected_companies.filter(function(company2, index2) {
            return company1.name == company2.name && index1 != index2
        }).length == 0;
    });

    var data = [{name: "", city: "<b>City</b>", industry: "<b>Industry</b>", employee: "<b>Employee</b>", dropbox: "<b>Dropbox</b>", dropbox_perc: "<b>Dropbox [%]</b>", ranking: "<b>Fortune Rank</b>", url: "<b>Url</b>"}];

    var c = selected_companies.map(function(company) {

        return {
            name: company.name,
            city: company.city_name + " (" + company.city_state + ")",
            industry: company.industry,
            employee: company.employee,
            dropbox: company.dropbox,
            dropbox_perc: (parseFloat(company.dropbox) / company.employee * 100.0).toFixed(1) + "%",
            ranking: company.ranking,
            url: company.url
        };
    });

    if(selected_companies.length > 0) {
        data = data.concat(c);
    }
    else {
        data = [];
    }

    // Create title row
    d3.select("#table_title")
        .selectAll("th")
        .data(data)
        .enter()
        .append("th")
        .text(function(d) {return d.name});

    // Update title row
    d3.select("#table_title")
        .selectAll("th")
        .data(data)
        .text(function(d) {return d.name});

    // Remove title row
    d3.select("#table_title")
        .selectAll("th")
        .data(data)
        .exit()
        .remove();

    // Create data for the rows
    var row_data = [];
    row_data.push(data.map(function(company) { return company.city }));
    row_data.push(data.map(function(company) { return company.industry }));
    row_data.push(data.map(function(company) { return company.employee }));
    row_data.push(data.map(function(company) { return company.dropbox }));
    row_data.push(data.map(function(company) { return company.dropbox_perc }));
    row_data.push(data.map(function(company) { return company.ranking }));
    row_data.push(data.map(function(company) { return company.url == "Url" ? "" : "<a href='" + company.url + "' target='_blank'>source</a>"; }));
    row_data.push(data.map(function(company) { return company.url == "Url" ? "" : "<button class='select-delete red' ranking='" + company.ranking + "'>Delete</button>"; }));



    // Create rows
    d3.select("#table_body")
        .selectAll("tr")
        .data(row_data)
        .enter()
        .append("tr");

    // Create columns
    d3.select("#table_body")
        .selectAll("tr")
        .data(row_data)
            .selectAll("td")
            .data(function(row) {
                console.log(row);
                return row;
            })
            .enter()
            .append('td')
            .html(function(d) {
                return d;
            });

    // Update existing columns
    d3.select("#table_body")
        .selectAll("tr")
        .data(row_data)
            .selectAll("td")
            .data(function(row) {
                return row;
            })
            .html(function(d) {
                return d;
            });

    // Delete removed columns
    d3.select("#table_body")
        .selectAll("tr")
        .data(row_data)
            .selectAll("td")
            .data(function(row) {
                return row;
            })
            .exit()
            .remove();

    // Delete removed rows
    d3.select("#table_body")
        .selectAll("tr")
        .data(row_data)
        .exit()
        .remove();

    // Attach listener for delete button
    $(".select-delete").click(function() {

        var ranking = $(this).attr("ranking");

        selected_companies = selected_companies.filter(function(company) {
            return +company.ranking != +ranking;
        });

        tableRender();
    })
}