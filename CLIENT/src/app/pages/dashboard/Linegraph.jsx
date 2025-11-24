import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { GetDashboardLineChart } from "../../utils/apiCalls";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  ArcElement,
  Tooltip,
//   Legend,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
);

const initialMilkDetailsLine = {
    bmcName: "",
    dateWiseQuantity: [],
};

const Linegraph = () => {
    const [milkDataLine, setMilkDataLine] = useState(initialMilkDetailsLine);

    useEffect(() => {
        getMilkDataLine();
    }, []);

    const getMilkDataLine = () => {
        GetDashboardLineChart((result) => {
            let { status, message, data } = result;
            if (status === 200) {
                setMilkDataLine(data);
            } 
        })
    }

    const lineOptions = {
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Daywise Milk Collection per BMC',
            },
        },
    };

    let lineDataSet = null;

    if (milkDataLine) {
        const lineData = Object.values(milkDataLine);
        let lineLabels = [];
        let lineDatasets = [];

        lineData.forEach((data, index) => {
            let name = data.bmcName;
            if (name && name.length > 0) {
                lineLabels = data.dateWiseQuantity.map(item => item.date);
                const dataQuantity = data.dateWiseQuantity.map(item => item.totalQuantity);
                const backgroundColors = ["#0037FF", "#D52DB7", "#FF2E7E", "#FF6B45", "#FFAB05",
                    "#d88373", "#f5e2c8", "#868491", "#cd5656", "#18206f", "#9BA2E9",
                    "#F1A7A7", "#E3AE64", "#3251C3", "#5F261B", "#BFBEC5", "#ECC0C0"];

                lineDatasets.push({
                    label: name,
                    data: dataQuantity,
                    borderColor: backgroundColors[index % backgroundColors.length],
                    backgroundColor: backgroundColors[index % backgroundColors.length],
                });
            }
        });

        lineDataSet = {
            labels: lineLabels,
            datasets: lineDatasets,
        };
    }

    return (
        <Line data={lineDataSet} options={lineOptions} width={1150} height={280} />
    );
};

export default Linegraph;