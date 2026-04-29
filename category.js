let categories = [];

function renderTable() {
  let table = document.getElementById("tableBody");
  table.innerHTML = "";

  categories.forEach((c, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${c.name}</td>
        <td>${c.slug}</td>
        <td>${c.sku}</td>
        <td>
          <span class="badge ${c.status ? 'bg-success' : 'bg-danger'}">
            ${c.status ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>${c.createdAt}</td>
        <td>${c.updatedAt}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editCategory(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCategory(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}


function saveCategory() {
  let name = document.getElementById("name").value;
  let slug = document.getElementById("slug").value;
  let sku = document.getElementById("sku").value;
  let status = document.getElementById("status").checked;
  let editIndex = document.getElementById("editIndex").value;

  if (!name || !slug || !sku) {
    alert("Please fill all fields");
    return;
  }

  let today = new Date().toLocaleDateString();

  let category = {
    name,
    slug,
    sku,
    status,
    createdAt: today,
    updatedAt: today
  };

  if (editIndex === "") {
    categories.push(category);
  } else {
    category.createdAt = categories[editIndex].createdAt;
    categories[editIndex] = category;
  }

  renderTable();
  resetForm();

  bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
}


function editCategory(index) {
  let c = categories[index];

  document.getElementById("name").value = c.name;
  document.getElementById("slug").value = c.slug;
  document.getElementById("sku").value = c.sku;
  document.getElementById("status").checked = c.status;
  document.getElementById("editIndex").value = index;

  new bootstrap.Modal(document.getElementById('categoryModal')).show();
}


function deleteCategory(index) {
  if (confirm("Delete this category?")) {
    categories.splice(index, 1);
    renderTable();
  }
}


function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("slug").value = "";
  document.getElementById("sku").value = "";
  document.getElementById("status").checked = false;
  document.getElementById("editIndex").value = "";
}


// INITIAL LOAD
renderTable();