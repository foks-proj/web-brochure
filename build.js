#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { all } = require('express/lib/application');

const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');
const layoutsDir = path.join(viewsDir, 'layouts');
const outputDir = path.join(__dirname, 'dist');
const cssOutputDir = path.join(outputDir, 'css');
const imgOutputDir = path.join(outputDir, 'img');
const jsOutputDir = path.join(outputDir, 'js');

const allOutputDirs = [outputDir, cssOutputDir, imgOutputDir, jsOutputDir];
allOutputDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Register partials
fs.readdirSync(partialsDir).forEach(file => {
  const name = path.parse(file).name;
  const content = fs.readFileSync(path.join(partialsDir, file), 'utf8');
  handlebars.registerPartial(name, content);
});

// Register helpers
handlebars.registerHelper('cb', function (options) {
  return new handlebars.SafeString('<span class="text-info">' + options.fn(this) + '</span>');
});
handlebars.registerHelper('shcom', function (options) {
  return new handlebars.SafeString('<span class="text-secondary">' + options.fn(this) + '</span>');
});

const layoutSrc = fs.readFileSync(path.join(layoutsDir, 'main.handlebars'), 'utf8');
const layoutTemplate = handlebars.compile(layoutSrc);

// Compile the main template
const templateSrc = fs.readFileSync(path.join(viewsDir, 'home.handlebars'), 'utf8');
const pageTemplate = handlebars.compile(templateSrc);

const pageHtml = pageTemplate({});
const fullHtml = layoutTemplate({ body : pageHtml });

fs.writeFileSync(path.join(outputDir, 'index.html'), fullHtml);
console.log('Static HTML generated at dist/index.html');

// copy node_modules/bootstrap/dist/bootstrap.min.css to dist/css/bootstrap.min.css
fs.copyFileSync(
  path.join(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css'),
  path.join(cssOutputDir, 'bootstrap.min.css')
);

console.log('Bootstrap CSS copied to dist/css/bootstrap.min.css');

// copy all files from node_modules/bootstrap/dist/js to dist/js
fs.copyFileSync(
  path.join(__dirname, 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'),
  path.join(jsOutputDir, 'bootstrap.bundle.min.js')
);
console.log('Bootstrap JS copied to dist/js/bootstrap.bundle.min.js');

// copy all images from public/img to dist/img by first listing all the images
// and then copying each one
const imgFiles = fs.readdirSync(path.join(__dirname, 'public/img'));
imgFiles.forEach(file => {
  fs.copyFileSync(
    path.join(__dirname, 'public/img', file),
    path.join(imgOutputDir, file)
  );
});
console.log('Images copied to dist/img');
