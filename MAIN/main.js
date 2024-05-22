(() => {
  const swiper = new Swiper('.swiper', {
    pagination: {
      el: '.swiper-pagination',
    },
    spaceBetween: 80,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slidesPerView: 'auto',
    slidesOffsetAfter: 50,
    slidesOffsetBefore: 25,
  });
})();
