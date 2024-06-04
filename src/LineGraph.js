import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import "chartjs-adapter-moment";
import moment from "moment";
import numeral from "numeral";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem) {
          return numeral(tooltipItem.raw.y).format("+0,0");
        },
      },
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "month",
        tooltipFormat: "ll",
        displayFormats: {
          month: "MMM YYYY",
        },
      },
      title: {
        display: true,
        text: "Date",
      },
    },
    y: {
      ticks: {
        callback: function (value) {
          return numeral(value).format("0a");
        },
      },
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: "Cases",
      },
    },
  },
};

const buildChartData = (data, caseType = "cases") => {
  const chartData = [];
  let lastDataPoint;
  for (let date in data[caseType]) {
    if (lastDataPoint) {
      const newData = {
        x: date,
        y: data[caseType][date] - lastDataPoint,
      };
      chartData.push(newData);
    }
    lastDataPoint = data[caseType][date];
  }
  return chartData;
};

function LineGraph({ caseType = "cases", ...props }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          let chartData = buildChartData(data, caseType);
          setData(chartData);
          console.log(chartData);
        });
    };
    fetchData();
  }, [caseType]);

  return (
    <div className={props.className}>
      {data.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                label: `Worldwide ${caseType}`,
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
                fill: true,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
