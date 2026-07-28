export class TerminalSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.body = this.container.querySelector('.terminal-body');
    this.input = this.container.querySelector('.terminal-input-element');
    this.cursor = this.container.querySelector('.terminal-custom-cursor');
    
    this.history = [];
    this.historyIndex = -1;
    this.isGameActive = false;
    this.secretNumber = null;
    this.gameAttempts = 0;
    
    this.init();
  }

  init() {
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.input.addEventListener('input', () => this.updateCursorPosition());
    
    // Clicking anywhere in the terminal body focuses input
    this.body.addEventListener('click', () => this.input.focus());
    
    // Hook up quick commands
    document.querySelectorAll('.terminal-quick-cmd').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cmd = e.target.getAttribute('data-cmd');
        this.input.value = cmd;
        this.updateCursorPosition();
        this.executeCommand(cmd);
      });
    });
    
    // Initial welcome text
    this.printLine('Initializing Imeth Jayasinghe CLI Terminal v1.0.0...', 'text-muted');
    this.printLine('Type <span class="text-primary">help</span> to view available commands, or click the quick action tags below.', 'text-secondary');
    this.printLine(' ', 'text-secondary');
    
    this.updateCursorPosition();
    this.input.focus({ preventScroll: true });
  }

  updateCursorPosition() {
    const text = this.input.value;
    const charWidth = 8.5;
    this.cursor.style.left = `${text.length * charWidth}px`;
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      const command = this.input.value.trim();
      this.executeCommand(command);
      this.input.value = '';
      this.updateCursorPosition();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0) {
        if (this.historyIndex === -1) {
          this.historyIndex = this.history.length - 1;
        } else if (this.historyIndex > 0) {
          this.historyIndex--;
        }
        this.input.value = this.history[this.historyIndex];
        this.updateCursorPosition();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex !== -1) {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = -1;
          this.input.value = '';
        }
        this.updateCursorPosition();
      }
    }
  }

  printLine(htmlContent, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = htmlContent;
    this.body.appendChild(line);
    this.body.scrollTop = this.body.scrollHeight;
  }

  printPrompt(cmd) {
    const line = document.createElement('div');
    line.className = 'terminal-prompt-line';
    line.innerHTML = `<span class="terminal-prompt">guest@imeth-jayasinghe:~$</span> <span style="color:#fff">${cmd}</span>`;
    this.body.appendChild(line);
  }

  executeCommand(commandStr) {
    if (!commandStr) return;
    
    this.printPrompt(commandStr);
    
    // Save to history
    this.history.push(commandStr);
    this.historyIndex = -1;
    
    const parts = commandStr.toLowerCase().split(' ');
    const cmd = parts[0];
    
    // If mini-game is active
    if (this.isGameActive) {
      this.handleGame(commandStr);
      return;
    }
    
    switch (cmd) {
      case 'help':
        this.printHelp();
        break;
      case 'about':
        this.printAbout();
        break;
      case 'skills':
        this.printSkills();
        break;
      case 'projects':
        this.printProjects();
        break;
      case 'contact':
        this.printContact();
        break;
      case 'clear':
        this.body.innerHTML = '';
        break;
      case 'secret':
        this.startSecretGame();
        break;
      default:
        this.printLine(`Command not found: <span style="color:#ef4444">${commandStr}</span>. Type <span style="color:#00F2FE">help</span> for assistance.`, 'terminal-output');
    }
  }

  printHelp() {
    this.printLine('<div style="color:#38bdf8; font-weight:600; margin-bottom:0.25rem;">Available CLI Commands:</div>', 'terminal-output');
    this.printLine(`
      <table class="terminal-table">
        <tr><td>about</td><td>View profile bio and career motivations.</td></tr>
        <tr><td>skills</td><td>Detailed technical stack classification.</td></tr>
        <tr><td>projects</td><td>Highlighted software development works summary.</td></tr>
        <tr><td>contact</td><td>View contact email, phone, and locations.</td></tr>
        <tr><td>clear</td><td>Clears the terminal console workspace screen.</td></tr>
        <tr><td>secret</td><td>Launch interactive guessing game.</td></tr>
      </table>
    `, 'terminal-output');
  }

  printAbout() {
    this.printLine('<div style="color:#38bdf8; font-weight:600; margin-bottom:0.35rem;">Core Engineering Profile:</div>', 'terminal-output');
    this.printLine('  <span style="color:#f1f5f9; line-height:1.6;">I am a Software Engineering Graduate (BSc Hons, 2nd Upper Division from University of Bedfordshire). My passion lies in building collaborative systems, designing responsive user interfaces, and writing clean, scalable code. Experience includes serving as an Undergraduate Trainee at Hatton National Bank, overseeing network-wide Queue Management System operations.</span>', 'terminal-output');
  }

  printSkills() {
    this.printLine('<div style="color:#38bdf8; font-weight:600; margin-bottom:0.25rem;">Categorized Technical Competencies:</div>', 'terminal-output');
    this.printLine(`
      <table class="terminal-table">
        <tr><td>Languages</td><td>Java, JavaScript (ES6+), TypeScript, Python 3.11+, C++, Pascal, HTML5, CSS3</td></tr>
        <tr><td>Frameworks</td><td>React, Next.js, React Native, NestJS, Express.js, Node.js, Spring Boot, Django 5, Laravel, Flutter, jQuery, TailwindCSS, Bootstrap</td></tr>
        <tr><td>Testing & Tools</td><td>JUnit 5, Jest, Playwright, Axios, Jackson, Pillow, nh3, Maven, npm</td></tr>
        <tr><td>Databases & ORM</td><td>PostgreSQL 16, MySQL, MongoDB, Firebase, Supabase, Redis 7, H2 | Hibernate, Django ORM, Prisma, Laravel Eloquent</td></tr>
        <tr><td>DevOps & Security</td><td>Docker, Spring Security, Django Security (RBAC), Passport.js JWT, Google Cloud (GCP), Vercel WSGI, Apache, WhiteNoise</td></tr>
        <tr><td>IDEs, Tools & OS</td><td>Git, GitHub, Postman, Bruno, VS Code, IntelliJ IDEA, NetBeans, Visual Studio | Ubuntu Linux, Windows</td></tr>
      </table>
    `, 'terminal-output');
  }

  printProjects() {
    this.printLine('<div style="color:#38bdf8; font-weight:600; margin-bottom:0.5rem;">Featured Engineering Projects:</div>', 'terminal-output');
    this.printLine('  1. <strong style="color:#38bdf8;">Sector Educational Institute Management System</strong> <span style="color:#cbd5e1">- Full-stack NestJS + React platform (Upgraded 3rd-Year Project) featuring Barcode Attendance, 75/25 Teacher Commission Splits, F2 Cashier Billing, Ctrl+K Palette, & Headless PDF Receipts.</span>', 'terminal-output');
    this.printLine('  2. <strong style="color:#38bdf8;">SL-GreenRoot Market</strong> <span style="color:#cbd5e1">- Secure Supermarket Inventory & POS System (Python 3.11, Django 5, Tailwind CSS, PostgreSQL, Supabase, Vercel).</span>', 'terminal-output');
    this.printLine('  3. <strong style="color:#38bdf8;">Sector Education Institute Website</strong> <span style="color:#cbd5e1">- Modern web portal (React, Vite, Tailwind CSS, Firebase Firestore & SSR). Live: https://sectorinstitute.lk</span>', 'terminal-output');
    this.printLine('  4. <strong style="color:#38bdf8;">Desktop Educational App</strong> <span style="color:#cbd5e1">- Desktop management console layout (Java Swing, NetBeans).</span>', 'terminal-output');
    this.printLine('  5. <strong style="color:#38bdf8;">Vehicle Management System (VehicleOS)</strong> <span style="color:#cbd5e1">- Decoupled full-stack fleet tracking system (Java 21, Spring Boot 3.4, React 19, Vite, H2 DB).</span>', 'terminal-output');
  }

  printContact() {
    this.printLine('<div style="color:#38bdf8; font-weight:600; margin-bottom:0.25rem;">Connect with Imeth:</div>', 'terminal-output');
    this.printLine(`
      <table class="terminal-table">
        <tr><td>Email</td><td>imethjayasinghe02@gmail.com</td></tr>
        <tr><td>Phone</td><td>+94 779694612</td></tr>
        <tr><td>Address</td><td>3/B Grace Peiris Road, Panadura, Sri Lanka</td></tr>
        <tr><td>LinkedIn</td><td>linkedin.com/in/imeth-jayasinghe</td></tr>
      </table>
    `, 'terminal-output');
  }

  startSecretGame() {
    this.isGameActive = true;
    this.secretNumber = Math.floor(Math.random() * 20) + 1;
    this.gameAttempts = 0;
    this.printLine('========================================', 'terminal-prompt');
    this.printLine('🎲 Welcome to the Secret Number Game!', 'terminal-prompt');
    this.printLine('<span style="color:#e2e8f0;">I have generated a random number between 1 and 20.</span>', 'terminal-output');
    this.printLine('<span style="color:#e2e8f0;">Try to guess it! Type your number below:</span>', 'terminal-output');
    this.printLine('========================================', 'terminal-prompt');
  }

  handleGame(guessStr) {
    const guess = parseInt(guessStr, 10);
    this.gameAttempts++;
    
    if (isNaN(guess)) {
      this.printLine('Please enter a valid number between 1 and 20.', 'terminal-output');
      return;
    }
    
    if (guess === this.secretNumber) {
      this.printLine(`<span style="color:#10b981; font-weight:600;">🎉 Congratulations! You guessed the number ${this.secretNumber} in ${this.gameAttempts} attempts.</span>`, 'terminal-output');
      this.printLine('<span style="color:#10b981; font-weight:600;">Secret unlocked: You have proven your developer debugging skill! 🚀</span>', 'terminal-output');
      this.isGameActive = false;
      this.secretNumber = null;
    } else if (guess < this.secretNumber) {
      this.printLine('<span style="color:#f59e0b;">Too low! Try again:</span>', 'terminal-output');
    } else {
      this.printLine('<span style="color:#f59e0b;">Too high! Try again:</span>', 'terminal-output');
    }
  }
}
