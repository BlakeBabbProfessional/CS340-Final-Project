document.getElementById('entity-filter-button').addEventListener('click', () => {
    let filterText = document.getElementById('entity-filter-input').value
    let filterColumnOption = document.getElementById('filter-dropdown-customers').selectedIndex

    if (!filterText) {
        window.location.href = '/customer'
        return
    }

    let filterColumn
    switch (filterColumnOption) {
        case 0:
            filterColumn = "customerID"
            break
        case 1:
            filterColumn = "customerFirstName"
            break;
        case 2:
            filterColumn = "customerLastName"
            break
        case 3:
            filterColumn = "customerDateOfBirth"
            break
        case 4:
            filterColumn = "customerTotalCost"
            break
    }

    window.location.href = `/customer/${filterColumn}/${filterText}`
})

document.getElementById('entity-add-button').addEventListener('click', () => {
    let inputAmountSpent = document.getElementById('entity-amount-spent-text').value
    let inputFirstName = document.getElementById('entity-first-name-text').value
    let inputLastName = document.getElementById('entity-last-name-text').value
    let inputDOB = document.getElementById('entity-dob-text').value

    if (!inputAmountSpent | !inputFirstName | !inputLastName | !inputDOB) {
        window.location.href = '/customer'
        return
    }

    window.location.href = `/customer/${inputAmountSpent}/${inputFirstName}/${inputLastName}/${inputDOB}`
})