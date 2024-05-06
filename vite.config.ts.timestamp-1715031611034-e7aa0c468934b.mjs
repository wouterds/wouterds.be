// vite.config.ts
import {
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
  vitePlugin as remix
} from "file:///Users/wouterds/Projects/wouterds.be/node_modules/@remix-run/dev/dist/index.js";
import { installGlobals } from "file:///Users/wouterds/Projects/wouterds.be/node_modules/@remix-run/node/dist/index.js";
import { defineConfig } from "file:///Users/wouterds/Projects/wouterds.be/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/wouterds/Projects/wouterds.be/node_modules/vite-tsconfig-paths/dist/index.mjs";
installGlobals();
var vite_config_default = defineConfig({
  server: {
    port: 3e3
  },
  ssr: {
    noExternal: ["react-use"]
  },
  optimizeDeps: {
    include: ["react-use"]
  },
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      ignoredRouteFiles: ["**/*.css"],
      appDirectory: "src",
      future: {
        unstable_singleFetch: true
      }
    }),
    tsconfigPaths()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd291dGVyZHMvUHJvamVjdHMvd291dGVyZHMuYmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy93b3V0ZXJkcy9Qcm9qZWN0cy93b3V0ZXJkcy5iZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvd291dGVyZHMvUHJvamVjdHMvd291dGVyZHMuYmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQge1xuICBjbG91ZGZsYXJlRGV2UHJveHlWaXRlUGx1Z2luIGFzIHJlbWl4Q2xvdWRmbGFyZURldlByb3h5LFxuICB2aXRlUGx1Z2luIGFzIHJlbWl4LFxufSBmcm9tICdAcmVtaXgtcnVuL2Rldic7XG5pbXBvcnQgeyBpbnN0YWxsR2xvYmFscyB9IGZyb20gJ0ByZW1peC1ydW4vbm9kZSc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuXG5pbnN0YWxsR2xvYmFscygpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICB9LFxuICBzc3I6IHtcbiAgICBub0V4dGVybmFsOiBbJ3JlYWN0LXVzZSddLFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3JlYWN0LXVzZSddLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVtaXhDbG91ZGZsYXJlRGV2UHJveHkoKSxcbiAgICByZW1peCh7XG4gICAgICBpZ25vcmVkUm91dGVGaWxlczogWycqKi8qLmNzcyddLFxuICAgICAgYXBwRGlyZWN0b3J5OiAnc3JjJyxcbiAgICAgIGZ1dHVyZToge1xuICAgICAgICB1bnN0YWJsZV9zaW5nbGVGZXRjaDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgdHNjb25maWdQYXRocygpLFxuICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSO0FBQUEsRUFDNVIsZ0NBQWdDO0FBQUEsRUFDaEMsY0FBYztBQUFBLE9BQ1Q7QUFDUCxTQUFTLHNCQUFzQjtBQUMvQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUUxQixlQUFlO0FBRWYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFlBQVksQ0FBQyxXQUFXO0FBQUEsRUFDMUI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxXQUFXO0FBQUEsRUFDdkI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLHdCQUF3QjtBQUFBLElBQ3hCLE1BQU07QUFBQSxNQUNKLG1CQUFtQixDQUFDLFVBQVU7QUFBQSxNQUM5QixjQUFjO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixzQkFBc0I7QUFBQSxNQUN4QjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLEVBQ2hCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
