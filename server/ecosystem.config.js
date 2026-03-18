module.exports = {
  apps: [
    {
      name: 'vestir-server',
      script: 'src/index.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: '../logs/server-error.log',
      out_file: '../logs/server.log',
      time: true,
    },
  ],
};
