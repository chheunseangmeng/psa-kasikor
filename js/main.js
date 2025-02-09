// Function to toggle the menu visibility on mobile
function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('show'); // Toggle the 'show' class to display or hide the menu
}


// GSAP animations
gsap.from('.footer-logo', {
    opacity: 0,
    y: -50,
    duration: 1,
    delay: 0.5
  });
  
  gsap.from('.footer-links', {
    opacity: 0,
    x: -50,
    duration: 1,
    delay: 0.7
  });
  
  gsap.from('.footer-social', {
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.9
  });
  
  gsap.from('.footer-bottom', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 1.1
  });
  
  // Back to Top Button visibility on scroll
  const backToTop = document.getElementById("back-to-top");
  
  window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  };
  
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  