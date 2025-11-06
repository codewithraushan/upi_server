module.exports = {
  apps: [
    {
      name: "upi_server",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "300M",

      // ✅ Log file locations
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      time: true,

      // ✅ Environment variables
      env: {
        NODE_ENV: "development",
        PORT: 5500
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5500
      }
    }
  ],

  // ✅ PM2 Log Rotate Settings
  deploy: {},

  // ✅ Global PM2 modules config (log rotation)
  // (PM2 will automatically use these if pm2-logrotate is installed)
  logrotate: {
    max_size: "10M",              // Rotate when log exceeds 10MB
    retain: 5,                    // Keep last 5 files
    compress: true,               // gzip older logs
    dateFormat: "YYYY-MM-DD_HH-mm-ss",
    rotateInterval: "0 0 * * *",  // Daily at midnight
    workerInterval: "30",         // Check every 30 seconds
  }
};
