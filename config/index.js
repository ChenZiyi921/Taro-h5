const path = require("path");
const config = {
  projectName: "clever-vico-lab",
  date: "2020-8-11",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [{ from: "src/serverConfig.js", to: "dist/serverConfig.js" }],
    options: {}
  },
  framework: "react",
  alias: {
    "@": path.resolve(__dirname, "..", "src")
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      },
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ["body"]
        }
      }
    },
    webpackChain(chain, webpack) {
      chain
        .plugin("analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin, []);
    }
  },
  h5: {
    publicPath: process.env.NODE_ENV === "development" ? "/" : "./",
    devServer: {
      proxy: {
        "/api/": {
          target: "http://172.16.20.53:8040/",
          pathRewrite: { "^/api/": "" },
          changeOrigin: true,
          secure: false
        }
      }
    },
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      },
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ["body"]
        }
      }
    }
  }
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
