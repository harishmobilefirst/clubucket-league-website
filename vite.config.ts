// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy target is env-driven so the same source builds for either cloud:
//   - default (no env / DEPLOY_TARGET!=amplify) -> Cloudflare Workers (test/preview builds)
//   - DEPLOY_TARGET=amplify                     -> AWS Amplify SSR (production)
// The aws-amplify preset forces its own output dir (.amplify-hosting) and ignores the
// `output`/`cloudflare` options below, so those are only passed for the Cloudflare target.
const isAmplify = process.env.DEPLOY_TARGET === "amplify";

const nitro = isAmplify
  ? {
      preset: "aws-amplify",
      awsAmplify: {
        // Match package.json engines (node >=22).
        runtime: "nodejs22.x",
      },
    }
  : {
      preset: "cloudflare-module",
      output: {
        dir: "dist",
        publicDir: "dist/client",
        serverDir: "dist/server",
      },
      cloudflare: {
        nodeCompat: true,
        deployConfig: false,
      },
    };

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  nitro,
  tanstackStart: {
    server: { entry: "server" },
  },
});
