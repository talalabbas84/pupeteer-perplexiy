const axios = require('axios');

class ProxyService {
  static async fetchWorkingProxies() {
    try {
      const response = await axios.get('https://api.proxyscrape.com/v4/free-proxy-list/get', {
        params: {
          request: 'get_proxies',
          country: 'ca',
          format: 'json',
          limit: 15,
          timeout: 20000,
        },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      return response.data
        .filter(proxy => proxy.alive && proxy.uptime > 0.8 && proxy.timeout < 5000)
        .map(proxy => `${proxy.protocol}://${proxy.ip}:${proxy.port}`);
    } catch (error) {
      console.error("Failed to fetch proxies:", error);
      return [];
    }
  }
}

module.exports = ProxyService;
