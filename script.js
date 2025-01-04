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

// Simulate a Linux-like prompt
term.write("kali@web-terminal:~$ ");

// Handle input
term.onData((data) => {
  // Handle Enter key
  if (data === "\r") {
    term.write("\r\nkali@web-terminal:~$ ");
  } else {
    // Echo typed characters
    term.write(data);
  }
});

// Resize terminal on window resize
window.addEventListener("resize", () => fitAddon.fit());
