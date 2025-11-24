import React, { useEffect, useRef, useState } from "react";
import "./rateChart.scss";
import {
    EntityandPermission, GetRateChart
} from "../../utils/apiCalls";
import Header from "../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import Confirm from "../../components/confirmModal/confirm";
import { CButton } from "@coreui/react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons';

const columns = [
    {
        key: "SlNo",
        label: "FAT/SNF",
        _props: { scope: "col" },
    },
    {
        key: "heading_1",
        label: "7.5",
        _props: { scope: "col" },
    },
    {
        key: "heading_2",
        label: "7.6",
        _props: { scope: "col" },
    },
    {
        key: "heading_3",
        label: "7.7",
        _props: { scope: "col" },
    },
    {
        key: "heading_4",
        label: "7.8",
        _props: { scope: "col" },
    },
    {
        key: "heading_5",
        label: "7.9",
        _props: { scope: "col" },
    },
    {
        key: "heading_6",
        label: "8.0",
        _props: { scope: "col" },
    },
    {
        key: "heading_7",
        label: "8.1",
        _props: { scope: "col" },
    },
    {
        key: "heading_8",
        label: "8.2",
        _props: { scope: "col" },
    },
    {
        key: "heading_9",
        label: "8.3",
        _props: { scope: "col" },
    },
    {
        key: "heading_10",
        label: "8.4",
        _props: { scope: "col" },
    },
    {
        key: "heading_11",
        label: "8.5",
        _props: { scope: "col" },
    },
    {
        key: "heading_12",
        label: "8.6",
        _props: { scope: "col" },
    },
    {
        key: "heading_13",
        label: "8.7",
        _props: { scope: "col" },
    },
    {
        key: "heading_14",
        label: "8.8",
        _props: { scope: "col" },
    },
    {
        key: "heading_15",
        label: "8.9",
        _props: { scope: "col" },
    },
    {
        key: "heading_16",
        label: "9.0",
        _props: { scope: "col" },
    },
];

const RateChart = () => {
    const token = localStorage.getItem("token");
    const userAuthData = JSON.parse(localStorage.getItem("userData"));
    const [permission, setPermission] = useState([]);

    useEffect(() => {
        if (userAuthData) {
            const RolesPermissions = userAuthData?.permissions?.find(
                (val) => val?.Roles
            );
            setPermission(RolesPermissions?.Roles);
        }
    }, []);

    const hasPermission = (perm) => {
        return permission?.includes(perm);
    };

    const [isLoading, setIsLoading] = useState(true);
    const [sessionOk, setSessionOk] = useState(false);
    const [rates, setRates] = useState()
    const [showConfirmModal1, setShowConfirmModal1] = useState(false);
    const [alertText, setAlertText] = useState("");
    const navigate = useNavigate();

    const items = [];

    const ratechartRef = useRef();
    const Print = () => {
        const printContents = ratechartRef.current?.innerHTML;
        if (printContents) {
            const originalContents = document.body;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        } else {
            // console.error('Element with ref "ratechartRef" not found.');
        }
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.table_to_sheet(ratechartRef.current); // Convert the table to worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
        XLSX.writeFile(wb, "RateChart.xlsx"); // Save the workbook as RateChart.xlsx
    };

    useEffect(() => {
        getRates();
        handleGetEntity();
    }, []);

    const getRates = () => {
        setIsLoading(true);
        GetRateChart((res) => {
            let { status, data, message } = res;
            if (status === 200) {
                setRates(data);
                // console.log(data)
                setIsLoading(false); // Hide the loading spinner
            } else if (status === 403) {
                setAlertText("You don't have access to perform this operation");
                setShowConfirmModal1(true);
                setIsLoading(false);
            } else if (status === 500) {
                setAlertText("Something wrong happened in API");
                setShowConfirmModal1(true);
                setIsLoading(false);
            } else if (message.includes("Invalid access token")) {
                setAlertText("User Session has Expired");
                setShowConfirmModal1(true);
                setSessionOk(true);
            }
        });
    };

    {
        rates?.map((val, ind) => {
            let rate;
            let ind1 = 3;
            items.push({
                SlNo: ind + ind1 + 0.1,
                id: val?.id,
            });
        });
    }

    const handleGetEntity = () => {
        EntityandPermission((res) => {
            // SetEntityList(res.data);
        });
        // console.log(entityList);
    };

    const handleConfirm = () => {
        setShowConfirmModal1(false)
        if (sessionOk) {
            localStorage.clear();
            navigate("/");
        }
    };

    return (
        <>
            {token ? (
                <div className="ratechart">
                    <div className="ratechart__container">
                        <div className="ratechart__header">
                            <div className="ratechart__header__section">
                                <div className="ratechart__header__section__main">
                                    <h5>Company: Verka</h5>
                                    <h4>{`Rate Chart`}</h4>
                                </div>
                                <div className="ratechart__header__section__bottom">
                                    <Header />
                                </div>
                            </div>
                        </div>
                        <>
                            <FontAwesomeIcon className="print" onClick={Print} icon={faPrint} />
                            <CButton className="export" style={{position:'fixed', right: '4vw', height: '2vw', display:'flex', alignItems:'center', top: '5vw'}} onClick={exportToExcel}>Export to Excel</CButton>
                            <div ref={ratechartRef} className="ratechart__table">
                                <div className="ratechart__table__header">
                                </div>
                                <div
                                    style={{ height: "98%", overflowY: "scroll" }}
                                >
                                    {isLoading ? (
                                        <Loader />
                                    ) : (
                                        <div >
                                            <table style={{ width: "100%", border: "1px solid black", justifyContent: "space-around", height: "100%" }}>
                                                <thead style={{ border: "1px solid black", textAlign: "center" }}>
                                                    <tr>
                                                        <th style={{ padding: "10px", border: "1px solid black" }}>FAT/SNF</th>
                                                        {columns.slice(1).map((column, index) => (
                                                            <th style={{ border: "1px solid black" }} key={index}>{column.label}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody style={{ height: "100%", border: "1px solid black" }}>
                                                    {items.map((item, index) => (
                                                        <tr style={{ textAlign: "center" }} key={index}>
                                                            <td style={{ padding: "10px", backgroundColor: "#0e419d", width: "8px", border: "1px solid black", color: "white" }}>{(2.9 + index / 10 + 0.1).toFixed(1)}</td>
                                                            {rates && rates[index]?.rates.map((rate, rateIndex) => (
                                                                <td style={{ border: "1px solid black" }} key={rateIndex}>{rate}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
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

export default RateChart;
