document.getElementById('entity-filter-button').addEventListener('click', () => {
    let filterText = document.getElementById('entity-filter-input').value
    let filterColumnOption = document.getElementById('filter-dropdown-suppliers-goods').selectedIndex

    if (!filterText) {
        window.location.href = '/suppliers-goods'
        return
    }

    let filterColumn
    switch (filterColumnOption) {
        case 0:
            filterColumn = "itemID"
            break
        case 1:
            filterColumn = "supplierID"
            break;
    }

    window.location.href = `/suppliers-goods/${filterColumn}/"${filterText}"`
})