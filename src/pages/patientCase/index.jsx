import Taro from "@tarojs/taro";
import { Component } from "react";
import { connect } from "react-redux";
import { setCase, setAllEvent } from "@/actions/patientCase";
import { View, Text, Picker } from "@tarojs/components";
import { AtInput, AtButton, AtList, AtListItem, AtPagination } from "taro-ui";
import IconFont from "@/components/iconfont";
import NoData from "@/components/NoData";
import {
  getDictionaryStatusListCase,
  queryAllProjectCases
} from "@/servers/servers";

import "./index.styl";

@connect(
  ({ library }) => ({
    library
  }),
  dispatch => ({
    setAllEvent(item) {
      dispatch(setAllEvent(item));
    },
    setCase(item) {
      dispatch(setCase(item));
    }
  })
)
export default class PatientCase extends Component {
  state = {
    patientName: "",
    selector: [],
    selectorChecked: { statusId: undefined, statusName: "全部" },
    caseTotal: 0,
    patientCaseList: [],
    total: 0,
    current: 1,
    caseStatusIds: undefined
  };

  componentDidMount() {
    const { library } = this.props;
    const { projectId } = library;
    this.getDictionaryStatusListCase(projectId);
    this.queryAllProjectCases("all");
  }

  componentWillUnmount() {}

  getDictionaryStatusListCase = projectId => {
    getDictionaryStatusListCase({
      projectId
    })
      .then(({ data: { data } }) => {
        data.unshift({
          statusId: undefined,
          statusName: "全部"
        });
        this.setState({
          selector: data
        });
      })
      .catch(err => {});
  };

  queryAllProjectCases = (type, params) => {
    const { library } = this.props;
    const { projectId } = library;
    const { current, caseStatusIds, patientName } = this.state;
    queryAllProjectCases({
      projectId,
      pageIndex: current,
      pageSize: 10,
      patientName,
      caseStatusIds,
      ...params
    })
      .then(res => {
        const {
          data: { total, projectCaseVOList }
        } = res.data;
        this.setState({
          total,
          caseTotal: type === "all" ? total : 1,
          patientCaseList: projectCaseVOList
        });
      })
      .catch(err => {});
  };

  handleChange = (input, value) => {
    this.setState({
      [input]: value
    });
  };

  onChange = e => {
    const item = this.state.selector[e.target.value];
    this.setState(
      {
        selectorChecked: item,
        caseStatusIds: item.statusId
      },
      () => {
        this.queryAllProjectCases();
      }
    );
  };

  jumpPatientCreate = () => {
    Taro.navigateTo({
      url: `/pages/patientCreate/index`
    });
  };

  jumpOrderInfo = (data, { disabled }) => {
    this.props.setAllEvent(data.eventList);
    this.props.setCase(data);
    Taro.navigateTo({
      url: `/pages/orderInfo/index?disabled=${disabled}`
    });
  };

  onPageChange = ({ type, current }) => {
    this.setState({ current }, () => {
      this.queryAllProjectCases();
    });
  };

  render() {
    const {
      patientName,
      selector,
      selectorChecked,
      patientCaseList,
      current,
      total,
      caseTotal
    } = this.state;
    const { statusCode } = this.props.library;
    return (
      <View className="patient-case">
        <View className={`at-row at-row--wrap ${caseTotal ? "" : "row-wrap"}`}>
          <View className="at-col at-col-4">
            {caseTotal ? (
              <AtInput
                name="patientName"
                title="姓名"
                type="text"
                placeholder="请输入"
                value={patientName}
                onChange={this.handleChange.bind(this, "patientName")}
                border={false}
              />
            ) : null}
          </View>
          <View className="at-col at-col-3">
            {caseTotal ? (
              <Picker
                mode="selector"
                range={selector}
                rangeKey="statusName"
                onChange={this.onChange}
              >
                <AtList hasBorder={false}>
                  <AtListItem
                    title={selectorChecked.statusName}
                    arrow="down"
                    hasBorder={false}
                  />
                </AtList>
              </Picker>
            ) : null}
          </View>
          <View
            className="at-col at-col-2"
            onClick={this.queryAllProjectCases.bind(this, "search", {
              pageIndex: 1
            })}
          >
            {caseTotal ? <IconFont name="sousuo" size={30}></IconFont> : null}
          </View>
          <View className="at-col at-col-3">
            <AtButton
              size="small"
              type="primary"
              onClick={this.jumpPatientCreate}
              disabled={statusCode !== "PRODUCTION"}
            >
              手动入组
            </AtButton>
          </View>
        </View>
        {patientCaseList.length ? (
          <View>
            {patientCaseList.map((item, index) => {
              const { statusName, statusCode } = item.caseStatus;
              return (
                <View className="list" key={index}>
                  <View className="item">
                    <Text>入组编号：</Text>
                    <Text>{item.joinedId}</Text>
                  </View>
                  <View className="item">
                    <Text>姓名：</Text>
                    <Text>{item.caseMetadataVO.patientName}</Text>
                  </View>
                  <View className="item">
                    <Text>病例状态：</Text>
                    <Text>{statusName}</Text>
                  </View>
                  {statusCode === "IN_COLLECTION" ||
                  statusCode === "UNSTART" ? (
                    <View
                      className="item"
                      onClick={this.jumpOrderInfo.bind(this, item, {
                        disabled: false
                      })}
                    >
                      <Text>录入数据</Text>
                      <IconFont
                        style={{ display: "inline-block", marginBottom: "2px" }}
                        name="icon1"
                        size={30}
                      />
                    </View>
                  ) : null}
                  {["COMPLETE", "AUDIT_PASS", "AUDITING"].includes(
                    statusCode
                  ) ? (
                    <View
                      className="item"
                      onClick={this.jumpOrderInfo.bind(this, item, {
                        disabled: true
                      })}
                    >
                      <Text>查看数据</Text>
                      <IconFont
                        style={{ display: "inline-block", marginBottom: "2px" }}
                        name="icon1"
                        size={30}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })}
            <AtPagination
              icon
              total={total}
              pageSize={10}
              current={current}
              onPageChange={this.onPageChange}
            />
          </View>
        ) : (
          <NoData
            props={{
              height: "calc(100vh - 100px)",
              iconName: "zanwushuju",
              text: "暂无病例信息"
            }}
          />
        )}
      </View>
    );
  }
}
