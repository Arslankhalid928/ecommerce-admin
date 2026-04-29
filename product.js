let products = [];

function renderTable() {
  let table = document.getElementById("tableBody");
  table.innerHTML = "";

  products.forEach((p, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.subCategory}</td>
        <td>${p.cost}</td>
        <td>${p.price}</td>
        <td>${p.qty}</td>
        <td>${p.sku}</td>
        <td>
          <span class="badge ${p.status ? 'bg-success' : 'bg-danger'}">
            ${p.status ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function saveProduct() {

  let name = document.getElementById("name").value;
  let cost = document.getElementById("cost").value;
  let price = document.getElementById("price").value;
  let qty = document.getElementById("qty").value;
  let category = document.getElementById("category").value;
  let subCategory = document.getElementById("subCategory").value;
  let sku = document.getElementById("sku").value;
  let status = document.getElementById("status").checked;
  let editIndex = document.getElementById("editIndex").value;

  if (!name || !cost || !price || !qty || !sku) {
    alert("Fill all fields");
    return;
  }

  let product = { name, cost, price, qty, category, subCategory, sku, status };

  if (editIndex === "") {
    products.push(product);
  } else {
    products[editIndex] = product;
  }

  renderTable();
  resetForm();

  bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
}

function editProduct(index) {
  let p = products[index];

  document.getElementById("name").value = p.name;
  document.getElementById("cost").value = p.cost;
  document.getElementById("price").value = p.price;
  document.getElementById("qty").value = p.qty;
  document.getElementById("category").value = p.category;
  document.getElementById("subCategory").value = p.subCategory;
  document.getElementById("sku").value = p.sku;
  document.getElementById("status").checked = p.status;

  document.getElementById("editIndex").value = index;

  new bootstrap.Modal(document.getElementById('productModal')).show();
}

function deleteProduct(index) {
  if (confirm("Delete product?")) {
    products.splice(index, 1);
    renderTable();
  }
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("cost").value = "";
  document.getElementById("price").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("sku").value = "";
  document.getElementById("status").checked = false;
  document.getElementById("editIndex").value = "";
}

renderTable();