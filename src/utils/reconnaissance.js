const dns = require('dns').promises;
const geoip = require('geoip-lite');

const performDNSLookup = async (domain) => {
  try {
    const aRecords = await dns.resolve4(domain);
    const mxRecords = await dns.resolveMx(domain);
    const nsList = await dns.resolveNs(domain);
    const txtRecords = await dns.resolveTxt(domain);
    const cname = await dns.resolveCname(domain).catch(() => []);

    return {
      success: true,
      domain,
      aRecords,
      mxRecords,
      nameServers: nsList,
      txtRecords,
      cnameRecords: cname
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const getIPGeolocation = (ip) => {
  try {
    const geo = geoip.lookup(ip);
    return {
      success: true,
      ip,
      country: geo?.country,
      city: geo?.city,
      timezone: geo?.timezone,
      coordinates: geo?.ll,
      range: geo?.range
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

const isPrivateIP = (ip) => {
  const privateRanges = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./
  ];
  return privateRanges.some(range => range.test(ip));
};

const parseSubdomain = (domain) => {
  const commonSubdomains = [
    'www', 'mail', 'ftp', 'localhost', 'admin', 'api', 'dev', 'staging',
    'test', 'blog', 'news', 'shop', 'support', 'help', 'cdn', 'cdn1',
    'cdn2', 'static', 'assets', 'images', 'api-v1', 'api-v2', 'dashboard'
  ];
  return commonSubdomains;
};

module.exports = {
  performDNSLookup,
  getIPGeolocation,
  isPrivateIP,
  parseSubdomain
};