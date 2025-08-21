// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functions
  initNavigation();
  initScrollAnimations();
  initFormHandling();
  initScrollProgress();
  initCountryCity();
  initSmoothScrolling();

  // Add loading class removal
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);
});

// Navigation functionality
function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile navigation toggle
  navToggle.addEventListener("click", function () {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Header scroll effect
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 4px 30px rgba(4, 79, 132, 0.15)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "0 2px 20px rgba(4, 79, 132, 0.1)";
    }
  });
}

// Scroll animations
function initScrollAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, observerOptions);

  // Observe all elements with slide-up class
  document.querySelectorAll(".slide-up").forEach((el) => {
    observer.observe(el);
  });

  // Counter animation for stats
  animateCounters();
}

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 200;

  counters.forEach((counter) => {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = +counter.innerText.replace(/\D/g, "");
          const increment = target / speed;
          let count = 0;

          const timer = setInterval(() => {
            count += increment;
            if (count < target) {
              if (counter.innerText.includes("£")) {
                counter.innerText = "£" + Math.ceil(count);
              } else if (counter.innerText.includes("%")) {
                counter.innerText = Math.ceil(count) + "%";
              } else if (counter.innerText.includes("+")) {
                counter.innerText = Math.ceil(count) + "+";
              } else {
                counter.innerText = Math.ceil(count);
              }
            } else {
              counter.innerText = counter.innerText.replace(/\d+/, target);
              clearInterval(timer);
            }
          }, 1);

          observer.unobserve(counter);
        }
      });
    });

    observer.observe(counter);
  });
}

// Form handling
function initFormHandling() {
  const form = document.getElementById("enrollmentForm");
  const submitBtn = form.querySelector(".submit-btn");

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form
    if (validateForm()) {
      // Show loading state
      showLoadingState(submitBtn);

      // Simulate form submission
      setTimeout(() => {
        showSuccessMessage();
        resetForm();
        hideLoadingState(submitBtn);
      }, 2000);
    }
  });

  // Real-time validation
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(input);
    });

    input.addEventListener("input", function () {
      clearFieldError(input);
    });
  });
}

// Form validation
function validateForm() {
  const requiredFields = document.querySelectorAll(
    "input[required], select[required]"
  );
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  // Email validation
  const email = document.getElementById("email");
  if (email.value && !isValidEmail(email.value)) {
    showFieldError(email, "Please enter a valid email address");
    isValid = false;
  }

  // Phone validation
  const phone = document.getElementById("phone");
  if (phone.value && !isValidPhone(phone.value)) {
    showFieldError(phone, "Please enter a valid phone number");
    isValid = false;
  }

  return isValid;
}

function validateField(field) {
  if (field.hasAttribute("required") && !field.value.trim()) {
    showFieldError(field, "This field is required");
    return false;
  }

  clearFieldError(field);
  return true;
}

function showFieldError(field, message) {
  clearFieldError(field);

  field.style.borderColor = "#e74c3c";
  field.style.boxShadow = "0 0 0 3px rgba(231, 76, 60, 0.1)";

  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error";
  errorDiv.style.cssText =
    "color: #e74c3c; font-size: 0.85rem; margin-top: 5px;";
  errorDiv.textContent = message;

  field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
  field.style.borderColor = "";
  field.style.boxShadow = "";

  const errorDiv = field.parentNode.querySelector(".field-error");
  if (errorDiv) {
    errorDiv.remove();
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function showLoadingState(button) {
  const originalText = button.innerHTML;
  button.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> <span>Processing...</span>';
  button.disabled = true;
  button.style.opacity = "0.8";

  button.dataset.originalText = originalText;
}

function hideLoadingState(button) {
  button.innerHTML = button.dataset.originalText;
  button.disabled = false;
  button.style.opacity = "1";
}

function showSuccessMessage() {
  // Create success modal
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;

  modalContent.innerHTML = `
        <div style="color: #28a745; font-size: 3rem; margin-bottom: 20px;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: #044f84; margin-bottom: 15px; font-size: 1.5rem;">Success!</h3>
        <p style="color: #666; margin-bottom: 25px;">Thank you for your interest! Our team will contact you within 24 hours.</p>
        <button onclick="this.closest('.success-modal').remove()" style="
            background: linear-gradient(135deg, #044f84 0%, #3f9fff 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            Close
        </button>
    `;

  modal.className = "success-modal";
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Auto close after 5 seconds
  setTimeout(() => {
    if (modal.parentNode) {
      modal.remove();
    }
  }, 5000);
}

function resetForm() {
  const form = document.getElementById("enrollmentForm");
  form.reset();

  // Clear any field errors
  const errorDivs = form.querySelectorAll(".field-error");
  errorDivs.forEach((div) => div.remove());

  // Reset field styles
  const fields = form.querySelectorAll("input, select");
  fields.forEach((field) => {
    field.style.borderColor = "";
    field.style.boxShadow = "";
  });
}

// Country and city handling
function initCountryCity() {
  const countrySelect = document.getElementById("country");
  const citySelect = document.getElementById("city");

  const cityData = {
    guyana: [
      "Georgetown",
      "Linden",
      "New Amsterdam",
      "Anna Regina",
      "Bartica",
      "Skeldon",
      "Rosignol",
      "Mahaica",
      "Parika",
    ],
    zambia: [
      "Lusaka",
      "Kitwe",
      "Ndola",
      "Kabwe",
      "Chingola",
      "Mufulira",
      "Luanshya",
      "Arusha",
      "Kasama",
      "Chipata",
    ],
    other: ["Please specify in comments"],
  };

  countrySelect.addEventListener("change", function () {
    const selectedCountry = this.value;
    citySelect.innerHTML = '<option value="">Select City</option>';

    if (cityData[selectedCountry]) {
      cityData[selectedCountry].forEach((city) => {
        const option = document.createElement("option");
        option.value = city.toLowerCase().replace(/\s+/g, "-");
        option.textContent = city;
        citySelect.appendChild(option);
      });
      citySelect.disabled = false;
    } else {
      citySelect.disabled = true;
    }
  });
}

// Scroll progress bar
function initScrollProgress() {
  // Create progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", function () {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = progress + "%";
  });
}

// Smooth scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Utility functions
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Add hover effects to cards
document.addEventListener("DOMContentLoaded", function () {
  // Feature cards hover effect
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Course cards hover effect
  const courseCards = document.querySelectorAll(".course-card");
  courseCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});

// Parallax effect for hero section
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const heroBackground = document.querySelector(".hero-background");

  if (hero && heroBackground) {
    const rate = scrolled * -0.5;
    heroBackground.style.transform = `translateY(${rate}px)`;
  }
});

// Add typing effect to hero title
function initTypingEffect() {
  const title = document.querySelector(".hero-title");
  if (!title) return;

  const text = title.textContent;
  title.textContent = "";
  title.style.borderRight = "2px solid #fff02a";

  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      setTimeout(() => {
        title.style.borderRight = "none";
      }, 500);
    }
  };

  // Start typing effect when hero section is visible
  const heroObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(typeWriter, 1000);
        heroObserver.unobserve(entry.target);
      }
    });
  });

  heroObserver.observe(title);
}

// Initialize typing effect
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initTypingEffect, 500);
});

// Add floating animation to form
function initFloatingForm() {
  const form = document.querySelector(".enrollment-form-container");
  if (!form) return;

  let floatDirection = 1;

  setInterval(() => {
    const currentTransform = getComputedStyle(form).transform;
    const matrix = new DOMMatrix(currentTransform);
    const currentY = matrix.m42;

    if (currentY > 10 || currentY < -10) {
      floatDirection *= -1;
    }

    form.style.transform = `translateY(${currentY + floatDirection * 0.5}px)`;
  }, 50);
}

// Add scroll-triggered animations
function initAdvancedAnimations() {
  // Stagger animation for course cards
  const courseCards = document.querySelectorAll(".course-card");
  const courseObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.animation = "slideInUp 0.6s ease forwards";
          }, index * 100);
          courseObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  courseCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    courseObserver.observe(card);
  });
}

// Add CSS keyframes for animations
function addAnimationStyles() {
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-group input:focus,
        .form-group select:focus {
            animation: inputFocus 0.3s ease;
        }
        
        @keyframes inputFocus {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .feature-card:hover .feature-icon {
            animation: iconBounce 0.6s ease;
        }
        
        @keyframes iconBounce {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.1) rotate(5deg); }
            75% { transform: scale(1.05) rotate(-5deg); }
        }
    `;
  document.head.appendChild(style);
}

// Initialize advanced features
document.addEventListener("DOMContentLoaded", function () {
  addAnimationStyles();
  setTimeout(initAdvancedAnimations, 1000);
});

// Add particle effect to hero section
function initParticleEffect() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

  hero.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }
  }

  function updateParticles() {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 42, ${particle.opacity})`;
      ctx.fill();
    });
  }

  function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  initParticles();
  animate();

  window.addEventListener(
    "resize",
    debounce(() => {
      resizeCanvas();
      initParticles();
    }, 250)
  );
}

// Initialize particle effect
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initParticleEffect, 2000);
});

// Add mouse follower effect
function initMouseFollower() {
  const follower = document.createElement("div");
  follower.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(255, 240, 42, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: multiply;
    `;

  document.body.appendChild(follower);

  let mouseX = 0,
    mouseY = 0;
  let followerX = 0,
    followerY = 0;

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    follower.style.left = followerX - 10 + "px";
    follower.style.top = followerY - 10 + "px";

    requestAnimationFrame(updateFollower);
  }

  updateFollower();

  // Scale effect on interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, input, select"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      follower.style.transform = "scale(2)";
      follower.style.background = "rgba(63, 159, 255, 0.3)";
    });

    el.addEventListener("mouseleave", () => {
      follower.style.transform = "scale(1)";
      follower.style.background = "rgba(255, 240, 42, 0.3)";
    });
  });
}

// Initialize mouse follower on desktop only
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth > 768) {
    initMouseFollower();
  }
});

// Performance optimization
function optimizePerformance() {
  // Lazy load images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Preload critical resources
  const criticalResources = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = resource;
    document.head.appendChild(link);
  });
}
