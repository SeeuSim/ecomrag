import userConfig from "../../vite.config.js";

const newConfig = async () => {
  const config = await (typeof userConfig === "function"
    ? userConfig({
        command: "build",
        mode: "production",
      })
    : userConfig);
  config.define = {
    ...config.define,
    "process.env": "window.gadgetConfig.env",
  };
  config.build = {
    ...config.build,
    manifest: true,
  };

  config.plugins = config.plugins ? config.plugins : [];
  

  return config;
};

export default newConfig;
