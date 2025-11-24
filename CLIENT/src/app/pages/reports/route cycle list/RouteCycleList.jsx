import { CTable, CFormSelect } from "@coreui/react";
import React, { useState, useEffect } from "react";
import "./RouteCycleList.scss";
import { CPagination, CPaginationItem } from "@coreui/react";
import {
  GetCycle,
  GetRouteMaster,
  GetDropDownOrganization,
  GetBillingCycle
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
    label: "Route",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "StartDate - EndDate",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Bill Generation",
    _props: { scope: "col" },
  },
];

const RouteCycleList = () => {
  const token = localStorage.getItem("token");
  const items = [];
  const [cycleTableData, setCycleTableData] = useState([]);
  const [selectorganizationData, setSelectorganizationData] = useState([]);
  const [selectRouteData, setSelectRouteData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedRouteOption, setSelectedRouteOption] = useState(0);
  const [date, setDate] = useState("");

  const [alertText, setAlertText] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [isddSelected, setIsDdSelected] = useState(false);
  const navigate = useNavigate();

  const currentDate = moment(new Date()).format('YYYY-MM-DD')
  useEffect(() => {
    getCycle();
  }, [currentDate]);

  const orgType = 5;
  useEffect(() => {
    getDropdownOrganization();
  }, [orgType]);

  const getDropdownOrganization = () => {
    GetDropDownOrganization((res) => {
      setSelectorganizationData(res.data);
    }, orgType);
  };

  const getCycle = () => {
    GetBillingCycle((result) => {
      setCycleTableData(result.data);
    }, currentDate);
  };

  useEffect(() => {
    getRouteMaster()
  }, [])
  const getRouteMaster = () => {
    GetRouteMaster((result) => {
      let { status, data, message } = result;
      if (status === 200) {
        setSelectRouteData(data);
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

  const newData = cycleTableData?.map((item, ind) => {
    return {
      ...item,
      appendDate: `${moment(item.startDate).format('YYYY-MM-DD')} - ${moment(item.endDate).format('YYYY-MM-DD')
        }`,
    };
  });

  {
    items?.push({
      heading_1: (
        <CFormSelect
          size="sm"
          onChange={(e) => {
            setSelectedOption(e.target.value);
            setIsDdSelected(Boolean(e.target.value));
          }}
        >
          <option value={0}>Select BMC</option>
          {selectorganizationData?.length &&
            selectorganizationData?.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              );
            })}
        </CFormSelect>
      ),
      heading_2: (
        <CFormSelect
          size="sm"
          onChange={(e) => {
            setSelectedRouteOption(e.target.value);
          }}
        >
          <option value={0}>Select Route</option>
          {selectRouteData?.length &&
            selectRouteData?.map((option, index) => {
              return (
                <option key={index} value={option.id}>
                  {option.routeName}
                </option>
              );
            })}
        </CFormSelect>
      ),

      heading_3: (
        <CFormSelect
          size="sm"
          onChange={(e) => {
            setDate(e.target.value);
          }}
        >
          <option value={0}>Select Date</option>
          {newData?.length &&
            newData?.map((option, index) => {
              // console.log(option);
              return (
                <option key={index} value={option.appendDate}>
                  {/* {console.log(option.appendDate)} */}
                  {option.appendDate}
                </option>
              );
            })}
        </CFormSelect>
      ),
      heading_4: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            to={isddSelected ? `/route-invoice-billing` : null}
            style={{
              color: isddSelected ? "blue" : "grey",
              cursor: isddSelected ? "pointer" : "not-allowed",
              pointerEvents: isddSelected ? "auto" : "none",
            }}
          >
            <span
              onClick={() => {
                if (isddSelected) {
                  navigateToCycle();
                }
              }}
            >
              Bill Generate
            </span>
          </Link>
        </div>
      ),
    });
  }

  const navigateToCycle = () => {
    localStorage.setItem("start-end-date", date);
    localStorage.setItem("BMCId", selectedOption);
    localStorage.setItem("RouteId", selectedRouteOption);
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };
  // console.log('token: ',token);

  return (
    <>
      {token ? (
        <div className="cycleroute">
          <div className="cycleroute__container">
            <div className="cycleroute__header">
              <div className="cycleroute__header__section">
                <div className="cycleroute__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`${"Route Billing Cycle Master"}`}</h4>
                </div>
                <div className="cycleroute__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            <div className="cycleroute__table">
              <div
                className="cycleroute__table__body"
                style={{ height: "70vh", overflowY: "scroll" }}
              >
                <CTable
                  columns={columns}
                  items={items}
                  hover
                  className="striped-table"
                />
              </div>
              {/* <div
                style={{
                  marginTop: "1vw",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CPagination activepage={1} pages={1}>
                  <CPaginationItem>First</CPaginationItem>
                  <CPaginationItem>Next</CPaginationItem>
                  <CPaginationItem>Previous</CPaginationItem>
                  <CPaginationItem>Last</CPaginationItem>
                </CPagination>
              </div> */}
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

export default RouteCycleList;
