import solc from "solc";
import defaultConfig from "../solidity/compile.config.json";
import fs from "fs";
import path from "path";

const updateSolCConfig = (
  name: string,
  config: { [setting: string]: any },
  content: string
) =>
  JSON.stringify({
    ...config,
    sources: {
      [name]: { content: content },
    },
  });

const compileSol = (
  filepath: string,
  name: string,
  config: { [setting: string]: any } = defaultConfig
) => {
  const solFileDescriptor = fs.openSync(filepath, "r");
  const contractFile = fs.readFileSync(solFileDescriptor, "utf-8");
  const updatedConfig = updateSolCConfig(name, config, contractFile);

  const compiled = JSON.parse(solc.compile(updatedConfig));
  fs.close(solFileDescriptor);
  return compiled;
};

export default compileSol;
