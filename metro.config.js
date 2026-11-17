const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// SQLite's web worker needs WASM and cross-origin isolation in the dev server.
config.resolver.assetExts.push('wasm');
const previousMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const next = previousMiddleware ? previousMiddleware(middleware, server) : middleware;
  return (request, response, done) => {
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    return next(request, response, done);
  };
};
module.exports = config;
