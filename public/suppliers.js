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

document.getElementById('entity-update-button').addEventListener('click', () => {
    let inputSupplierID = document.getElementById('entity-update-number').value
    let inputSupplierName = document.getElementById('entity-supplier-name-update').value

    if (!inputSupplierName) {
        window.location.href = '/suppliers'
        return
    }

    let req = new XMLHttpRequest()
    let url = `/suppliers/${inputSupplierID}/${inputSupplierName}`

    req.open('POST', url)
    req.addEventListener('load', (event) => {
        if (event.target.status === 200) {
            window.location.reload()
        }
    })
    req.setRequestHeader('Content-Type', 'application/sql')
    req.send()
})

let buttons = document.getElementsByName('entity-remove-button')
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        let req = new XMLHttpRequest()
        let url = `/remove/Suppliers/supplierID/${e.target.id}/`
        
        req.open('POST', url)
        req.addEventListener('load', (event) => {
            if (event.target.status === 200) {
                window.location.reload()
            }
        })
        req.setRequestHeader('Content-Type', 'application/sql')
        req.send()
    })
}