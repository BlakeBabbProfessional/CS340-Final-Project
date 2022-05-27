document.getElementById('entity-filter-button').addEventListener('click', () => {
    let filterText = document.getElementById('entity-filter-input').value
    let filterColumnOption = document.getElementById('filter-dropdown-goods').selectedIndex

    if (!filterText) {
        window.location.href = '/goods'
        return
    }

    let filterColumn
    switch (filterColumnOption) {
        case 0:
            filterColumn = "itemID"
            break
        case 1:
            filterColumn = "goodPrice"
            break;
        case 2:
            filterColumn = "goodLocationInStore"
            break
        case 3:
            filterColumn = "goodExpirationDate"
            break
        case 4:
            filterColumn = "orderID"
            break
        case 5:
            filterColumn = "supplierID"
    }

    window.location.href = `/goods/${filterColumn}/${filterText}`
})

document.getElementById('entity-add-button').addEventListener('click', () => {
    let inputPrice = document.getElementById('entity-price-text').value
    let inputLocation = document.getElementById('entity-location-text').value
    let inputExpirationDate = document.getElementById('entity-expiration-date-text').value

    if (!inputPrice | !inputLocation | !inputExpirationDate) {
        window.location.href = '/goods'
        return
    }

    let req = new XMLHttpRequest()
    let url = `/goods/${inputPrice}/${inputLocation}/${inputExpirationDate}`

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
        let url = `/remove/Goods/itemID/${e.target.id}/`
        
        req.open('POST', url)
        req.setRequestHeader('Content-Type', 'application/sql')
        req.send()

        setTimeout(() => {
            window.location.reload()
        }, 10)
    })
}