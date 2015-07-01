FILTER = {
    NONE: "FILTER.NONE"
};


/**
 * \param[in]  data      Vector of companies data, every row is one company
 *
 * \return vector of companies data, one row for a company
 */
function filterData(data) {
    return data;
}

/**
 * \param[in]  company      Company object
 *
 * \return integer representing the radius of the circle in this config
 */
function companyCircleRadius(company) {
    return 0.00001 * company.employee;
}
