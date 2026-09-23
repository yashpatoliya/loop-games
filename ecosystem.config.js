module.exports = {
  apps: [
    {
      name: "loop-games",
      script: "npm",
      args: "run start",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
