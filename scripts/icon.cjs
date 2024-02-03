const path = require("path");
const sharp = require("sharp");

const sizes = [16, 32, 48, 128];
const src = path.resolve(__dirname, "..", "icon-src", "favicon.svg");
const outputDir = path.resolve(__dirname, "..", "static", "images");

for (const size of sizes) {
  sharp(src)
    .resize(size, size)
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(path.join(outputDir, `icon-${size}.png`))
    .then((info) => {
      console.log(info);
    })
    .catch((err) => {
      console.error(err);
    });
}
