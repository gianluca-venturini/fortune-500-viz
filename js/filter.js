// Filter configuration options
FILTER = {
    NONE: "FILTER.NONE",
    DROPBOX_USERS: "FILTER.DROPBOX_USERS",
    NUM_EMPLOYEES: "FILTER.NUM_EMPLOYEES",
    RANKING: "FILTER.RANKING"
};

// Render configuration options
RENDER = {
    CONSTANT: "RENDER.CONSTANT",
    PROP_EMPLOYEES: "RENDER.PROP_EMPLOYEES",
    PROP_DROPBOX: "RENDER.PROP_DROPBOX"
};

/**
 * \param[in]  data      Vector of companies data, every row is one company
 *
 * \return vector of companies data, one row for a company
 */
function filterData(data) {
    switch(config.filter) {
        case FILTER.NONE:
            return data;
            break;

        case FILTER.RANKING:    // Increasing order
            return data.filter(function(d) {
                return d.ranking <= config.filter_number + config.filter_offset &&
                    d.ranking > config.filter_offset;
            });
            break;

        case FILTER.NUM_EMPLOYEES:  // Decreasing order
            return data.sort(function(a, b){return b.employee - a.employee}).filter(function(d, index) {
                return index < config.filter_number;
            });
            break;

        case FILTER.DROPBOX_USERS:  // Decreasing order
            return data.sort(function(a, b){return b.dropbox - a.dropbox}).filter(function(d, index) {
                return index < config.filter_number;
            });
            break;
    }

}

/**
 * \param[in]  company      Company object
 * \param[in]  max_value    Max value of employees or dropbox users
 * \param[in]  max_radius   Max radius
 * \param[in]  fixed_radius Constant radius
 *
 * \return integer representing the radius of the circle in this config
 */
function companyCircleRadius(company, max_value) {

    // Constants
    var max_radius = config.max_radius; // Max radius
    var fixed_radius = config.fixed_radius;   // Constant radius

    switch(config.company_render) {
        case RENDER.CONSTANT:
            return fixed_radius;
            break;

        case RENDER.PROP_EMPLOYEES:
            return max_radius / max_value * company.employee;
            break;

        case RENDER.PROP_DROPBOX:
            return max_radius / max_value * company.dropbox;
            break;
    }

}

/**
 * \param[in]  company      Company object
 *
 * \return integer representing the order in data representation used as a key in visualization
 */
function order(company) {
    return company.ranking;
}

