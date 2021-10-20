import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef
} from "react";
import { View, Text, Picker, RadioGroup, Radio } from "@tarojs/components";
import {
  AtList,
  AtListItem,
  AtForm,
  AtInput,
  AtCheckbox,
  AtCalendar,
  AtFloatLayout,
  AtTextarea,
  AtButton,
  AtAccordion,
  AtDivider,
  AtRate,
  AtImagePicker
} from "taro-ui";
import { DatePicker } from "antd-mobile";
import * as moment from "moment";
import { isEqual } from "lodash";
import Table from "taro3-table";
import Accordion from "@/components/Accordion";
import Proportion from "@/components/Proportion";
import IconFont from "@/components/iconfont";

let factoryArray = length => {
  return Array(length)
    .fill(0)
    .map((item, index) => (item = index < 10 ? "0" + index : index + ""));
};

let timeOptions = [];

let hours = factoryArray(24);
let minutes = factoryArray(60);
let seconds = factoryArray(60);
timeOptions = [hours, minutes, seconds, [], hours, minutes, seconds];

const FormControl = props => {
  const { formData, formItemData, disabled: disable } = props;
  let disabled = eval(disable);
  const [openStateArray, setOpenStateArray] = useState({});
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {}, []);

  let selectorChange = (identifier, options, event) => {
    props.setFormItemData(identifier, options[event.target.value]);
  };

  let dateChange = (identifier, event) => {
    props.setFormItemData(identifier, event.target);
  };

  let dateTimeChange = (identifier, event) => {
    props.setFormItemData(identifier, event);
  };

  let checkboxChange = (identifier, options, event) => {
    props.setFormItemData(identifier, event);
  };

  let inputChange = (identifier, event) => {
    props.setFormItemData(identifier, event);
  };

  let dateIntervalClick = () => {
    setOpen(!open);
  };

  let prefixZero = number => {
    return number < 10 ? "0" + number : number;
  };

  let timeIntervalChange = (identifier, event) => {
    const { value } = event.target;
    props.setFormItemData(identifier, {
      startTime: `${moment(new Date()).format("YYYY-MM-DD")} ${prefixZero(
        value[0]
      )}:${prefixZero(value[1])}:${prefixZero(value[2])}`,
      endTime: `${moment(new Date()).format("YYYY-MM-DD")} ${prefixZero(
        value[4]
      )}:${prefixZero(value[5])}:${prefixZero(value[6])}`
    });
  };

  let proportionChange = (identifier, obj, n, e) => {
    props.setFormItemData(identifier, { ...obj, [n]: e.target.value });
  };

  let onSelectDate = (identifier, selectDate) => {
    const { start, end } = selectDate.value;
    if (start && end) {
      props.setFormItemData(identifier, [start, end]);
      setOpen(!open);
    }
  };

  let displayRule = item => {
    // if (
    //   formItemData[item.ruleList[0]?.dependControlIdentifier] ===
    //   item.ruleList[0]?.ruleValue
    // ) {
    //   props.requiredItem(item);
    // }
    let flag = true;
    if (item.ruleList.length) {
      if (item.ruleType === "SKIP") {
        item.ruleList.forEach(item => {
          if (formItemData[item.dependControlIdentifier] === item.ruleValue) {
            flag = false;
          }
        });
      } else {
        item.ruleList.forEach(item => {
          flag = formItemData[item.dependControlIdentifier] === item.ruleValue;
        });
      }
    }
    return flag;
  };

  let filterByName = (data, Name) => {
    let dest = [];
    for (let i = 0; i < data.length; i++) {
      let ai = data[i];
      if (i == 0) {
        dest.push(ai);
      } else {
        let filterData = dest.filter(e => {
          if (e[Name] == ai[Name]) {
            Object.assign(e, ai);
          }
          return e[Name] == ai[Name];
        });
        if (filterData.length == 0) {
          dest.push(ai);
        }
      }
    }
    return dest;
  };

  let beforeRenderDom = item => {
    // setOpenStateArray({
    //   ...openStateArray,
    //   [identifier]: !openStateArray[identifier]
    // });
  };

  let renderDom = formData => {
    return formData.length
      ? formData.map((item, index) => {
          if (!item?.privateAttr?.isInTable) {
            const { selectedControlType, identifier, required, nameZh } = item;
            switch (selectedControlType) {
              case "date-picker":
                return displayRule(item) ? (
                  <Picker
                    disabled={disabled}
                    mode="date"
                    key={item.id}
                    onChange={dateChange.bind(this, identifier)}
                  >
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        className={required ? "at-input__title--required" : ""}
                        title={nameZh}
                        extraText={formItemData[identifier]}
                        arrow="right"
                      />
                    </AtList>
                  </Picker>
                ) : null;
              case "date-time-picker":
                return displayRule(item) ? (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                        extraText={formItemData[identifier]}
                        arrow="right"
                        onClick={() => {
                          setVisible(true);
                        }}
                      />
                    </AtList>
                    <DatePicker
                      visible={visible}
                      onClose={() => {
                        setVisible(false);
                      }}
                      precision="second"
                      onConfirm={val => {
                        dateTimeChange(
                          identifier,
                          moment(val).format("YYYY-MM-DD HH:mm:ss")
                        );
                      }}
                    />
                  </View>
                ) : null;
              case "input-text":
                return displayRule(item) ? (
                  <AtInput
                    disabled={disabled}
                    required={required}
                    key={item.id}
                    title={nameZh}
                    type="text"
                    value={formItemData[identifier]}
                    onChange={inputChange.bind(this, identifier)}
                  />
                ) : null;
              case "input-number":
                return displayRule(item) ? (
                  <AtInput
                    disabled={disabled}
                    required={required}
                    key={item.id}
                    title={nameZh}
                    type="number"
                    value={formItemData[identifier]}
                    onChange={inputChange.bind(this, identifier)}
                  />
                ) : null;
              case "group-box":
                console.log(displayRule(item));
                return displayRule(item) ? (
                  <Accordion
                    disabled={disabled}
                    key={item.id}
                    // open={openStateArray[identifier]}
                    title={nameZh}
                  >
                    {renderDom(item.children)}
                  </Accordion>
                ) : null;
              case "radio":
                return displayRule(item) ? (
                  <Picker
                    disabled={disabled}
                    mode="selector"
                    key={item.id}
                    range={item.privateAttr?.options}
                    rangeKey="label"
                    onChange={selectorChange.bind(
                      this,
                      identifier,
                      item.privateAttr?.options
                    )}
                  >
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        className={required ? "at-input__title--required" : ""}
                        title={nameZh}
                        extraText={formItemData[identifier]}
                        arrow="right"
                      />
                    </AtList>
                  </Picker>
                ) : null;
              case "select":
                return displayRule(item) ? (
                  <Picker
                    disabled={disabled}
                    mode="selector"
                    key={item.id}
                    range={item.privateAttr?.options}
                    rangeKey="label"
                    onChange={selectorChange.bind(
                      this,
                      identifier,
                      item.privateAttr?.options
                    )}
                  >
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        className={required ? "at-input__title--required" : ""}
                        title={nameZh}
                        extraText={formItemData[identifier]}
                        arrow="right"
                      />
                    </AtList>
                  </Picker>
                ) : null;
              case "checkbox":
                item.privateAttr?.options.map(item => {
                  item.value = item.label;
                  item.disabled = disabled;
                });
                return displayRule(item) ? (
                  <View>
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                        extraText={formItemData[identifier]}
                      />
                    </AtList>
                    <AtCheckbox
                      key={item.id}
                      options={item.privateAttr?.options}
                      selectedList={formItemData[identifier] || []}
                      onChange={checkboxChange.bind(
                        this,
                        identifier,
                        item.privateAttr?.options
                      )}
                    />
                  </View>
                ) : null;
              case "date-interval":
                return displayRule(item) ? (
                  <AtList key={item.id}>
                    <AtListItem
                      disabled={disabled}
                      title={nameZh}
                      extraText={
                        Array.isArray(formItemData[identifier])
                          ? formItemData[identifier]?.join(" ~ ")
                          : ""
                      }
                      arrow="right"
                      className={required ? "at-input__title--required" : ""}
                      onClick={dateIntervalClick}
                    />
                    <AtFloatLayout
                      isOpened={open}
                      title=""
                      onClose={dateIntervalClick}
                    >
                      <AtCalendar
                        isMultiSelect
                        currentDate={{
                          start: formItemData?.[identifier]?.[0],
                          end: formItemData?.[identifier]?.[1]
                        }}
                        onSelectDate={onSelectDate.bind(this, identifier)}
                      />
                    </AtFloatLayout>
                  </AtList>
                ) : null;
              case "time-interval":
                const { startTime, endTime } = formItemData[identifier] || {};
                let sTime = startTime
                  ? moment(startTime).format("HH:mm:ss")
                  : null;
                let eTime = endTime ? moment(endTime).format("HH:mm:ss") : null;
                return displayRule(item) ? (
                  <Picker
                    disabled={disabled}
                    mode="multiSelector"
                    key={item.id}
                    range={timeOptions}
                    value={
                      startTime
                        ? [
                            ...sTime.split(":").map(item => +item),
                            0,
                            ...eTime.split(":").map(item => +item)
                          ]
                        : null
                    }
                    onChange={timeIntervalChange.bind(this, identifier)}
                  >
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        className={required ? "at-input__title--required" : ""}
                        title={nameZh}
                        extraText={
                          startTime
                            ? `${moment(startTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )} ~ ${moment(endTime).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}`
                            : ""
                        }
                        arrow="right"
                      />
                    </AtList>
                  </Picker>
                ) : null;
              case "image":
                return displayRule(item) ? (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                      />
                    </AtList>
                    <img
                      style={disabled ? { opacity: ".3" } : {}}
                      src={item.privateAttr.dataValue}
                      alt={nameZh}
                    />
                  </View>
                ) : null;
              case "file":
                return displayRule(item) ? (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                      />
                    </AtList>
                    {/* <img src={item.privateAttr.dataValue} alt={nameZh} /> */}
                  </View>
                ) : null;
              case "input-number-unit":
                return displayRule(item) ? (
                  <AtInput
                    disabled={disabled}
                    required={required}
                    key={item.id}
                    title={nameZh}
                    type="text"
                    value={formItemData[identifier]}
                    onChange={inputChange.bind(this, identifier)}
                  >
                    <Text>{item.privateAttr.units[0].unit}</Text>
                  </AtInput>
                ) : null;
              case "input-textarea":
                return displayRule(item) ? (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                      />
                    </AtList>
                    <AtTextarea
                      disabled={disabled}
                      count={false}
                      value={formItemData[identifier]}
                      onChange={inputChange.bind(this, identifier)}
                      maxLength={1000}
                    />
                  </View>
                ) : null;
              case "input-proportion":
                return displayRule(item) ? (
                  <Proportion
                    key={item.id}
                    disabled={disabled}
                    required={required}
                    title={nameZh}
                    value={formItemData[identifier]}
                    onInput={proportionChange.bind(
                      this,
                      identifier,
                      formItemData[identifier]
                    )}
                  />
                ) : null;
              case "label":
                return (
                  <AtList key={item.id}>
                    <AtListItem
                      disabled={disabled}
                      title={nameZh}
                      className={required ? "at-input__title--required" : ""}
                    />
                  </AtList>
                );
              case "divider":
                const { isShowText, isDashed, orientation } = item.privateAttr;
                return (
                  <View
                    key={item.id}
                    style={Object.assign(
                      { margin: "30px auto 10px", position: "relative" },
                      disabled ? { opacity: ".3" } : {}
                    )}
                  >
                    <AtDivider
                      content={isShowText ? nameZh : ""}
                      className="AtDivider"
                    />
                  </View>
                );
              case "table":
                const { title, content } = item.privateAttr;
                let columns = title
                  .filter(item => item.rowIndex === 0)
                  .map((current, i) => {
                    return {
                      title: current.label,
                      dataIndex: i
                    };
                  });
                content.map((current, i) => {
                  return (current[current.colIndex] =
                    formItemData[current.controlIdentifier] || "");
                });
                let rowTitle = title.filter(
                  item => item.colIndex === 0 && item.rowIndex !== 0
                );
                let dataSource = filterByName(content, "rowIndex");
                dataSource.map(
                  (current, i) => (current[0] = rowTitle[i].label)
                );
                console.log(dataSource);
                return (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={disabled}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                      />
                    </AtList>
                    <Table
                      columns={columns}
                      dataSource={dataSource}
                      rowKey="rowIndex"
                      scroll={{ x: true }}
                      style={disabled ? { opacity: ".3" } : {}}
                      titleStyle={{ padding: "10px 0" }}
                      rowStyle={{ padding: "10px 0" }}
                      rowClassName="hr"
                      colStyle={{ display: "flex", justifyContent: "center" }}
                    />
                  </View>
                );
              case "SVG":
                return "";
              default:
                return (
                  <AtList key={item.id}>
                    <AtListItem
                      disabled={disabled}
                      title="未知组件"
                      className={required ? "at-input__title--required" : ""}
                    />
                  </AtList>
                );
            }
          }
        })
      : null;
  };

  return <AtForm className="page-section">{renderDom(formData)}</AtForm>;
};

const areEqual = (prevProps, nextProps) => {
  return isEqual(prevProps.formItemData, nextProps.formItemData);
};

export default React.memo(FormControl);
// export default React.memo(FormControl, areEqual);
