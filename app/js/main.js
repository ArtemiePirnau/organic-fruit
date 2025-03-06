$(function () {
  // slider
  $(".about-us__slider").slick({
    prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button"><img src="./images/icons/prev.svg" alt="prev"></button>',
    nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"><img src="./images/icons/next.svg" alt="prev"></button>'
  })

  // starRating
  $(".about-us__rating").starRating({
    initialRating: 4.5,
    strokeColor: '#894A00',
    strokeWidth: 10,
    starSize: 25,
    emptyColor: '#fff',
    strokeColor: '#F1B90B',
    strokeWidth: 20
  });

  // burger
  $(".burger").on("click", function () {
    $(this).toggleClass("active");
    $(".menu__list").toggleClass("active");
    $(".menu").toggleClass("active");
  })
  AOS.init({ once: true });
});
