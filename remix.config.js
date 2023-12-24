/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*", "**/*.css"],
  server: "./src/server.ts",
  serverBuildPath: "functions/[[path]].js",
  serverConditions: ["workerd", "worker", "browser"],
  serverDependenciesToBundle: "all",
  serverMainFields: ["browser", "module", "main"],
  serverMinify: true,
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  appDirectory: "src",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
};
