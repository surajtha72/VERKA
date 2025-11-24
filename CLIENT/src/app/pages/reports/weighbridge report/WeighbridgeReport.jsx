import { CButton, CCol, CFormInput, CFormLabel, CRow, CTable } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/header/Header';
import Loader from '../../../components/loader';
import { Navigate, useNavigate } from 'react-router-dom';
import { GetWeighBridge, GetWeighBridgeReport, GetWeighbridgeReportData } from '../../../utils/apiCalls';
import moment from 'moment';
import * as XLSX from "xlsx";
import Confirm from "../../../components/confirmModal/confirm";
import { Paper } from '@mui/material';

const columns = [
  {
    key: "SlNo",
    label: "SL. No.",
    _props: { scope: "col" },
  },
  {
    key: "datetime",
    label: "Date & Time",
    _props: { scope: "col" },
  },
  {
    key: "weighbridgeNo",
    label: "Weighbridge No",
    _props: { scope: "col" },
  },
  {
    key: "vehicleNo",
    label: "Vehicle No.",
    _props: { scope: "col" },
  },
  {
    key: "inDateTime",
    label: "In Date & Time",
    _props: { scope: "col" },
  },
  {
    key: "outDateTime",
    label: "Out Date & Time",
    _props: { scope: "col" },
  },
  {
    key: "driverName",
    label: "Driver Name",
    _props: { scope: "col" },
  },
  {
    key: "route",
    label: "Route",
    _props: { scope: "col" },
  },
  {
    key: "productCat",
    label: "Product Group",
    _props: { scope: "col" },
  },
  {
    key: "productName",
    label: "Product Name",
    _props: { scope: "col" },
  },
  {
    key: "grossWeight",
    label: "Gross Weight(Kg)",
    _props: { scope: "col" },
  },
  {
    key: "tareWeight",
    label: "Tare Weight(Kg)",
    _props: { scope: "col" },
  },
  {
    key: "netWeight",
    label: "Net Weight(kg)",
    _props: { scope: "col" },
  },
  {
    key: "fat",
    label: "Fat",
    _props: { scope: "col" },
  },
  {
    key: "snf",
    label: "Snf",
    _props: { scope: "col" },
  },
  {
    key: "clr",
    label: "Clr",
    _props: { scope: "col" },
  },
  {
    key: "purpose",
    label: "Purpose",
    _props: { scope: "col" },
  },
  {
    key: "destination",
    label: "Destination",
    _props: { scope: "col" },
  },
  {
    key: "entryType",
    label: "Entry Type",
    _props: { scope: "col" },
  },
  {
    key: "remark",
    label: "Remarks",
    _props: { scope: "col" },
  },
];

const cycleTaleColumns = [
  {
    key: "date",
    label: "Select Date",
    _props: { scope: "col" },
  },
  {
    key: "action",
    label: " ",
    _props: { scope: "col" },
  },
  {
    key: "export",
    label: " ",
    _props: { scope: "col" },
  },
];
const WeighbridgeReport = () => {

  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [weighbridgetableDate, setWeighbridgeTableData] = useState([]);
  const [weighbridgeData, setWeighbridgeData] = useState([]);
  const items = [];
  const excelitem = [];
  const [testDate, setTestDate] = useState();
  const [currentDate, setCurrentDate] = useState();
  const [displayTable, setDisplayTable] = useState(false);

  const [alertText, setAlertText] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const navigate = useNavigate();
  const cycleItems = [];
  const getWeighBridgeReportData = () => {
    GetWeighbridgeReportData((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setWeighbridgeTableData(data);
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
    }, testDate)
  }


  const getWeighbridgeData = () => {
    GetWeighBridgeReport((res) => {
      if (res.data?.length > 0) {
        setDisplayTable(true);
      } else { setDisplayTable(false) }
      setWeighbridgeData(res.data);
    }, testDate)
  }

  {
    weighbridgeData?.map((val, ind) => {
      let milkData = weighbridgetableDate.find((data) => data.vehicleNo.RegistrationNo === val?.vehicleNo?.RegistrationNo);
      items.push({
        SlNo: ind + 1,
        id: val?.id,
        datetime: currentDate,
        vehicleNo: val?.vehicleNo?.RegistrationNo,
        weighbridgeNo: val?.weighbridgeNo ? val?.weighbridgeNo : " ",
        inDateTime: moment(val?.createdAt).format("YYYY-MM-DD HH:mm") ? moment(val?.createdAt).format("YYYY-MM-DD HH:mm") : " ",
        outDateTime: moment(val?.modifiedAt).format("YYYY-MM-DD HH:mm") ? moment(val?.modifiedAt).format("YYYY-MM-DD HH:mm") : " ",
        driverName: val?.vehicleNo?.driverName ? val.vehicleNo?.driverName : " ",
        route: val?.routeId?.RouteName ? val?.routeId?.RouteName : " ",
        productName: val?.productName ? val.productName : " ",
        productCat: val?.productCategory.CategoryName ? val?.productCategory.CategoryName : " ",
        grossWeight: val?.grossWeight ? val.grossWeight : " ",
        tareWeight: val?.tareWeight ? val?.tareWeight : " ",
        netWeight: val?.netWeightKg ? val?.netWeightKg : " ",
        fat: milkData?.fat ?? " ",
        snf: milkData?.snf ?? " ",
        clr: milkData?.clr ?? " ",
        purpose: val?.purpose ? val?.purpose : " ",
        destination: val?.destination ? val?.destination : " ",
        entryType: val?.weightMode ? val?.weightMode : " ",
        remark: val?.remarks ? val?.remarks : " ",
      })
    });
  }

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Weighbridge_report.xlsx");
  };
  {
    weighbridgeData?.map((val, ind) => {
      let milkData = weighbridgetableDate.find((data) => data.vehicleNo.RegistrationNo === val?.vehicleNo?.RegistrationNo);
      excelitem.push({
        SlNo: ind + 1,
        id: val?.id,
        datetime: currentDate,
        vehicleNo: val?.vehicleNo?.RegistrationNo,
        weighbridgeNo: val?.weighbridgeNo ? val?.weighbridgeNo : " ",
        inDateTime: moment(val?.createdAt).format("YYYY-MM-DD HH:mm") ? moment(val?.createdAt).format("YYYY-MM-DD HH:mm") : " ",
        outDateTime: moment(val?.modifiedAt).format("YYYY-MM-DD HH:mm") ? moment(val?.modifiedAt).format("YYYY-MM-DD HH:mm") : " ",
        driverName: val?.vehicleNo?.driverName ? val.vehicleNo?.driverName : " ",
        route: val?.routeId?.RouteName ? val?.routeId?.RouteName : " ",
        productName: val?.productName ? val.productName : " ",
        productCat: val?.productCategory.CategoryName ? val?.productCategory.CategoryName : " ",
        grossWeight: val?.grossWeight ? val.grossWeight : " ",
        tareWeight: val?.tareWeight ? val?.tareWeight : " ",
        netWeight: val?.netWeightKg ? val?.netWeightKg : " ",
        fat: milkData?.fat ?? " ",
        snf: milkData?.snf ?? " ",
        clr: milkData?.clr ?? " ",
        purpose: val?.purpose ? val?.purpose : " ",
        destination: val?.destination ? val?.destination : " ",
        entryType: val?.weightMode ? val?.weightMode : " ",
        remark: val?.remarks ? val?.remarks : " ",
      });
    });
  }

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  {
    cycleItems?.push({
      date: (
        <CFormInput
          style={{ height: "40px" }}
          type='date'
          name="name"
          size="sm"
          onChange={(e) => {
            setTestDate(e.target.value)
            setCurrentDate(e.target.value)
          }}
          placeholder="Enter Name "
          aria-label="default input example"
        />
      ),
      action: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "blue",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
            onClick={() => {
              getWeighBridgeReportData()
              getWeighbridgeData()
            }}
          >
            View Weighbridge Report
          </span>
        </div >
      ),
      export: (
        <div style={{ display: "flex", "flexDirection": "column" }}>
          {displayTable && <span style={{
            color: "blue",
            cursor: "pointer",
            pointerEvents: "auto",
          }} onClick={handleExportToExcel}>Export to Excel</span>}
        </div>
      )
    });
  }

  return (
    <>
      {token ? <div className="weighbridge">
        <div className="weighbridge__container">
          <div className="weighbridge__header">
            <div className="weighbridge__header__section">
              <div className="weighbridge__header__section__main">
                <h5>Company: Verka</h5>
                <h4>{`${"Weighbridge Report"}`}</h4>
              </div>
              <div className="weighbridge__header__section__bottom">
                <Header />
              </div>
            </div>
          </div>
          <div className="cyclebmc__table">
            <CTable
              columns={cycleTaleColumns}
              items={cycleItems}
              hover
              className="striped-table" />
          </div>
          {displayTable ? <div className="weighbridge__table">
            <div
              className="weighbridge__table__body"
              style={{ height: "70vh", overflowY: "scroll" }}
            >
              <CTable columns={columns} items={items} className="striped-table" />
            </div>
            <div
              style={{
                marginTop: "1vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
            </div>
          </div> : <div className="empty_data">
            <Paper elevation={3}>
              <h1>No vehicle entry</h1>
              <h3>For the selected date</h3>
            </Paper>
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
      </div > : <Navigate to={"/"} />
      }
    </>
  )
}

export default WeighbridgeReport