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
  const actual = data.map(item => item.actual);
  const recommend = data.map(item => item.recommend);

  const option = {
    tooltip: {},
    legend: {
      data: ["实际指数", "推荐指数"],
      top: 0
    },
    radar: {
      indicator,
      radius: 90,
      splitNumber: 5,
      axisName: {
        color: '#333',
        fontSize: 14
      }
    },
    series: [
      {
        name: "能力对比",
        type: "radar",
        data: [
          {
            value: actual,
            name: "实际指数",
            areaStyle: { color: "rgba(59,130,246,0.2)" },
            lineStyle: { color: "#2563eb" },
            symbol: "circle",
            itemStyle: { color: "#2563eb" }
          },
          {
            value: recommend,
            name: "推荐指数",
            areaStyle: { color: "rgba(16,185,129,0.1)" },
            lineStyle: { color: "#10b981" },
            symbol: "circle",
            itemStyle: { color: "#10b981" }
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