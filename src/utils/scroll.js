export function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
  
    const header = document.querySelector(".header");
    const headerHeight = header ? header.offsetHeight : 0;
  
    const elementTop = el.getBoundingClientRect().top;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
    const scrollTo = scrollTop + elementTop - headerHeight - 10;
  
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth"
    });
  }