document.addEventListener("DOMContentLoaded", () => {
  let mouseX = 0
  let mouseY = 0
  let isMouseActive = false

  function createAnimatedPoints() {
    const pointsContainer = document.getElementById("animated-points")
    const numberOfPoints = 80 // Increased from 50 to 80

    for (let i = 0; i < numberOfPoints; i++) {
      const point = document.createElement("div")
      point.className = "animated-point"

      // Random position
      point.style.left = Math.random() * 100 + "%"
      point.style.top = Math.random() * 100 + "%"

      // Random animation delay
      point.style.animationDelay = Math.random() * 8 + "s"

      // Random size variation
      const size = 2 + Math.random() * 3 // 2px to 5px
      point.style.width = size + "px"
      point.style.height = size + "px"

      // Random opacity
      point.style.opacity = 0.3 + Math.random() * 0.7

      pointsContainer.appendChild(point)
    }
  }

  function createInteractivePoints() {
    const pointsContainer = document.getElementById("animated-points")
    const interactivePoints = 15

    for (let i = 0; i < interactivePoints; i++) {
      const point = document.createElement("div")
      point.className = "animated-point interactive-point"
      point.style.left = Math.random() * 100 + "%"
      point.style.top = Math.random() * 100 + "%"
      point.style.animationDelay = Math.random() * 3 + "s"

      // Mark as interactive for mouse following
      point.dataset.interactive = "true"
      point.dataset.speed = (0.02 + Math.random() * 0.03).toString()

      pointsContainer.appendChild(point)
    }
  }

  createAnimatedPoints()
  createInteractivePoints()

  // Track mouse movement for background effect
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100
    mouseY = (e.clientY / window.innerHeight) * 100

    document.documentElement.style.setProperty("--mouse-x", mouseX + "%")
    document.documentElement.style.setProperty("--mouse-y", mouseY + "%")

    if (!isMouseActive) {
      document.body.classList.add("mouse-active")
      isMouseActive = true
    }

    const floatingElements = document.querySelectorAll(".floating-element")
    floatingElements.forEach((element, index) => {
      const speed = (index + 1) * 0.02
      const x = (e.clientX - window.innerWidth / 2) * speed
      const y = (e.clientY - window.innerHeight / 2) * speed
      element.style.transform = `translate(${x}px, ${y}px)`
    })

    const interactivePoints = document.querySelectorAll(".animated-point[data-interactive='true']")
    interactivePoints.forEach((point) => {
      const speed = Number.parseFloat(point.dataset.speed)
      const x = (e.clientX - window.innerWidth / 2) * speed
      const y = (e.clientY - window.innerHeight / 2) * speed
      point.style.transform = `translate(${x}px, ${y}px) scale(1.2)`
    })
  })

  // Hide effect when mouse leaves window
  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("mouse-active")
    isMouseActive = false

    const interactivePoints = document.querySelectorAll(".animated-point[data-interactive='true']")
    interactivePoints.forEach((point) => {
      point.style.transform = "translate(0, 0) scale(1)"
    })
  })

  function createRipple(event) {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const ripple = document.createElement("span")
    ripple.classList.add("ripple")
    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"

    button.appendChild(ripple)

    // Remove ripple after animation completes
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    }, 600)
  }

  // Add ripple effect to all buttons
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", createRipple)
  })

  // Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const body = document.querySelector("body")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
    body.classList.toggle("menu-open")
  })

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      body.classList.remove("menu-open")
    })
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for navbar height
          behavior: "smooth",
        })
      }
    })
  })

  // Active section highlighting based on scroll position
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-link")

  function highlightNavLink() {
    const scrollPosition = window.scrollY + 100 // Adding offset

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  }

  // Initial call to highlight the correct section
  highlightNavLink()

  // Highlight active section on scroll
  window.addEventListener("scroll", highlightNavLink)

  // Theme Toggle Functionality
  const themeToggleBtn = document.getElementById("theme-toggle-btn")
  const htmlElement = document.documentElement
  const themeIcon = themeToggleBtn.querySelector("i")

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme) {
    htmlElement.className = savedTheme
    updateThemeIcon(savedTheme)
  } else {
    // Check for system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (prefersDarkScheme) {
      htmlElement.classList.add("dark-mode")
      htmlElement.classList.remove("light-mode")
      updateThemeIcon("dark-mode")
    }
  }

  // Toggle theme when button is clicked
  themeToggleBtn.addEventListener("click", () => {
    if (htmlElement.classList.contains("dark-mode")) {
      htmlElement.classList.remove("dark-mode")
      htmlElement.classList.add("light-mode")
      localStorage.setItem("theme", "light-mode")
      updateThemeIcon("light-mode")
    } else {
      htmlElement.classList.remove("light-mode")
      htmlElement.classList.add("dark-mode")
      localStorage.setItem("theme", "dark-mode")
      updateThemeIcon("dark-mode")
    }
  })

  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    if (theme === "dark-mode") {
      themeIcon.className = "fas fa-sun"
    } else {
      themeIcon.className = "fas fa-moon"
    }
  }

  // Form submission handling with Google Sheets integration
  const contactForm = document.getElementById("contact-form")
  const formMessage = document.getElementById("form-message")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const contact = document.getElementById("Contact").value
      const message = document.getElementById("message").value

      if (!name || !email || !contact || !message) {
        formMessage.textContent = "Please fill in all fields."
        formMessage.className = "form-message error"
        setTimeout(() => {
          formMessage.className = "form-message"
        }, 5000)
        return
      }

      // Show loading state
      const submitBtn = contactForm.querySelector(".submit-btn")
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Sending..."
      submitBtn.classList.add("loading")

      // Google Sheets script URL - you'll replace this with your actual script URL
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbyo_yTR0STdxhodUmyxQUE3wW_rAIRQwqYZLI0wsJyDqsvjcDo2gVOfbDnueVo-N_Zw/exec"

      // Create form data to send
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("contact", contact)
      formData.append("message", message)
      formData.append("date", new Date().toLocaleString())

      fetch(scriptURL, {
        method: "POST",
        body: formData,
        mode: "no-cors", // This helps with CORS issues for Google Apps Script
      })
        .then((response) => {
          // Hide loading state
          submitBtn.textContent = originalBtnText
          submitBtn.classList.remove("loading")

          // For no-cors mode, we can't read the response, so we assume success
          // Show success message
          formMessage.textContent = "Form submitted Successfully. Thank You for showing your interest!"
          formMessage.className = "form-message success"

          // Reset form
          contactForm.reset()

          // Hide success message after 5 seconds
          setTimeout(() => {
            formMessage.className = "form-message"
          }, 5000)
        })
        .catch((error) => {
          console.error("Error!", error.message)

          // Hide loading state
          submitBtn.textContent = originalBtnText
          submitBtn.classList.remove("loading")

          formMessage.textContent = "Network error occurred. Please check your internet connection and try again."
          formMessage.className = "form-message error"

          // Hide error message after 5 seconds
          setTimeout(() => {
            formMessage.className = "form-message"
          }, 5000)
        })
    })
  }

  const downloadResumeBtn = document.getElementById("download-resume-btn")

  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Show loading state
      const originalText = downloadResumeBtn.textContent
      downloadResumeBtn.textContent = "Generating PDF..."
      downloadResumeBtn.style.pointerEvents = "none"

      try {
        // Create new jsPDF instance
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()

        // Set font and colors
        doc.setFont("helvetica")

        // Header
        doc.setFontSize(24)
        doc.setTextColor(40, 40, 40)
        doc.text("SHIVANSH MISHRA", 105, 25, { align: "center" })

        doc.setFontSize(14)
        doc.setTextColor(100, 100, 100)
        doc.text("FullStack Web Developer", 105, 35, { align: "center" })

        // Contact Info
        doc.setFontSize(10)
        doc.text("+91 8858094500", 20, 50)
        doc.text("luckymishra2625@gmail.com", 105, 50, { align: "center" })

        // Line separator
        doc.setDrawColor(200, 200, 200)
        doc.line(20, 55, 190, 55)

        let yPos = 70

        // Education Section
        doc.setFontSize(14)
        doc.setTextColor(40, 40, 40)
        doc.text("EDUCATION", 20, yPos)
        yPos += 10

        doc.setFontSize(11)
        doc.setTextColor(60, 60, 60)
        doc.text("Bachelor of Computer Applications", 20, yPos)
        yPos += 6
        doc.text("Renaissance University", 20, yPos)
        yPos += 6
        doc.text("August 2024 - Present", 20, yPos)
        yPos += 15

        // Technical Skills Section
        doc.setFontSize(14)
        doc.setTextColor(40, 40, 40)
        doc.text("TECHNICAL SKILLS", 20, yPos)
        yPos += 10

        doc.setFontSize(11)
        doc.setTextColor(60, 60, 60)
        doc.text("Programming Languages: Python, C, C++", 20, yPos)
        yPos += 6
        doc.text("Web Development: HTML, CSS, JavaScript", 20, yPos)
        yPos += 6
        doc.text("Frameworks: ReactJs, NodeJS, ExpressJS, MongoDB", 20, yPos)
        yPos += 6
        doc.text("Tools: Git, VS Code", 20, yPos)
        yPos += 6
        doc.text("Soft Skills: Time Management, Teamwork, Communication, Leadership", 20, yPos)
        yPos += 15

        // Professional Experience Section
        doc.setFontSize(14)
        doc.setTextColor(40, 40, 40)
        doc.text("PROFESSIONAL EXPERIENCE", 20, yPos)
        yPos += 10

        doc.setFontSize(12)
        doc.setTextColor(60, 60, 60)
        doc.text("Full Stack Developing Intern", 20, yPos)
        yPos += 6
        doc.setFontSize(10)
        doc.text("Micro IT", 20, yPos)
        yPos += 8
        doc.text("• Developed functional and dynamic websites using front-end and back-end technologies.", 20, yPos)
        yPos += 5
        doc.text("• Implemented optimized and bug-free code for enhanced performance.", 20, yPos)
        yPos += 5
        doc.text("• Ensured seamless user experience across all platforms.", 20, yPos)
        yPos += 10

        doc.setFontSize(12)
        doc.text("Freelance Web Developer", 20, yPos)
        yPos += 8
        doc.setFontSize(10)
        doc.text("• Developed and deployed responsive websites for many clients.", 20, yPos)
        yPos += 5
        doc.text("• Used Next.js, Tailwind CSS, and MongoDB for modern web solutions.", 20, yPos)
        yPos += 5
        doc.text("• Integrated secure payment gateways and authentication systems.", 20, yPos)
        yPos += 15

        // Projects Section
        doc.setFontSize(14)
        doc.setTextColor(40, 40, 40)
        doc.text("PROJECTS", 20, yPos)
        yPos += 10

        doc.setFontSize(12)
        doc.setTextColor(60, 60, 60)
        doc.text("Personal Portfolio", 20, yPos)
        yPos += 6
        doc.setFontSize(10)
        doc.text("Using JavaScript, Google Sheets", 20, yPos)
        yPos += 5
        doc.text("• Implemented features for customers to reach out through contact form", 20, yPos)
        yPos += 5
        doc.text("• Added feedback functionality for enhanced user interaction", 20, yPos)

        // Save the PDF
        doc.save("Shivansh_Mishra_Resume.pdf")

        // Reset button
        setTimeout(() => {
          downloadResumeBtn.textContent = originalText
          downloadResumeBtn.style.pointerEvents = "auto"
        }, 1000)
      } catch (error) {
        console.error("Error generating PDF:", error)
        downloadResumeBtn.textContent = originalText
        downloadResumeBtn.style.pointerEvents = "auto"
        alert("Error generating PDF. Please try again.")
      }
    })
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"

        // Add stagger effect for skill items
        if (entry.target.classList.contains("skill-item")) {
          const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100
          setTimeout(() => {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0) scale(1)"
          }, delay)
        }
      }
    })
  }, observerOptions)

  // Observe all sections for animations
  document.querySelectorAll(".skill-item, .project-card, .timeline-item").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})
