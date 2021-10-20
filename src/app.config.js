import { useGlobalIconFont } from "./components/iconfont/helper";

export default {
  pages: [
    "pages/index/index",
    "pages/my/index",
    "pages/login/index",
    "pages/library/index",
    "pages/collect/index",
    "pages/password/index",
    "pages/statistics/index",
    "pages/patientCase/index",
    "pages/patientCreate/index",
    "pages/orderInfo/index"
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  usingComponents: Object.assign(useGlobalIconFont())
  // tabBar: {
  //   color: "#7f8389",
  //   selectedColor: "#00a8f3",
  //   borderStyle: "black",
  //   backgroundColor: "#f7f7fa",
  //   list: [
  //     {
  //       pagePath: "pages/index/index",
  //       text: "首页",
  //       iconPath: "assets/images/i-home.png",
  //       selectedIconPath: "assets/images/i-home-active.png"
  //     },
  //     {
  //       pagePath: "pages/my/index",
  //       text: "我的",
  //       iconPath: "assets/images/i-user.png",
  //       selectedIconPath: "assets/images/i-user-active.png"
  //     }
  //   ]
  // }
};
