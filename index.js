document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.querySelector("body");   

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    body.classList.toggle("menu-open");
  });

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      body.classList.remove("menu-open");
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for navbar height
          behavior: "smooth" 
        });
      }
    });
  });

  // Active section highlighting based on scroll position
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNavLink() {
    let scrollPosition = window.scrollY + 100; // Adding offset

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // Initial call to highlight the correct section
  highlightNavLink();

  // Highlight active section on scroll
  window.addEventListener("scroll", highlightNavLink);

  // Theme Toggle Functionality
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const htmlElement = document.documentElement;
  const themeIcon = themeToggleBtn.querySelector("i");

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    htmlElement.className = savedTheme;
    updateThemeIcon(savedTheme);
  } else {
    // Check for system preference
    const prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (prefersDarkScheme) {
      htmlElement.classList.add("dark-mode");
      htmlElement.classList.remove("light-mode");
      updateThemeIcon("dark-mode");
    }
  }

  // Toggle theme when button is clicked
  themeToggleBtn.addEventListener("click", function () {
    if (htmlElement.classList.contains("dark-mode")) {
      htmlElement.classList.remove("dark-mode");
      htmlElement.classList.add("light-mode");
      localStorage.setItem("theme", "light-mode");
      updateThemeIcon("light-mode");
    } else {
      htmlElement.classList.remove("light-mode");
      htmlElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark-mode");
      updateThemeIcon("dark-mode");
    }
  });

  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (theme === "dark-mode") {
      themeIcon.className = "fas fa-sun";
    } else {
      themeIcon.className = "fas fa-moon";
    }
  }

  // Form submission handling with Google Sheets integration
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const contact = document.getElementById("Contact").value;
      const message = document.getElementById("message").value;

      // Show loading state
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = "";
      submitBtn.classList.add("loading");

      // Google Sheets script URL - you'll replace this with your actual script URL
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbw8gB2IgMsizg4wmi2c7lgc0q6gdTKS5mNLIyofrGkLrulwW5rbdcfiSmdeXTPxlMw7/exec";

      // Create form data to send
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contact", contact);
      formData.append("message", message);
      formData.append("date", new Date().toLocaleString());

      // Send data to Google Sheets
      fetch(scriptURL, { method: "POST", body: formData })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success!", data);

          // Hide loading state
          submitBtn.textContent = originalBtnText;
          submitBtn.classList.remove("loading");

          // Show success message
          formMessage.textContent = "Form submitted Successfully.Thank You for showing your interest!.";
          formMessage.className = "form-message success";

          // Reset form
          contactForm.reset();

          // Hide success message after 5 seconds
          setTimeout(() => {
            formMessage.className = "form-message";
          }, 5000);
        })
        .catch((error) => {
          console.error("Error!", error.message);

          // Hide loading state
          submitBtn.textContent = originalBtnText;
          submitBtn.classList.remove("loading");

          // Show error message
          formMessage.textContent =
            "Something went wrong.Please try again later.";
          formMessage.className = "form-message error";

          // Hide error message after 5 seconds
          setTimeout(() => {
            formMessage.className = "form-message";
          }, 5000);
        });
    });
  }

  // Add animation to skills section
  const skillItems = document.querySelectorAll(".skill-item");

  skillItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    item.style.transitionDelay = `${index * 0.1}s`;
  });

  // Intersection Observer for animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate skill items when skills section is visible
          if (entry.target.id === "skills") {
            skillItems.forEach((item) => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            });
          }

          // Add animation class to the section
          entry.target.classList.add("animate");

          // Stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe all sections for animations
  sections.forEach((section) => {
    observer.observe(section);
  });
});
    