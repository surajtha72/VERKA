import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Paper, Select } from "@mui/material";
import { CTable, CButton } from "@coreui/react";
import images from "../../../../assets/images/log_out.png";
import { DownloadTableExcel } from "react-export-table-to-excel";
import Header from "../../../components/header/Header";
import Loader from "../../../components/loader";
import * as XLSX from "xlsx";
import download from "../../../../assets/images/icons/download.png";
import moment from "moment";
import { GetInwardTransportation } from "../../../utils/apiCalls";

const columns = [
  {
    key: "sn",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "vehicleno",
    label: "Vehicle Reg. No.",
    _props: { scope: "col" },
  },
  {
    key: "transporter",
    label: "Transporter Name",
    _props: { scope: "col" },
  },
  {
    key: "milkquantity",
    label: "Milk Quantity",
    _props: { scope: "col" },
  },
  {
    key: "canCount",
    label: "Can Count",
    _props: { scope: "col" },
  },
  {
    key: "route",
    label: "Route Name",
    _props: { scope: "col" },
  },
  {
    key: "payterm",
    label: "Payment Term",
    _props: { scope: "col" },
  },
  {
    key: "rate",
    label: "Rate",
    _props: { scope: "col" },
  },
  {
    key: "attendance",
    label: "Attd.",
    _props: { scope: "col" },
  },
  {
    key: "payamount",
    label: "Payment Amount",
    _props: { scope: "col" },
  },
  {
    key: "perltrcost",
    label: "Per LTR Cost",
    _props: { scope: "col" },
  },
  {
    key: "accName",
    label: "A/C Name",
    _props: { scope: "col" },
  },
  {
    key: "accNumber",
    label: "A/C NO",
    _props: { scope: "col" },
  },
  {
    key: "accIfscCode",
    label: "A/C IFSC",
    _props: { scope: "col" },
  },
  {
    key: "arrivalTime",
    label: "Arrival Time",
    _props: { scope: "col" },
  },
  {
    key: "HeadloadQty",
    label: "Total Headload Qty",
    _props: { scope: "col" },
  },
  {
    key: "HeadloadAmt",
    label: "Total Headload Amt",
    _props: { scope: "col" },
  }
];

const InwardTransportation = () => {
  const [inwardData, setInwardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const items = [];
  const excelitem = [];
  const navigate = useNavigate();

  useEffect(() => {
    getInwardTransportation();
  }, []);
  const getInwardTransportation = () => {
    setIsLoading(true);
    const startDate = localStorage.getItem("startDate");
    const endDate = localStorage.getItem("endDate");
    const shift = localStorage.getItem("shift");
    // const dateParts = dateRange?.split(" - ");
    const payload = {
      startDate: startDate,
      endDate: endDate,
      bmcId: localStorage.getItem("BMCId"),
      shift: shift,
    };
    GetInwardTransportation((res) => {
      setInwardData(res.data);
      if (res.status == 200) {
        setIsLoading(false);
      }
    }, payload);
  };

  {
    inwardData?.map((val, ind) => {
      console.log(
        "totalmilkCollection: ",
        val.totalMilkCollections,
        " payAmount:",
        val.contract?.PayAmount
      );

      let paymentAmount;

      if (val.contract?.PayTerms == "Day Wise") {
        paymentAmount = val.attendance * parseInt(val.contract?.PayAmount);
      }
      if (val.contract?.PayTerms == "Shift Wise") {
        paymentAmount =
          val.totalMilkCollections * parseInt(val.contract?.PayAmount);
      }
      if (val.contract?.PayTerms == "Month Wise") {
        const startDate = localStorage.getItem("startDate");
        const endDate = localStorage.getItem("endDate");
        const getTotalDaysInMonth = (date) => moment(date).daysInMonth();
        const monthsCount = getTotalDaysInMonth(startDate,endDate);
        paymentAmount = (parseInt(val.contract?.PayAmount) / monthsCount) * val.attendance;
        // console.log(monthsCount);
      }

      let perltercost = paymentAmount / val.totalMilk;

      items.push({
        sn: ind + 1,
        vehicleno: val?.contract?.VehicleId?.RegistrationNo
          ? val.contract.VehicleId.RegistrationNo
          : "-",
        transporter: val?.contract?.TransporterId?.FirmName
          ? val.contract.TransporterId.FirmName
          : "-",
        route: val?.routId?.RouteName ? val.routId.RouteName : "-",
        milkquantity: val.totalMilk <= 0 ? "-" : val.totalMilk,
        canCount: val.canCount <= 0 ? "-" : val.canCount,
        payterm: val?.contract?.PayTerms ? val.contract.PayTerms : "-",
        rate: val?.contract?.PayAmount ? parseInt(val.contract.PayAmount) : "-",
        attendance: val?.attendance ? val.attendance : "-",
        payamount:
          paymentAmount && paymentAmount > 0 ? paymentAmount.toFixed(2) : "-",
        perltrcost:
          isNaN(perltercost) || perltercost <= 0
            ? "-"
            : `${perltercost.toFixed(2)} per LTR`,
        accName: val.accName ? val.accName : "-",
        accNumber: val.accNumber ? val.accNumber : "-",
        accIfscCode: val.accIfscCode ? val.accIfscCode : "-",
        arrivalTime: val.arrivalTime
          ? moment(val?.arrivalTime).format("YYYY-MM-DD hh:mm:ss")
          : "-",
        HeadloadQty: val.HeadloadQty ? val.HeadloadQty : "-",
        HeadloadAmt: val.HeadloadAmt ? val.HeadloadAmt : "-",
      });
      excelitem.push({
        "SlNo": ind + 1,
        "Vehicle No.": val?.contract?.VehicleId?.RegistrationNo
          ? val.contract.VehicleId.RegistrationNo
          : " ",
        "Transporter": val?.contract?.TransporterId?.FirmName
          ? val.contract.TransporterId.FirmName
          : "-",
        "Route": val?.routId?.RouteName ? val?.routId?.RouteName : " ",
        "Milk Quantity": val.totalMilk <= 0 ? "-" : val.totalMilk,
        "Can Count": val.canCount <= 0 ? "-" : val.canCount,
        "Payterm": val?.contract?.PayTerms ? val.contract.PayTerms : "-",
        "Rate": val?.contract?.PayAmount ? parseInt(val.contract.PayAmount) : "-",
        "Attendance": val?.attendance ? val.attendance : "-",
        "Payamount":
          paymentAmount && paymentAmount > 0 ? paymentAmount.toFixed(2) : "-",
        "Per ltr cost":
          isNaN(perltercost) || perltercost <= 0
            ? "-"
            : `${perltercost.toFixed(2)} per LTR`,
        "Acc Name": val.accName ? val.accName : "-",
        "Acc Number": val.accNumber ? val.accNumber : "-",
        "Acc IFSC": val.accIfscCode ? val.accIfscCode : "-",
        "Arrival Time": val.arrivalTime
          ? moment(val?.arrivalTime).format("YYYY-MM-DD hh:mm:ss")
          : "-",
        "Total Headload Qty": val.HeadloadQty ? val.HeadloadQty : "-",
        "Total Headload Amt": val.HeadloadAmt ? val.HeadloadAmt : "-",
      });
    });
  }

  // console.log('This is items', items);

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `inward transport details.xlsx`);
  };

  const handleInward = () => {
    navigate("/inward-transportation-form");
  };

  return (
    <div className="milk-collection">
      <div className="milk-collection__container">
        <div className="milk-collection__header">
          <div className="milk-collection__header__section">
            <div className="milk-collection__header__section__main">
              <h5>Company: Verka</h5>
              <h4>Inward Transportation details</h4>
            </div>
            <div className="milk-collection__header__section__bottom">
              <Header />
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="milk-collection__table">
              <div className="milk-collection__table__header">
                <div className="milk-collection__table__header__section"></div>
              </div>
              <div className="back">
                <IconButton onClick={handleInward}>
                  <img src={images} alt="back" />
                </IconButton>
              </div>
              <div className="buttonsExcel">
                <CButton
                  onClick={handleExportToExcel}
                  style={{ backgroundColor: "#0e419d" }}
                >
                  Export to excel{" "}
                </CButton>
              </div>
              <div
                className="milk-collection__table__body"
                style={{ height: "75vh", overflowY: "scroll" }}
              >
                <CTable
                  // ref={t   ableRef}
                  columns={columns}
                  items={items}
                  hover
                  className="striped-table"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default InwardTransportation;
