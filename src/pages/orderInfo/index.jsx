import { Component } from "react";
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
  refreshDateBind
} from "@/servers/servers";
import FormControl from "./form";
import NoData from "@/components/NoData";
import "./index.styl";

@connect(
  ({ library, patientCase, userInfo }) => ({
    library,
    patientCase,
    userInfo
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
    formItemData: [],
    formId: ""
  };

  componentDidMount() {
    const { displayEvent } = this.props.patientCase;
    if (displayEvent.length) {
      this.getFormTreeData(0);
      this.props.setCurrentEvent(displayEvent[0]);
    }
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
      })
      .catch(err => {});
  };

  getFormTreeData = value => {
    const { displayEvent } = this.props.patientCase;
    this.setState(
      {
        formList:
          displayEvent[value || 0].eventInstanceList[0]?.projectEventFormList ||
          []
      },
      () => {
        const { formList } = this.state;
        this.getProjectFormTree(formList[0]);
      }
    );
  };

  getProjectFormTree = currentForm => {
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
            this.setState({
              formItemData: []
            });
          }
        });
        Taro.hideLoading();
      })
      .catch(err => {});
  };

  getFormData = (projectId, formDataId) => {
    getFormData({ projectId, formDataId })
      .then(res => {
        this.setState({
          formItemData: res.data.data.data
        });
      })
      .catch(err => {});
  };

  /**
   *
   * @param {*} identifier
   * @param {*} val  类型为 object，array，string
   */
  setFormItemData = (identifier, val) => {
    console.log(identifier, val);
    const { label, value } = val;
    this.setState(
      state => ({
        formItemData: {
          ...state.formItemData,
          [identifier]: label || value || val
        }
      }),
      () => {
        console.log(this.state.formItemData);
      }
    );
  };

  eventTabsClick = value => {
    const { displayEvent } = this.props.patientCase;
    this.props.setCurrentEvent(displayEvent[value]);
    this.setState({
      current: value,
      current2: 0,
      current3: 0
    });
    this.getFormTreeData(value);
  };

  formTabsClick = value => {
    const { formList } = this.state;
    this.setState({
      current2: value,
      current3: 0
    });
    this.getProjectFormTree(formList[value]);
  };

  childFormTabsClick = value => {
    const { formList, current2 } = this.state;
    this.setState({
      current3: value
    });
    this.getProjectFormTree(formList[current2]);
  };

  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    });
  };

  saveFormData = saveType => {
    const { library, userInfo, patientCase } = this.props;
    const { projectId, scheduled } = library;
    const { userId } = userInfo;
    const { formItemData, formList } = this.state;
    const { projectCaseFormId } = formList[0].formInstanceList[0];

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
    let requiredComputed = data => {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].required &&
          !data[i]?.ruleList[0]?.dependControlIdentifier
        ) {
          requiredList[data[i].identifier] = true;
        }
        if (
          data[i].children &&
          !data[i]?.ruleList[0]?.dependControlIdentifier
        ) {
          requiredComputed(data[i].children);
        }
      }
      return requiredList;
    };
    return requiredComputed(data);
  };

  requiredComplete = () => {
    const { formData, formItemData } = this.state;
    let requiredList = this.requiredItem(formData);
    for (const key in requiredList) {
      if (formItemData[key] !== "") {
        requiredList[key] = false;
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
        Taro.showModal({
          title: "是否将该表单标记为已完成?",
          cancelText: "取消",
          confirmText: "确认",
          confirmColor: "#09f",
          content: "系统检测到该表单所有必填项都已填写",
          showCancel: true,
          success: res => {
            if (res.confirm) {
              this.handleConfirm();
            }
          }
        });
      }
    } else if (formEntryStatusCode === "COMPLETE") {
      this.saveFormData(patchFormDataComplete);
    } else {
      this.saveFormData(patchFormDataIncomplete);
    }
  };

  handleConfirm = () => {
    this.saveFormData(patchFormDataEntryComplete);
  };

  refreshConfirm = () => {
    this.refreshDateBind();
  };

  onReset = () => {
    const { formItemData } = this.state;
    let reset = formItemData;
    for (const key in reset) {
      reset[key] = "";
    }
    this.setState(
      {
        formItemData: {
          ...formItemData,
          ...reset
        }
      },
      () => {
        console.log(this.state.formItemData);
      }
    );
  };

  getFormStatus = projectCaseFormId => {
    const { library } = this.props;
    const { projectId } = library;
    getFormStatus({ projectCaseFormId }).then(({ data: { data, code } }) => {
      this.props.setCurrentFormStatus(data);
      this.getFormData(projectId, data.formDataId);
    });
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
      }).then(({ data: { data } }) => {
        resolve(data);
      });
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
    }).then(({ data: { data, code } }) => {
      this.props.setAllEvent(data);
    });
  };

  render() {
    const { disabled } = this.$instance.router.params;
    const { displayEvent, currentForm } = this.props.patientCase;
    const { repeatable } = currentForm;
    const {
      current,
      current2,
      current3,
      formList,
      formData,
      formItemData
    } = this.state;
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
        {displayEvent.length ? (
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

            {formData.length ? (
              <View>
                {currentForm.formInstanceList.length > 1 ? (
                  <AtTabs
                    scroll
                    current={current3}
                    tabList={childFormListTitle}
                    onClick={this.childFormTabsClick.bind(this)}
                  >
                    {currentForm.formInstanceList.map((item, index) => {
                      return (
                        <AtTabsPane
                          current={current3}
                          index={index}
                          key={index}
                        >
                          <FormControl
                            formData={formData}
                            formItemData={formItemData}
                            setFormItemData={this.setFormItemData}
                            disabled={disabled}
                            requiredItem={this.requiredItem}
                          />
                        </AtTabsPane>
                      );
                    })}
                  </AtTabs>
                ) : (
                  <FormControl
                    formData={formData}
                    formItemData={formItemData}
                    setFormItemData={this.setFormItemData}
                    disabled={disabled}
                    requiredItem={this.requiredItem}
                  />
                )}
              </View>
            ) : null}
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
