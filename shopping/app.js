let products = [];

function toShort(str, max) {
  if (str.length > max) {
    return str.substring(0, max) + "....";
  } else {
    return str;
  }
}

function toShow(x) {
  $("#products").empty();
  x.map((product) => {
    $("#products").append(`
    <div class="col-12 col-md-4 col-lg-4">
      <div class="card p-1 mb-3">
        <div class="card-body">
          <img src="${product.image}" alt="" class="rounded">
          <p class="card-title text-nowrap overflow-hidden text-info font-weight-bold">${toShort(
            product.title,
            15
          )}
          </p>
          <small class="">${toShort(String(product.description), 90)}</small>
          <div class=" d-flex mt-3 justify-content-between align-item-center">
              <span class="font-weight-bold">${product.price}</span>
              <button class="btn btn-info btn-sm rounded add-to-cart" data-id = "${
                product.id
              }">
              <i class="fas fa-cart-plus"></i></button>
          </div>
        </div>
      </div>
    </div>             
  `);
  });
}

function cartTotal() {
  let count = $(".item-in-cart-cost").length;
  $(".item-in-cart-count").html(count);
  $(".cart-count").html(count);
  if (count > 0) {
    let totalCost = $(".item-in-cart-cost")
      .toArray()
      .map((el) => el.innerHTML)
      .reduce((x, y) => Number(x) + Number(y));
    $(".total").html(`
            <div class="d-flex searchbar justify-content-between font-weight-bold p-3">
                <h4 class="">Total</h4>
                <h4>$<span class="cart-cost-total">${parseFloat(
                  totalCost
                ).toFixed(2)}</span></h4>
            </div>
            `);
  } else {
    $(".total").html("empty items");
  }
}

//getting prducts items

$.get("https://fakestoreapi.com/products/", function (data) {
  products = data;
  console.log(data);
  toShow(products);
});

//getting product categories
$.get("https://fakestoreapi.com/products/categories", function (data) {
  data.map((cat) => $("#category").append(`<option>${cat}`));
});

//search item by input when user type
$("#search").on("keyup", function () {
  console.log("hello");
  let keyword = $(this).val().toLowerCase();
  // $(".product").filter(function () {
  //     $(this).toggle($(this).text().toLocaleLowerCase().indexOf(keyword) > -1);

  // });

  //trimp the string to filter space input from user
  if (keyword.trim().length) {
    let filterProducts = products.filter((product) => {
      if (
        product.title.toLowerCase().indexOf(keyword) > -1 ||
        product.description.toLowerCase().indexOf(keyword) > -1 ||
        product.price == keyword
      ) {
        return product;
      }
    });
    // console.log(filterProducts);
    toShow(filterProducts);
  }

  //or
});

//selector item click event

$("#category").on("change", function () {
  let selectedCategory = $(this).val();
  console.log(selectedCategory);
  if (selectedCategory != 0) {
    let filterProducts = products.filter((product) => {
      if (product.category === selectedCategory) {
        return product;
      }
    });
    toShow(filterProducts);
  } else {
    toShow(products);
  }
});

//finding the add-to-cart button dynamically to get action from all items clicking
$("#products").delegate(".add-to-cart", "click", function () {
  let currentItemId = $(this).attr("data-id"); //jquery attribute selector
  console.log(currentItemId);
  let productInfo = products.filter((el) => el.id == currentItemId)[0];
  console.log(productInfo);
  if (
    $(".item-in-cart")
      .toArray()
      .map((el) => el.getAttribute("data-id"))
      .includes(currentItemId)
  ) {
    alert("Already added");
  } else {
    $("#cart").append(`
            <div class="card mb-2 border-0 item-in-cart" data-id = "${productInfo.id}"">
                <div class="card-body">
                <img src="${productInfo.image}" class="img-in-cart rounded" alt="">

                    <div class="d-flex justify-content-between">
                    <p class="p-2">
                    ${productInfo.title}
                </p>
                        <button class="btn btn-sm remove-from-cart">
                            <i class="fas fa-trash-alt"></i>
                        </button>

                    </div>
                  
                    <div class="d-flex justify-content-between align-item-center">
                        <div class="form-row d-flex">
                            <button class="btn btn-sm quantity-minus">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control w-50 mx-2 py-0 quantity" unitPrice= "${productInfo.price}" value="1" min="1">
                            <button class="btn btn-sm quantity-plus">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <p>$<span class="item-in-cart-cost">${productInfo.price}</span></p>
                        </div>
                        <hr>
                    </div>
                </div>
            
            `);
  }
  cartTotal();
});

$("#cart").delegate(".remove-from-cart", "click", function () {
  $(this).parentsUntil("#cart").remove();
  cartTotal();
});

$("#cart").delegate(".quantity-plus", "click", function () {
  let q = $(this).siblings(".quantity").val();
  let p = $(this).siblings(".quantity").attr("unitPrice");
  console.log(q);
  console.log(p);
  let newQ = Number(q) + 1;
  let newCost = p * newQ;
  console.log(Number(q) * p);

  $(this).siblings(".quantity").val(newQ);
  $(this)
    .parent()
    .siblings("p")
    .find(".item-in-cart-cost")
    .html(newCost.toFixed(2));
  cartTotal();
});

$("#cart").delegate(".quantity-minus", "click", function () {
  let q = $(this).siblings(".quantity").val();
  let p = $(this).siblings(".quantity").attr("unitPrice");
  console.log(q);
  console.log(p);
  if (q > 1) {
    let newQ = Number(q) - 1;
    let newCost = p * newQ;
    console.log(Number(q) * p);

    $(this).siblings(".quantity").val(newQ);
    $(this)
      .parent()
      .siblings("p")
      .find(".item-in-cart-cost")
      .html(newCost.toFixed(2));
    cartTotal();
  }
});
$("#cart").delegate(".quantity", "keyup change", function () {
  let q = $(this).val();
  let p = $(this).attr("unitPrice");
  console.log(q);
  console.log(p);
  if (q > 1) {
    let newQ = Number(q);
    let newCost = p * newQ;
    console.log(Number(q) * p);

    $(this).siblings(".quantity").val(newQ);
    $(this)
      .parent()
      .siblings("p")
      .find(".item-in-cart-cost")
      .html(newCost.toFixed(2));
    cartTotal();
  } else {
    alert("more than one");
  }
});
