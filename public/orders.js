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

document.getElementById('entity-add-button').addEventListener('click', () => {
    let inputPurchaseDate = document.getElementById('entity-purchase-date-text').value

    if (!inputPurchaseDate) {
        window.location.href = '/orders'
        return
    }

    let req = new XMLHttpRequest()
    let url = `/orders/${inputPurchaseDate}`

    req.open('POST', url)
    req.setRequestHeader('Content-Type', 'application/sql')
    req.send()

    setTimeout(() => {
        window.location.reload()
    }, 10)
})

let buttons = document.getElementsByName('entity-remove-button')
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        let req = new XMLHttpRequest()
        let url = `/remove/Orders/orderID/${e.target.id}/`
        
        req.open('POST', url)
        req.setRequestHeader('Content-Type', 'application/sql')
        req.send()

        setTimeout(() => {
            window.location.reload()
        }, 10)
    })
}