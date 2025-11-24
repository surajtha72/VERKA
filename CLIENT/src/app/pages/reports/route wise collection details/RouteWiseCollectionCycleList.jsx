import { CTable, CFormSelect, CButton, CFormInput } from "@coreui/react";
import React, { useState, useEffect } from "react";
import "./RouteWiseCollectionCycleList.scss";
import { GetBillingCycle, GetDropDownOrganization } from "../../../utils/apiCalls";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "../../../components/header/Header";
import Confirm from "../../../components/confirmModal/confirm";
import moment from "moment";

const columns = [
  {
    key: "heading_1",
    label: "Select BMC",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "StartDate - EndDate",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Bill Generation",
    _props: { scope: "col" },
  },
];

const shiftWisecolumns = [
  {
    key: "heading_1",
    label: "Select BMC",
    _props: { scope: "col" },
  },

  {
    key: "heading_3",
    label: "from",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "to",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "shift",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Bill Generation",
    _props: { scope: "col" },
  },

];

const AgentReconcillationCycleList = () => {
  const token = localStorage.getItem("token");
  const items = [];
  const shiftWiseItems = [];
  const [cycleTableData, setCycleTableData] = useState([]);
  const [date, setDate] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isddSelected, setIsDdSelected] = useState(false);
  const navigate = useNavigate();
  const [selectorganizationData, setSelectorganizationData] = useState();
  const [selectedOption, setSelectedOption] = useState(0);
  const [isRouteWise, setisRouteWise] = useState(false);

  // dates to get shift wise reports 
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [shift, setShift] = useState('both');

  const currentDate = moment(new Date()).format('YYYY-MM-DD')
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
      } else if (message?.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModal1(true);
        setSessionOk(true);
      }
    }, currentDate);
  };

  const orgType = 5;
  useEffect(() => {
    getDropdownOrganization();
  }, [orgType]);

  const getDropdownOrganization = () => {
    GetDropDownOrganization((res) => {
      setSelectorganizationData(res.data);
    }, orgType);
  };

  const newData = cycleTableData?.map((item, ind) => {
    return {
      ...item,
      appendDate: ` ${moment(item.startDate).format('YYYY-MM-DD')} - ${moment(item.endDate).format('YYYY-MM-DD')
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
            setDate(e.target.value);
            setIsDdSelected(Boolean(e.target.value));
          }}
        >
          <option value={0}>Select Date</option>
          {newData?.length &&
            newData?.map((option, index) => {
              // console.log(option);
              return (
                <option key={index} value={option.appendDate}>
                  {option.appendDate}
                </option>
              );
            })}
        </CFormSelect>
      ),
      heading_3: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            to={isddSelected ? `/route-collection-report` : null}
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
              Generate Route-Wise Collection Report
            </span>
          </Link>
        </div>
      ),
    });
  }

  {
    shiftWiseItems.push(
      {
        heading_2: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link
              to={(startDate !== null && endDate !== null && shift !== null) ? `/route-collection-report` : null}
              style={{
                color: (startDate !== null && endDate !== null && shift !== null) ? "blue" : "grey",
                cursor: (startDate !== null && endDate !== null && shift !== null) ? "pointer" : "not-allowed",
                pointerEvents: (startDate !== null && endDate !== null && shift !== null) ? "auto" : "none",
              }}
            >
              <span
                onClick={() => {
                  if ((startDate !== null && endDate !== null && shift !== null)) {
                    navigateToCycle();
                  }
                }}
              >
                Generate Route-Wise Collection Report
              </span>
            </Link>
          </div>
        ),
        heading_3: (
          <CFormInput
            type="date"
            size="sm"
            onChange={(e) => {
              setStartDate(e.target.value);
              // console.log(e.target.value)
            }}
          />
        ),
        heading_4: (
          <CFormInput
            type="date"
            size="sm"
            onChange={(e) => {
              setEndDate(e.target.value);
              // console.log(e.target.value)
            }}
          />
        ),
        heading_5: (
          <CFormSelect
            size="sm"
            onChange={(e) => {
              setShift(e.target.value);

            }}
          >
            <option value={0}>Select Shift</option>
            <option value={'morning'}>
              Morning
            </option>
            <option value={'evening'}>
              Evening
            </option>
            <option value={'both'}>
              Both
            </option>
          </CFormSelect>
        ),
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
      }
    )
  }

  const navigateToCycle = () => {
    localStorage.setItem("start-end-date", date);
    localStorage.setItem("BMCId", selectedOption);
    if (startDate !== null && endDate !== null) {
      localStorage.setItem("start-end-date", `${startDate} - ${endDate}`);
      localStorage.setItem("shift", shift);
    }
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
      {token ? <div className="reconcillation">
        <div className="reconcillation__container">
          <div className="reconcillation__header">
            <div className="reconcillation__header__section">
              <div className="reconcillation__header__section__main">
                <h5>Company: Verka</h5>
                <h4>{`${"Route-Wise Collection Report"}`}</h4>
              </div>
              <div className="reconcillation__header__section__bottom">
                <Header />
              </div>
            </div>
          </div>
          <div className="reconcillation__table">
            {
              isRouteWise ? <button onClick={() => { setisRouteWise(isRouteWise ? false : true) }} className="buttons">Get Cycle-Wise Reports</button>
                :
                <button onClick={() => { setisRouteWise(isRouteWise ? false : true) }} className="buttons">Get Shift-Wise Reports</button>
            }
            <div
              className="reconcillation__table__body"
              style={{ height: "70vh", overflowY: "scroll" }}
            >
              {
                isRouteWise ? <CTable columns={shiftWisecolumns} items={shiftWiseItems} hover className="striped-table" />
                  :
                  <CTable columns={columns} items={items} hover className="striped-table" />
              }
            </div>
            <div
              style={{
                marginTop: "1vw",
                display: "flex",
                justifyContent: "center",
              }}
            >
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
      </div> : <Navigate to={"/"} />
      }
    </>
  );
};

export default AgentReconcillationCycleList;