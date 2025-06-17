/*
 * Resume Webpage JavaScript - script.js (Redesigned Version)
 * This file handles interactive elements, animations, and dynamic behaviors
 * for Prithviraj Kamble's redesigned resume webpage.
 *
 * Key features:
 * - Particle animation in the Hero section for a dynamic background.
 * - Intersection Observer for 'scroll-reveal' animations on sections,
 * including skill bar fill and shimmer animations.
 * - Robust smooth scrolling for navigation links with fixed navbar offset.
 * - Bootstrap Tooltip initialization for interactive elements.
 * - Enhanced Navbar shrink effect on scroll for a more polished feel.
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded: Resume script.js is running!");

  // =====================================
  // 1. Particle Animation for Hero Section Background
  //    Uses a canvas to draw subtle, floating particles for a dynamic and elegant effect.
  // =====================================
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const particleCount = 70; // Number of particles
  const particleSize = 1; // Base size of particles
  const particleSpeed = 0.5; // Speed of particles

  // Function to resize canvas to fit parent container
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
  }

  // Particle class definition
  class Particle {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
      this.alpha = 0.0; // Start transparent
      this.fadeSpeed = 0.005 + Math.random() * 0.005; // Random fade-in speed
      this.blinkDelay = Math.random() * 200; // Random delay for blink effect
    }

    draw() {
      ctx.save(); // Save the current state of the canvas
      ctx.globalAlpha = this.alpha; // Apply current alpha
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore(); // Restore the canvas state
    }

    update() {
      // Fade in logic
      if (this.alpha < 0.7) {
        this.alpha += this.fadeSpeed;
      } else {
        // Introduce subtle blinking
        if (Math.random() < 0.001) {
          // Small chance to blink
          this.alpha = 0.1 + Math.random() * 0.3;
        }
      }

      // Move particle
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Boundary checks: respawn if out of bounds
      if (this.x - this.radius > canvas.width) {
        this.x = -this.radius;
      } else if (this.x + this.radius < 0) {
        this.x = canvas.width + this.radius;
      }
      if (this.y - this.radius > canvas.height) {
        this.y = -this.radius;
      } else if (this.y + this.radius < 0) {
        this.y = canvas.height + this.radius;
      }

      this.draw();
    }
  }

  // Function to initialize particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = particleSize + Math.random() * 2; // Vary particle size
      const color = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`; // Vary opacity for softer look
      const velocity = {
        x: (Math.random() - 0.5) * particleSpeed,
        y: (Math.random() - 0.5) * particleSpeed,
      };
      particles.push(new Particle(x, y, radius, color, velocity));
    }
    console.log("Particles initialized.");
  }

  // Animation loop for particles
  function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw a very subtle background layer to reduce contrast if needed
    // ctx.fillStyle = 'rgba(20, 15, 30, 0.05)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
    });
  }

  // Initialize and start particle animation on window load and resize
  window.addEventListener("load", () => {
    resizeCanvas();
    initParticles();
    animateParticles();
  });
  window.addEventListener("resize", resizeCanvas);

  // =====================================
  // 2. Intersection Observer for Section Scroll Animations
  //    Adds 'is-visible' class to sections when they enter the viewport,
  //    triggering CSS fade-in and slide-up animations defined in style.css.
  // =====================================
  const sections = document.querySelectorAll(".section-animated"); // Select all sections to animate

  const sectionObserverOptions = {
    root: null, // relative to the viewport
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the section is visible
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Stop observing once animated
        console.log(`Section "${entry.target.id}" is now visible.`);
      }
    });
  }, sectionObserverOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
  console.log("Intersection Observer initialized for general sections.");

  // =====================================
  // 3. Intersection Observer for Skill Bar Animations
  //    Specifically targets skill bars to animate their width and shimmer when visible.
  // =====================================
  const skillBars = document.querySelectorAll(".skill-bar-fill");

  const skillBarObserverOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.7, // Trigger when 70% of the skill bar is visible
  };

  const skillBarObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const skillLevel = entry.target.dataset.skillLevel;
        entry.target.style.width = skillLevel; // Animate width
        // Activate shimmer after fill animation starts
        entry.target.style.setProperty("animation-delay", "1.5s", "important"); // Ensure delay is applied
        entry.target.style.setProperty("opacity", "1", "important"); // Ensure opacity is 1
        entry.target.style.setProperty(
          "animation",
          "shimmer 1.2s infinite linear",
          "important"
        ); // Apply shimmer animation

        observer.unobserve(entry.target);
        console.log(
          `Skill bar for "${entry.target.parentElement.previousElementSibling.textContent.trim()}" animated to ${skillLevel}.`
        );
      }
    });
  }, skillBarObserverOptions);

  skillBars.forEach((skillBar) => {
    skillBarObserver.observe(skillBar);
  });
  console.log("Intersection Observer initialized for skill bars.");

  // =====================================
  // 4. Smooth Scrolling for Navigation Links
  //    Ensures a smooth scroll animation when clicking internal anchor links,
  //    accounting for the fixed navigation bar's height.
  // =====================================
  document
    .querySelectorAll("a.smooth-scroll, .navbar-nav .nav-link")
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const navbarHeight = document.querySelector(".navbar").offsetHeight;
          window.scrollTo({
            top: targetElement.offsetTop - navbarHeight,
            behavior: "smooth",
          });

          const navbarCollapse = document.getElementById("navbarNav");
          if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
              toggle: false,
            });
            bsCollapse.hide();
            console.log("Navbar collapsed after link click.");
          }
        }
      });
    });
  console.log("Smooth scrolling initialized.");

  // =====================================
  // 5. Bootstrap Tooltip Initialization
  //    Enables Bootstrap's tooltip feature.
  // =====================================
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
  console.log("Bootstrap Tooltips initialized.");

  // =====================================
  // 6. Navbar Shrink Effect on Scroll
  //    Makes the navbar slightly smaller and less transparent when scrolling down.
  // =====================================
  const mainNavbar = document.getElementById("mainNavbar");
  const initialNavbarHeight = mainNavbar.offsetHeight;

  window.addEventListener("scroll", () => {
    if (window.scrollY > initialNavbarHeight) {
      mainNavbar.classList.add("navbar-shrink");
    } else {
      mainNavbar.classList.remove("navbar-shrink");
    }
  });
  console.log("Navbar shrink effect initialized.");
});
