
let table;
let products = JSON.parse(localStorage.getItem("full_metro_db")) || [];

$(document).ready(function(){
    
    if(!localStorage.getItem("admin_session")) {
        localStorage.setItem("admin_session", "ACTIVE-" + Math.random().toString(36).substr(2, 9));
    }

    table = $('#productTable').DataTable({
        dom: 'rtip',
        pageLength: 7
    });

    $('#searchBox').keyup(function(){
        table.search($(this).val()).draw();
    });

    $("#inpStatus").change(function(){
        $("#statusLabel").text(this.checked ? "Active" : "Inactive");
    });
 if(products.length === 0) fetchFullData();
    else renderUI();
});

function fetchFullData(){
   
    $.get("https://dummyjson.com/products", function(res){
        products = res.products.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            sku: "SKU-" + p.id + "-" + Math.floor(Math.random()*100),
            cost: (p.price * 0.75).toFixed(2),
            price: p.price,
            qty: p.stock,
            status: true
        }));
        updateStorage();
        Swal.fire("Data Sync", "All products loaded from API", "info");
    });
}

function generateSlug(text){
    let slug = text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    $("#inpSlug").val(slug);
}

function renderUI(){
    table.clear();
    products.forEach((p, i) => {
        table.row.add([
            p.id,
            `<b>${p.title}</b>`,
            `<span class="text-muted small">${p.slug}</span>`,
            `<code class="text-dark">${p.sku}</code>`,
            `$${p.price} <small class="d-block text-muted">Cost: $${p.cost}</small>`,
            p.qty,
            `<span class="badge ${p.status ? 'bg-success' : 'bg-secondary'}">${p.status ? 'Active' : 'Inactive'}</span>`,
            `<div class="text-end">
                <button class="btn btn-sm btn-outline-primary" onclick="openEdit(${i})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteData(${i})">Del</button>
            </div>`
        ]);
    });
    table.draw();
}

function saveData(){
    const idx = $("#editIdx").val();
    const data = {
        id: idx === "" ? Math.floor(Math.random() * 10000) : products[idx].id,
        title: $("#inpTitle").val(),
        slug: $("#inpSlug").val(),
        sku: $("#inpSKU").val(),
        cost: $("#inpCost").val(),
        price: $("#inpPrice").val(),
        qty: $("#inpQty").val(),
        status: $("#inpStatus").is(":checked")
    };

    if(!data.title || !data.sku || !data.price || !data.qty){
        Swal.fire("Missing Info", "Please fill all required fields", "error");
        return;
    }

    if(idx === "") products.unshift(data);
    else products[idx] = data;

    updateStorage();
    bootstrap.Modal.getInstance(productModal).hide();
    Swal.fire("Success", "Records updated in storage", "success");
}

function openEdit(i){
    $("#mTitle").text("Edit Product #" + products[i].id);
    $("#editIdx").val(i);
    $("#inpTitle").val(products[i].title);
    $("#inpSlug").val(products[i].slug);
    $("#inpSKU").val(products[i].sku);
    $("#inpCost").val(products[i].cost);
    $("#inpPrice").val(products[i].price);
    $("#inpQty").val(products[i].qty);
    $("#inpStatus").prop("checked", products[i].status).change();
    new bootstrap.Modal(productModal).show();
}

function deleteData(i){
    Swal.fire({
        title: "Delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#d33'
    }).then(res => {
        if(res.isConfirmed) {
            products.splice(i, 1);
            updateStorage();
            Swal.fire("Success", "Records deleted in storage", "success");
        }
    });
     
}

function updateStorage(){
    localStorage.setItem("full_metro_db", JSON.stringify(products));
    renderUI();
}

function clearForm(){
    $("#mTitle").text("Create New Product");
    $("#editIdx").val("");
    $(".modal-body input").not(':checkbox').val("");
    $("#inpStatus").prop("checked", true).change();
}
$(document).ready(function () {
  let table = $("#productTable").DataTable();

  
  $("#customSearch").on("keyup", function () {
    table.search(this.value).draw();
  });
});

function logout(){
    localStorage.removeItem("admin_session");
    location.reload();
    window.location.href = "login.html";
}
