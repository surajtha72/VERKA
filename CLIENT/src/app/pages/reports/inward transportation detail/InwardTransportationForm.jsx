import { CTable, CFormSelect, CFormInput, CButton } from "@coreui/react";
import React, { useState, useEffect } from "react";
import {
  GetBillingCycle,
  GetDropDownOrganization,
} from "../../../utils/apiCalls";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "../../../components/header/Header";
import Confirm from "../../../components/confirmModal/confirm";
import moment from "moment";

const columns = [
  {
    key: "heading_1",
    label: "BMC",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Start Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "End Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Shift",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: " ",
    _props: { scope: "col" },
  },
];

const InwardTransportationForm = () => {
  const token = localStorage.getItem("token");
  const items = [];
  const [cycleTableData, setCycleTableData] = useState([]);
  const [selectorganizationData, setSelectorganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndtDate] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState("");
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  const [shift, setShift] = useState("null");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCycle();
  }, [currentDate]);

  const orgType = 5;
  useEffect(() => {
    getDropdownOrganization();
  }, [orgType]);

  const getDropdownOrganization = () => {
    GetDropDownOrganization((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setSelectorganizationData(data);
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
    }, orgType);
  };
  const getCycle = () => {
    GetBillingCycle((result) => {
      setCycleTableData(result.data);
    }, currentDate);
  };

  const validateForm = () => {
    let errors = {};
    if (selectedOption === 0) errors.selectedOption = "Please select a BMC.";
    if (!startDate) errors.startDate = "Start date is required.";
    if (!endDate) errors.endDate = "End date is required.";
    if (startDate && endDate && moment(endDate).isBefore(moment(startDate))) {
      errors.endDate = "End date cannot be before start date.";
    }
    if (shift === "null") errors.shift = "Please select a shift.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const newData = cycleTableData?.map((item, ind) => {
    return {
      ...item,
      appendDate: `${moment(startDate).format("YYYY-MM-DD")} - ${moment(
        endDate
      ).format("YYYY-MM-DD")}`,
    };
  });

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      localStorage.setItem("startDate", startDate);
      localStorage.setItem("endDate", endDate);
      localStorage.setItem("BMCId", selectedOption);
      localStorage.setItem("shift", shift);
      navigate("/inward-transportation");
    }
  };

  {
    items?.push({
      heading_1: (
        <div>
          <CFormSelect
            size="sm"
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setOrgName(
                selectorganizationData?.find((org) => org.id == e.target.value)
                  ?.name
              );
              setErrors((prevErrors) => ({ ...prevErrors, selectedOption: null }));
            }}
          >
            <option value={0}>Select BMC</option>
            {selectorganizationData?.map((option, index) => (
              <option key={index} value={option.id}>
                {option.name}
              </option>
            ))}
          </CFormSelect>
          {errors.selectedOption && (
            <p style={{ color: "red", fontSize: "x-small" }}>
              {errors.selectedOption}
            </p>
          )}
        </div>
      ),
      heading_2: (
        <div>
          <CFormInput
            type="date"
            size="sm"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, startDate: null }));
            }}
          />
          {errors.startDate && (
            <p style={{ color: "red", fontSize: "x-small" }}>
              {errors.startDate}
            </p>
          )}
        </div>
      ),
      heading_3: (
        <div>
          <CFormInput
            type="date"
            size="sm"
            value={endDate}
            onChange={(e) => {
              setEndtDate(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, endDate: null }));
            }}
          />
          {errors.endDate && (
            <p style={{ color: "red", fontSize: "x-small" }}>
              {errors.endDate}
            </p>
          )}
        </div>
      ),
      heading_4: (
        <div>
          <CFormSelect
            size="sm"
            value={shift}
            onChange={(e) => {
              setShift(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, shift: null }));
            }}
          >
            <option value="0">Select Shift</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="both">Both</option>
          </CFormSelect>
          {errors.shift && (
            <p style={{ color: "red", fontSize: "x-small" }}>{errors.shift}</p>
          )}
        </div>
      ),
      heading_5: (
        <CButton
          style={{
            border: 0,
            backgroundColor: "#0e419d",
            "margin-right": "15px",
          }}
          onClick={handleSubmit}
        >
          Submit
        </CButton>
      ),
    });
  }

  return (
    <>
      {token ? (
        <div className="cyclebmc">
          <div className="cyclebmc__container">
            <div className="cyclebmc__header">
              <div className="cyclebmc__header__section">
                <div className="cyclebmc__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`${"Inward Transportation"}`}</h4>
                </div>
                <div className="cyclebmc__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            <div className="cyclebmc__table">
              <div
                className="cyclebmc__table__body"
                style={{ height: "70vh", overflowY: "scroll" }}
              >
                <CTable
                  columns={columns}
                  items={items}
                  hover
                  className="striped-table"
                />
              </div>
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

export default InwardTransportationForm;
