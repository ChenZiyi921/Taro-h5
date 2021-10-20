export const globalData = (function createCache() {
  const data = {};
  return {
    set(key, val) {
      data[key] = val;
    },
    get(key) {
      return data[key];
    }
  };
})();

/**
 * 递归通过父节点ID生成树结构
 * 思路：
 *      1. 第一次递归的时候查询出所有的父节点
 *      2. 然后通过当前父节点id不断地去查询所有子节点，直到递归完毕返回
 * @param {String} pid 父节点id
 */
export const getTrees = (pid = null, ary) => {
  if (!pid) {
    // 如果没有父id（第一次递归的时候）将所有父级查询出来
    return ary
      .filter(item => !item.parent)
      .map(item => {
        // 通过父节点ID查询所有子节点
        item.value = item.code;
        item.title = item.name;
        item.children = getTrees(item.code, ary);
        return item;
      });
  } else {
    return ary
      .filter(item => item.parent === pid)
      .map(item => {
        // 通过父节点ID查询所有子节点
        item.value = item.code;
        item.title = item.name;
        item.children = getTrees(item.code, ary);
        return item;
      });
  }
};
