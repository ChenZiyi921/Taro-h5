import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import Taro from "@tarojs/taro";
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
import { uploadFileUrl, imagePreviewHost } from "@/servers/servers";
import { displayRule } from "./rule";

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

const FormControl = forwardRef((props, ref) => {
  const { formData, disabled: disable, formItemData } = props;
  let disabled = eval(disable);
  const [openStateArray, setOpenStateArray] = useState({});
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {}, []);

  let selectorChange = (item, options, event) => {
    props.setFormItemData(item, options[event.target.value]);
  };

  let dateChange = (item, event) => {
    props.setFormItemData(item, event.target);
  };

  let dateTimeChange = (item, event) => {
    props.setFormItemData(item, event);
  };

  let timeChange = (item, event) => {
    let val = event.detail.value.map(index => {
      return (index = index < 10 ? "0" + index : index + "");
    });
    props.setFormItemData(item, val.join(":"));
  };

  let checkboxChange = (item, event) => {
    props.setFormItemData(item, event);
  };

  let inputChange = (item, attr, event) => {
    if (attr && event.indexOf(".") !== -1 && event.split(".")[1].length > 2) {
      props.setFormItemData(item, event.substring(0, event.indexOf(".") + 3));
    } else {
      props.setFormItemData(item, event);
    }
  };

  let dateIntervalClick = () => {
    setOpen(!open);
  };

  let prefixZero = number => {
    return number < 10 ? "0" + number : number;
  };

  let timeIntervalChange = (item, event) => {
    const { value } = event.target;
    let newDate = moment(new Date()).format("YYYY-MM-DD");
    props.setFormItemData(item, {
      startTime: moment(
        `${newDate} ${prefixZero(value[0])}:${prefixZero(
          value[1]
        )}:${prefixZero(value[2])}`
      ).toISOString(),
      endTime: moment(
        `${newDate} ${prefixZero(value[4])}:${prefixZero(
          value[5]
        )}:${prefixZero(value[6])}`
      ).toISOString()
    });
  };

  let proportionChange = (item, obj, k, val) => {
    props.setFormItemData(item, { ...obj, [k]: val - 0 });
  };

  let onSelectDate = (item, selectDate) => {
    const { start, end } = selectDate.value;
    if (start && end) {
      props.setFormItemData(item, [start, end]);
      setOpen(!open);
    }
  };

  let rateChange = (item, obj, val) => {
    props.setFormItemData(item, obj[val - 1].label);
  };

  let onFileChange = (item, tempFilePaths, operationType, index) => {
    if (operationType === "add") {
      let uploadImages = i => {
        Taro.uploadFile({
          url: uploadFileUrl,
          filePath: tempFilePaths[i ? tempFilePaths.length - i : 0].url,
          name: "file",
          fileName:
            tempFilePaths[i ? tempFilePaths.length - i : 0]?.file
              ?.originalFileObj?.name,
          formData: {},
          success: res => {
            let resData = JSON.parse(res.data);
            if (resData.code === "OK") {
              Taro.showToast({
                title: "上传成功",
                icon: "success",
                duration: 2000
              });
              props.setFormItemData(
                item,
                {
                  url: `${imagePreviewHost}${encodeURIComponent(resData.data)}`
                },
                "image"
              );
            } else {
              Taro.showToast({
                title: resData.message,
                duration: 2000
              });
            }
          },
          fail: err => {
            Taro.showToast({
              title: "上传失败",
              duration: 2000
            });
          }
        });
      };
      if (tempFilePaths.length > 1) {
        for (
          let i = 1,
            l = tempFilePaths.length - formItemData[item.identifier].length;
          i <= l;
          i++
        ) {
          uploadImages(i);
        }
      } else {
        uploadImages(false);
      }
    } else {
      formItemData[item.identifier].splice(index, 1);
      props.setFormItemData(item, formItemData[item.identifier]);
    }
  };

  let onImageClick = (identifier, index, files) => {
    Taro.previewImage({
      current: formItemData[identifier][index].url, // 当前显示图片的http链接
      urls: formItemData[identifier] // 需要预览的图片http链接列表
    });
  };

  // useImperativeHandle(ref, () => ({
  //   questionRule
  // }));

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

  // let beforeRenderDom = item => {
  //   setOpenStateArray({
  //     ...openStateArray,
  //     [identifier]: !openStateArray[identifier]
  //   });
  // };

  let isEdit = item => {
    if (disabled) {
      return true;
    }
    return !item.valueEditable;
  };

  let renderDom = formData => {
    return formData.length
      ? formData.map((item, index) => {
          if (!item?.privateAttr?.isInTable) {
            const {
              selectedControlType,
              identifier,
              required,
              nameZh,
              privateAttr
            } = item;
            switch (selectedControlType) {
              case "date-picker":
                return displayRule(item) ? (
                  <Picker
                    disabled={isEdit(item)}
                    mode="date"
                    key={item.id}
                    onChange={e => {
                      dateChange(item, e);
                    }}
                  >
                    <AtList>
                      <AtListItem
                        disabled={isEdit(item)}
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
                        disabled={isEdit(item)}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                        extraText={
                          formItemData[identifier]
                            ? moment(formItemData[identifier]).format(
                                `YYYY-MM-DD ${privateAttr.timeFormat}`
                              )
                            : ""
                        }
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
                      precision={
                        privateAttr.timeFormat === "HH:mm:ss"
                          ? "second"
                          : privateAttr.timeFormat === "HH:mm"
                          ? "minute"
                          : "hour"
                      }
                      onConfirm={val => {
                        dateTimeChange(
                          item,
                          moment(val).format(`YYYY-MM-DD HH:mm:ss`)
                        );
                      }}
                      value={
                        formItemData[identifier]
                          ? new Date(formItemData[identifier])
                          : new Date()
                      }
                      min={new Date(new Date("1900/01/01 00:00:00").getTime())}
                      max={
                        new Date(
                          new Date(
                            `${new Date().getFullYear() + 30}/01/01 00:00:00`
                          ).getTime()
                        )
                      }
                    />
                  </View>
                ) : null;
              // case "time-picker":
              //   return displayRule(item) ? (
              //     <Picker
              //       disabled={isEdit(item)}
              //       mode="multiSelector"
              //       key={item.id}
              //       range={
              //         privateAttr.timeFormat === "HH:mm:ss"
              //           ? [hours, minutes, seconds]
              //           : privateAttr.timeFormat === "HH:mm"
              //           ? [hours, minutes]
              //           : [seconds]
              //       }
              //       value={
              //         formItemData[identifier] &&
              //         formItemData[identifier].split(":")
              //       }
              //       onChange={val => {
              //         timeChange(item, val);
              //       }}
              //     >
              //       <AtList>
              //         <AtListItem
              //           disabled={isEdit(item)}
              //           className={required ? "at-input__title--required" : ""}
              //           title={nameZh}
              //           extraText={formItemData[identifier]}
              //           arrow="right"
              //         />
              //       </AtList>
              //     </Picker>
              //   ) : null;
              // case "date-time-interval":
              case "input-text":
                return displayRule(item) ? (
                  <AtInput
                    disabled={isEdit(item)}
                    required={required}
                    key={item.id}
                    title={nameZh}
                    type="text"
                    value={formItemData[identifier]}
                    onChange={inputChange.bind(this, item, null)}
                    // placeholder={item.desc}
                  />
                ) : null;
              case "input-number":
                return displayRule(item) ? (
                  <AtInput
                    disabled={isEdit(item)}
                    required={required}
                    key={item.id}
                    title={nameZh}
                    type="number"
                    value={formItemData[identifier]}
                    onChange={inputChange.bind(this, item, {
                      selectedControlType,
                      privateAttr
                    })}
                  />
                ) : null;
              case "input-number-unit":
                return displayRule(item) ? (
                  <AtInput
                    disabled={isEdit(item)}
                    required={required}
                    key={item.id}
                    title={nameZh}
                    type="number"
                    value={formItemData[identifier]}
                    onChange={inputChange.bind(this, item, {
                      selectedControlType,
                      privateAttr
                    })}
                  >
                    <Text>{privateAttr.units[0]?.unit}</Text>
                  </AtInput>
                ) : null;
              case "input-number-unit-interval":
                return displayRule(item) ? (
                  <Proportion
                    key={item.id}
                    disabled={isEdit(item)}
                    required={required}
                    title={nameZh}
                    value={formItemData[identifier]}
                    onChange={proportionChange.bind(
                      this,
                      item,
                      formItemData[identifier]
                    )}
                    type="input-number-unit-interval"
                    privateAttr={privateAttr}
                  />
                ) : null;
              case "input-number-interval":
                return displayRule(item) ? (
                  <Proportion
                    key={item.id}
                    disabled={isEdit(item)}
                    required={required}
                    title={nameZh}
                    value={formItemData[identifier]}
                    onChange={proportionChange.bind(
                      this,
                      item,
                      formItemData[identifier]
                    )}
                    type="input-number-interval"
                  />
                ) : null;
              case "input-textarea":
                return displayRule(item) ? (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={isEdit(item)}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                      />
                    </AtList>
                    <AtTextarea
                      disabled={isEdit(item)}
                      count={false}
                      value={formItemData[identifier]}
                      onChange={inputChange.bind(this, item, null)}
                      maxLength={1000}
                      placeholder={item.desc}
                    />
                  </View>
                ) : null;
              case "input-proportion":
                return displayRule(item) ? (
                  <Proportion
                    key={item.id}
                    disabled={isEdit(item)}
                    required={required}
                    title={nameZh}
                    value={formItemData[identifier]}
                    onChange={proportionChange.bind(
                      this,
                      item,
                      formItemData[identifier]
                    )}
                    type="input-proportion"
                  />
                ) : null;
              case "group-box":
                return displayRule(item) ? (
                  <Accordion
                    disabled={isEdit(item)}
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
                    disabled={isEdit(item)}
                    mode="selector"
                    key={item.id}
                    range={privateAttr?.options}
                    rangeKey="label"
                    onChange={selectorChange.bind(
                      this,
                      item,
                      privateAttr?.options
                    )}
                  >
                    <AtList>
                      <AtListItem
                        disabled={isEdit(item)}
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
                    disabled={isEdit(item)}
                    mode="selector"
                    key={item.id}
                    range={privateAttr?.options}
                    rangeKey="label"
                    onChange={selectorChange.bind(
                      this,
                      item,
                      privateAttr?.options
                    )}
                  >
                    <AtList>
                      <AtListItem
                        disabled={isEdit(item)}
                        className={required ? "at-input__title--required" : ""}
                        title={nameZh}
                        extraText={formItemData[identifier]}
                        arrow="right"
                      />
                    </AtList>
                  </Picker>
                ) : null;
              case "checkbox":
                privateAttr?.options.map(item => {
                  item.value = item.label;
                  item.disabled = disabled;
                });
                return displayRule(item) ? (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={isEdit(item)}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                        extraText={formItemData[identifier]}
                      />
                    </AtList>
                    <AtCheckbox
                      options={privateAttr?.options}
                      selectedList={formItemData[identifier] || []}
                      onChange={checkboxChange.bind(this, item)}
                    />
                  </View>
                ) : null;
              case "date-interval":
                return displayRule(item) ? (
                  <AtList key={item.id}>
                    <AtListItem
                      disabled={isEdit(item)}
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
                        onSelectDate={onSelectDate.bind(this, item)}
                      />
                    </AtFloatLayout>
                  </AtList>
                ) : null;
              case "time-interval":
                const { startTime, endTime } = formItemData[identifier] || {};
                let sTime = startTime
                  ? moment(startTime).format("HH:mm:ss")
                  : null;
                console.log(sTime, "123214");
                let eTime = endTime ? moment(endTime).format("HH:mm:ss") : null;
                return displayRule(item) ? (
                  <Picker
                    disabled={isEdit(item)}
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
                    onChange={timeIntervalChange.bind(this, item)}
                  >
                    <AtList>
                      <AtListItem
                        disabled={isEdit(item)}
                        className={required ? "at-input__title--required" : ""}
                        title={nameZh}
                        extraText={startTime ? `${sTime} ~ ${eTime}` : ""}
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
                        disabled={isEdit(item)}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                      />
                    </AtList>
                    <img
                      style={disabled ? { opacity: ".3" } : {}}
                      src={privateAttr.dataValue}
                      alt={nameZh}
                    />
                  </View>
                ) : null;
              case "file":
                let files = formItemData[identifier] || [];
                return displayRule(item) ? (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={isEdit(item)}
                        title={nameZh}
                        className={required ? "at-input__title--required" : ""}
                      />
                    </AtList>
                    <AtImagePicker
                      multiple
                      files={files}
                      mode="aspectFill"
                      onChange={onFileChange.bind(this, item)}
                      // onFail={onFileFail.bind(this)}
                      onImageClick={onImageClick.bind(this, identifier)}
                    />
                  </View>
                ) : null;
              case "label":
                return (
                  <AtList key={item.id}>
                    <AtListItem
                      disabled={isEdit(item)}
                      title={nameZh}
                      className={required ? "at-input__title--required" : ""}
                    />
                  </AtList>
                );
              case "divider":
                const { isShowText, isDashed, orientation } = privateAttr;
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
                const { title, content } = privateAttr;
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
                return (
                  <View key={item.id}>
                    <AtList>
                      <AtListItem
                        disabled={isEdit(item)}
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
              case "rate":
                // taro rate 选中一星后不可再次点击清除，antd mobile 有allowClear
                return displayRule(item) ? (
                  <View
                    className={`proportion at-input ${
                      required ? "at-input__title--required" : ""
                    } ${disabled ? "at-input--disabled" : ""}`}
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Text>{nameZh}</Text>
                    <AtRate
                      margin={100}
                      max={privateAttr.options.length}
                      value={
                        privateAttr.options.findIndex(
                          n => n.label === formItemData[identifier]
                        ) + 1 || 0
                      }
                      onChange={rateChange.bind(
                        this,
                        item,
                        privateAttr.options
                      )}
                    />
                  </View>
                ) : null;
              default:
                return (
                  <AtList key={item.id}>
                    <AtListItem
                      disabled={isEdit(item)}
                      title={`${nameZh} - 不支持此类组件`}
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
});

const areEqual = (prevProps, nextProps) => {
  return isEqual(prevProps.formItemData, nextProps.formItemData);
};

export default React.memo(FormControl);
// export default React.memo(FormControl, areEqual);
