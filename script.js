// script.js

// Import xterm.js
const { Terminal } = window;

// Create and configure the terminal
const term = new Terminal({
  theme: {
    background: "#282a36", // Dracula theme
    foreground: "#f8f8f2", // Text color
    cursor: "#f8f8f2",     // Cursor color
  },
});

// Open the terminal in the div with id "terminal"
term.open(document.getElementById("terminal"));

// Display a welcome message
term.writeln("Welcome to the Web Linux Terminal!");

// Simulated file system
const filesystem = {
  '/': {
    type: 'dir',
    contents: {
      home: { type: 'dir', contents: {} },
      file1: { type: 'file', content: 'Hello, World!' },
    },
  },
};

let currentDir = '/';

function resolvePath(path) {
  const parts = path.split('/').filter(Boolean);
  let node = filesystem['/'];
  for (const part of parts) {
    if (node.contents && node.contents[part]) {
      node = node.contents[part];
    } else {
      return null;
    }
  }
  return node;
}

function processCommand(command) {
  const [cmd, ...args] = command.split(' ');
  switch (cmd) {
    case 'ls':
      return Object.keys(resolvePath(currentDir).contents).join('\n');
    case 'pwd':
      return currentDir;
    case 'clear':
      term.clear();
      return '';
    default:
      return `${cmd}: command not found`;
  }
}

// Handle user input
term.prompt = () => term.write("\nkali@web-terminal:~$ ");

term.onKey(({ key, domEvent }) => {
  if (domEvent.key === "Enter") {
    const input = term.buffer.active.getLine(term.buffer.active.cursorY).translateToString();
    const command = input.split("~$ ")[1]?.trim();
    const output = processCommand(command);
    if (output) term.writeln(output);
    term.prompt();
  } else {
    term.write(key);
  }
});

term.prompt();
