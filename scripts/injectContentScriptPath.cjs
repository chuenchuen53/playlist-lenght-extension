const path = require("path");
const fs = require("fs");

function replaceContentScriptPathInManifest(manifestPath, contentScriptDir) {
  console.log("[INFO]: replace content script path in manifest");

  const placeholder = "{{content.js}}";
  const manifest = fs.readFileSync(manifestPath, "utf-8");
  const filename = fs.readdirSync(contentScriptDir)[0];
  const contentScriptPath = `content/${filename}`;
  const updatedManifest = manifest.replace(placeholder, contentScriptPath);
  fs.writeFileSync(manifestPath, updatedManifest);
}

module.exports = replaceContentScriptPathInManifest;
