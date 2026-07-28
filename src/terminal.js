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
    this.printLine('Available CLI Commands:', 'terminal-output');
    this.printLine(`
      <table class="terminal-table">
        <tr><td>about</td><td>View profile bio and career motivations.</td></tr>
        <tr><td>skills</td><td>Detailed technical stack classification.</td></tr>
        <tr><td>projects</td><td>Highlighted software development works summary.</td></tr>
        <tr><td>contact</td><td>View contact email, phone, and locations.</td></tr>
        <tr><td>clear</td><td>Clears the terminal console workspace screen.</td></tr>
        <tr><td>secret</td><td>Launch guessing game.</td></tr>
      </table>
    `, 'terminal-output');
  }

  printAbout() {
    this.printLine('Core Engineering Profile:', 'terminal-output');
    this.printLine('  I am a Software Engineering Graduate (BSc Hons, 2nd Upper from University of Bedfordshire). My drive is to build collaborative systems and create engaging user experiences while exploring new frameworks. I have experience working as an Undergraduate Trainee at Hatton National Bank monitoring queue system infrastructure.', 'terminal-output');
  }

  printSkills() {
    this.printLine('Technical Skills Inventory:', 'terminal-output');
    this.printLine(`
      <table class="terminal-table">
        <tr><td>Languages</td><td>Java, JavaScript, Python, C++, C, SQL</td></tr>
        <tr><td>Frameworks</td><td>React, Spring Boot, Flutter, Node.js</td></tr>
        <tr><td>Web Dev</td><td>HTML5, CSS3, JavaScript, PHP, Bootstrap</td></tr>
        <tr><td>Databases</td><td>MySQL, Firebase</td></tr>
        <tr><td>IDEs & Tools</td><td>GitHub, VS Code, Apache NetBeans, IntelliJ IDEA, Android Studio, Git</td></tr>
        <tr><td>Interests</td><td>AI Development, Claude, Prompt Engineering</td></tr>
      </table>
    `, 'terminal-output');
  }

  printProjects() {
    this.printLine('Software Engineering Projects:', 'terminal-output');
    this.printLine('  1. <strong style="color:#00F2FE">Sector Educational Institute Management System</strong> - Full-stack NestJS + React platform (Upgraded 3rd-Year Project) featuring Barcode Attendance, 75/25 Teacher Commission Splits, F2 Cashier Billing, Ctrl+K Palette, & Headless PDF Receipts.', 'terminal-output');
    this.printLine('  2. <strong style="color:#00F2FE">New City Hardware</strong> - E-commerce store with low-stock warnings & analytics (React, Firebase).', 'terminal-output');
    this.printLine('  3. <strong style="color:#00F2FE">Vehicle Management System</strong> - Full-stack data portal calling Spring Boot APIs (React, Node, Java).', 'terminal-output');
    this.printLine('  4. <strong style="color:#00F2FE">Educational E-Commerce</strong> - Custom authentication web store (PHP, HTML/CSS, SQL, WAMP).', 'terminal-output');
    this.printLine('  5. <strong style="color:#00F2FE">Desktop Educational App</strong> - Desktop management console layout (Java Swing, NetBeans).', 'terminal-output');
  }

  printContact() {
    this.printLine('Connect with Imeth:', 'terminal-output');
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
    this.printLine('========================================', 'text-primary');
    this.printLine('🎲 Welcome to the Secret Number Game!', 'text-primary');
    this.printLine('I have generated a random number between 1 and 20.', 'terminal-output');
    this.printLine('Try to guess it! Type your number below:', 'terminal-output');
    this.printLine('========================================', 'text-primary');
  }

  handleGame(guessStr) {
    const guess = parseInt(guessStr, 10);
    this.gameAttempts++;
    
    if (isNaN(guess)) {
      this.printLine('Please enter a valid number between 1 and 20.', 'terminal-output');
      return;
    }
    
    if (guess === this.secretNumber) {
      this.printLine(`🎉 Congratulations! You guessed the number ${this.secretNumber} in ${this.gameAttempts} attempts.`, 'color-success');
      this.printLine('Secret unlocked: You have proven your developer debugging skill! 🚀', 'color-success');
      this.isGameActive = false;
      this.secretNumber = null;
    } else if (guess < this.secretNumber) {
      this.printLine('Too low! Try again:', 'terminal-output');
    } else {
      this.printLine('Too high! Try again:', 'terminal-output');
    }
  }
}
