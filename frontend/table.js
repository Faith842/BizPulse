const expenseform = document.getElementById('expenseform')
const expensetablebody = document.querySelector('#expensetable tbody')
let expenseeditindex = null

expenseform.addEventListener('submit', (e) => {
  e.preventDefault()

  const category = document.getElementById('category').value
  const product = document.getElementById('product-name').value
  const description = document.getElementById('description').value
  const date = document.getElementById('date').value
  const amount = document.getElementById('amount').value
  const payment = document.getElementById('payment-method').value

  if (expenseeditindex === null) {
    addexpenserow(category, product, description, date, amount, payment)
  } else {
    const row = expensetablebody.children[expenseeditindex]
    row.children[0].textContent = category
    row.children[1].textContent = product
    row.children[2].textContent = description
    row.children[3].textContent = date
    row.children[4].textContent = amount
    row.children[5].textContent = payment

    expenseeditindex = null
    expenseform.querySelector('button[type="submit"]').textContent = 'submit'
  }

  expenseform.reset()
})

function addexpenserow(category, product, description, date, amount, payment) {
  const row = document.createElement('tr')
  row.innerHTML = `
    <td>${category}</td>
    <td>${product}</td>
    <td>${description}</td>
    <td>${date}</td>
    <td>${amount}</td>
    <td>${payment}</td>
    <td class="actions">
      <button onclick="editexpenserow(this)">edit</button>
      <button onclick="deleteexpenserow(this)">remove</button>
    </td>
  `
  expensetablebody.appendChild(row)
}

window.editexpenserow = function (button) {
  const row = button.closest('tr')
  expenseeditindex = Array.from(expensetablebody.children).indexOf(row)

  document.getElementById('category').value = row.children[0].textContent
  document.getElementById('product-name').value = row.children[1].textContent
  document.getElementById('description').value = row.children[2].textContent
  document.getElementById('date').value = row.children[3].textContent
  document.getElementById('amount').value = row.children[4].textContent
  document.getElementById('payment-method').value = row.children[5].textContent

  expenseform.querySelector('button[type="submit"]').textContent = 'update'
}

window.deleteexpenserow = function (button) {
  const row = button.closest('tr')
  expensetablebody.removeChild(row)
}

const salesform = document.getElementById('salesform')
const salestablebody = document.querySelector('#salestable tbody')
let saleseditindex = null

salesform.addEventListener('submit', (e) => {
  e.preventDefault()

  const date = document.getElementById('date').value
  const product = document.getElementById('product-name').value
  const description = document.getElementById('description').value
  const quantity = document.getElementById('quantity').value
  const price = document.getElementById('price').value
  const payment = document.getElementById('payment-method').value
  const amount = document.getElementById('amount').value

  if (saleseditindex === null) {
    addsalesrow(date, product, description, quantity, price, payment, amount)
  } else {
    const row = salestablebody.children[saleseditindex]
    row.children[0].textContent = date
    row.children[1].textContent = product
    row.children[2].textContent = description
    row.children[3].textContent = quantity
    row.children[4].textContent = price
    row.children[5].textContent = payment
    row.children[6].textContent = amount

    saleseditindex = null
    salesform.querySelector('button[type="submit"]').textContent = 'save record'
  }

  salesform.reset()
})

function addsalesrow(date, product, description, quantity, price, payment, amount) {
  const row = document.createElement('tr')
  row.innerHTML = `
    <td>${date}</td>
    <td>${product}</td>
    <td>${description}</td>
    <td>${quantity}</td>
    <td>${price}</td>
    <td>${payment}</td>
    <td>${amount}</td>
    <td class="actions">
      <button onclick="editsalesrow(this)">edit</button>
      <button onclick="deletesalesrow(this)">remove</button>
    </td>
  `
  salestablebody.appendChild(row)
}

window.editsalesrow = function (button) {
  const row = button.closest('tr')
  saleseditindex = Array.from(salestablebody.children).indexOf(row)

  document.getElementById('date').value = row.children[0].textContent
  document.getElementById('product-name').value = row.children[1].textContent
  document.getElementById('description').value = row.children[2].textContent
  document.getElementById('quantity').value = row.children[3].textContent
  document.getElementById('price').value = row.children[4].textContent
  document.getElementById('payment-method').value = row.children[5].textContent
  document.getElementById('amount').value = row.children[6].textContent

  salesform.querySelector('button[type="submit"]').textContent = 'update'
}

window.deletesalesrow = function (button) {
  const row = button.closest('tr')
  salestablebody.removeChild(row)
}

// ------------------ stock form ------------------
const stockform = document.getElementById('stockform')
const stocktablebody = document.querySelector('#stocktable tbody')
let stockeditindex = null

stockform.addEventListener('submit', (e) => {
  e.preventDefault()

  const product = document.getElementById('product-name').value
  const credit = document.getElementById('credit').value
  const cp = document.getElementById('cp').value
  const sp = document.getElementById('sp').value
  const quantity = document.getElementById('quantity').value
  const pm = document.getElementById('profit-margin').value

  if (stockeditindex === null) {
    addstockrow(product, credit, cp, sp, quantity, pm)
  } else {
    const row = stocktablebody.children[stockeditindex]
    row.children[0].textContent = product
    row.children[1].textContent = credit
    row.children[2].textContent = cp
    row.children[3].textContent = sp
    row.children[4].textContent = quantity
    row.children[5].textContent = pm

    stockeditindex = null
    stockform.querySelector('button[type="submit"]').textContent = 'submit'
  }

  stockform.reset()
})

function addstockrow(product, credit, cp, sp, quantity, pm) {
  const row = document.createElement('tr')
  row.innerHTML = `
    <td>${product}</td>
    <td>${credit}</td>
    <td>${cp}</td>
    <td>${sp}</td>
    <td>${quantity}</td>
    <td>${pm}</td>
    <td class="actions">
      <button onclick="editstockrow(this)">edit</button>
      <button onclick="deletestockrow(this)">remove</button>
    </td>
  `
  stocktablebody.appendChild(row)
}

window.editstockrow = function (button) {
  const row = button.closest('tr')
  stockeditindex = Array.from(stocktablebody.children).indexOf(row)

  document.getElementById('product-name').value = row.children[0].textContent
  document.getElementById('credit').value = row.children[1].textContent
  document.getElementById('cp').value = row.children[2].textContent
  document.getElementById('sp').value = row.children[3].textContent
  document.getElementById('quantity').value = row.children[4].textContent
  document.getElementById('profit-margin').value = row.children[5].textContent

  stockform.querySelector('button[type="submit"]').textContent = 'update'
}

window.deletestockrow = function (button) {
  const row = button.closest('tr')
  stocktablebody.removeChild(row)
}
