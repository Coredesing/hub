module.exports = {
  apps: [{
    name: 'nextjs',
    script: 'npm',
    args: 'start',
    env: {
      PORT: 3000
    },
    env_production: {
      PORT: 1234
    }
  }]
}
