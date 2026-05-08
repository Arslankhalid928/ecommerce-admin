let subData = [];
let subTable;

function loadSubCategories() {
  fetch("https://dummyjson.com/products?limit=20")
    .then(res => res.json())
    .then(response => {
      subData = response.products.map(item => {
        return {
          name: item.title,
          category: item.category,
          slug: item.title.toLowerCase().split(' ').join('-'),
          sku: "SKU-" + Math.floor(Math.random() * 1000),
          status: true,
          date: new Date().toLocaleDateString()
        };
      });
      showTable();
    })
    .catch(err => {
      console.log("Fetch error:", err);
    });
}


function showTable() {
  let html = "";
  if ($.fn.DataTable.isDataTable('#dataTable')) {
    $('#dataTable').DataTable().destroy();
  }

  subData.forEach((item, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td><span class="badge bg-info text-dark">${item.category}</span></td>
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
          <button class="btn btn-warning btn-sm" onclick="editBtn(${i})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBtn(${i})">Delete</button>
        </td>
      </tr>`;
  });

  document.getElementById("tableBody").innerHTML = html;

  subTable = $('#dataTable').DataTable({
    dom: 'rtip',
    pageLength: 7
  });
}


function saveSub() {

  let n = document.getElementById("name").value.trim();
  let c = document.getElementById("category").value.trim();
  let s = document.getElementById("slug").value.trim();
  let sk = document.getElementById("sku").value.trim();
  let st = document.getElementById("status").checked;
  let id = document.getElementById("editIndex").value;


  if (n == "" || c == "" || s == "" || sk == "") {
    Swal.fire({
      title: "Opps!",
      text: "Please fill all the details first.",
      icon: "error",
      confirmButtonColor: "#d33"
    });
    return;
  }

  let obj = {
    name: n,
    category: c,
    slug: s,
    sku: sk,
    status: st,
    date: new Date().toLocaleDateString()
  };

  if (id === "") {

    subData.push(obj);
    Swal.fire("Added!", "New sub-category created.", "success");
  } else {

    subData[id] = obj;
    Swal.fire("Updated!", "Details changed successfully.", "success");
  }

  showTable();
  clearForm();
  $('#subModal').modal('hide');
}


function deleteBtn(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      subData.splice(index, 1);
      showTable();
      Swal.fire("Deleted!", "Record has been removed.", "success");
    }
  });
}


function editBtn(index) {
  let data = subData[index];
  document.getElementById("name").value = data.name;
  document.getElementById("category").value = data.category;
  document.getElementById("slug").value = data.slug;
  document.getElementById("sku").value = data.sku;
  document.getElementById("status").checked = data.status;
  document.getElementById("editIndex").value = index;

  $('#subModal').modal('show');
  swal.fire("Edit Sub-Category", "You can now edit the sub-category details.", "info");
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("category").value = "";
  document.getElementById("slug").value = "";
  document.getElementById("sku").value = "";
  document.getElementById("status").checked = false;
  document.getElementById("editIndex").value = "";
}

$(document).ready(function () {
  loadSubCategories();
  $("#customSearch").keyup(function () {
    if (subTable) subTable.search(this.value).draw();
  });
});
function logout() {
  localStorage.removeItem("admin_session");
  location.reload();
  window.location.href = "login.html";
}