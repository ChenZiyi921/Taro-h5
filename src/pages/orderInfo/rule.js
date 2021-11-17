import store from "@/store/index";
import Taro from "@tarojs/taro";

let logicalConjunction = (status, item) => {
  const { formItemData, formsData } = store.getState();
  const { isCrossForm4LogicRule } = item.privateAttr;
  let data = formItemData;
  let flag = status === "DISPLAY" ? false : true;
  if (item.logicalConjunction === "OR") {
    for (let i = 0, l = item.ruleList; i < l.length; i++) {
      if (isCrossForm4LogicRule) {
        // data = formsData[l[i].dependFormId]; // 跨表单新增代码，开发跨表单时需删除，后端有接口
      }
      if (data[l[i].dependControlIdentifier] === l[i].ruleValue) {
        flag = status === "DISPLAY";
        break;
      }
    }
  }
  if (item.logicalConjunction === "AND") {
    let temp = [];
    for (let i = 0, l = item.ruleList; i < l.length; i++) {
      if (isCrossForm4LogicRule) {
        // data = formsData[l[i].dependFormId];
      }
      temp.push(data[l[i].dependControlIdentifier] === l[i].ruleValue);
    }
    if (!temp.includes(false)) {
      flag = status === "DISPLAY";
    }
  }
  return flag;
};

let displayRule = item => {
  return !item.ruleList.length || logicalConjunction(item.ruleType, item);
};

let questionRule = item => {
  const { formItemData } = store.getState();
  if (item.questionRule) {
    const { identifier, questionRule } = item;
    const { conditionConjunction, memo, conditionList } = questionRule;
    if (conditionList?.length) {
      let temp = [];
      let selfVal = formItemData[identifier];
      conditionList.forEach(current => {
        let otherVal = formItemData[current.dependControlIdentifier];
        switch (current.conditionOperator) {
          case ">":
            temp.push(selfVal > otherVal);
            break;
          case "<":
            temp.push(selfVal < otherVal);
            break;
          case ">=":
            temp.push(selfVal >= otherVal);
            break;
          case "<=":
            temp.push(selfVal <= otherVal);
            break;
          case "=":
            temp.push(selfVal == otherVal); // 不能用===，因为输入框中number被转成string，下面!=同理
            break;
          case "!=":
            temp.push(selfVal != otherVal);
            break;
          default:
            break;
        }
      });
      if (conditionConjunction === "OR" && temp.includes(true)) {
        Taro.atMessage({
          message: memo,
          type: "warning"
        });
      }
      if (conditionConjunction === "AND" && !temp.includes(false)) {
        Taro.atMessage({
          message: memo,
          type: "warning"
        });
      }
    }
  }
};

export { displayRule, questionRule };
