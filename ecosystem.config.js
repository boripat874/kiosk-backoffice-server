module.exports = {
  apps : [{
    name: "KioskOffice",
    script: "npm",
    args: "start",
    // Optional: Add watch: true if you want PM2 to restart on file changes (good for dev)
    // watch: true,
    // Optional: Environment variables if needed
    instances: 1,
    // cron_restart: '0 0 * * *',
    env: {
      NODE_ENV: 'development',
      PORT: 3002 // <--- DEVELOPMENT PORT
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3002 // <--- PRODUCTION PORT
    }
    
  }]
};