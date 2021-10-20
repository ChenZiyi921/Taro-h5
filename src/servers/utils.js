import Taro from "@tarojs/taro";
import cookie from "react-cookies";

/**
 * @description 获取当前页url
 */
export const getCurrentPageUrl = () => {
  let pages = Taro.getCurrentPages();
  let currentPage = pages[pages.length - 1];
  let url = currentPage.path;
  return url;
};

/**
 * @description: 过滤对象中为undefined的属性值
 * @param {obj}
 * @return {obj}
 */
export const clearDeep = obj => {
  if (!obj || !typeof obj === "object") return;
  const keys = Object.keys(obj);
  for (let key of keys) {
    const val = obj[key];
    if (typeof val === "undefined") {
      delete obj[key];
    } else if (typeof val === "object") {
      clearDeep(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        // 如某属性的值为不包含任何属性的独享，则将该属性删除
        delete obj[key];
      }
    }
  }
  return obj;
};

export const pageToLogin = () => {
  let path = getCurrentPageUrl();
  cookie.remove("_sessionId");
  cookie.remove("username");
  if (!path.includes("login")) {
    Taro.reLaunch({
      url: "/pages/login/index"
    });
  }
};
