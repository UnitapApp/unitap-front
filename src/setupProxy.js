const { createProxyMiddleware } = require('http-proxy-middleware');
const { getUnitapBackendAddress, isProductionEnv } = require('utils/env');

module.exports = function (app) {
  if (!isProductionEnv()) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: getUnitapBackendAddress(),
        changeOrigin: true,
      }),
    );
  }
};
