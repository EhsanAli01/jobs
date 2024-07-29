import React, { useState } from "react";
import Chart from "react-apexcharts";

const Career = () => {
  const [graphType, setGraphType] = useState("area");

  const series = [
    {
      name: "Jobs Completed",
      data: [19, 22, 20, 26, 10, 30, 18, 20, 15, 20, 25, 23, 18],
    },
  ];
  const options = {
    xaxis: {
      categories: [
        "2019-05-01",
        "2019-05-02",
        "2019-05-03",
        "2019-05-04",
        "2019-05-05",
        "2019-05-06",
        "2019-05-07",
        "2019-05-08",
        "2019-05-09",
        "2019-05-10",
        "2019-05-11",
        "2019-05-12",
        "2019-05-13",
      ],
    },
  };

  const typeHandler = (type) => {
    setGraphType(type);
  };

  const defaultClass = "text-left";

  return (
    <section className="flex">
      <aside className="border-r border-gray-400 w-[25%] flex flex-col pl-16 py-10 gap-2 tracking-wider">
        <h1 className="text-lg font-semibold text-gray-500 mb-10">
          Graph Types
        </h1>

        <button
          className={defaultClass}
          onClick={() => {
            typeHandler("area");
          }}
        >
          Area
        </button>

        <button
          className={defaultClass}
          onClick={() => {
            typeHandler("line");
          }}
        >
          Line
        </button>

        <button
          className={defaultClass}
          onClick={() => {
            typeHandler("bar");
          }}
        >
          Bars
        </button>

        <button
          className={defaultClass}
          onClick={() => {
            typeHandler("heatmap");
          }}
        >
          Heatmap
        </button>
      </aside>
      <div className="w-full flex flex-col items-center gap-20 py-10">
        <h1 className="text-lg font-semibold text-gray-500">
          Here your can check the detailed statistics of your career...
        </h1>
        <div className="flex justify-center items-center">
          <Chart
            options={options}
            series={series}
            type={graphType}
            width="500"
          />
        </div>
      </div>
    </section>
  );
};

export default Career;
