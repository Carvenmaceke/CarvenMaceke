(function() {
  "use strict";

  window.addEventListener('load', () => {
    on_page_load()
  });

  /**
   * Function gets called when page is loaded.
   */
  function on_page_load() {
    // Initialize On-scroll Animations
    AOS.init({
      anchorPlacement: 'top-left',
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      disable: 'mobile'
    });

    // Initialize the CV download gate (email request -> access code -> download)
    init_cv_gate();
  }

  /**
   * CV Download Gate
   * Step 1: visitor submits their email via a Netlify Form (emails the site owner).
   * Step 2: visitor enters the access code the owner sends them, unlocking the real download.
   */
  function init_cv_gate() {
    const CV_ACCESS_CODE = "20212024";
    const CV_FILE = "CarvenMaceke_Resume.pdf";
    const OWNER_EMAIL = "carvenmaceke9@gmail.com";

    const modalEl = document.getElementById('cvGateModal');
    if (!modalEl) return; // gate not present on this page

    const emailForm = document.getElementById('cvEmailForm');
    const emailInput = document.getElementById('cvEmail');
    const codeStep = document.getElementById('cvCodeStep');
    const codeInput = document.getElementById('cvCode');
    const codeError = document.getElementById('cvCodeError');
    const unlockBtn = document.getElementById('cvUnlockBtn');

    // Step 1: open the visitor's own email app, addressed to the site owner,
    // with the visitor's email included in the message body.
    emailForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const visitorEmail = emailInput.value.trim();
      const subject = 'CV Download Request';
      const body =
        'Hi Carven,\n\nI would like to download your CV from your portfolio site.\n\nMy email address: ' +
        visitorEmail +
        '\n\nPlease send me the access code.';

      const mailtoLink =
        'mailto:' + OWNER_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailtoLink;

      emailForm.style.display = 'none';
      codeStep.style.display = 'block';
    });

    // Step 2: check the access code, then trigger the real download
    unlockBtn.addEventListener('click', function () {
      const entered = codeInput.value.trim();
      if (entered === CV_ACCESS_CODE) {
        codeError.style.display = 'none';

        const link = document.createElement('a');
        link.href = CV_FILE;
        link.download = CV_FILE;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
      } else {
        codeError.style.display = 'block';
      }
    });

    // Reset the modal back to step 1 whenever it's closed
    modalEl.addEventListener('hidden.bs.modal', function () {
      emailForm.reset();
      emailForm.style.display = 'block';
      codeStep.style.display = 'none';
      codeInput.value = '';
      codeError.style.display = 'none';
    });
  }

  /**
   * Navbar effects and scrolltop buttons upon scrolling
   */
  const navbar = document.getElementById('header-nav')
  var body = document.getElementsByTagName("body")[0]
  const scrollTop = document.getElementById('scrolltop')
  window.onscroll = () => {
    if (window.scrollY > 0) {
      navbar.classList.add('fixed-top', 'shadow-sm')
      body.style.paddingTop = navbar.offsetHeight + "px"
      scrollTop.style.visibility = "visible";
      scrollTop.style.opacity = 1;
    } else {
      navbar.classList.remove('fixed-top', 'shadow-sm')
      body.style.paddingTop = "0px"
      scrollTop.style.visibility = "hidden";
      scrollTop.style.opacity = 0;
    }
  };

  /**
   * Masonry Grid
   */
  var elem = document.querySelector('.grid');
  if(elem) {
    imagesLoaded(elem, function() {
      new Masonry(elem, {
        itemSelector: '.grid-item',
        percentPosition: true,
        horizontalOrder: true
      });
    })
  }

  /**
   * Big Picture Popup for images and videos
   */
   document.querySelectorAll("[data-bigpicture]").forEach((function(e) {
     e.addEventListener("click", (function(t){
       t.preventDefault();
       const data =JSON.parse(e.dataset.bigpicture)
       BigPicture({
        el: t.target,
        ...data
      })
     })
    )
  }))

  /**
   * Big Picture Popup for Photo Gallary
   */
   document.querySelectorAll(".bp-gallery a").forEach((function(e) {
    var caption = e.querySelector('figcaption')
    var img = e.querySelector('img')
    // set the link present on the item to the caption in full view
    img.dataset.caption = '<a class="link-light" target="_blank" href="' + e.href + '">' + caption.innerHTML + '</a>';
    window.console.log(caption, img)
     e.addEventListener("click", (function(t){
       t.preventDefault();
       BigPicture({
        el: t.target,
        gallery: '.bp-gallery',
      })
     })
    )
  }))

  // Add your javascript here


})();