document.getElementById('entity-filter-button').addEventListener('click', () => {
    let filterText = document.getElementById('entity-filter-input').value
    let filterColumnOption = document.getElementById('filter-dropdown-orders').selectedIndex

    if (!filterText) {
        window.location.href = '/orders'
        return
    }

    let filterColumn
    switch (filterColumnOption) {
        case 0:
            filterColumn = "orderID"
            break
        case 1:
            filterColumn = "orderPurchaseDate"
            break;
        case 2:
            filterColumn = "customerID"
            break
    }

    window.location.href = `/orders/${filterColumn}/${filterText}`
})