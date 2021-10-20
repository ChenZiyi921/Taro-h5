import { Component } from "react";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Table from "taro3-table";
import NoData from "@/components/NoData";

import "./index.styl";

export default class Collect extends Component {
  state = {
    collectList: [],
    dataSource: [
      {
        id: 1,
        username: "小红",
        telephone: "123"
      }
    ]
  };

  columns = [
    {
      title: "患者标识",
      dataIndex: "username"
    },
    {
      title: "姓名",
      dataIndex: "telephone",
      width: 60
    },
    {
      title: "操作",
      fixed: "right",
      render: t => {
        return <Text className="cancel-collect">取消收藏</Text>;
      }
    }
  ];

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { collectList, dataSource } = this.state;
    return (
      <View>
        {collectList.length ? (
          <View className="chen-wrap collect">
            <Table
              columns={this.columns}
              dataSource={dataSource}
              rowKey="id"
              scroll={{ x: true }}
              titleStyle={{ padding: "10px 0" }}
              rowStyle={{ padding: "10px 0" }}
              rowClassName="hr"
              colStyle={{ display: "flex", justifyContent: "center" }}
            />
          </View>
        ) : (
          <NoData
            props={{
              iconName: "zanwushoucang",
              text: "暂无收藏"
            }}
          />
        )}
      </View>
    );
  }
}
