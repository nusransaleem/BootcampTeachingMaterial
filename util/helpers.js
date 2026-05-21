const fs = require('fs');
const path = require('path');

function loadEnvFile(envName = 'qa') {
  const envPath = path.resolve(__dirname, `../env/${envName}.env`);
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}

function getCartBadgeExpectedCount(beforeCount, delta) {
  const next = Number(beforeCount) + delta;
  return next > 0 ? next.toString() : '';
}

module.exports = { loadEnvFile, getCartBadgeExpectedCount };
