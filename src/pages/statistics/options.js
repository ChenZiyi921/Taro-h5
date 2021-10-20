export const gridData = [
  {
    title: "分中心",
    number: 6,
    iconName: "fenzhongxin",
    color: "#09f"
  },
  {
    title: "专病库成员",
    number: 6,
    iconName: "chengyuan",
    color: "#09f"
  },
  {
    title: "病例",
    number: 6,
    iconName: "huanzhe"
  },
  {
    title: "逾期病例数",
    number: 6,
    iconName: "yuqi",
    color: ""
  },
  {
    title: "表单",
    number: 6,
    iconName: "biaodan",
    color: "#09f"
  },
  {
    title: "数据项",
    number: 6,
    iconName: "shujuxiang",
    color: "#09f"
  }
];

export const sexOptions = {
  title: {
    text: "性别分布",
    left: "center"
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    bottom: "bottom"
  },
  series: [
    {
      name: "性别",
      type: "pie",
      radius: "50%",
      data: [
        { value: 0, name: "男性" },
        { value: 0, name: "女性" },
        { value: 0, name: "未知" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};

export const ageOptions = {
  title: {
    text: "年龄分布",
    left: "center"
  },
  grid: {
    left: 0
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "horizontal",
    bottom: 0,
    // type: "scroll",
    data: ["6岁及以下", "7岁至17岁", "18岁至40岁", "41岁至65岁", "66岁及以上"]
  },
  series: [
    {
      name: "年龄",
      type: "pie",
      radius: "42%",
      center: ["50%", "44%"],
      data: [
        { value: 0, name: "6岁及以下" },
        { value: 0, name: "7岁至17岁" },
        { value: 0, name: "18岁至40岁" },
        { value: 0, name: "41岁至65岁" },
        { value: 0, name: "66岁及以上" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};

export const chenterOptions = {
  title: {
    text: "分中心病例收集数",
    left: "center"
  },
  dataset: [
    {
      dimensions: ["name", "value"],
      source: [
        [" Hannah Krause ", 41],
        ["Zhao Qian ", 20]
      ]
    },
    {
      transform: {
        type: "sort",
        config: { dimension: "value", order: "desc" }
      }
    }
  ],
  xAxis: {
    type: "category",
    axisLabel: { interval: 0, rotate: 30 }
  },
  yAxis: {},
  series: {
    type: "bar",
    encode: { x: "name", y: "value" },
    datasetIndex: 1
  }
};

export const statusOptions = {
  title: {
    text: "病例状态统计信息",
    left: "center"
  },
  grid: {
    left: 0
  },
  tooltip: {
    trigger: "item"
  },
  legend: {
    orient: "horizontal",
    bottom: 0,
    data: []
  },
  series: [
    {
      name: "状态",
      type: "pie",
      radius: "50%",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};
