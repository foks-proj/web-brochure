#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');
const layoutsDir = path.join(viewsDir, 'layouts');
const outputDir = path.join(__dirname, 'dist');
const cssOutputDir = path.join(outputDir, 'css');
const imgOutputDir = path.join(outputDir, 'img');


if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
if (!fs.existsSync(cssOutputDir)) fs.mkdirSync(cssOutputDir);
if (!fs.existsSync(imgOutputDir)) fs.mkdirSync(imgOutputDir);

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
