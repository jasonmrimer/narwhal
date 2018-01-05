export function randomText(length: number) {
  return Array(length).fill('').map(randomASCIIChar).join('');
}

function randomASCIIChar() {
  const value = Math.random() * (90 - 65) + 65;
  return String.fromCharCode(value);
}