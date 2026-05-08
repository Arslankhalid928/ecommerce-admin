let catData = [];
let catTable;


function getCategories() {
  fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {

      let uniqueList = [...new Set(data.products.map(p => p.category))];

      catData = uniqueList.map(item => {
        return {
          name: item.charAt(0).toUpperCase() + item.slice(1),
          slug: item.toLowerCase().split(' ').join('-'),
          sku: "CAT-" + Math.floor(1000 + Math.random() * 9000),
          status: true,
          date: new Date().toLocaleDateString()
        };
      });

      refreshTable();
    })
    .catch(err => {
      console.log("Network error:", err);
      document.getElementById("tableBody").innerHTML = "<tr><td colspan='8'>Data load nahi ho saka</td></tr>";
    });
}


function refreshTable() {
  let rows = "";

  let i = 0;
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().destroy();
  }

  catData.forEach((item, index) => {
    rows += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.slug}</td>
        <td>${item.sku}</td>
        <td>
          <span class="badge ${item.status ? 'bg-success' : 'bg-danger'}">
            ${item.status ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>${item.date}</td>
        <td>${item.date}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editBtn(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBtn(${index})">Delete</button>
        </td>
      </tr>`;
  });

  document.getElementById("tableBody").innerHTML = rows;


  catTable = $('#dataTable').DataTable({
    dom: 'rtip',
    pageLength: 7
  });
}


function saveCategory() {
  let n = document.getElementById("name").value.trim();
  let s = document.getElementById("slug").value.trim();
  let sk = document.getElementById("sku").value.trim();
  let st = document.getElementById("status").checked;
  let id = document.getElementById("editIndex").value;


  if (n == "" || s == "" || sk == "") {
    Swal.fire("Missing!", "Please fill all fields", "warning");
    return;
  }

  let obj = {
    name: n,
    slug: s,
    sku: sk,
    status: st,
    date: new Date().toLocaleDateString()
  };

  if (id === "") {
    catData.push(obj);
    Swal.fire("Success", "Category has been added", "success");
  } else {
    catData[id] = obj;
    Swal.fire("Updated", "Category details changed", "success");
  }

  refreshTable();
  resetForm();
  $('#categoryModal').modal('hide');
}


function editBtn(index) {
  let item = catData[index];
  document.getElementById("name").value = item.name;
  document.getElementById("slug").value = item.slug;
  document.getElementById("sku").value = item.sku;
  document.getElementById("status").checked = item.status;
  document.getElementById("editIndex").value = index;

  $('#categoryModal').modal('show');
  Swal.fire("Edit Category", "You can now edit the category details.", "info");
}


function deleteBtn(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "Delete this category?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      catData.splice(index, 1);
      refreshTable();
      Swal.fire("Deleted!", "Category removed.", "success");
    }
  });
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("slug").value = "";
  document.getElementById("sku").value = "";
  document.getElementById("status").checked = false;
  document.getElementById("editIndex").value = "";
}

$(document).ready(function () {
  getCategories();

  $('#customSearch').keyup(function () {
    if (catTable) catTable.search(this.value).draw();
  });
});

function logout() {
  localStorage.removeItem("admin_session");
  window.location.href = "login.html";
}