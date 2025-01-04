// script.js
const { Terminal } = window;
const term = new Terminal({
  theme: {
    background: "#282a36", // Dracula Background
    foreground: "#f8f8f2", // Text Color
    cursor: "#f8f8f2",     // Cursor Color
  },
});

term.open(document.getElementById("terminal"));

const filesystem = {
  '/': {
    type: 'dir',
    contents: {
      home: { type: 'dir', contents: {} },
      var: { type: 'dir', contents: {} },
      etc: { type: 'dir', contents: {} },
      file1: { type: 'file', content: '' },
    },
  },
};

let currentDir = '/';

function listDir(path) {
  const dir = resolvePath(path);
  if (dir && dir.type === 'dir') {
    return Object.keys(dir.contents).join('\n');
  }
  return `ls: cannot access '${path}': No such file or directory`;
}

function resolvePath(path) {
  const parts = path.split('/').filter(Boolean);
  let node = filesystem['/'];

  for (const part of parts) {
    if (node.contents[part]) {
      node = node.contents[part];
    } else {
      return null;
    }
  }
  return node;
}

function processCommand(input) {
  const [command, ...args] = input.split(' ');
  switch (command) {
    case 'ls':
      return listDir(currentDir);
    case 'pwd':
      return currentDir;
    case 'cd':
      if (args[0] && resolvePath(args[0])) {
        currentDir = args[0];
        return '';
      }
      return `cd: ${args[0]}: No such file or directory`;
    case 'mkdir':
      if (args[0]) {
        const dir = resolvePath(currentDir);
        dir.contents[args[0]] = { type: 'dir', contents: {} };
        return '';
      }
      return 'mkdir: missing operand';
    case 'clear':
      term.clear();
      return '';
    default:
      return `${command}: command not found`;
  }
}

term.writeln('Welcome to the Web Linux Terminal!');
term.prompt = () => term.write('\nkali@web-terminal:~$ ');

term.prompt();
term.onKey(({ key, domEvent }) => {
  const input = term.buffer.active.getLine(term.buffer.active.cursorY).translateToString();
  if (domEvent.key === 'Enter') {
    const result = processCommand(input.trim().split('~$ ')[1]);
    if (result) term.writeln(result);
    term.prompt();
  }
});
