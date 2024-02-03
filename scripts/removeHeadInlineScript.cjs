const glob = require("tiny-glob");
const path = require("path");
const fs = require("fs");

async function removeHeadInlineScript(directory) {
  console.log("[INFO]: Removing Head Inline Scripts");

  const scriptRegx = /<script nonce="%sveltekit.nonce%">([\s\S]+?)<\/script>/;
  const files = await glob("**/*.{html}", {
    cwd: directory,
    dot: true,
    aboslute: true,
    filesOnly: true
  });
  files
    .map((f) => path.join(directory, f))
    .forEach((file) => {
      console.log(`[INFO]: edit file: ${file}`);
      const f = fs.readFileSync(file, { encoding: "utf-8" });

      const script = f.match(scriptRegx);
      if (script && script[1]) {
        const newHtml = f.replace(scriptRegx, "");
        fs.writeFileSync(file, newHtml);
      }
    });
}

module.exports = removeHeadInlineScript;
