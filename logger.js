const logger = {
  log: (message) => console.log("Log:", message),
  debug: (message) => console.debug("Debug:", message),
  error: (message) => console.error("Error:", message),
  warn: (message) => console.warn("Warn:", message),
};

module.exports.logger = logger;
