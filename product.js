let selectedRow;


if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}


$.get("https://dummyjson.com/products", function (data) {

  data.products.forEach(p => {

    let slug = p.title.toLowerCase().replaceAll(" ", "-");

    $("#myTable tbody").append(`
        <tr>
            <td>${p.id}</td>
            <td>${p.title}</td>
            <td>${slug}</td>
            <td>${p.price}</td>
            <td>${p.price - 50}</td>
            <td>SKU-${p.id}</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
                <button class="edit btn btn-warning btn-sm">Edit</button>
                <button class="delete btn btn-danger btn-sm">Delete</button>
            </td>
        </tr>
        `);
  });

  $("#myTable").DataTable();
});


$("#addBtn").click(function () {

  let title = $("#addTitle").val();
  let price = $("#addPrice").val();

  $.ajax({
    url: "https://dummyjson.com/products/add",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ title, price }),

    success: function (res) {

      $("#myTable tbody").append(`
            <tr>
                <td>${res.id}</td>
                <td>${res.title}</td>
                <td>${res.title.toLowerCase().replaceAll(" ", "-")}</td>
                <td>${res.price}</td>
                <td>${res.price - 50}</td>
                <td>SKU-${res.id}</td>
                <td><span class="badge bg-success">Active</span></td>
                <td>
                    <button class="edit btn btn-warning btn-sm">Edit</button>
                    <button class="delete btn btn-danger btn-sm">Delete</button>
                </td>
            </tr>
            `);

      Swal.fire("Added!", "Product created", "success");

      bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
    }
  });
});



$(document).on("click", ".edit", function () {

  selectedRow = $(this).closest("tr");

  $("#editTitle").val(selectedRow.find("td:eq(1)").text());
  $("#editSlug").val(selectedRow.find("td:eq(2)").text());
  $("#editPrice").val(selectedRow.find("td:eq(3)").text());
  $("#editCost").val(selectedRow.find("td:eq(4)").text());
  $("#editSKU").val(selectedRow.find("td:eq(5)").text());

  new bootstrap.Modal(document.getElementById('editModal')).show();
});



$("#saveBtn").click(function () {

  let id = selectedRow.find("td:eq(0)").text();

  $.ajax({
    url: `https://dummyjson.com/products/${id}`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      title: $("#editTitle").val(),
      price: $("#editPrice").val()
    }),

    success: function (res) {

      selectedRow.find("td:eq(1)").text(res.title);
      selectedRow.find("td:eq(3)").text(res.price);

      Swal.fire("Updated!", "Product updated", "success");

      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    }
  });
});



$(document).on("click", ".delete", function () {

  let row = $(this).closest("tr");
  let id = row.find("td:eq(0)").text();

  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true
  }).then(result => {

    if (result.isConfirmed) {

      $.ajax({
        url: `https://dummyjson.com/products/${id}`,
        method: "DELETE",

        success: function () {
          row.remove();
          Swal.fire("Deleted!", "", "success");
        }
      });

    }

  });
});



function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

