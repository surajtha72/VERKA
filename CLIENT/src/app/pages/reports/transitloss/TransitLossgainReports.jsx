import {
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import Loader from "../../../components/loader";
import { Navigate, useNavigate } from "react-router-dom";
import {
  GetMilkDispatch,
  GetMilkDispatchWithVehicleNo,
  GetRouteMaster,
  GetTransitlossGainReports,
  GetTransitlossWeighbridgeData,
  GetTransitlossWeighbridgeDataWithVehicleNo,
  GetVehicles,
  GetWeighBridge,
  GetWeighBridgeReport,
  GetWeighbridgeReportData,
} from "../../../utils/apiCalls";
import moment from "moment";
import * as XLSX from "xlsx";
import { Select } from "@mui/material";
import Confirm from "../../../components/confirmModal/confirm";
import TableComponent from "./tablecom";

const columns = [
  {
    key: "SlNo",
    label: "SL. No.",
    _props: { scope: "col" },
  },
  {
    key: "vehicle",
    label: "Vehicle No.",
    _props: { scope: "col" },
  },
  {
    key: "date",
    label: "Date",
    _props: { scope: "col" },
  },
  {
    key: "capacity",
    label: "Capacity",
    _props: { scope: "col" },
  },
  {
    key: "received",
    label: "Received",
    _props: { scope: "col" },
    children: [
      {
        key: "bmc",
        label: "BMC/CC",
        _props: { scope: "col" },
        _style: { margin: "10px" },
      },
      {
        key: "fat",
        label: "Fat",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF",
        _props: { scope: "col" },
      },
      {
        key: "weight",
        label: "Weight",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "dispatched",
    label: "Dispatched",
    _props: { scope: "col" },
    children: [
      {
        key: "weight",
        label: "Weight",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "difference",
    label: "Difference",
    _props: { scope: "col" },
    children: [
      {
        key: "weight",
        label: "Weight",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "receivedAtFactory",
    label: "Received at Factory",
    _props: { scope: "col" },
    children: [
      {
        key: "weight",
        label: "Weight",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF",
        _props: { scope: "col" },
      },
    ],
  },
  {
    key: "finalDifference",
    label: "Final Difference",
    _props: { scope: "col" },
    children: [
      {
        key: "weight",
        label: "Weight",
        _props: { scope: "col" },
      },
      {
        key: "fat",
        label: "Fat",
        _props: { scope: "col" },
      },
      {
        key: "snf",
        label: "SNF",
        _props: { scope: "col" },
      },
    ],
  },
];

const Filtercolumns = [
  {
    key: "heading_2",
    label: "Vehicle No.",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "From Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "To Date",
    _props: { scope: "col" },
  },
];

// const d/.ummyData = [
//   {
//     SlNo: 1,
//     vehicle: "ABC123",
//     date: "2024-08-01",
//     capacity: 1000,
//     received: {
//       bmc: 800,
//       fat: 20,
//       snf: 8,
//       weight: 800,
//     },
//     dispatched: {
//       weight: 750,
//       fat: 19,
//       snf: 7,
//     },
//     difference: {
//       weight: 50,
//       fat: 1,
//       snf: 1,
//     },
//     receivedAtFactory: {
//       weight: 750,
//       fat: 19,
//       snf: 7,
//     },
//     finalDifference: {
//       weight: 50,
//       fat: 1,
//       snf: 1,
//     },
//   },
//   {
//     SlNo: 2,
//     vehicle: "XYZ789",
//     date: "2024-08-02",
//     capacity: 1200,
//     received: {
//       bmc: 950,
//       fat: 22,
//       snf: 9,
//       weight: 950,
//     },
//     dispatched: {
//       weight: 900,
//       fat: 21,
//       snf: 8,
//     },
//     difference: {
//       weight: 50,
//       fat: 1,
//       snf: 1,
//     },
//     receivedAtFactory: {
//       weight: 900,
//       fat: 21,
//       snf: 8,
//     },
//     finalDifference: {
//       weight: 50,
//       fat: 1,
//       snf: 1,
//     },
//   },
//   {
//     SlNo: 3,
//     vehicle: "LMN456",
//     date: "2024-08-03",
//     capacity: 1500,
//     received: {
//       bmc: 1200,
//       fat: 23,
//       snf: 10,
//       weight: 1200,
//     },
//     dispatched: {
//       weight: 1150,
//       fat: 22,
//       snf: 9,
//     },
//     difference: {
//       weight: 50,
//       fat: 1,
//       snf: 1,
//     },
//     receivedAtFactory: {
//       weight: 1150,
//       fat: 22,
//       snf: 9,
//     },
//     finalDifference: {
//       weight: 50,
//       fat: 1,
//       snf: 1,
//     },
//   },
// ];

const TransitLossGainReportS = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  // const [isLoading, setIsLoading] = useState(true);
  const [dispatchedData, setdispatchedData] = useState([]);
  const [weighbridgeData, setWeighbridgeData] = useState([]);
  const [ReportData, setReportData] = useState([]);
  const items = [];
  const FilterItems = [];
  const excelitem = [];
  let excelData = [];
  const [currentDate, setCurrentDate] = useState();
  const [displayTable, setDisplayTable] = useState(false);
  const [routeId, setRouteId] = useState();
  const [vehicleNo, setVehicleNo] = useState();
  const [routeMasterData, setRouteMasterData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [netWeight, setNetWeight] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [alertText, setAlertText] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const navigate = useNavigate();

  const getMilkDispatch = () => {
    if (vehicleNo) {
      GetMilkDispatchWithVehicleNo(
        (res) => {
          // console.log(res)
          setdispatchedData(res.data);
        },
        vehicleNo,
        fromDate,
        toDate
      );
    } else {
      GetMilkDispatch(
        (res) => {
          // console.log(res)
          setdispatchedData(res.data);
        },
        fromDate,
        toDate
      );
    }
  };

  const getWeighbridgeData = () => {
    if (vehicleNo) {
      GetTransitlossWeighbridgeDataWithVehicleNo(
        (res) => {
          setWeighbridgeData(res?.data);
        },
        vehicleNo,
        fromDate,
        toDate
      );
    } else {
      GetTransitlossWeighbridgeData(
        (res) => {
          setWeighbridgeData(res?.data);
        },
        fromDate,
        toDate
      );
    }
  };

  const dataGenerator = (data, ind) => {
    return {
      SlNo: ind,
      vehicle: data.vehicle?.RegistrationNo,
      date: data.ReportDate,
      capacity: data.vehicle?.Capacity,
      received: {
        bmc: 0,
        fat: data.ReceiptFat,
        snf: data.ReceiptSnf,
        weight: data.ReceiptnetWeight,
      },
      dispatched: {
        weight: data.TankerDispatchnetWeight,
        fat: data.TankerDispatchFat,
        snf: data.TankerDispatchSnf,
      },
      difference: {
        weight: 50,
        fat: 1,
        snf: 1,
      },
      receivedAtFactory: {
        weight: data.FactoryReceiptWeight,
        fat: data.FactoryReceiptfat,
        snf: data.FactoryReceiptSnf,
      },
      finalDifference: {
        weight: 50,
        fat: 1,
        snf: 1,
      },
    };
  };
  const getTransitLossgainReports = () => {
    if (vehicleNo) {
      GetTransitlossGainReports(
        (res) => {
          console.log("Res Data", res?.data);

          let finaldata = res?.data.map((data, ind) => {
            let {
              ReceiptnetWeight,
              ReceiptFat,
              ReceiptSnf,
              TankerDispatchnetWeight,
              TankerDispatchfat,
              TankerDispatchSnf,
              FactoryReceiptWeight,
              FactoryReceiptSnf,
              FactoryReceiptfat,
            } = data;

            console.log(
              "weightdiff :",
              ReceiptnetWeight - TankerDispatchnetWeight
            );
            console.log("fatdiff :", ReceiptFat - TankerDispatchfat);
            console.log("snftdiff :", ReceiptSnf - TankerDispatchSnf);

            let weightDiff = TankerDispatchnetWeight - ReceiptnetWeight;
            let fatDiff = TankerDispatchfat - ReceiptFat;
            let snfDiff = TankerDispatchSnf - ReceiptSnf;

            let weightFinalDiff =
              FactoryReceiptWeight - TankerDispatchnetWeight;
            let fatFinalDiff = FactoryReceiptfat - TankerDispatchfat;
            let snfFinalDiff = FactoryReceiptSnf - TankerDispatchSnf;

            return {
              SlNo: ind+1,
              vehicle: data.vehicle?.RegistrationNo,
              date: data.ReportDate,
              capacity: data.vehicle?.Capacity,
              received: {
                bmc: data.Bmc,
                fat: data.ReceiptFat,
                snf: data.ReceiptSnf,
                weight: data.ReceiptnetWeight,
              },
              dispatched: {
                weight: data?.TankerDispatchnetWeight,
                fat: data?.TankerDispatchfat,
                snf: data?.TankerDispatchSnf,
              },
              difference: {
                weight: weightDiff.toFixed(2),
                fat: fatDiff.toFixed(2),
                snf: snfDiff.toFixed(2),
              },
              receivedAtFactory: {
                weight: data?.FactoryReceiptWeight,
                fat: data?.FactoryReceiptfat,
                snf: data?.FactoryReceiptSnf,
              },
              finalDifference: {
                weight: weightFinalDiff.toFixed(2),
                fat: fatFinalDiff.toFixed(2),
                snf: snfFinalDiff.toFixed(2),
              },
            };
          });
          setReportData(finaldata);
        },
        fromDate,
        toDate,
        vehicleNo
      );
    }
  };

  console.log("datata :", ReportData);

  useEffect(() => {
    getRouteMasterData();
    getVehicles();
  }, []);

  const getRouteMasterData = () => {
    GetRouteMaster((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        // console.log("route : ", data)
        setRouteMasterData(data);
      } else if (status === 403) {
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
      } else if (status === 500) {
        setAlertText("Something wrong happened in API");
        setShowConfirmModal1(true);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModal1(true);
        setSessionOk(true);
      }
    });
  };

  const dispatchedDates = [];
  dispatchedData?.forEach((data) => {
    if (
      !dispatchedDates.includes(moment(data.dispatchedAt).format("DD-MM-YY"))
    ) {
      dispatchedDates.push(moment(data.dispatchedAt).format("DD-MM-YY"));
    }
  });

  const totalWeightsByDate = [];
  dispatchedDates?.forEach((date) => {
    const totalWeight = dispatchedData
      .filter((data) => moment(data.dispatchedAt).format("DD-MM-YY") === date)
      .reduce((sum, data) => sum + data.weight, 0);

    const weighbridgeDataByDate = weighbridgeData.filter(
      (data) => moment(data.createdAt).format("DD-MM-YY") === date
    );

    if (weighbridgeDataByDate[0]?.netWeightKg > 0 && totalWeight > 0) {
      totalWeightsByDate.push({
        date: date,
        totalWeight: totalWeight,
        weighbridgeData: weighbridgeDataByDate[0],
      });
    }
  });

  // console.log("Total weights by date:", totalWeightsByDate);

  let totalWeight = 0;
  dispatchedData?.forEach((data) => {
    totalWeight += data.weight;
  });
  // console.log(totalWeight)

  // console.log("netweight : ", netWeight)
  // console.log("totalweight : ", totalWeight)
  // console.log("transitloss : ", transitLoss)
  // console.log("transitgrain : ", transitGain)

  {
    totalWeightsByDate?.map((val, ind) => {
      let weight = val.weighbridgeData?.netWeightKg - val.totalWeight;
      // console.log("format : ", typeof weight)
      let transitGain = 0;
      let transitLoss = 0;
      // console.log("weight : ", weight)
      if (weight > 0) {
        transitGain = weight;
      }
      if (weight < 0) {
        transitLoss = Math.abs(weight);
      }
      items.push({
        SlNo: ind + 1,
        vehicle: val?.weighbridgeData?.vehicleNo?.RegistrationNo,
        date: val.date || "  ",
        dispatched: val.totalWeight || "0",
        received: val.weighbridgeData?.netWeightKg || "0",
        transitGain: weight > 0 ? weight : " ",
        transitLoss: weight < 0 ? Math.abs(weight) : " ",
      });
      // console.log(items)
    });
  }

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Transit_loss_gain.xlsx");
  };

  if (ReportData.length > 0) {
    excelData = ReportData?.map((item) => ({
      SlNo: item.SlNo,
      vehicle: item.vehicle,
      date: item.date,
      capacity: item.capacity,
      received_bmc: item.received.bmc,
      received_fat: item.received.fat,
      received_snf: item.received.snf,
      received_weight: item.received.weight,
      dispatched_weight: item.dispatched.weight,
      dispatched_fat: item.dispatched.fat,
      dispatched_snf: item.dispatched.snf,
      difference_weight: item.difference.weight,
      difference_fat: item.difference.fat,
      difference_snf: item.difference.snf,
      receivedAtFactory_weight: item.receivedAtFactory.weight,
      receivedAtFactory_fat: item.receivedAtFactory.fat,
      receivedAtFactory_snf: item.receivedAtFactory.snf,
      finalDifference_weight: item.finalDifference.weight,
      finalDifference_fat: item.finalDifference.fat,
      finalDifference_snf: item.finalDifference.snf,
    }));
  }
  {
    totalWeightsByDate?.map((val, ind) => {
      excelitem.push({
        SlNo: ind + 1,
        vehicle: val?.weighbridgeData?.vehicleNo?.RegistrationNo,
        date: val.date || "  ",
        dispatched: val.totalWeight || "0",
        received: val.weighbridgeData?.netWeightKg || "0",
        transitGain:
          Math.abs(val.weighbridgeData?.netWeight - val.totalWeight) || "0",
        transitLoss:
          Math.abs(val.weighbridgeData?.netWeight - val.totalWeight) || "0",
      });
    });
  }

  const handleSubmit = () => {
    getTransitLossgainReports();
    setDisplayTable(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  //get all the vehicles
  const getVehicles = () => {
    GetVehicles((res) => {
      if (res.status === 200) {
        setVehicleData(res.data);
      }
    });
  };

 
  {
    FilterItems?.push({
      heading_1: (
        <CFormSelect
          size="sm"
          name="routeId"
          onChange={(e) => {
            setRouteId(e.target.value);
            setDisplayTable(false);
          }}
        >
          <option>Select Route</option>
          {routeMasterData?.length &&
            routeMasterData?.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.routeName}
                </option>
              );
            })}
        </CFormSelect>
      ),
      heading_2: (
        <>
          <CFormSelect
            size="sm"
            name="vehicleNo"
            onChange={(e) => {
              setVehicleNo(e.target.value);
            }}
          >
            <option>Select Vehicle No.</option>
            {vehicleData?.length &&
              vehicleData?.map((option, index) => {
                return (
                  <option key={index} value={option.id}>
                    {option.registrationNumber}
                  </option>
                );
              })}
          </CFormSelect>

          {/* <Select
            options={vehicleData}
            value={selectedVehicle}
            onChange={handleVehicleChange}
            placeholder="Select Vehicle"
            isSearchable
            styles={{
              control: (provided) => ({
                ...provided,
                height: "20px",
                minHeight: "20px",
                alignContent: 'center'
              }),
            }}
          /> */}
        </>
      ),
      heading_3: (
        <CFormInput
          type="date"
          name="fromDate"
          size="sm"
          onChange={(e) => {
            setFromDate(e.target.value);
            // console.log("fromdate : ", fromDate)
          }}
          placeholder="Enter Name "
          aria-label="default input example"
        />
      ),
      heading_4: (
        <CFormInput
          type="date"
          name="toDate"
          size="sm"
          onChange={(e) => {
            setToDate(e.target.value);
            // console.log("toDate : ", toDate)
          }}
          placeholder="Enter Name "
          aria-label="default input example"
        />
      ),
    });
  }

  return (
    <>
      {token ? (
        <div className="weighbridge">
          <div className="weighbridge__container">
            <div className="weighbridge__header">
              <div className="weighbridge__header__section">
                <div className="weighbridge__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`${"Tanker Milk Reconciliation Reports"}`}</h4>
                </div>
                <div className="weighbridge__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>

            {/* <div style={{ width: "98%", fontWeight: 550 }}><CRow>
                        <CCol lg={3}>
                            <CFormLabel htmlFor="nf-email">
                                Select Route
                            </CFormLabel>
                            <CFormSelect
                                size="sm"
                                name="routeId"
                                onChange={(e) => {
                                    setRouteId(e.target.value);
                                    setDisplayTable(false);
                                }}
                            >
                                <option>Select Route</option>
                                {routeMasterData?.length &&
                                    routeMasterData?.map(
                                        (option, index) => {
                                            return (
                                                <option key={index} value={option.id}>
                                                    {option.routeName}
                                                </option>
                                            );
                                        }
                                    )}
                            </CFormSelect>
                        </CCol>
                        <CCol lg={3}>
                            <CFormLabel htmlFor="nf-email">
                                Vehicle No.
                            </CFormLabel>
                            <CFormSelect
                                size="sm"
                                name="vehicleNo"
                                onChange={(e) => {
                                    setVehicleNo(e.target.value);
                                }}
                            >
                                <option>Select Vehicle No.</option>
                                {vehicleData?.length &&
                                    vehicleData?.map(
                                        (option, index) => {
                                            return (
                                                <option key={index} value={option.id}>
                                                    {option.registrationNumber}
                                                </option>
                                            );
                                        }
                                    )}
                            </CFormSelect>
                        </CCol>

                        <CCol lg={3}>
                            <CFormLabel>
                                From Date
                            </CFormLabel>
                            <CFormInput
                                type='date'
                                name="fromDate"
                                size="sm"
                                onChange={(e) => {
                                    setFromDate(e.target.value)
                                    console.log("fromdate : ", fromDate)
                                }}
                                placeholder="Enter Name "
                                aria-label="default input example"
                            />
                        </CCol>
                        <CCol lg={3}>
                            <CFormLabel>
                                To Date
                            </CFormLabel>
                            <CFormInput
                                type='date'
                                name="toDate"
                                size="sm"
                                onChange={(e) => {
                                    setToDate(e.target.value)
                                    console.log("toDate : ", toDate)
                                }}
                                placeholder="Enter Name "
                                aria-label="default input example"
                            />
                        </CCol>
                    </CRow>
                        <br />
                        <CRow>
                            <CCol lg={2}>{displayTable && <CButton onClick={handleExportToExcel}>Export to Excel</CButton>}</CCol>
                            <CCol lg={9}></CCol>
                            <CCol lg={1}><CButton onClick={handleSubmit}>Submit</CButton></CCol>
                        </CRow>
                    </div> */}
            <div className="weighbridge__table">
              <div
                className="weighbridge__table__body"
                style={{ height: "20vh" }}
              >
                <CTable
                  columns={Filtercolumns}
                  items={FilterItems}
                  className="striped-table"
                />
                <CRow>
                  <CCol lg={2}>
                    {displayTable && (
                      <CButton
                        style={{
                          border: 0,
                          backgroundColor: "#0e419d",
                        }}
                        onClick={handleExportToExcel}
                      >
                        Export to Excel
                      </CButton>
                    )}
                  </CCol>
                  <CCol lg={9}></CCol>
                  <CCol lg={1}>
                    <CButton
                      style={{
                        border: 0,
                        backgroundColor: "#0e419d",
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
              </div>
            </div>

            {displayTable && (
              <div className="weighbridge__table">
                <div
                  className="weighbridge__table__body"
                  style={{ height: "70vh", overflowY: "scroll" }}
                >
                  {/* <CTable
                                columns={columns}
                                items={items}
                                className="striped-table" /> */}
                  <TableComponent columns={columns} items={ReportData} />
                </div>
                <div
                  style={{
                    marginTop: "1vw",
                    display: "flex",
                    justifyContent: "center",
                  }}
                ></div>
              </div>
            )}
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
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default TransitLossGainReportS;
