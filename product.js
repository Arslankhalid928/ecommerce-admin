

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


$(document).on("click", ".edit", function () {

  selectedRow = $(this).closest("tr");

  $("#editTitle").val(selectedRow.find("td:eq(1)").text());
  $("#editSlug").val(selectedRow.find("td:eq(2)").text());
  $("#editPrice").val(selectedRow.find("td:eq(3)").text());
  $("#editCost").val(selectedRow.find("td:eq(4)").text());
  $("#editSKU").val(selectedRow.find("td:eq(5)").text());

  let modal = new bootstrap.Modal(document.getElementById('editModal'));
  modal.show();
});


$("#saveBtn").click(function () {

  selectedRow.find("td:eq(1)").text($("#editTitle").val());
  selectedRow.find("td:eq(2)").text($("#editSlug").val());
  selectedRow.find("td:eq(3)").text($("#editPrice").val());
  selectedRow.find("td:eq(4)").text($("#editCost").val());
  selectedRow.find("td:eq(5)").text($("#editSKU").val());

  Swal.fire({
    icon: 'success',
    title: 'Updated!',
    text: 'Product updated successfully'
  });

  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
});


$(document).on("click", ".delete", function () {

  let row = $(this).closest("tr");

  Swal.fire({
    title: "Are you sure?",
    text: "This product will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {

    if (result.isConfirmed) {
      row.remove();

      Swal.fire("Deleted!", "Product removed successfully", "success");
    }

  });

});



function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

