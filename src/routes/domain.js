const express = require('express');
const router = express.Router();
const dns = require('dns').promises;
const whois = require('whois');
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const ScanResult = require('../models/ScanResult');

// DNS Lookup
router.post('/dns-lookup', authenticate, async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain required' });
    }

    const results = await dns.resolve4(domain);
    const mxRecords = await dns.resolveMx(domain);
    const txtRecords = await dns.resolveTxt(domain);

    const scanResult = new ScanResult({
      userId: req.user.userId,
      scanType: 'domain',
      target: domain,
      status: 'completed',
      results: {
        aRecords: results,
        mxRecords,
        txtRecords
      },
      metadata: {
        domain
      },
      completedAt: new Date()
    });

    await scanResult.save();

    res.json({
      domain,
      aRecords: results,
      mxRecords,
      txtRecords,
      scanId: scanResult._id
    });
  } catch (error) {
    res.status(500).json({ error: `DNS Lookup failed: ${error.message}` });
  }
});

// WHOIS Lookup
router.post('/whois', authenticate, async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain required' });
    }

    whois.lookup(domain, (err, data) => {
      if (err) {
        return res.status(500).json({ error: `WHOIS lookup failed: ${err.message}` });
      }

      // Save to database
      const scanResult = new ScanResult({
        userId: req.user.userId,
        scanType: 'domain',
        target: domain,
        status: 'completed',
        results: { whoisData: data },
        metadata: { domain },
        completedAt: new Date()
      });
      scanResult.save();

      res.json({
        domain,
        whoisData: data,
        scanId: scanResult._id
      });
    });
  } catch (error) {
    res.status(500).json({ error: `WHOIS lookup failed: ${error.message}` });
  }
});

// IP Geolocation
router.post('/ip-geolocation', authenticate, async (req, res) => {
  try {
    const { ip } = req.body;
    if (!ip) {
      return res.status(400).json({ error: 'IP address required' });
    }

    // Using geoip-lite
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(ip);

    const scanResult = new ScanResult({
      userId: req.user.userId,
      scanType: 'ip',
      target: ip,
      status: 'completed',
      results: geo,
      metadata: {
        ip,
        country: geo?.country,
        city: geo?.city
      },
      completedAt: new Date()
    });

    await scanResult.save();

    res.json({
      ip,
      geolocation: geo,
      scanId: scanResult._id
    });
  } catch (error) {
    res.status(500).json({ error: `Geolocation lookup failed: ${error.message}` });
  }
});

// Subdomain Enumeration (simulated)
router.post('/subdomain-enum', authenticate, async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Domain required' });
    }

    // Simulated common subdomains
    const commonSubdomains = ['www', 'mail', 'ftp', 'localhost', 'admin', 'api', 'dev', 'staging'];
    const foundSubdomains = [];

    for (const sub of commonSubdomains) {
      try {
        const fullDomain = `${sub}.${domain}`;
        const addresses = await dns.resolve4(fullDomain);
        foundSubdomains.push({ subdomain: fullDomain, ips: addresses });
      } catch (e) {
        // Subdomain not found
      }
    }

    const scanResult = new ScanResult({
      userId: req.user.userId,
      scanType: 'domain',
      target: domain,
      status: 'completed',
      results: { subdomains: foundSubdomains },
      metadata: { domain },
      completedAt: new Date()
    });

    await scanResult.save();

    res.json({
      domain,
      subdomains: foundSubdomains,
      total: foundSubdomains.length,
      scanId: scanResult._id
    });
  } catch (error) {
    res.status(500).json({ error: `Subdomain enumeration failed: ${error.message}` });
  }
});

module.exports = router;