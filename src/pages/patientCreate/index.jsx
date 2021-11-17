import Taro from "@tarojs/taro";
import { Component } from "react";
import { connect } from "react-redux";
import produce from "immer";
import { View, Text, Picker } from "@tarojs/components";
import {
  AtList,
  AtListItem,
  AtForm,
  AtInput,
  AtButton,
  AtMessage
} from "taro-ui";
import * as moment from "moment";
import IconFont from "@/components/iconfont";
import {
  getDictionaryChinaRegion,
  getDictionaryNation,
  getDictionaryProfession,
  getDictionaryRelation,
  getDictionaryCaseMetadata,
  getProjectArms,
  addProjectCase
} from "@/servers/servers";

import { default as PickerAddress } from "react-picker-address";
import "react-picker-address/dist/react-picker-address.css";
import { getTrees } from "@/utils/utils";

import "./index.styl";

@connect(
  ({ library, userInfo }) => ({
    library,
    userInfo
  }),
  dispatch => ({})
)
export default class PatientCreate extends Component {
  state = {
    armsList: [],
    selectArm: {},
    sexList: ["男", "女", "未知"],
    marriageStatusList: ["未婚", "已婚", "丧偶", "离婚", "未知婚姻状况"],
    professionList: [],
    selectProfession: {},
    value: "",
    visible: false,
    visible2: false,
    district: [],
    nationList: [],
    selectNation: {},
    relationList: [],
    selectRelation: {},
    caseMetadata: [],
    displayData: [],
    form: {
      caseMetadataVO: {
        address: "",
        birthDate: "",
        creatorId: "",
        idCardNumber: "",
        linkmanAddress: "",
        linkmanName: "",
        linkmanRegion: "",
        linkmanRelationCode: "",
        linkmanTelephone: "",
        marriageStatus: "",
        nationCode: "",
        patientId: "",
        patientName: "",
        professionCode: "",
        region: "",
        sex: "",
        source: 2, // 0表示检索入组，1表示导入，2表示手动入组
        telephone: "",
        visitId: ""
      },
      armId: undefined,
      scheduled: true,
      joinedId: "",
      joinedUserId: "",
      projectId: "",
      scheduleDate: "",
      requiredObject: {}
    }
  };

  componentDidMount() {
    const { library } = this.props;
    const { projectId } = library;
    this.getDictionaryChinaRegion();
    this.getDictionaryNation();
    this.getDictionaryProfession();
    this.getDictionaryRelation();
    this.getDictionaryCaseMetadata(projectId);
    this.getProjectArms(projectId);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getDictionaryChinaRegion = () => {
    getDictionaryChinaRegion()
      .then(({ data }) => {
        this.setState({ district: getTrees(null, data) });
      })
      .catch(err => {});
  };

  getDictionaryNation = () => {
    getDictionaryNation()
      .then(({ data: { data } }) => {
        this.setState({ nationList: data });
      })
      .catch(err => {});
  };

  getDictionaryProfession = () => {
    getDictionaryProfession()
      .then(({ data: { data } }) => {
        this.setState({ professionList: data });
      })
      .catch(err => {});
  };

  getDictionaryRelation = () => {
    getDictionaryRelation()
      .then(({ data: { data } }) => {
        this.setState({ relationList: data });
      })
      .catch(err => {});
  };

  getDictionaryCaseMetadata = projectId => {
    getDictionaryCaseMetadata({ projectId })
      .then(({ data: { data } }) => {
        let obj = {};
        data.forEach(item => {
          if (item.required) {
            obj[item.code] = true;
          }
        });
        this.setState({
          caseMetadata: data,
          displayData: data.map(item => item.code),
          requiredObject: obj
        });
      })
      .catch(err => {});
  };

  getProjectArms = projectId => {
    getProjectArms({ projectId })
      .then(({ data: { data } }) => {
        this.setState({ armsList: data });
      })
      .catch(err => {});
  };

  formChange = (key, e) => {
    let data = Object.assign({}, this.state.form.caseMetadataVO, {
      [key]: e?.target?.value || e
    });
    this.setState(state => ({
      form: {
        ...state.form,
        caseMetadataVO: data
      }
    }));
    if (!!e?.target?.value || !!e) {
      this.setRequireItemState(key);
    } else {
      this.setRequireItemState(key, true);
    }
  };

  joinedIdChange = val => {
    this.setState({
      form: {
        ...this.state.form,
        joinedId: val
      }
    });
    if (!!val) {
      this.setRequireItemState("joinedId");
    } else {
      this.setRequireItemState("joinedId", true);
    }
  };

  sexChange = e => {
    this.setState(
      produce(draft => {
        draft.form.caseMetadataVO.sex = this.state.sexList[e.target.value];
      })
    );
    if (!!e) {
      this.setRequireItemState("sex");
    } else {
      this.setRequireItemState("sex", true);
    }
  };

  professionChange = e => {
    const { professionList } = this.state;
    this.setState({
      selectProfession: professionList[e.target.value]
    });
    this.setState(
      produce(draft => {
        draft.form.caseMetadataVO.professionCode =
          professionList[e.target.value].code;
      })
    );
    this.setRequireItemState("professionName");
  };

  marriageStatusChange = e => {
    this.setState(
      produce(draft => {
        draft.form.caseMetadataVO.marriageStatus = this.state.marriageStatusList[
          e.target.value
        ];
      })
    );
    if (!!e) {
      this.setRequireItemState("marriageStatus");
    } else {
      this.setRequireItemState("marriageStatus", true);
    }
  };

  showPicker = key => {
    this.setState({
      [key]: true
    });
  };

  hidePicker = key => {
    this.setState({
      [key]: false
    });
  };

  onChange = (key, value, selectedRows) => {
    this.setState(
      produce(draft => {
        draft.form.caseMetadataVO[key] = selectedRows
          .map(item => item.title)
          .join("/");
      })
    );
    this.setState({
      visible: false,
      visible2: false
    });
    this.setRequireItemState(key);
  };

  armsListChange = e => {
    const { armsList } = this.state;
    this.setState({ selectArm: armsList[e.target.value] });
    this.setState(state => ({
      form: {
        ...state.form,
        armId: armsList[e.target.value].armId
      }
    }));
  };

  nationListChange = e => {
    const { nationList } = this.state;
    this.setState({ selectNation: nationList[e.target.value] });
    this.setState(
      produce(draft => {
        draft.form.caseMetadataVO.nationCode = nationList[e.target.value].code;
      })
    );
    this.setRequireItemState("nationName");
  };

  relationListChange = e => {
    const { relationList } = this.state;
    this.setState({ selectRelation: relationList[e.target.value] });
    this.setState(
      produce(draft => {
        draft.form.caseMetadataVO.linkmanRelationCode =
          relationList[e.target.value].code;
      })
    );
    this.setRequireItemState("linkmanRelationName");
  };

  isPlaceholder = status => {
    if (status) {
      return <AtListItem hasBorder={false} title={status} />;
    } else {
      return <input placeholder="请选择" readOnly className="weui-input" />;
    }
  };

  setRequireItemState = (key, status) => {
    this.setState(state => ({
      requiredObject: {
        ...state.requiredObject,
        [key]: status || false
      }
    }));
  };

  requiredValidate = () => {
    const { requiredObject, caseMetadata } = this.state;
    let flag = false;
    if (Object.values(requiredObject).includes(true)) {
      for (const key in requiredObject) {
        if (requiredObject[key]) {
          Taro.atMessage({
            message: `${
              caseMetadata.filter(item => item.code === key)[0].name
            }不能为空`,
            type: "error"
          });
          break;
        }
      }
    } else {
      flag = true;
    }
    return flag;
  };

  onSubmit = event => {
    const { library } = this.props;
    const { caseGrouped, caseNumberAutomated } = library;
    const { armId, joinedId } = this.state.form;
    if (caseGrouped && armId === undefined) {
      Taro.atMessage({
        message: `请选择分组`,
        type: "error"
      });
      return;
    }
    if (!caseNumberAutomated && joinedId === "") {
      Taro.atMessage({
        message: `入组编号不能为空`,
        type: "error"
      });
      return;
    }
    if (this.requiredValidate()) {
      const { library, userInfo } = this.props;
      const { projectId } = library;
      const { userId } = userInfo;
      this.setState(
        state => ({
          form: {
            ...state.form,
            caseMetadataVO: {
              ...state.form.caseMetadataVO,
              creatorId: userId
            },
            joinedUserId: userId,
            projectId
          }
        }),
        () => {
          const { form } = this.state;
          addProjectCase(form)
            .then(({ data: { code, message } }) => {
              Taro.atMessage({
                message,
                type: code === "OK" ? "success" : "error"
              });
              if (code === "OK") {
                setTimeout(() => {
                  this.jumpPatientCase();
                }, 2000);
              }
            })
            .catch(err => {});
        }
      );
    }
  };

  onReset = event => {
    this.setState({
      selectArm: {},
      selectProfession: {},
      value: "",
      visible: false,
      visible2: false,
      selectNation: {},
      selectRelation: {},
      form: {
        caseMetadataVO: {
          patientId: "",
          visitId: "",
          patientName: "",
          sex: "",
          birthDate: "",
          telephone: "",
          linkmanTelephone: "",
          professionCode: "",
          address: "",
          nationName: "",
          marriageStatus: "",
          linkmanName: "",
          linkmanRegion: "",
          linkmanAddress: "",
          region: "",
          source: 2, // 0表示检索入组，1表示导入，2表示手动入组
          creatorId: "",
          idCardNumber: ""
        }
      }
    });
  };

  jumpPatientCase = () => {
    Taro.redirectTo({
      url: "/pages/patientCase/index"
    });
  };

  isRequired = code => {
    const { caseMetadata } = this.state;
    return caseMetadata.filter(item => item.code === code)[0].required;
  };

  render() {
    const { library } = this.props;
    const { caseGrouped, caseNumberAutomated } = library;
    const {
      armsList,
      selectArm,
      sexList,
      professionList,
      selectProfession,
      marriageStatusList,
      nationList,
      selectNation,
      relationList,
      selectRelation,
      visible,
      visible2,
      displayData,
      district,
      form: {
        caseMetadataVO: {
          patientId,
          visitId,
          patientName,
          sex,
          birthDate,
          telephone,
          linkmanTelephone,
          professionCode,
          address,
          nationName,
          marriageStatus,
          linkmanName,
          linkmanRegion,
          linkmanAddress,
          region,
          idCardNumber
        },
        joinedId
      }
    } = this.state;
    return (
      <View className="patient-create">
        <AtMessage />
        <AtForm onSubmit={this.onSubmit} onReset={this.onReset}>
          {caseGrouped ? (
            <View className="at-input flex-wrap">
              <Text className="at-input__title at-input__title--required">
                分组
              </Text>
              <View className="gender">
                <Picker
                  mode="selector"
                  range={armsList}
                  rangeKey="armName"
                  onChange={this.armsListChange}
                >
                  <AtList hasBorder={false}>
                    {this.isPlaceholder(selectArm.armName)}
                  </AtList>
                </Picker>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {!caseNumberAutomated ? (
            <AtInput
              required
              name="value"
              title="入组编号"
              type="text"
              placeholder="请输入入组编号"
              value={joinedId}
              onChange={this.joinedIdChange}
            />
          ) : null}
          <View className="title hr">病例元数据</View>
          {displayData.includes("patientId") ? (
            <AtInput
              required={this.isRequired("patientId")}
              name="value"
              title="病人号"
              type="text"
              placeholder="请输入病人号"
              value={patientId}
              onChange={this.formChange.bind(this, "patientId")}
            />
          ) : null}
          {displayData.includes("visitId") ? (
            <AtInput
              required={this.isRequired("visitId")}
              name="value"
              title="就诊号"
              type="text"
              placeholder="请输入就诊号"
              value={visitId}
              onChange={this.formChange.bind(this, "visitId")}
            />
          ) : null}
          {displayData.includes("patientName") ? (
            <AtInput
              required={this.isRequired("patientName")}
              name="value"
              title="姓名"
              type="text"
              placeholder="请输入姓名"
              value={patientName}
              onChange={this.formChange.bind(this, "patientName")}
            />
          ) : null}
          {displayData.includes("sex") ? (
            <View className="at-input flex-wrap">
              <Text
                className={`at-input__title ${
                  this.isRequired("sex") ? "at-input__title--required" : ""
                }`}
              >
                性别
              </Text>
              <View className="gender">
                <Picker
                  mode="selector"
                  range={sexList}
                  onChange={this.sexChange}
                >
                  <AtList hasBorder={false}>{this.isPlaceholder(sex)}</AtList>
                </Picker>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {displayData.includes("birthDate") ? (
            <View className="at-input flex-wrap">
              <Text
                className={`at-input__title ${
                  this.isRequired("birthDate")
                    ? "at-input__title--required"
                    : ""
                }`}
              >
                出生日期
              </Text>
              <View className="gender">
                <Picker
                  mode="date"
                  onChange={this.formChange.bind(this, "birthDate")}
                  start={moment(new Date("1900/01/01")).format("YYYY-MM-DD")}
                >
                  <AtList hasBorder={false}>
                    {this.isPlaceholder(birthDate)}
                  </AtList>
                </Picker>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {displayData.includes("telephone") ? (
            <AtInput
              required={this.isRequired("telephone")}
              name="value"
              title="联系电话"
              type="text"
              placeholder="请输入联系电话"
              value={telephone}
              onChange={this.formChange.bind(this, "telephone")}
            />
          ) : null}
          {displayData.includes("professionName") ? (
            <View className="at-input flex-wrap">
              <Text
                className={`at-input__title ${
                  this.isRequired("professionName")
                    ? "at-input__title--required"
                    : ""
                }`}
              >
                职业
              </Text>
              <View className="gender">
                <Picker
                  mode="selector"
                  range={professionList}
                  rangeKey="name"
                  onChange={this.professionChange}
                >
                  <AtList hasBorder={false}>
                    {this.isPlaceholder(selectProfession.name)}
                  </AtList>
                </Picker>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {displayData.includes("region") ? (
            <View className="at-input flex-wrap">
              <Text
                className={`at-input__title ${
                  this.isRequired("region") ? "at-input__title--required" : ""
                }`}
              >
                居住地
              </Text>
              <View className="gender">
                <div>
                  <input
                    onClick={this.showPicker.bind(this, "visible")}
                    value={region}
                    placeholder="请选择居住地"
                    readOnly
                    className="weui-input"
                  />
                  <PickerAddress
                    title="地址"
                    visible={visible}
                    onClose={this.hidePicker.bind(this, "visible")}
                    dataSource={district}
                    onChange={this.onChange.bind(this, "region")}
                  />
                </div>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {displayData.includes("address") ? (
            <AtInput
              required={this.isRequired("address")}
              name="value"
              title="详细地址"
              type="text"
              placeholder="请输入详细地址"
              value={address}
              onChange={this.formChange.bind(this, "address")}
            />
          ) : null}
          {displayData.includes("nationName") ? (
            <View className="at-input flex-wrap">
              <Text
                className={`at-input__title ${
                  this.isRequired("nationName")
                    ? "at-input__title--required"
                    : ""
                }`}
              >
                民族
              </Text>
              <View className="gender">
                <Picker
                  mode="selector"
                  range={nationList}
                  rangeKey="name"
                  onChange={this.nationListChange}
                >
                  <AtList hasBorder={false}>
                    {this.isPlaceholder(selectNation.name)}
                  </AtList>
                </Picker>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {displayData.includes("marriageStatus") ? (
            <View className="at-input flex-wrap">
              <Text
                className={`at-input__title ${
                  this.isRequired("marriageStatus")
                    ? "at-input__title--required"
                    : ""
                }`}
              >
                婚姻状况
              </Text>
              <View className="gender">
                <Picker
                  mode="selector"
                  range={marriageStatusList}
                  onChange={this.marriageStatusChange}
                >
                  <AtList hasBorder={false}>
                    {this.isPlaceholder(marriageStatus)}
                  </AtList>
                </Picker>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {displayData.includes("linkmanName") ? (
            <AtInput
              required={this.isRequired("linkmanName")}
              name="value"
              title="联系人姓名"
              type="text"
              placeholder="请输入联系人姓名"
              value={linkmanName}
              onChange={this.formChange.bind(this, "linkmanName")}
            />
          ) : null}
          {displayData.includes("linkmanTelephone") ? (
            <AtInput
              required={this.isRequired("linkmanTelephone")}
              name="value"
              title="联系人电话"
              type="text"
              placeholder="请输入联系人电话"
              value={linkmanTelephone}
              onChange={this.formChange.bind(this, "linkmanTelephone")}
            />
          ) : null}
          {displayData.includes("linkmanRegion") ? (
            <View className="at-input flex-wrap">
              <Text
                className={`at-input__title ${
                  this.isRequired("linkmanRegion")
                    ? "at-input__title--required"
                    : ""
                }`}
              >
                联系人居住地
              </Text>
              <View className="gender">
                <div>
                  <input
                    onClick={this.showPicker.bind(this, "visible2")}
                    value={linkmanRegion}
                    placeholder="请选择联系人居住地"
                    readOnly
                    className="weui-input"
                  />
                  <PickerAddress
                    title="地址"
                    visible={visible2}
                    onClose={this.hidePicker.bind(this, "visible2")}
                    dataSource={district}
                    onChange={this.onChange.bind(this, "linkmanRegion")}
                  />
                </div>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {displayData.includes("linkmanAddress") ? (
            <AtInput
              required={this.isRequired("linkmanAddress")}
              name="value"
              title="联系人详细地址"
              type="text"
              placeholder="请输入联系人详细地址"
              value={linkmanAddress}
              onChange={this.formChange.bind(this, "linkmanAddress")}
            />
          ) : null}
          {displayData.includes("linkmanRelationName") ? (
            <View className="at-input flex-wrap">
              <Text
                className={`at-input__title ${
                  this.isRequired("marriageStatus")
                    ? "at-input__title--required"
                    : ""
                }`}
              >
                联系人关系
              </Text>
              <View className="gender">
                <Picker
                  mode="selector"
                  range={relationList}
                  rangeKey="name"
                  onChange={this.relationListChange}
                >
                  <AtList hasBorder={false}>
                    {this.isPlaceholder(selectRelation.name)}
                  </AtList>
                </Picker>
                <IconFont name="icon1" size={30}></IconFont>
              </View>
            </View>
          ) : null}
          {displayData.includes("idCardNumber") ? (
            <AtInput
              required={this.isRequired("idCardNumber")}
              name="value"
              title="身份证号"
              type="text"
              placeholder="请输入身份证号"
              value={idCardNumber}
              onChange={this.formChange.bind(this, "idCardNumber")}
            />
          ) : null}
          <View className="action">
            <AtButton
              type="secondary"
              size="small"
              className="mr10"
              onClick={this.jumpPatientCase}
            >
              上一步
            </AtButton>
            <AtButton
              formType="reset"
              type="secondary"
              size="small"
              className="button-warring mr10"
            >
              重置
            </AtButton>
            <AtButton
              formType="submit"
              type="secondary"
              size="small"
              className="button-primary"
            >
              提交
            </AtButton>
          </View>
        </AtForm>
      </View>
    );
  }
}
