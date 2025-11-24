import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { CTable, CButton } from "@coreui/react";
import images from "../../../../assets/images/log_out.png";
import Header from "../../../components/header/Header";
import Loader from "../../../components/loader";
import * as XLSX from "xlsx";
import moment from "moment";
import { GetVehicleAttendance } from "../../../utils/apiCalls";

const columns = [
  {
    key: "startDate",
    label: "Start Date",
    _props: { scope: "col" },
  },
  {
    key: "endDate",
    label: "End Date",
    _props: { scope: "col" },
  },
  {
    key: "bmc",
    label: "BMC",
    _props: { scope: "col" },
  },
  {
    key: "vehicleRegNo",
    label: "Vehicle Reg. No.",
    _props: { scope: "col" },
  },
  {
    key: "route",
    label: "Route Name",
    _props: { scope: "col" },
  },
  {
    key: "morningShiftArrival",
    label: "Morning Shift Arrival",
    _props: { scope: "col" },
  },
  {
    key: "eveningShiftArrival",
    label: "Evening Shift Arrival",
    _props: { scope: "col" },
  },
];

const VehicleAttendance = () => {
  const [vehicleData, setVehicledData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const items = [];
  const excelitem = [];
  const navigate = useNavigate();

  useEffect(() => {
    getVehicleAttendance();
  }, []);
  const getVehicleAttendance = () => {
    setIsLoading(true);
    const startDate = localStorage.getItem("startDate");
    const endDate = localStorage.getItem("endDate");
    const payload = {
      startDate: startDate,
      endDate: endDate,
      bmcId: localStorage.getItem("BMCId"),
    };
    GetVehicleAttendance((res) => {
      setVehicledData(res.data);
      if (res.status == 200) {
        setIsLoading(false);
      }
    }, payload);
  };

  {
    vehicleData.forEach((val, ind) => {
      if (val.morningShiftArrival && val.eveningShiftArrival) {
        Object.keys(val.morningShiftArrival).map((date) => {
          items.push({
            sn: ind + 1,
            startDate: val.startDate ? moment(val.startDate).format("DD/MM/YYYY") : "-",
            endDate: val.endDate ? moment(val.endDate).format("DD/MM/YYYY") : "-",
            bmc: val.bmc ? val.bmc : "-",
            vehicleRegNo: val.vehicleRegNo ? val.vehicleRegNo : "-",
            route: val.route ? val.route : "-",
            morningShiftArrival: val.morningShiftArrival[date] ? moment(val.morningShiftArrival[date]).format("DD/MM/YYYY hh:mm:ss") : "-",
            eveningShiftArrival: val.eveningShiftArrival[date] ? moment(val.eveningShiftArrival[date]).format("DD/MM/YYYY hh:mm:ss") : "-"
          });

          excelitem.push({
            "sn": ind + 1,
            "startDate": val.startDate ? moment(val.startDate).format("DD/MM/YYYY") : "-",
            "endDate": val.endDate ? moment(val.endDate).format("DD/MM/YYYY") : "-",
            "bmc": val.bmc,
            "vehicleRegNo": val.vehicleRegNo,
            "route": val.route,
            "morningShiftArrival": val.morningShiftArrival[date] ? moment(val.morningShiftArrival[date]).format("DD/MM/YYYY hh:mm:ss") : "-",
            "eveningShiftArrival": val.eveningShiftArrival[date] ? moment(val.eveningShiftArrival[date]).format("DD/MM/YYYY hh:mm:ss") : "-"
          });
        });
      } else {
        console.warn(`Missing data for vehicleRegNo: ${val.vehicleRegNo}`);
      }
    });
  }

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `vehicle attendance sheet.xlsx`);
  };

  const handleVehicle = () => {
    navigate("/vehicle-attendance-form");
  };

  return (
    <div className="milk-collection">
      <div className="milk-collection__container">
        <div className="milk-collection__header">
          <div className="milk-collection__header__section">
            <div className="milk-collection__header__section__main">
              <h5>Company: Verka</h5>
              <h4>Vehicle Attendance sheet</h4>
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
                <IconButton onClick={handleVehicle}>
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
export default VehicleAttendance;
