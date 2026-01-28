"use client";
import React from "react";
import Chart from "react-apexcharts";

const LineChart: React.FC = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "line-chart",
      animations: {
        enabled: true,
        easing: "easein",
        speed: 800,
      },
      width: "100%",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    title: {
      text: "Monthly Sales Data",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "semibold",
        fontFamily: "Poppins, sans-serif",
      },
    },
  };

  const series: ApexAxisChartSeries = [
    {
      name: "Sales",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 145, 160, 170],
    },
  ];

  return (
    <div className="py-4">
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default LineChart;
