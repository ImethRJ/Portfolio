import { ParticleNetwork } from './particles.js';
import { TerminalSimulator } from './terminal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles Background
  new ParticleNetwork('particles-canvas');
  
  // 2. Initialize Terminal Simulator
  new TerminalSimulator('portfolio-terminal');
  
  // 3. Scroll Header Toggle
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

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

  // 7. Filter Projects
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Apply animation classes
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
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

  // 9. Sector Educational Institute Modal Handling
  const sectorModal = document.getElementById('sector-modal');
  const closeModalBtn = document.getElementById('close-sector-modal');

  // Use event delegation for all modal open triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-sector-modal-btn');
    if (trigger) {
      e.preventDefault();
      if (sectorModal) {
        sectorModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    }
  });

  if (closeModalBtn && sectorModal) {
    closeModalBtn.addEventListener('click', () => {
      sectorModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    sectorModal.addEventListener('click', (e) => {
      if (e.target === sectorModal) {
        sectorModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sectorModal.classList.contains('active')) {
        sectorModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
});

