import { ParticleNetwork } from './particles.js';
import { TerminalSimulator } from './terminal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles Background
  new ParticleNetwork('particles-canvas');
  
  // 2. Initialize Terminal Simulator
  new TerminalSimulator('portfolio-terminal');
  
  // 3. Scroll Header & Mobile Menu Toggle
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('mobile-active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // 4. Reveal Elements on Scroll (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger skill bars animation if we reveal the skills container
        if (entry.target.id === 'skills' || entry.target.querySelector('#skills') || entry.target.querySelector('.skill-bar-fill')) {
          animateSkills();
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  
  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Skill Bar Animations
  function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      bar.style.width = width;
    });
  }

  // 6. Navigation Link Active Class on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 250)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });



  // 8. Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      // Basic client validation
      if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Submit to Formspree
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
      statusMsg.style.display = 'none';
      
      fetch('https://formspree.io/f/mlgvngjg', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      })
      .then(response => {
        if (response.ok) {
          showStatus(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
          contactForm.reset();
        } else {
          showStatus('Oops! There was a problem submitting your form.', 'error');
        }
      })
      .catch(() => {
        showStatus('Oops! There was a network error. Please try again.', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
    });
  }

  function showStatus(text, type) {
    statusMsg.className = `form-status ${type}`;
    statusMsg.innerHTML = text;
    statusMsg.style.display = 'block';
  }

  // 9. Modal Handling (Sector & GreenRoot Modals)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('a[href^="#"], .open-sector-modal-btn, .open-greenroot-modal-btn');
    if (trigger) {
      const href = trigger.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetModal = document.querySelector(href);
        if (targetModal && targetModal.classList.contains('modal-overlay')) {
          e.preventDefault();
          targetModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    }
  });

  // Close modals on close button, backdrop click, or ESC key
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }
  });
});

