result = [].slice.call(document.getElementsByClassName("company-list-item")).map(function(company) {
    return {
        name:company.getElementsByClassName("company-name")[0]["outerText"],
        url: company.getElementsByClassName("company-item-link")[0]["href"],
        city_name: company.getElementsByClassName("company-location")[0]["outerText"].split(",")[0],
        city_state: company.getElementsByClassName("company-location")[0]["outerText"].split(",")[1],
        industry: company.getElementsByClassName("company-industry")[0]["outerText"],
        ranking: company.getElementsByClassName("ranking")[0]["outerText"].split(".")[0]
    }
})