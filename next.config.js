module.exports = {
  experimental: {
    reactRefresh: true,
  },
  webpack(config, options) {
    config.resolve.alias['react'] = require.resolve('react')
    return config
  }
}

