// redirects to a url which contain the parameters (the user input) - activated when user presses the filter button
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

    window.location.href = `/suppliers-goods/${filterColumn}/${filterText}`
})
// redirects to a url which contain the parameters (the user input) - activated when user presses the add button
// to be received by GET
document.getElementById('entity-add-button').addEventListener('click', () => {
    console.log("do something")
    let selectSupplierFk = document.getElementById('supplier-fk-input')
    let inputSupplierKey = selectSupplierFk.options[selectSupplierFk.selectedIndex].value
    let selectGoodFk = document.getElementById('good-fk-input')
    let inputGoodKey = selectGoodFk.options[selectGoodFk.selectedIndex].value

    let req = new XMLHttpRequest()
    let url = `/suppliers-goods/${inputSupplierKey}/${inputGoodKey}`

    req.open('POST', url)
    req.addEventListener('load', (event) => {
        if (event.target.status === 200) {
            window.location.reload()
        }
    })
    req.setRequestHeader('Content-Type', 'application/sql')
    req.send()
})
// sends a req with the URL that contains the target ID
let buttons = document.getElementsByName('entity-remove-button')
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
        let req = new XMLHttpRequest()
        let url = `/remove/SupplierGoods/itemID/${e.target.id}/`
        
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