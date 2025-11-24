import { CButton, CCol, CFormInput, CFormLabel, CFormSelect, CRow, CTable } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/header/Header';
import Loader from '../../../components/loader';
import { Navigate, useNavigate } from 'react-router-dom';
import { GetMilkDispatch, GetMilkDispatchWithVehicleNo, GetRouteMaster, GetTransitlossWeighbridgeData, GetTransitlossWeighbridgeDataWithVehicleNo, GetVehicles, GetWeighBridge, GetWeighBridgeReport, GetWeighbridgeReportData } from '../../../utils/apiCalls';
import moment from 'moment';
import * as XLSX from "xlsx";
import { Select } from '@mui/material';
import Confirm from "../../../components/confirmModal/confirm";

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
        key: "dispatched",
        label: "Dispatched Weight",
        _props: { scope: "col" },
    },
    {
        key: "received",
        label: "Received Weight",
        _props: { scope: "col" },
    },
    {
        key: "transitGain",
        label: "Transit Gain",
        _props: { scope: "col" },
    },
    {
        key: "transitLoss",
        label: "Transit Loss",
        _props: { scope: "col" },
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

const TransitLossReport = () => {

    const token = localStorage.getItem("token");
    const userAuthData = JSON.parse(localStorage.getItem("userData"));
    // const [isLoading, setIsLoading] = useState(true);
    const [dispatchedData, setdispatchedData] = useState([]);
    const [weighbridgeData, setWeighbridgeData] = useState([]);
    const items = [];
    const FilterItems = [];
    const excelitem = [];
    const [currentDate, setCurrentDate] = useState();
    const [displayTable, setDisplayTable] = useState(false);
    const [routeId, setRouteId] = useState()
    const [vehicleNo, setVehicleNo] = useState()
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
            GetMilkDispatchWithVehicleNo((res) => {
                // console.log(res)
                setdispatchedData(res.data);
            }, vehicleNo, fromDate, toDate)
        } else {
            GetMilkDispatch((res) => {
                // console.log(res)
                setdispatchedData(res.data);
            },fromDate, toDate)
        }
    }

    const getWeighbridgeData = () => {
        if(vehicleNo) {
            GetTransitlossWeighbridgeDataWithVehicleNo((res) => {
                setWeighbridgeData(res?.data);
            }, vehicleNo, fromDate, toDate)
        } else {
            GetTransitlossWeighbridgeData((res) => {
                setWeighbridgeData(res?.data);
            }, fromDate, toDate)
        }
    }

    useEffect(() => {
        getRouteMasterData();
        getVehicles();
    }, [])
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
    const getVehicles = () => {
        GetVehicles((res) => {
            if (res.status === 200) {
                setVehicleData(res.data);
            }
        });
    }
    const dispatchedDates = [];
    dispatchedData?.forEach((data) => {
        if (!dispatchedDates.includes(moment(data.dispatchedAt).format("DD-MM-YY"))) {
            dispatchedDates.push(moment(data.dispatchedAt).format("DD-MM-YY"));
        }
    })

    const totalWeightsByDate = [];
    dispatchedDates?.forEach((date) => {
        const totalWeight = dispatchedData
            .filter((data) => moment(data.dispatchedAt).format("DD-MM-YY") === date)
            .reduce((sum, data) => sum + data.weight, 0);

        const weighbridgeDataByDate = weighbridgeData
            .filter((data) => moment(data.createdAt).format("DD-MM-YY") === date);

        if(weighbridgeDataByDate[0]?.netWeightKg > 0 && totalWeight > 0) {
            totalWeightsByDate.push({
                date: date,
                totalWeight: totalWeight,
                weighbridgeData: weighbridgeDataByDate[0],
            });
        }
    });

    console.log("Total weights by date:", totalWeightsByDate);


    let totalWeight = 0;
    dispatchedData?.forEach((data) => {
        totalWeight += data.weight;
    })
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
            })
            // console.log(items)
        });
    }

    const handleExportToExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelitem);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "Transit_loss_gain.xlsx");
    };
    {
        totalWeightsByDate?.map((val, ind) => {
            excelitem.push({
                SlNo: ind + 1,
                vehicle: val?.weighbridgeData?.vehicleNo?.RegistrationNo,
                date: val.date || "  ",
                dispatched: val.totalWeight || "0",
                received: val.weighbridgeData?.netWeightKg || "0",
                transitGain: Math.abs(val.weighbridgeData?.netWeight - val.totalWeight) || "0",
                transitLoss: Math.abs(val.weighbridgeData?.netWeight - val.totalWeight) || "0",
            });
        });
    }

    const handleSubmit = () => {
        getMilkDispatch();
        getWeighbridgeData();
        setDisplayTable(true);
    }

    const handleConfirm = () => {
        setShowConfirmModal1(false);
        if (sessionOk) {
            localStorage.clear();
            navigate("/");
        }
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
            ),
            heading_2: (
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
            ),
            heading_3: (
                <CFormInput
                    type='date'
                    name="fromDate"
                    size="sm"
                    onChange={(e) => {
                        setFromDate(e.target.value)
                        // console.log("fromdate : ", fromDate)
                    }}
                    placeholder="Enter Name "
                    aria-label="default input example"
                />
            ),
            heading_4: (
                <CFormInput
                    type='date'
                    name="toDate"
                    size="sm"
                    onChange={(e) => {
                        setToDate(e.target.value)
                        // console.log("toDate : ", toDate)
                    }}
                    placeholder="Enter Name "
                    aria-label="default input example"
                />
            ),
        })
    }

    return (
        <>
            {token ? <div className="weighbridge">
                <div className="weighbridge__container">
                    <div className="weighbridge__header">
                        <div className="weighbridge__header__section">
                            <div className="weighbridge__header__section__main">
                                <h5>Company: Verka</h5>
                                <h4>{`${"Transit-Loss/Gain"}`}</h4>
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
                                <CCol lg={2}>{displayTable &&
                                    <CButton style={{
                                        border: 0,
                                        backgroundColor: "#0e419d"
                                    }}
                                        onClick={handleExportToExcel}>
                                        Export to Excel
                                    </CButton>}</CCol>
                                <CCol lg={9}></CCol>
                                <CCol lg={1}>
                                    <CButton style={{
                                        border: 0,
                                        backgroundColor: "#0e419d"
                                    }}
                                        onClick={handleSubmit}>
                                        Submit
                                    </CButton></CCol>
                            </CRow>
                        </div>
                    </div>
                    {displayTable && <div className="weighbridge__table">
                        <div
                            className="weighbridge__table__body"
                            style={{ height: "70vh", overflowY: "scroll" }}
                        >
                            <CTable
                                columns={columns}
                                items={items}
                                className="striped-table" />
                        </div>
                        <div
                            style={{
                                marginTop: "1vw",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                        </div>
                    </div>}
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
            </div> : <Navigate to={"/"} />
            }
        </>
    )
}

export default TransitLossReport