const path = require("path");
const removeHeadInlineScript = require("./removeHeadInlineScript.cjs");
const removeInlineScript = require("./removeInlineScript.cjs");
const replaceContentScriptPathInManifest = require("./injectContentScriptPath.cjs");
const child_process = require("child_process");

const execute = (command) => {
  const result = child_process.spawnSync(command, [], {
    encoding: "utf8",
    shell: true,
    stdio: "inherit"
  });
  if (result.error) {
    console.error(`Process executing command "${command}" failed or timeout.\n`);
    result.error.childProcessResult = result;
    throw result.error;
  }
  if (result.signal !== null) {
    const error = new Error(`Command "${command}" terminated with ${result.signal}`);
    error.childProcessResult = result;
    throw error;
  }
  if (result.status !== 0) {
    const error = new Error(`Command "${command}" returns non-zero exit code`);
    error.childProcessResult = result;
    throw error;
  }
  return result;
};

async function build() {
  console.log("[INFO]: build popup");
  execute("vite build");

  console.log("[INFO]: build content");
  execute("vite build -c vite.config.content.ts");

  const buildRootDir = path.resolve(__dirname, "..", "build");
  const manifestPath = path.join(buildRootDir, "manifest.json");
  const contentScriptDir = path.join(buildRootDir, "content");

  await removeHeadInlineScript(buildRootDir);
  await removeInlineScript(buildRootDir);
  replaceContentScriptPathInManifest(manifestPath, contentScriptDir);
}

build();
