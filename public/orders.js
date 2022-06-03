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
    let selectCustomerFk = document.getElementById('customer-fk-input')
    let inputCustomerKey = selectCustomerFk.options[selectCustomerFk.selectedIndex].value

    if (!inputPurchaseDate) {
        window.location.href = '/orders'
        return
    }

    let req = new XMLHttpRequest()
    let url = `/orders/${inputPurchaseDate}/${inputCustomerKey}`

    req.open('POST', url)
    req.addEventListener('load', (event) => {
        if (event.target.status === 200) {
            window.location.reload()
        }
        if (event.target.status === 400) {
            alert("invalid request")
        }
    })
    req.setRequestHeader('Content-Type', 'application/sql')
    req.send()
})

document.getElementById('entity-update-button').addEventListener('click', () => {
    let inputOrderID = document.getElementById('entity-update-number').value
    let inputPurchaseDate = document.getElementById('entity-purchase-date-update').value

    if (!inputOrderID | !inputPurchaseDate) {
        window.location.href = '/orders'
        return
    }

    let req = new XMLHttpRequest()
    let url = `/orders/${inputOrderID}/${inputPurchaseDate}`

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
        let url = `/remove/Orders/orderID/${e.target.id}/`
        
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