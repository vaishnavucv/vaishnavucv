// script.js

// Import Xterm.js and Fit Addon
const terminalContainer = document.getElementById("terminal");

// Initialize the terminal
const term = new Terminal({
  theme: {
    background: "#282a36",
    foreground: "#f8f8f2",
    cursor: "#f8f8f2",
  },
  cursorBlink: true,
  cols: 80,
  rows: 24,
});

// Fit Addon to auto-resize the terminal
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

// Attach terminal to the DOM
term.open(terminalContainer);

// Auto-fit the terminal to the container
fitAddon.fit();

// Simulated file structure for `ls` and `cd`
let currentDirectory = "~";
const fileSystem = {
  "~": ["Desktop", "Documents", "Downloads", "Music", "Pictures", "Videos"],
  "~/Documents": ["file1.txt", "file2.txt"],
};

// Simulated commands and responses
const commands = {
  pwd: () => currentDirectory,
  clear: () => {
    term.clear();
    return null; // No output for clear
  },
  ls: () => fileSystem[currentDirectory]?.join(" ") || "No such directory",
  cd: (dir) => {
    if (dir === "~") {
      currentDirectory = "~";
    } else if (fileSystem[`${currentDirectory}/${dir}`]) {
      currentDirectory += `/${dir}`;
    } else {
      return `bash: cd: ${dir}: No such file or directory`;
    }
    return null; // No output for successful cd
  },
};

// Display prompt
function displayPrompt() {
  term.write(`\r\nkali@web-terminal:${currentDirectory}$ `);
}

// Handle input and command execution
term.onData((data) => {
  if (data === "\r") {
    // Handle Enter key
    const input = buffer.trim();
    const [command, ...args] = input.split(" ");
    const output = commands[command]?.(args.join(" ")) || `bash: ${command}: command not found`;

    if (output !== null) {
      term.write(`\r\n${output}`);
    }
    buffer = ""; // Clear buffer after executing the command
    displayPrompt();
  } else if (data === "\u007F") {
    // Handle Backspace
    if (buffer.length > 0) {
      buffer = buffer.slice(0, -1);
      term.write("\b \b");
    }
  } else {
    // Append input to buffer
    buffer += data;
    term.write(data);
  }
});

// Initialize terminal
let buffer = "";
displayPrompt();

// Resize terminal on window resize
window.addEventListener("resize", () => fitAddon.fit());
