// Отвечает за слайд-появление элементов
class ItcCollapse {
  constructor(target, duration, trigger) {
    this._target = target;
    this._duration = duration;
    this._trigger = trigger;
  }
  show() {
    const el = this._target;
    const trigger = this._trigger;
    if (
      el.classList.contains("collapsing") ||
      el.classList.contains("collapse_show")
    ) {
      return;
    }
    trigger.classList.add("trigger-active");
    el.classList.remove("collapse");
    const height = el.offsetHeight;
    el.style.height = 0;
    el.style.overflow = "hidden";
    el.style.transition = `height ${this._duration}ms ease`;
    el.classList.add("collapsing");
    el.offsetHeight;
    el.style.height = `${height}px`;
    window.setTimeout(() => {
      el.classList.remove("collapsing");
      el.classList.add("collapse");
      el.classList.add("collapse_show");
      el.style.height = "";
      el.style.transition = "";
      el.style.overflow = "";
    }, this._duration);
  }
  hide() {
    const el = this._target;
    const trigger = this._trigger;
    if (
      el.classList.contains("collapsing") ||
      !el.classList.contains("collapse_show")
    ) {
      return;
    }
    el.style.height = `${el.offsetHeight}px`;
    el.offsetHeight;
    el.style.height = 0;
    el.style.overflow = "hidden";
    el.style.transition = `height ${this._duration}ms ease`;
    el.classList.remove("collapse");
    el.classList.remove("collapse_show");
    el.classList.add("collapsing");
    trigger.classList.remove("trigger-active");
    window.setTimeout(() => {
      el.classList.remove("collapsing");
      el.classList.add("collapse");
      el.style.height = "";
      el.style.transition = "";
      el.style.overflow = "";
    }, this._duration);
  }
  toggle() {
    this._target.classList.contains("collapse_show")
      ? this.hide()
      : this.show();
  }
}

function headerHandler() {
  // Открытие меню и анимация бургера
  const headerBurger = document.querySelector(".header__burger");
  const headerMenu = document.querySelector(".header__menu");

  headerBurger.addEventListener("click", function () {
    headerBurger.classList.toggle("header__burger_active");
    headerMenu.classList.toggle("menu_active");
    document.querySelector("body").classList.toggle("lock");
  });
}

function sliderInit() {
  // Инициализация слайдеров
  // Слайдер на главной
  if (document.querySelector(".intro__slider")) {
    new Swiper(".intro__slider", {
      // slidesPerView: 2.9,
      slidesPerView: "auto",
      spaceBetween: 36,
      slidesPerGroup: 1,
      loop: true,
      speed: 550,
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
      },
      watchSlidesProgress: true,
      navigation: {
        nextEl: `.intro__next`,
        prevEl: `.intro__prev`,
      },
      on: {
        afterInit: (slider) => {
          slider.el.classList.add("slider-initialized");
        },
      },
      breakpoints: {
        // when window width is >= 300px
        300: {
          spaceBetween: 15,
        },
        // when window width is >= 768px
        768: {
          spaceBetween: 36,
        },
      },
    });
  }
  // Главный слайдер на странице "Медиа"
  if (document.querySelector(".media-intro__slider")) {
    new Swiper(".media-intro__slider", {
      slidesPerView: 1,
      loop: false,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
      },
      autoHeight: true,
      speed: 400,
      simulateTouch: false,
      navigation: {
        nextEl: ".media-intro__next",
        prevEl: ".media-intro__prev",
      },
      pagination: {
        el: ".media-intro__pagination",
        type: "bullets",
        clickable: true,
      },
      on: {
        afterInit: (slider) => {
          slider.el.classList.add("slider-initialized");
        },
      },
    });
  }

  // Второстепенные слайдеры на странице "Медиа"
  const mediaPhotoSliders = document.querySelectorAll(".media-photo__slider");
  if (mediaPhotoSliders.length) {
    for (let i = 0; i < mediaPhotoSliders.length; i++) {
      const mediaPhotoSlider = mediaPhotoSliders[i];
      const mediaPhotoWrapper = mediaPhotoSlider.closest(
        ".media-photo__wrapper"
      );
      const currentPlaceholder = mediaPhotoWrapper.querySelector(
        ".media-photo__current"
      );
      const totalPlaceholder = mediaPhotoWrapper.querySelector(
        ".media-photo__total"
      );

      const sliderModificator = `media-photo__slider_${i}`;
      const wrapperModificator = `media-photo__wrapper_${i}`;

      mediaPhotoWrapper.classList.add(wrapperModificator);
      mediaPhotoSlider.classList.add(sliderModificator);

      new Swiper(`.${sliderModificator}`, {
        slidesPerView: 4,
        loop: false,
        spaceBetween: 40,
        slidesPerGroup: 4,
        speed: 800,
        autoHeight: true,
        preloadImages: false,
        lazy: {
          loadPrevNext: true,
        },
        navigation: {
          nextEl: `.${wrapperModificator} .media-photo__arrow_next`,
          prevEl: `.${wrapperModificator} .media-photo__arrow_prev`,
        },
        on: {
          afterInit: (slider) => {
            slider.el.classList.add("slider-initialized");
            initFraction(slider, currentPlaceholder, totalPlaceholder);
          },
          slideChange: (slider) => {
            recalculateFraction(slider, currentPlaceholder);
          },
        },
        breakpoints: {
          // when window width is >= 300px
          300: {
            slidesPerView: 2,
            spaceBetween: 15,
            slidesPerGroup: 2,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
            slidesPerGroup: 3,
          },
          // when window width is >= 992px
          992: {
            slidesPerView: 4,
            spaceBetween: 40,
            slidesPerGroup: 4,
          },
        },
      });
    }
  }

  // Слайдер в блоке "Партнёры" на главной странице
  if (document.querySelector(".partners__slider")) {
    const partnersWrapper = document.querySelector(".partners__wrapper");
    const currentPlaceholder =
      partnersWrapper.querySelector(".fraction__current");
    const totalPlaceholder = partnersWrapper.querySelector(".fraction__total");

    new Swiper(".partners__slider", {
      slidesPerView: 4,
      loop: false,
      spaceBetween: 30,
      slidesPerGroup: 4,
      speed: 800,
      navigation: {
        nextEl: ".partners__arrow_next",
        prevEl: ".partners__arrow_prev",
      },
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
      },
      on: {
        afterInit: (slider) => {
          slider.el.classList.add("slider-initialized");
          initFraction(slider, currentPlaceholder, totalPlaceholder);
        },
        slideChange: (slider) => {
          recalculateFraction(slider, currentPlaceholder);
        },
      },
      breakpoints: {
        // when window width is >= 300px
        300: {
          slidesPerView: 1,
          spaceBetween: 15,
          slidesPerGroup: 1,
        },
        525: {
          slidesPerView: 2,
          spaceBetween: 20,
          slidesPerGroup: 2,
        },
        // when window width is >= 768px
        800: {
          slidesPerView: 3,
          spaceBetween: 20,
          slidesPerGroup: 3,
        },
        // when window width is >= 992px
        1100: {
          slidesPerView: 4,
          spaceBetween: 40,
          slidesPerGroup: 4,
        },
      },
    });
  }

  // Слайдеры в блоке "Новости" на странице мероприятий
  const competitionSliders = document.querySelectorAll(
    ".slider-competitions-news"
  );
  if (competitionSliders.length) {
    for (let i = 0; i < competitionSliders.length; i++) {
      const competitionSlider = competitionSliders[i];
      const wrapper = competitionSlider.closest(".competitions-news__outer");

      const sliderModificator = `slider-competitions-news_${i}`;
      const wrapperModificator = `competitions-news__outer_${i}`;

      competitionSlider.classList.add(sliderModificator);
      wrapper.classList.add(wrapperModificator);

      new Swiper(`.${sliderModificator}`, {
        slidesPerView: 1,
        loop: false,
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        preloadImages: false,
        lazy: {
          loadPrevNext: true,
        },
        autoHeight: true,
        speed: 400,
        simulateTouch: false,
        navigation: {
          nextEl: `.${wrapperModificator} .competitions-news__next`,
          prevEl: `.${wrapperModificator} .competitions-news__prev`,
        },
        pagination: {
          el: `.${wrapperModificator} .competitions-news__pagination`,
          type: "bullets",
          clickable: true,
        },
        on: {
          afterInit: (slider) => {
            slider.el.classList.add("slider-initialized");
          },
        },
      });
    }
  }

  // Слайдер в блоке "Медиацентр" на главной странце
  if (document.querySelector(".mediacenter__slider")) {
    new Swiper(".mediacenter__slider", {
      slidesPerView: 1,
      loop: false,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      preloadImages: false,
      lazy: {
        loadPrevNext: true,
      },
      autoHeight: true,
      speed: 400,
      simulateTouch: false,
      navigation: {
        nextEl: `.mediacenter__arrow_next`,
        prevEl: `.mediacenter__arrow_prev`,
      },
      on: {
        afterInit: (slider) => {
          slider.el.classList.add("slider-initialized");
        },
      },
    });
  }

  // Инициализация фракций
  function initFraction(slider, currentPlaceholder, totalPlaceholder) {
    currentPlaceholder.textContent = 1;
    totalPlaceholder.textContent = Math.ceil(
      slider.slides.length / slider.params.slidesPerGroup
    );
  }

  // Перерасчёт фракций
  function recalculateFraction(slider, currentPlaceholder) {
    const currentValue =
      Math.ceil(slider.realIndex / slider.params.slidesPerGroup) + 1;
    currentPlaceholder.textContent = currentValue;
  }
}

function infocenterSlideAppearing() {
  const triggerWrappers = document.querySelectorAll(
    ".sidebar-infocenter__row.sidebar-infocenter__row_has-trigger"
  );
  if (!triggerWrappers.length) return;

  for (let i = 0; i < triggerWrappers.length; i++) {
    const wrapper = triggerWrappers[i];
    const submenu = wrapper.querySelector(".sidebar-infocenter__collapse");
    const trigger = wrapper.querySelector(".sidebar-infocenter__trigger");
    const collapse = new ItcCollapse(submenu, 500, trigger);

    trigger.addEventListener("click", () => collapse.toggle());
  }
}

function lazyload() {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.05,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        } else if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute("data-srcset");
        }

        img.onload = () => {
          const wrapper = img.closest(".lazy-image-wrapper") || img;
          wrapper.classList.add("lazy-image-wrapper--loaded");
        };
        observer.unobserve(img);
      }
    });
  }, options);

  const lazyImages = document.querySelectorAll(
    ".lazy-image-wrapper img[data-src], .lazy-image-wrapper source[data-srcset]"
  );
  lazyImages.forEach((img) => observer.observe(img));
}

window.onload = function () {
  sliderInit();
  headerHandler();
  infocenterSlideAppearing();
  lazyload();
};
