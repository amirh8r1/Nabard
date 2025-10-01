module.exports = {
  apps: [
    {
      name: "webservice-dev",
      script: "bin/www",
      cwd: "./",
      autorestart: true,
      exec_mode: "fork",
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["[/\\]./", "node_modules", "logs"],
    },
    {
      name: "prisma_studio",
      script: "npx prisma studio --port 5555 --browser none",
      cwd: "./",
      autorestart: true,
    },
  ],
};
