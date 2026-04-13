import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import rsc from '@vitejs/plugin-rsc';
import type { Logger } from 'babel-plugin-react-compiler';

const config = defineConfig({
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({ rsc: { enabled: true } }),
    rsc(),
    viteReact({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              logger: {
                logEvent(filename, event) {
                  switch (event.kind) {
                    case 'CompileSuccess': {
                      console.log(`✅ Compiled: ${filename}`);
                      break;
                    }
                    case 'CompileError': {
                      console.log(`❌ Compiler Error: ${filename}`);
                      console.error(`Reason: ${event.detail.reason}`);
                      break;
                    }
                    default: {
                    }
                  }
                },
              } satisfies Logger,
            },
          ],
        ],
      },
    }),
  ],
});

export default config;
