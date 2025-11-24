import { CTable, CFormSelect, CButton } from "@coreui/react";
import React, { useState, useEffect } from "react";
import { GetBillingCycle } from "../../../utils/apiCalls";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "../../../components/header/Header";
import Confirm from "../../../components/confirmModal/confirm";
import moment from "moment";

const columns = [
  {
    key: "heading_1",
    label: "StartDate - EndDate",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Bill Generation",
    _props: { scope: "col" },
  },
];

const ComplaintCycle = () => {
  const token = localStorage.getItem("token");
  const items = [];
  const [cycleTableData, setCycleTableData] = useState([]);
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const navigate = useNavigate();
  const [billingCycleid, setBillingCycleId] = useState(null);
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  useEffect(() => {
    getCycle();
  }, [currentDate]);

  const getCycle = () => {
    GetBillingCycle((result) => {
      let { status, data, message } = result;
      if (status === 200) {
        setCycleTableData(data);
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
    }, currentDate);
  };

  {
    items?.push({
      heading_1: (
        <CFormSelect
          size="sm"
          onChange={(e) => {
            setBillingCycleId(e.target.value);
            setIsSelected(true);
          }}
        >
          <option value={0}>Select Date</option>
          {cycleTableData?.length &&
            cycleTableData?.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {moment(option.startDate).format("YYYY-MM-DD")} -{" "}
                  {moment(option.endDate).format("YYYY-MM-DD")}
                </option>
              );
            })}
        </CFormSelect>
      ),
      heading_2: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            to={isSelected ? `/complaint-form` : null}
            style={{
              color: isSelected ? "blue" : "grey",
              cursor: isSelected ? "pointer" : "not-allowed",
              pointerEvents: isSelected ? "auto" : "none",
            }}
          >
            <span
              style={{
                color: isSelected ? "blue" : "grey",
                cursor: isSelected ? "pointer" : "not-allowed",
                pointerEvents: isSelected ? "auto" : "none",
              }}
              onClick={() => {
                if (isSelected) {
                  localStorage.setItem("billingCycleId", billingCycleid);
                }
              }}
            >
              View Complaints
            </span>
          </Link>
        </div>
      ),
    });
  }

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <>
      {token ? (
        <div className="reconcillation">
          <div className="reconcillation__container">
            <div className="reconcillation__header">
              <div className="reconcillation__header__section">
                <div className="reconcillation__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`${"Complaint Cycle"}`}</h4>
                </div>
                <div className="reconcillation__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            <div className="reconcillation__table">
              <div
                className="reconcillation__table__body"
                style={{ height: "70vh", overflowY: "scroll" }}
              >
                <CTable
                  columns={columns}
                  items={items}
                  hover
                  className="striped-table"
                />
              </div>
              <div
                style={{
                  marginTop: "1vw",
                  display: "flex",
                  justifyContent: "center",
                }}
              ></div>
            </div>
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

export default ComplaintCycle;
