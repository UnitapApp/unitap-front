const { createProxyMiddleware } = require('http-proxy-middleware');
const { getUnitapBackendAddress } = require('utils/env');

module.exports = function (app) {
  if (process.env.NODE_ENV === 'development') {
    app.use(
      '/api',
      createProxyMiddleware({
        target: getUnitapBackendAddress(),
        changeOrigin: true,
      }),
    );
  }
};
