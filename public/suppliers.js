document.getElementById('entity-filter-button').addEventListener('click', () => {
    let filterText = document.getElementById('entity-filter-input').value
    let filterColumnOption = document.getElementById('filter-dropdown-suppliers').selectedIndex

    if (!filterText) {
        window.location.href = '/suppliers'
        return
    }

    let filterColumn
    switch (filterColumnOption) {
        case 0:
            filterColumn = "supplierID"
            break
        case 1:
            filterColumn = "supplierName"
            break;
    }

    window.location.href = `/suppliers/${filterColumn}/${filterText}`
})