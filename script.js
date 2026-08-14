/* ==========================================================================
   INITIALIZATION & PLUGINS
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ==========================================================================
   BOOT SEQUENCE (LOADER)
   ========================================================================== */

window.addEventListener('DOMContentLoaded', () => {
  let progress = 0;
  const progressBar = document.getElementById('progress-bar');
  const percentageText = document.getElementById('boot-percentage');
  const statusText = document.getElementById('boot-status-text');

  const bootInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(bootInterval);
      
      statusText.innerText = "SYSTEM READY";
      progressBar.style.width = "100%";
      percentageText.innerText = "100%";

      setTimeout(() => {
        gsap.to("#boot-screen", {
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            document.getElementById('boot-screen').style.display = 'none';
            animateHeroEntrance();
          }
        });
      }, 500);
    } else {
      progressBar.style.width = `${progress}%`;
      percentageText.innerText = `${progress}%`;
      if (progress > 40 && progress < 75) {
        statusText.innerText = "LOADING CORE ASSETS";
      } else if (progress >= 75) {
        statusText.innerText = "ESTABLISHING SECURE PROTOCOLS";
      }
    }
  }, 60);
});

/* ==========================================================================
   CUSTOM CURSOR SYSTEM
   ========================================================================== */

const cursor = document.getElementById('custom-cursor');
const dot = cursor.querySelector('.cursor-dot');
const ring = cursor.querySelector('.cursor-ring');
const label = cursor.querySelector('.cursor-label');

let mouse = { x: -100, y: -100 };
let dotPos = { x: -100, y: -100 };
let ringPos = { x: -100, y: -100 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Cursor animation loop
function tickCursor() {
  const lerpDot = 0.25;
  const lerpRing = 0.12;

  dotPos.x += (mouse.x - dotPos.x) * lerpDot;
  dotPos.y += (mouse.y - dotPos.y) * lerpDot;
  ringPos.x += (mouse.x - ringPos.x) * lerpRing;
  ringPos.y += (mouse.y - ringPos.y) * lerpRing;

  dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
  ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
  label.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

  requestAnimationFrame(tickCursor);
}
requestAnimationFrame(tickCursor);

// Add state listeners to elements
const setupCursorListeners = () => {
  // General links hover
  document.querySelectorAll('a, button, .nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-link'));
  });

  // View hover targets (images/sliders)
  document.querySelectorAll('.hover-target-view').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover-view');
      label.innerText = "VIEW";
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover-view');
      label.innerText = "";
    });
  });

  // Open hover targets (repos, github CTA)
  document.querySelectorAll('.hover-target-open').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover-open');
      label.innerText = "OPEN";
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover-open');
      label.innerText = "";
    });
  });
};

setupCursorListeners();

/* ==========================================================================
   HERO ENTRANCE & INTERACTION
   ========================================================================== */

function animateHeroEntrance() {
  const tl = gsap.timeline();
  
  // Slide down nav
  tl.from(".main-nav", {
    y: -50,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
  });

  // Fade in hero bg text
  tl.from(".hero-bg-text", {
    opacity: 0,
    scale: 0.9,
    duration: 1.5,
    ease: "power3.out"
  }, "-=0.8");

  // Portal scaling
  tl.from(".portal-container", {
    scale: 0.5,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
  }, "-=1.2");

  // CTA entrance
  tl.from(".hero-cta-container", {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  }, "-=0.5");
}

// 3D Cube Rotation Setup (Horizontal / Vertical Parallax)
const heroCube = document.getElementById('hero-cube');
const portalTrigger = document.getElementById('portal-trigger');

let cubeRotation = { x: -15, y: 35 };
let targetMouseOffset = { x: 0, y: 0 };
let currentMouseOffset = { x: 0, y: 0 };

// Auto-rotate the cube continuously
function autoRotateCube() {
  if (!isScrollingHero) {
    cubeRotation.y += 0.05; // Slow rotation speed
    cubeRotation.x = -15 + Math.sin(Date.now() * 0.001) * 5; // Subtle auto-wobble
  }
  
  // Smoothly interpolate mouse parallax offsets
  currentMouseOffset.x += (targetMouseOffset.x - currentMouseOffset.x) * 0.08;
  currentMouseOffset.y += (targetMouseOffset.y - currentMouseOffset.y) * 0.08;

  // Apply combined rotations
  heroCube.style.transform = `rotateX(${cubeRotation.x + currentMouseOffset.y}deg) rotateY(${cubeRotation.y + currentMouseOffset.x}deg)`;
  
  requestAnimationFrame(autoRotateCube);
}
requestAnimationFrame(autoRotateCube);

// Track if scroll trigger is taking over the rotation
let isScrollingHero = false;

// Mouse Interaction on Hero Portal
portalTrigger.addEventListener('mousemove', (e) => {
  const rect = portalTrigger.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  
  // Parallax rotation bounds
  targetMouseOffset.x = (x / rect.width) * 45; // max 45deg
  targetMouseOffset.y = -(y / rect.height) * 45;

  // Tilt the portal frame slightly
  gsap.to(portalTrigger, {
    rotateX: -(y / rect.height) * 15,
    rotateY: (x / rect.width) * 15,
    duration: 0.5,
    ease: "power2.out"
  });
});

portalTrigger.addEventListener('mouseleave', () => {
  targetMouseOffset.x = 0;
  targetMouseOffset.y = 0;
  gsap.to(portalTrigger, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.8,
    ease: "power2.out"
  });
});

// ScrollTrigger connecting Cube Rotation to Scrolling
gsap.to(cubeRotation, {
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "bottom top",
    scrub: true,
    onToggle: (self) => { isScrollingHero = self.isActive; }
  },
  y: "+=360", // Rotate full spin during scroll down
  x: "-=90",
  ease: "none"
});

// Portal Zoom Transition on Click
document.querySelector('.explore-cta').addEventListener('click', (e) => {
  e.preventDefault();
  const targetId = e.currentTarget.getAttribute('href');
  
  gsap.to(".portal-container", {
    scale: 3.5,
    opacity: 0,
    duration: 1.2,
    ease: "power3.inOut",
    onComplete: () => {
      // Scroll to project tunnel smoothly
      lenis.scrollTo(targetId);
      // Reset portal scale
      gsap.to(".portal-container", {
        scale: 1,
        opacity: 1,
        delay: 0.5,
        duration: 0.8
      });
    }
  });
});

/* ==========================================================================
   CINEMATIC PROJECT TUNNEL (3D Z-AXIS SCROLL)
   ========================================================================== */

const slides = gsap.utils.toArray('.tunnel-slide');
const tunnelContainer = document.getElementById('tunnel-container');

// Pin the tunnel section and create 3D scrolling sequence
const tunnelTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".tunnel-section",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    pin: true,
    anticipatePin: 1
  }
});

slides.forEach((slide, idx) => {
  // First slide is visible initially
  if (idx === 0) {
    gsap.set(slide, { opacity: 1, visibility: 'visible', zIndex: 100 });
    
    // Scale it away to camera depth as user scrolls to next
    tunnelTL.to(slide.querySelector('.slide-content'), {
      z: 1000,
      opacity: 0,
      ease: "power1.inOut"
    }, idx);
    
    tunnelTL.to(slide, {
      opacity: 0,
      ease: "power1.in"
    }, idx);
  } else {
    // Other slides emerge from deep space (z: -1500px)
    gsap.set(slide, { opacity: 0, visibility: 'hidden', zIndex: 100 - idx });
    
    const content = slide.querySelector('.slide-content');
    gsap.set(content, { z: -1500 });

    // Timeline steps:
    // 1. Reveal slide (fade in and pull forward to z: 0)
    tunnelTL.to(slide, {
      onStart: () => {
        slide.style.visibility = 'visible';
        slide.classList.add('active');
      },
      onReverseComplete: () => {
        slide.style.visibility = 'hidden';
        slide.classList.remove('active');
      },
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, idx - 0.5);

    tunnelTL.to(content, {
      z: 0,
      duration: 1,
      ease: "power2.out"
    }, idx - 0.5);

    // 2. Scale away if not the last slide
    if (idx < slides.length - 1) {
      tunnelTL.to(content, {
        z: 1000,
        opacity: 0,
        duration: 1,
        ease: "power1.inOut"
      }, idx + 0.5);
      
      tunnelTL.to(slide, {
        opacity: 0,
        duration: 1,
        ease: "power1.in"
      }, idx + 0.5);
    }
  }
});

/* ==========================================================================
   EDITORIAL TYPOGRAPHY SECTION
   ========================================================================== */

// Move rows left / right opposing directions
gsap.to(".word-create", {
  scrollTrigger: {
    trigger: ".editorial-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  x: "-25vw",
  ease: "none"
});

gsap.to(".word-build", {
  scrollTrigger: {
    trigger: ".editorial-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  x: "15vw",
  ease: "none"
});

gsap.to(".word-break", {
  scrollTrigger: {
    trigger: ".editorial-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  x: "-35vw",
  ease: "none"
});

gsap.to(".word-rebuild", {
  scrollTrigger: {
    trigger: ".editorial-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
  x: "20vw",
  ease: "none"
});

// "SHIP." scales up and highlights dynamically
gsap.fromTo(".word-ship", 
  { scale: 0.7, opacity: 0.2 },
  {
    scrollTrigger: {
      trigger: ".editorial-section",
      start: "center 70%",
      end: "center 40%",
      scrub: true,
    },
    scale: 1.1,
    opacity: 1,
    ease: "power2.out"
  }
);

/* ==========================================================================
   SYSTEM TECH STACK PARALLAX
   ========================================================================== */

const stackWords = document.querySelectorAll('.stack-word');
const stackSection = document.querySelector('.stack-section');

stackSection.addEventListener('mousemove', (e) => {
  const rect = stackSection.getBoundingClientRect();
  const mouseX = e.clientX - rect.left - rect.width / 2;
  const mouseY = e.clientY - rect.top - rect.height / 2;

  stackWords.forEach(word => {
    const depth = parseFloat(word.getAttribute('data-depth'));
    const xMove = (mouseX * depth) * 0.4;
    const yMove = (mouseY * depth) * 0.4;
    const rotate = (mouseX * depth) * 0.05;

    gsap.to(word, {
      x: xMove,
      y: yMove,
      rotateZ: rotate,
      z: depth * 100, // Move closer to camera based on depth
      color: `rgba(255, 255, 255, ${0.2 + depth * 0.8})`, // dynamic visibility
      duration: 0.6,
      ease: "power2.out"
    });
  });
});

stackSection.addEventListener('mouseleave', () => {
  stackWords.forEach(word => {
    gsap.to(word, {
      x: 0,
      y: 0,
      rotateZ: 0,
      z: 0,
      color: "rgba(255, 255, 255, 0.2)",
      duration: 0.8,
      ease: "power3.out"
    });
  });
});

/* ==========================================================================
   GITHUB API COMMAND CENTER
   ========================================================================== */

async function loadGitHubStats() {
  const username = "octocat"; // Replace with your actual github handle if needed
  const commitsEl = document.getElementById('stat-commits');
  const reposEl = document.getElementById('stat-repos');
  const followersEl = document.getElementById('stat-followers');
  const starsEl = document.getElementById('stat-stars');

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error("API Limit / Error");
    const userData = await userRes.json();
    
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const reposData = await reposRes.json();
    
    // Calculate total stars
    let totalStars = 0;
    if (Array.isArray(reposData)) {
      totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    }

    // Animate the values counting up smoothly
    animateStatValue(reposEl, userData.public_repos);
    animateStatValue(followersEl, userData.followers);
    animateStatValue(starsEl, totalStars || 54); // Fallback star count if 0
    animateStatValue(commitsEl, 1284); // Mock commit counts because API requires heavy auth
  } catch (error) {
    console.warn("GitHub API fetch failed. Loading local fallback metrics.", error);
    // Keep high quality fallbacks
  }
}

function animateStatValue(element, targetValue) {
  const obj = { value: 0 };
  gsap.to(obj, {
    value: targetValue,
    duration: 2.5,
    ease: "power4.out",
    onUpdate: () => {
      element.innerText = Math.floor(obj.value).toLocaleString();
    }
  });
}

// Trigger stats loading when scrolled into view
ScrollTrigger.create({
  trigger: ".command-center",
  start: "top 80%",
  onEnter: () => {
    loadGitHubStats();
  },
  once: true
});

/* ==========================================================================
   MAGNETIC BUTTON INTERACTION
   ========================================================================== */

const ctaBtn = document.getElementById('github-cta-btn');

ctaBtn.addEventListener('mousemove', (e) => {
  const rect = ctaBtn.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  // Magnetic pull factor
  gsap.to(ctaBtn, {
    x: x * 0.35,
    y: y * 0.35,
    duration: 0.3,
    ease: "power2.out"
  });

  gsap.to(ctaBtn.querySelector('.btn-bg'), {
    x: x * 0.15,
    y: y * 0.15,
    duration: 0.3,
    ease: "power2.out"
  });
});

ctaBtn.addEventListener('mouseleave', () => {
  gsap.to(ctaBtn, {
    x: 0,
    y: 0,
    duration: 0.6,
    ease: "elastic.out(1, 0.3)"
  });

  gsap.to(ctaBtn.querySelector('.btn-bg'), {
    x: 0,
    y: 0,
    duration: 0.6,
    ease: "elastic.out(1, 0.3)"
  });
});
