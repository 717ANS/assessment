"use client";
import React from "react";
import ReactECharts from "echarts-for-react";

interface SectionScore {
  name: string;
  actual: number;
  recommend: number;
}

export default function RadarChart({ data }: { data: SectionScore[] }) {
  const indicator = data.map(item => ({ name: item.name, max: 1 }));
  const actual = data.map(item => item.actual.toFixed(2));
  const recommend = data.map(item => item.recommend.toFixed(2));

  const option = {
    backgroundColor: '#949494',
    tooltip: {},
    legend: {
      data: ["实际指数", "推荐指数"],
      top: 0,
      textStyle: {
        color: '#333'
      }
    },
    radar: {
      indicator,
      radius: 90,
      splitNumber: 5,
      axisName: {
        color: '#333',
        fontSize: 14
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#999'
        }
      }
    },
    series: [
      {
        name: "能力对比",
        type: "radar",
        data: [
          {
            value: recommend,
            name: "推荐指数",
            areaStyle: { color: "rgba(61, 93, 111, 0.2)" },
            lineStyle: { color: "#3D5D6F" },
            symbol: "circle",
            itemStyle: { color: "#3D5D6F" }
          },
          {
            value: actual,
            name: "实际指数",
            areaStyle: { color: "rgba(204,31,32,0.2)" },
            lineStyle: { color: "#CC1F20" },
            symbol: "circle",
            itemStyle: { color: "#CC1F20" }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex justify-center">
      <ReactECharts option={option} style={{ height: 350, width: "100%" }} />
    </div>
  );
} 