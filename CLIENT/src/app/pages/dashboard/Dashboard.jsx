import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import Header from "../../components/header/Header";
import { GetDashboardMilkDetails, GetManualEntry, GetDashboardBarChart, GetDashboardLineChart } from "../../utils/apiCalls";
import Confirm from "../../components/confirmModal/confirm";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import {
  CButton,
  CCol,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow
} from "@coreui/react";
import { Paper } from "@mui/material";
import moment from 'moment';
import { PieChart, Pie, Line, Tooltip, Legend, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Linegraph from "./Linegraph";

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
);

const initialMilkDetails = {
  organization: "",
  sumOfWeights: "",
};

const initialMilkDetailsBar = {
  bmcName: "",
  morQty: "",
  eveQty: "",
};

const initialMilkDetailsLine = {
  bmcName: "",
  dateWiseQuantity: [],
};



const Dashboard = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [milkData, setMilkData] = useState(initialMilkDetails);
  const [milkDataBar, setMilkDataBar] = useState(initialMilkDetailsBar);
  const [milkDataLine, setMilkDataLine] = useState(initialMilkDetailsLine);
  const [sessionOk, setSessionOk] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [allowManualEntry, setAllowManualEntry] = useState({});
  const [pendingReqCount, setPendingReqCount] = useState();
  const [isPendingReqs, setIsPendingReques] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  useEffect(() => {
    getMilkDataPie();
    getMilkDataLine();
    GetManualEntry((result) => {
      setAllowManualEntry(result.data);
      let pendingReqs = 0;
      result.data?.forEach(ele => {
        if (ele.status === "pending") {
          pendingReqs++;
          setIsPendingReques(true);
        }
      })
      setPendingReqCount(pendingReqs);
    })
  }, []);

  const handleManualEntry = () => {
    navigate("/manual-entry");
  }

  const getMilkDataPie = () => {
    GetDashboardMilkDetails((result) => {
      let { status, message, data } = result;
      if (status === 200) {
        // console.log('data : ', data)
        setMilkData(data);
      } else if (status === 403) {
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
      } else if (status === 403) {
        setMilkData(data)
      } else if (status === 500) {
        setAlertText("Something wrong happened in API");
        setShowConfirmModal1(true);
      } else if (message?.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModal1(true);
        setSessionOk(true);
      }
    })
  };

  useEffect(() => {
    getMilkDataBar();
  }, [date])
  const getMilkDataBar = () => {
    GetDashboardBarChart((result) => {
      let { status, message, data } = result;
      if (status === 200) {
        // console.log('bar data : ', data)
        setMilkDataBar(data);
      } else if (status === 403) {
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
      } else if (status === 403) {
        setMilkDataBar(data)
      } else if (status === 500) {
        setAlertText("Something wrong happened in API");
        setShowConfirmModal1(true);
      } else if (message?.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModal1(true);
        setSessionOk(true);
      }
    }, date)
  }

  const getMilkDataLine = () => {
    GetDashboardLineChart((result) => {
      let { status, message, data } = result;
      if (status === 200) {
        setMilkDataLine(data);
      } else if (status === 403) {
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
      } else if (status === 403) {
        setMilkDataLine(data);
      } else if (status === 500) {
        setAlertText("Something wrong happened in API");
        setShowConfirmModal1(true);
      } else if (message?.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModal1(true);
        setSessionOk(true);
      }
    })
  }

  // console.log('line data : ', milkDataLine);

  let chartData = null;

  if (milkData) {
    chartData = Object.values(milkData).map(entry => ({
      orgName: entry.bmc?.Name,
      weight: entry.weight,
    }));
  }

  let barData = null;

  if (milkDataBar) {
    barData = Object.values(milkDataBar).map(entry => ({
      bmcName: entry.bmcName,
      morQty: entry?.detail?.morQty,
      eveQty: entry?.detail?.eveQty,
    }));
  }

  const COLORS = ["#0037FF", "#D52DB7", "#FF2E7E", "#FF6B45", "#FFAB05",
    "#d88373", "#f5e2c8", "#868491", "#cd5656", "#18206f", "#9BA2E9", "#F1A7A7",
    "#E3AE64", "#3251C3", "#5F261B", "#BFBEC5", "#ECC0C0"];

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const lineOptions = {
    responsive: true,
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

  const today = moment(new Date()).format('YYYY-MM-DD');

  return (
    <><CModal
      alignment="center"
      visible={isPendingReqs}
      onClose={() => {
      }}
    >
      <CModalHeader>
        <CModalTitle>Pending Manual Entry Requests</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div>
          <p>You have {pendingReqCount} requests for manual entry access.</p>
        </div>
        <div>
          <CButton onClick={handleManualEntry}>View</CButton>
          <CButton style={{ backgroundColor: 'red', marginLeft: 10 }} onClick={() => {
            setIsPendingReques(false);
          }}>Cancel</CButton>
        </div>
      </CModalBody>
    </CModal>

      <div className="dashboard">
        <div className="dashboard__container">
          <div className="dashboard__header">
            <div className="dashboard__header__section">
              <div className="dashboard__header__section__main">
                <h5>Company: Verka</h5>
                <h4>Dashboard</h4>
              </div>
              <div className="dashboard__header__section__bottom">
                <Header />
              </div>
            </div>
          </div>
          {milkData ?
            (<CRow className="charts-container">

              <CRow className="vertical-div-group">
                {/* Pie Chart*/}
                <CCol md="4" lg="4" className="vertical-div">
                  <Paper elevation={3}>
                    <ResponsiveContainer width="100%" height={279}>
                      <PieChart>
                        <text x="50%" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight={700} fill="#666">
                          Milk Collection per BMC
                        </text>
                        <Pie
                          data={chartData}
                          dataKey="weight"
                          nameKey="orgName"
                          cx="50%"
                          cy="55%"
                          outerRadius={100}
                          fill="#8884d8"
                          // label={(entry) => entry.orgName}
                          isAnimationActive={false}
                          onMouseEnter={(data, index, e) => {
                            e.target.setAttribute("fill", COLORS[index % COLORS.length]);
                          }}
                          onMouseLeave={(data, index, e) => {
                            e.target.setAttribute("fill", COLORS[index % COLORS.length]);
                          }}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        {/* <Legend align="right" verticalAlign="middle" layout="vertical" iconSize={10} wrapperStyle={{ fontSize: '12px' }}/> */}
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </CCol>

                {/* Vertical Bar graph */}
                <CCol md="8" lg="8" className="vertical-div">
                  <Paper elevation={3}>
                    <div style={{ alignSelf: 'end', display: 'flex', justifyContent: 'right' }}>
                      <CFormInput
                        style={{ width: '200px', marginBottom: '-50px', height: '30px', fontSize: '50', zIndex: '1' }}
                        type="date"
                        name="date"
                        max={today}
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value)
                        }}
                      />
                    </div>
                    {/* <Bar data={barDataSet} options={barOptions} width={700} height={350} /> */}
                    <ResponsiveContainer width="100%" height={279}>
                      <BarChart
                        data={barData}
                        margin={{ top: 35, right: 30, left: 30, bottom: 5 }}
                      >
                        <text x="50%" y="20" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight={700} fill="#666">
                          Shiftwise Milk Collection per BMC
                        </text>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bmcName" tick={null} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="morQty"
                          fill={COLORS[0]}
                          name="Morning"
                        />
                        <Bar
                          dataKey="eveQty"
                          fill={COLORS[1]}
                          name="Evening"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </CCol>
              </CRow>

              {/* Line chart */}
              <CRow>
                <CCol md="12" lg="12" className="horizontal-div">
                  <Paper elevation={3}>
                        <Linegraph/>
                  </Paper>
                </CCol>
              </CRow>

            </CRow>)
            :
            (<div className="empty_data">
              <Paper elevation={3}>
                <h1>No Collection</h1>
                <h3>For Today</h3>
              </Paper>
            </div>)
          }
        </div>
        {showConfirmModal1 && (
          <Confirm
            buttonText={"OK"}
            isCancelRequired={false}
            confirmTitle={alertText}
            onConfirm={() => {
              handleConfirm();
            }}
            onCancel={() => {
              setShowConfirmModal1(false);
              setSessionOk(true);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;