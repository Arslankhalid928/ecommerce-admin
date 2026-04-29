let subcategories = [];

function renderTable() {
  let table = document.getElementById("tableBody");
  table.innerHTML = "";

  subcategories.forEach((s, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${s.name}</td>
        <td>${s.category}</td>
        <td>${s.slug}</td>
        <td>${s.sku}</td>
        <td>
          <span class="badge ${s.status ? 'bg-success' : 'bg-danger'}">
            ${s.status ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>${s.createdAt}</td>
        <td>${s.updatedAt}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editSub(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteSub(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function saveSub() {
  let name = document.getElementById("name").value;
  let category = document.getElementById("category").value;
  let slug = document.getElementById("slug").value;
  let sku = document.getElementById("sku").value;
  let status = document.getElementById("status").checked;
  let editIndex = document.getElementById("editIndex").value;

  if (!name || !slug || !sku) {
    alert("Fill all fields");
    return;
  }

  let today = new Date().toLocaleDateString();

  let sub = { name, category, slug, sku, status, createdAt: today, updatedAt: today };

  if (editIndex === "") {
    subcategories.push(sub);
  } else {
    sub.createdAt = subcategories[editIndex].createdAt;
    subcategories[editIndex] = sub;
  }

  renderTable();
  resetForm();
  bootstrap.Modal.getInstance(document.getElementById('subModal')).hide();
}

function editSub(index) {
  let s = subcategories[index];

  document.getElementById("name").value = s.name;
  document.getElementById("category").value = s.category;
  document.getElementById("slug").value = s.slug;
  document.getElementById("sku").value = s.sku;
  document.getElementById("status").checked = s.status;
  document.getElementById("editIndex").value = index;

  new bootstrap.Modal(document.getElementById('subModal')).show();
}

function deleteSub(index) {
  if (confirm("Delete this subcategory?")) {
    subcategories.splice(index, 1);
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

renderTable();