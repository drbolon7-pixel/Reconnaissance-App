const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

const validateDomain = (domain) => {
  const re = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return re.test(domain);
};

const validateIP = (ip) => {
  const re = /^(\d{1,3}\.){3}\d{1,3}$/;
  return re.test(ip);
};

const validateIPv4 = (ip) => {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
};

const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  validateEmail,
  validateDomain,
  validateIP,
  validateIPv4,
  validateURL
};