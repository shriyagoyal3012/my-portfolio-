/**
 * Shriya Goyal — Personal Portfolio Interactive Scripts
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme Switcher
  initTheme();

  // 2. Initialize Interactive Canvas Particles
  initParticleCanvas();

  // 3. Initialize Hero Typewriter Effect
  initTypewriter();

  // 4. Initialize Navigation & Scroll Behaviors
  initNavigation();

  // 5. Initialize Skill Progress Bars with IntersectionObserver
  initSkillBars();

  // 6. Initialize Interactive CLI Terminal Playground
  initInteractiveTerminal();

  // 7. Initialize Contact Form & Clipboard Utilities
  initContactUtilities();

  // 8. Update Copyright Year
  document.getElementById('current-year')?.replaceChildren(document.createTextNode(new Date().getFullYear()));
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('shriya_portfolio_theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('shriya_portfolio_theme', newTheme);
    showToast(`Switched to ${newTheme === 'light' ? 'Light' : 'Dark'} mode ✨`);
  });
}

/* ==========================================================================
   2. Interactive Particles Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 32 : 65;
  const maxDistance = 120;

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.35 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive repelling
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let forceX = (dx / dist) * force * 1.4;
          let forceY = (dy / dist) * force * 1.4;
          this.x -= forceX;
          this.y -= forceY;
        }
      }
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(79, 70, 229, ${this.baseAlpha * 0.6})` : `rgba(129, 140, 248, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColorBase = isLight ? 'rgba(79, 70, 229,' : 'rgba(129, 140, 248,';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          let alpha = (1 - dist / maxDistance) * (isLight ? 0.12 : 0.18);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${lineColorBase}${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Hero Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Aspiring Software Developer 💻',
    'First-Year B.Tech ECE Student 🎓',
    'Web Development Enthusiast 🌐',
    'Dedicated Problem Solver 🧩'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1900;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Navigation & Scroll Behaviors
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (scrollPos > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (scrollPos > 350) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }

    // ScrollSpy
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Hamburger Toggle
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        hamburgerBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Scroll to Top
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   5. Skill Progress Bars Animation
   ========================================================================== */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const skillFills = document.querySelectorAll('.skill-fill-bar');

  if (!skillSection || skillFills.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach(fill => {
          const width = fill.getAttribute('data-width');
          if (width) {
            fill.style.width = width;
          }
        });
        observer.unobserve(skillSection);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillSection);
}

/* ==========================================================================
   6. Interactive CLI Terminal
   ========================================================================== */
function initInteractiveTerminal() {
  const input = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  const quickBtns = document.querySelectorAll('.quick-cmd-btn');

  if (!input || !terminalBody) return;

  const commandResponses = {
    'help': `Available Commands:
  • about       - Overview of Shriya's background & focus
  • skills      - Primary technical skill set
  • education   - Degree & school academic milestones
  • projects    - Key projects built by Shriya
  • goal        - Career goal & software aspirations
  • internship  - Current internship seeking status
  • contact     - Direct email, phone, location & LinkedIn
  • date        - Current date and local time
  • clear       - Clear the terminal screen`,

    'about': `Shriya Goyal
First-Year B.Tech ECE student at JECRC University, Jaipur.
Building strong programming fundamentals, working on web projects, and exploring AI tools.
Eager to learn, build practical projects, and gain first-hand internship experience.`,

    'skills': `Technical Skills:
• C (Programming Language)
• HTML, CSS, JavaScript (Frontend Foundations)
• Web Development (Responsive UI & Architecture)
• Git & GitHub (Version Control)
• AI Tools (Productivity & Exploration)
• Problem Solving (Core Logic & Fundamentals)`,

    'education': `Education:
1. Bachelor of Technology (B.Tech) — ECE
   JECRC University, Jaipur (First Year, 2026–Present)
2. Class 12 — Saraswati Vidya Mandir, Mathura (Percentage: 84.8%)
3. Class 10 — Saraswati Vidya Mandir, Mathura (Percentage: 95.4%)`,

    'projects': `Projects:
1. Portfolio Website
   A personal portfolio website built to showcase my skills, projects, education and learning journey.
   Tech: HTML, CSS, JavaScript

2. Web Application
   A web application project created to practice web development, UI design and problem-solving.
   Tech: HTML, CSS, JavaScript, Web Development`,

    'goal': `Career Goal:
To grow as a software developer by strengthening my programming fundamentals, building practical projects and gaining real-world industry experience.`,

    'internship': `Internship Status:
Currently seeking my first internship opportunity in software development and web development.`,

    'contact': `Contact Information:
• Email:    shriyag124@gmail.com
• Phone:    +91 9548980960
• Location: Uttar Pradesh, India
• LinkedIn: https://www.linkedin.com/in/shriya-goyal-6448a8428?utm_source=share_via&utm_content=profile&utm_medium=member_android`,

    'date': () => `System Date: ${new Date().toLocaleString()}`,
    'hi': `Hello! 👋 Type 'help' to explore my portfolio through this terminal.`,
    'hello': `Hello! 👋 Type 'help' to explore my portfolio through this terminal.`
  };

  function executeCommand(cmdText) {
    const trimmed = cmdText.trim().toLowerCase();
    if (!trimmed) return;

    // Append Command Echo Line
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line';
    echoLine.innerHTML = `<span class="terminal-prompt-user">visitor@shriya</span>:<span class="terminal-prompt-path">~</span>$ <span class="terminal-command-echo">${escapeHtml(trimmed)}</span>`;
    terminalBody.appendChild(echoLine);

    if (trimmed === 'clear') {
      terminalBody.innerHTML = '';
      return;
    }

    // Determine Response
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-output';

    if (commandResponses[trimmed]) {
      const result = typeof commandResponses[trimmed] === 'function' 
        ? commandResponses[trimmed]() 
        : commandResponses[trimmed];
      responseLine.textContent = result;
    } else {
      responseLine.textContent = `Command not recognized: '${trimmed}'. Type 'help' for available commands.`;
    }

    terminalBody.appendChild(responseLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value;
      input.value = '';
      executeCommand(cmd);
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/* ==========================================================================
   7. Contact Utilities & Toast
   ========================================================================== */
function initContactUtilities() {
  // Copy Email Button
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'shriyag124@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        copyBtn.textContent = 'Copied! ✓';
        showToast('Email address copied to clipboard! 📋');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2500);
      }).catch(() => {
        showToast('shriyag124@gmail.com');
      });
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields! ⚠️');
        return;
      }

      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Sending... ⏳</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. 🚀`);
      }, 1200);
    });
  }
}

/* Toast Notification */
let toastTimeout;
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  let toast = toastContainer.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toastContainer.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
