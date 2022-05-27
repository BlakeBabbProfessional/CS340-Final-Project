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

document.getElementById('entity-add-button').addEventListener('click', () => {
    let inputSupplierName = document.getElementById('entity-supplier-name-text').value

    if (!inputSupplierName) {
        window.location.href = '/suppliers'
        return
    }

    let req = new XMLHttpRequest()
    let url = `/suppliers/${inputSupplierName}`

    req.open('POST', url)
    req.setRequestHeader('Content-Type', 'application/sql')
    req.send()

    setTimeout(() => {
        window.location.reload()
    }, 15)
})

let buttons = document.getElementsByName('entity-remove-button')
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        let req = new XMLHttpRequest()
        let url = `/remove/Suppliers/supplierID/${e.target.id}/`
        
        req.open('POST', url)
        req.setRequestHeader('Content-Type', 'application/sql')
        req.send()

        setTimeout(() => {
            window.location.reload()
        }, 10)
    })
}