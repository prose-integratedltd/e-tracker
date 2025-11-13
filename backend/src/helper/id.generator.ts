export function generateId(name: string): string {
  const now = new Date();
  const dateTime = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

  const usernameHex = Array.from(name.split(' ')[0])
    .map((char) => char.charCodeAt(0).toString(16))
    .join('');

  return `PIL-${dateTime}-${usernameHex}`;
}
