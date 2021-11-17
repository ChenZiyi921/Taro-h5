import React, { Component } from "react";
import { connect } from "react-redux";
import Taro, { eventCenter, getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtButton, AtTabs, AtTabsPane, AtMessage } from "taro-ui";
import {
  setAllEvent,
  setCurrentEvent,
  setCurrentForm,
  setCurrentFormStatus,
  setCurrentFormList
} from "@/actions/patientCase";
import { setItemData } from "@/actions/formItemData";
import { setFormsData } from "@/actions/formsData";
import {
  insertForm,
  getCaseEventList,
  getProjectFormTree,
  getFormData,
  patchFormDataEntryComplete,
  patchFormDataEntryIncomplete,
  patchFormDataIncomplete,
  patchFormDataComplete,
  getFormStatus,
  refreshDateValidate,
  refreshDateBind,
  formValidate
} from "@/servers/servers";
import FormControl from "./form";
import NoData from "@/components/NoData";
import { questionRule } from "./rule";
import "./index.styl";

@connect(
  ({ library, patientCase, userInfo, formItemData, formsData }) => ({
    library,
    patientCase,
    userInfo,
    formItemData,
    formsData
  }),
  dispatch => ({
    setAllEvent(item) {
      dispatch(setAllEvent(item));
    },
    setCurrentEvent(data) {
      dispatch(setCurrentEvent(data));
    },
    setCurrentForm(data) {
      dispatch(setCurrentForm(data));
    },
    setCurrentFormStatus(data) {
      dispatch(setCurrentFormStatus(data));
    },
    setCurrentFormList(data, formInstanceList) {
      dispatch(setCurrentFormList(data, formInstanceList));
    },
    setItemData(data) {
      dispatch(setItemData(data));
    },
    setFormsData(data) {
      dispatch(setFormsData(data));
    }
  })
)
export default class OrderInfo extends Component {
  $instance = getCurrentInstance();

  state = {
    current: 0,
    current2: 0,
    current3: 0,
    formList: [],
    formData: [],
    formId: "",
    formIndex: 0,
    needToFill: true
  };

  componentDidMount() {
    const { displayEvent, currentCase } = this.props.patientCase;
    const { formList } = currentCase;
    if (displayEvent.length) {
      this.getFormTreeData(0);
      this.props.setCurrentEvent(displayEvent[0]);
    }
    if (formList?.length) {
      this.getFormTreeData(0);
      this.props.setAllEvent([
        {
          eventInstanceList: [{ projectEventFormList: formList }]
        }
      ]);
      this.props.setCurrentEvent({
        eventInstanceList: [{ projectEventFormList: formList }]
      });
    }
    this.containerRef = React.createRef();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getCaseEventList = () => {
    const {
      currentEvent: { eventInstanceList },
      currentForm
    } = this.props.patientCase;
    const { id } = currentForm;
    const {
      projectEventId,
      projectCaseEventId,
      projectCaseId
    } = eventInstanceList[0];
    getCaseEventList({
      projectEventId,
      projectCaseEventId,
      projectCaseId
    })
      .then(({ data: { data } }) => {
        if (data.length) {
          this.props.setCurrentFormList(
            data,
            data.filter(n => id === n.id)[0].formInstanceList
          );
        }
      })
      .catch(err => {});
  };

  insertForm = () => {
    const { userInfo, patientCase } = this.props;
    const { userId } = userInfo;
    const { currentForm } = patientCase;
    const { current3 } = this.state;
    const {
      projectCaseId,
      projectEventFormId,
      projectCaseEventId
    } = currentForm.formInstanceList[current3];
    insertForm({
      operatorId: userId,
      projectCaseId,
      projectEventFormId,
      projectCaseEventId
    })
      .then(({ data: { data, message } }) => {
        this.getCaseEventList();
        Taro.atMessage({
          message,
          type: "success"
        });
        setTimeout(() => {
          Taro.redirectTo({
            url: "/pages/patientCase/index"
          });
        }, 2000);
      })
      .catch(err => {});
  };

  getFormTreeData = value => {
    const { displayEvent, currentCase } = this.props.patientCase;
    const { formList: resFormList } = currentCase;
    this.setState(
      {
        formList:
          resFormList ||
          displayEvent[value || 0].eventInstanceList[0]?.projectEventFormList ||
          []
      },
      () => {
        const { formList } = this.state;
        const { library } = this.props;
        const { projectId } = library;
        this.getProjectFormTree(formList[0]);
      }
    );
  };

  getProjectFormTree = currentForm => {
    this.formValidate(currentForm).then(needToFill => {
      this.setState({ needToFill });
      if (needToFill) {
        const { library } = this.props;
        const { projectId } = library;
        const { formId } = currentForm;
        const { projectCaseFormId } = currentForm.formInstanceList[0];
        Taro.showLoading({
          title: "加载中",
          mask: true
        });
        this.setState({ formId });
        this.props.setCurrentForm(currentForm);
        this.getFormStatus(projectCaseFormId);
        getProjectFormTree({ projectId, formId })
          .then(res => {
            const { data } = res.data;
            this.setState({ formData: data }, () => {
              const { current3 } = this.state;
              const { formDataId } = currentForm.formInstanceList[current3];
              if (formDataId) {
                this.getFormData(projectId, formDataId);
              } else {
                this.props.setItemData({});
              }
            });
            Taro.hideLoading();
          })
          .catch(err => {});
      }
    });
  };

  getFormData = (projectId, formDataId) => {
    if (formDataId) {
      const { patientCase } = this.props;
      const { currentForm } = patientCase;
      const { formId } = currentForm;
      getFormData({ projectId, formDataId })
        .then(res => {
          this.props.setItemData(res.data.data.data);
          this.props.setFormsData({ [formId]: res.data.data.data });
        })
        .catch(err => {});
    } else {
      this.props.setItemData({});
    }
  };

  /**
   *
   * @param {*} item
   * @param {*} val  类型为 object，array，string
   */
  setFormItemData = (item, val, type) => {
    const { identifier } = item;
    const { label, value } = val;
    const { formItemData } = this.props;
    if (type === "image") {
      this.props.setItemData({
        ...formItemData,
        [identifier]: formItemData[identifier]?.length
          ? formItemData[identifier].concat(val)
          : [val]
      });
    } else {
      let setData = v => {
        this.props.setItemData({
          ...formItemData,
          [identifier]: v
        });
        questionRule(item);
      };
      setData(label || value || val);
    }
  };

  eventTabsClick = value => {
    const { displayEvent } = this.props.patientCase;
    this.props.setCurrentEvent(displayEvent[value]);
    this.setState({
      current: value,
      current2: 0,
      current3: 0,
      formIndex: 0
    });
    this.props.setItemData({});
    this.getFormTreeData(value);
  };

  formTabsClick = value => {
    const { formList } = this.state;
    this.props.setItemData({});
    this.setState(
      {
        current2: value,
        current3: 0,
        formIndex: value
      },
      () => {
        this.getProjectFormTree(formList[value]);
      }
    );
  };

  childFormTabsClick = value => {
    const { formList, current2 } = this.state;
    this.setState({
      current3: value,
      formIndex: value
    });
    this.props.setItemData({});
    this.getProjectFormTree(formList[current2]);
  };

  formValidate = currentForm => {
    return new Promise((resolve, reject) => {
      const { currentCase } = this.props.patientCase;
      const { projectCaseId } = currentCase;
      formValidate({
        projectCaseId,
        currentForm
      })
        .then(({ data: { data, code } }) => {
          if (code === "OK") {
            resolve(data);
          }
          reject(false);
        })
        .catch(err => {});
    });
  };

  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    });
  };

  saveFormData = saveType => {
    const { library, userInfo, patientCase, formItemData } = this.props;
    const { projectId, scheduled } = library;
    const { userId } = userInfo;
    const { formList, formIndex } = this.state;
    const { projectCaseFormId } = formList[formIndex].formInstanceList[0];

    const {
      currentEvent: { eventInstanceList },
      currentForm,
      currentCase
    } = patientCase;

    const { armId } = currentCase;
    const { id, formId } = currentForm;
    const {
      projectEventId,
      projectCaseEventId,
      projectCaseId
    } = eventInstanceList[0];
    let params = {};
    if (saveType.name === "patchFormDataEntryComplete") {
      params = {
        formItemData: {
          data: formItemData,
          metadata: {
            projectArmId: armId || undefined,
            projectCaseEventId,
            projectCaseFormId,
            projectCaseFormInstanceNo: 1,
            projectCaseId,
            projectEventFormId: id,
            projectEventId,
            projectFormId: formId,
            projectId
          }
        },
        projectCaseFormId,
        projectId,
        operatorId: userId,
        formId
      };
    } else {
      params = {
        formItemData,
        projectCaseFormId,
        projectId,
        operatorId: userId,
        formId
      };
    }

    saveType(params)
      .then(({ data: { data, code, message } }) => {
        this.getFormStatus(projectCaseFormId);
        Taro.atMessage({
          message,
          type: code === "OK" ? "success" : "error"
        });
        if (code === "OK") {
          if (scheduled) {
            this.refreshDateValidate().then(res => {
              if (res) {
                Taro.showModal({
                  title: "是否将本次更改应用到日程安排的生成策略?",
                  cancelText: "取消",
                  confirmText: "确认",
                  confirmColor: "#09f",
                  content: "本次更改可能影响日程安排的生成策略",
                  showCancel: true,
                  success: res => {
                    if (res.confirm) {
                      this.refreshConfirm();
                    }
                  }
                });
              }
            });
          }
        }
      })
      .catch(err => {});
  };

  requiredItem = data => {
    let requiredList = {};
    let requiredName = {};
    let requiredComputed = data => {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].required &&
          !data[i]?.ruleList[0]?.dependControlIdentifier
        ) {
          requiredList[data[i].identifier] = true;
          requiredName[data[i].identifier] = data[i].nameZh;
        }
        if (
          data[i].children &&
          !data[i]?.ruleList[0]?.dependControlIdentifier
        ) {
          requiredComputed(data[i].children);
        }
      }
      return { requiredList, requiredName };
    };
    return requiredComputed(data);
  };

  requiredComplete = () => {
    const { formItemData } = this.props;
    const { formData } = this.state;
    const { requiredList, requiredName } = this.requiredItem(formData);
    for (const key in requiredList) {
      if (formItemData[key] !== "" && formItemData[key] !== undefined) {
        requiredList[key] = false;
      } else {
        Taro.atMessage({
          message: `${requiredName[key]}是必填项`,
          type: "error"
        });
        break;
      }
    }
    return Object.values(requiredList).includes(true);
  };

  onSubmit = () => {
    const { currentForm } = this.props.patientCase;
    const { formEntryStatusCode } = currentForm.formInstanceList[0];
    if (formEntryStatusCode === "NO_DATA") {
      if (this.requiredComplete()) {
        this.saveFormData(patchFormDataEntryIncomplete);
      } else {
        if (!this.requiredComplete()) {
          Taro.showModal({
            title: "是否将该表单标记为已完成?",
            cancelText: "取消",
            confirmText: "确认",
            confirmColor: "#09f",
            content: "系统检测到该表单所有必填项都已填写",
            showCancel: true,
            success: res => {
              if (res.confirm) {
                this.saveFormData(patchFormDataEntryComplete);
              }
            }
          });
        }
      }
    } else if (formEntryStatusCode === "COMPLETE") {
      if (!this.requiredComplete()) {
        this.saveFormData(patchFormDataComplete);
      }
    } else {
      if (!this.requiredComplete()) {
        this.saveFormData(patchFormDataIncomplete);
      }
    }
  };

  refreshConfirm = () => {
    this.refreshDateBind();
  };

  onReset = () => {
    const { formItemData } = this.props;
    for (const key in formItemData) {
      formItemData[key] = "";
    }
    this.props.setItemData({
      ...formItemData
    });
  };

  getFormStatus = projectCaseFormId => {
    const { library } = this.props;
    const { projectId } = library;
    getFormStatus({ projectCaseFormId })
      .then(({ data: { data, code } }) => {
        this.props.setCurrentFormStatus(data);
        this.getFormData(projectId, data.formDataId);
      })
      .catch(err => {});
  };

  refreshDateValidate = () => {
    const { library, patientCase } = this.props;
    const { projectId } = library;
    const { currentForm } = patientCase;
    const { projectCaseFormId } = currentForm.formInstanceList[0];
    return new Promise((resolve, reject) => {
      refreshDateValidate({
        projectCaseFormId,
        projectId
      })
        .then(({ data: { data } }) => {
          resolve(data);
        })
        .catch(err => {});
    });
  };

  refreshDateBind = () => {
    const { library, patientCase, userInfo } = this.props;
    const { projectId } = library;
    const { currentForm } = patientCase;
    const { projectCaseFormId } = currentForm.formInstanceList[0];
    const { userId } = userInfo;
    refreshDateBind({
      projectCaseFormId,
      projectId,
      userId
    })
      .then(({ data: { data, code } }) => {
        this.props.setAllEvent(data);
      })
      .catch(err => {});
  };

  renderForm = () => {
    const { disabled } = this.$instance.router.params;
    const { formData, needToFill } = this.state;
    const { formItemData } = this.props;
    return (
      <View>
        {needToFill ? (
          <View>
            {formData.length ? (
              <FormControl
                formData={formData}
                formItemData={formItemData}
                setFormItemData={this.setFormItemData}
                disabled={disabled}
                requiredItem={this.requiredItem}
                ref={this.containerRef}
              />
            ) : null}
          </View>
        ) : (
          <NoData
            props={{
              iconName: "luru",
              text: "该表单不需要填写！",
              height: "400px",
              size: 200,
              color: "#eee",
              textStyle: { marginTop: "20px" }
            }}
          />
        )}
      </View>
    );
  };

  render() {
    const { disabled } = this.$instance.router.params;
    const { displayEvent, currentForm } = this.props.patientCase;
    const { repeatable } = currentForm;
    const { current, current2, current3, formList } = this.state;
    let eventListTitle = displayEvent.length
      ? displayEvent.map(item => {
          return {
            title: item.eventName
          };
        })
      : [];
    let formListTitle = formList.length
      ? formList.map(item => {
          return {
            title: item.formName
          };
        })
      : [];
    let childFormListTitle =
      currentForm?.formInstanceList?.length > 1
        ? currentForm.formInstanceList.map(item => {
            return {
              title: item.formInstanceName
            };
          })
        : [];
    return (
      <View>
        {displayEvent.length || formList.length ? (
          <View className="chen-wrap order-info">
            <AtMessage />
            {!eval(disabled) ? (
              <View className="action">
                <AtButton
                  type="secondary"
                  size="small"
                  className="button-success mr10"
                  disabled={!repeatable}
                  onClick={this.insertForm}
                >
                  增加
                </AtButton>
                <AtButton
                  formType="submit"
                  type="secondary"
                  size="small"
                  className="button-primary mr10"
                  onClick={this.onSubmit}
                >
                  保存
                </AtButton>
                <AtButton
                  formType="reset"
                  type="secondary"
                  size="small"
                  className="button-warring"
                  onClick={this.onReset}
                >
                  重置
                </AtButton>
              </View>
            ) : null}
            {displayEvent.length ? (
              <AtTabs
                scroll
                current={current}
                tabList={eventListTitle}
                onClick={this.eventTabsClick.bind(this)}
              >
                {displayEvent.map((item, index) => {
                  return (
                    <AtTabsPane current={current} index={index} key={index}>
                      <AtTabs
                        scroll
                        current={current2}
                        tabList={formListTitle}
                        onClick={this.formTabsClick.bind(this)}
                      >
                        {formList.length
                          ? formList.map((current, i) => {
                              return (
                                <AtTabsPane
                                  current={current2}
                                  index={i}
                                  key={i}
                                ></AtTabsPane>
                              );
                            })
                          : null}
                      </AtTabs>
                    </AtTabsPane>
                  );
                })}
              </AtTabs>
            ) : null}
            {currentForm.formInstanceList.length > 1 ? (
              <AtTabs
                scroll
                current={current3}
                tabList={childFormListTitle}
                onClick={this.childFormTabsClick.bind(this)}
              >
                {currentForm.formInstanceList.map((item, index) => {
                  return (
                    <AtTabsPane current={current3} index={index} key={index}>
                      {this.renderForm()}
                    </AtTabsPane>
                  );
                })}
              </AtTabs>
            ) : (
              this.renderForm()
            )}
          </View>
        ) : (
          <NoData
            props={{
              iconName: "zanwushuju",
              text: "该病例无可用事件实例"
            }}
          />
        )}
      </View>
    );
  }
}
