function logStep(message) {
  console.log(`[STEP] ${message}`);
}

function logInfo(message) {
  console.log(`[INFO] ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

module.exports = { logStep, logInfo, logError };
