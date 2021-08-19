$(".show-side-bar").click(function () {
  console.log("open");
  $(".sidebar").animate({ marginLeft: "0" });
});

$(".hide-side-bar").click(function () {
  console.log("close");
  $(".sidebar").animate({
    marginLeft: "-100%",
  });
});

$(".btn-payment").click(function () {
  console.log("close");
  $(".sidebar").animate({
    marginLeft: "-100%",
  });
});

$(".modal-close").click(function () {
  console.log("open");
  $(".sidebar").animate({ marginLeft: "0" });
});
