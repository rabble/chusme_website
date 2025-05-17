#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Ensure the static directory in dist exists
if (!fs.existsSync('dist/static')) {
  fs.mkdirSync('dist/static', { recursive: true });
}

// Build Tailwind CSS
console.log('Building Tailwind CSS...');
execSync('npx tailwindcss -i ./src/globals.css -o ./static/styles.css');

// Copy the static files to the dist directory
console.log('Copying static files...');
execSync('cp -r static/* dist/static/');

// Build the TypeScript code with esbuild
console.log('Building TypeScript with esbuild...');
execSync('npx esbuild src/index.ts --bundle --minify --format=esm --outfile=dist/index.js --platform=browser');

// Copy the wrangler.toml file to the dist directory
console.log('Copying wrangler.toml...');
fs.copyFileSync('wrangler.toml', 'dist/wrangler.toml');

console.log('Build completed successfully!');