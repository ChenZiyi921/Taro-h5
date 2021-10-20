import { Component } from "react";
import { connect } from "react-redux";
import { View, Text, Button } from "@tarojs/components";
import { AtList, AtListItem, AtButton } from "taro-ui";
import EChart from "techarts";
import * as echarts from "echarts";
import * as moment from "moment";
import IconFont from "@/components/iconfont";
import NoData from "@/components/NoData";
import {
  getProject,
  getProjectHomeCount,
  getDistributionAge,
  getDistributionCenterAmount,
  getDistributionSex,
  getDistributionStatus
} from "@/servers/servers";
import {
  gridData,
  sexOptions,
  ageOptions,
  chenterOptions,
  statusOptions
} from "./options";

import "./index.styl";

@connect(
  ({ library }) => ({
    library
  }),
  dispatch => ({})
)
export default class Index extends Component {
  state = {
    gridData,
    sexOptions,
    sexOptionsReady: false,
    ageOptions,
    ageOptionsReady: false,
    chenterOptions,
    chenterOptionsReady: false,
    statusOptions,
    statusOptionsReady: false,
    centerCount: 1
  };

  componentDidMount() {
    const { library } = this.props;
    const { projectId } = library;
    this.getProjectHomeCount(projectId);
    this.getDistributionAge(projectId);
    this.getDistributionSex(projectId);
    this.getDistributionCenterAmount(projectId);
    this.getDistributionStatus(projectId);
  }

  componentWillUnmount() {
    clearInterval(this.clearInterval);
  }

  componentDidShow() {}

  componentDidHide() {}

  updateArrayItem = (index, key, value) => {
    const { gridData } = this.state;
    this.setState({
      gridData: gridData.map((item, _index) =>
        _index == index ? { ...item, [key]: value } : item
      )
    });
  };

  getProjectHomeCount = projectId => {
    getProjectHomeCount({
      projectId
    })
      .then(({ data: { data } }) => {
        const {
          caseCount,
          centerCount,
          controlCount,
          formCount,
          overdueProjectCaseCount,
          userCount
        } = data;
        this.updateArrayItem(0, "number", centerCount || 0);
        this.updateArrayItem(1, "number", userCount || 0);
        this.updateArrayItem(2, "number", caseCount || 0);
        this.updateArrayItem(3, "number", overdueProjectCaseCount || 0);
        this.updateArrayItem(4, "number", formCount || 0);
        this.updateArrayItem(5, "number", controlCount || 0);
        this.setState({ centerCount });
      })
      .catch(err => {});
  };

  getDistributionSex = projectId => {
    getDistributionSex({ projectId })
      .then(({ data: { data } }) => {
        const { maleTotal, femaleTotal, unknownTotal } = data;
        sexOptions.series[0].data[0].value = maleTotal;
        sexOptions.series[0].data[1].value = femaleTotal;
        sexOptions.series[0].data[2].value = unknownTotal;
        this.setState({
          sexOptions,
          sexOptionsReady: Object.keys(data).length ? true : false
        });
      })
      .catch(err => {});
  };

  getDistributionAge = projectId => {
    const computeAgeTotal = arr => {
      if (arr.length) {
        return arr.reduce((t, l) => t + l.total, 0);
      } else {
        return 0;
      }
    };
    getDistributionAge({ projectId })
      .then(({ data: { data } }) => {
        ageOptions.series[0].data[0].value = computeAgeTotal(
          data.filter(item => item.age <= 6)
        );
        ageOptions.series[0].data[1].value = computeAgeTotal(
          data.filter(item => item.age >= 7 && item.age <= 17)
        );
        ageOptions.series[0].data[2].value = computeAgeTotal(
          data.filter(item => item.age >= 18 && item.age <= 40)
        );
        ageOptions.series[0].data[3].value = computeAgeTotal(
          data.filter(item => item.age >= 41 && item.age <= 65)
        );
        ageOptions.series[0].data[4].value = computeAgeTotal(
          data.filter(item => item.age >= 65)
        );
        this.setState({
          ageOptions,
          ageOptionsReady: data.length ? true : false
        });
      })
      .catch(err => {});
  };

  getDistributionCenterAmount = projectId => {
    getDistributionCenterAmount({ projectId })
      .then(({ data: { data } }) => {
        let centerData = data.map(item => {
          return [item.centerName, item.caseNum];
        });
        chenterOptions.dataset[0].source = centerData;
        this.setState({
          chenterOptions,
          chenterOptionsReady: data.length ? true : false
        });
      })
      .catch(err => {});
  };

  getDistributionStatus = projectId => {
    getDistributionStatus({ projectId })
      .then(({ data: { data } }) => {
        statusOptions.legend.data = data.map(item => {
          return item.name;
        });
        statusOptions.series[0].data = data;
        this.setState({
          statusOptions,
          statusOptionsReady: data.length ? true : false
        });
      })
      .catch(err => {});
  };

  render() {
    const {
      gridData,
      sexOptions,
      sexOptionsReady,
      ageOptions,
      ageOptionsReady,
      chenterOptions,
      chenterOptionsReady,
      statusOptions,
      statusOptionsReady
    } = this.state;
    const { library } = this.props;
    const {
      projectName,
      description,
      statusName,
      createDate,
      managerName
    } = library;
    return (
      <View className="chen-wrap statistics">
        <View className="title hr">专病库信息</View>
        <AtList className="library-info" hasBorder={false}>
          <AtListItem title="名称：" extraText={projectName} />
          <AtListItem title="描述：" extraText={description} />
          <AtListItem title="状态：" extraText={statusName} />
          <AtListItem
            title="发起时间："
            extraText={moment(createDate).format("YYYY-MM-DD")}
          />
          <AtListItem title="负责人：" extraText={managerName} />
        </AtList>
        <View className="grid-list">
          {gridData.map((item, index) => {
            return (
              <View
                className="grid-list-item"
                key={index}
                style={Object.assign(
                  [0, 2, 4].includes(index)
                    ? { borderRight: "2px solid #F0F0F2" }
                    : {},
                  [0, 1, 2, 3].includes(index)
                    ? { borderBottom: "2px solid #F0F0F2" }
                    : {}
                )}
              >
                <IconFont
                  name={item.iconName}
                  size={60}
                  color={item.color}
                ></IconFont>
                <View className="content">
                  <View className="text">{item.title}</View>
                  <Text className="number">{item.number}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View className="title">病例统计</View>
        <View className="page-index">
          {!sexOptionsReady &&
          !ageOptionsReady &&
          !chenterOptionsReady &&
          !statusOptionsReady ? (
            <NoData
              props={{
                height: "300px",
                iconName: "zanwutongjishuju",
                text: "暂无统计"
              }}
            />
          ) : null}
          <EChart echarts={echarts} option={sexOptionsReady && sexOptions} />
          <EChart echarts={echarts} option={ageOptionsReady && ageOptions} />
          {this.state.centerCount ? (
            <EChart
              echarts={echarts}
              option={chenterOptionsReady && chenterOptions}
            />
          ) : null}
          <EChart
            echarts={echarts}
            option={statusOptionsReady && statusOptions}
          />
        </View>
      </View>
    );
  }
}
