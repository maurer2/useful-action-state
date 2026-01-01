//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  trailingComma: 'all',
  semi: true,
  singleQuote: true,
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  experimentalOperatorPosition: 'start',
}

export default config
