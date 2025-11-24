import { CTable, CFormSelect } from "@coreui/react";
import React, { useState, useEffect } from "react";
// import "./BmcCycleList.scss";
import { CPagination, CPaginationItem } from "@coreui/react";
import { GetBillingCycle, GetDropDownOrganization } from "../../../utils/apiCalls";
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
    label: "StartDate - EndDate",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: " ",
    _props: { scope: "col" },
  },
];

const ProductSalesBillingCycle = () => {
  const token = localStorage.getItem("token");
  const items = [];
  const [cycleTableData, setCycleTableData] = useState([]);
  const [selectorganizationData, setSelectorganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [date, setDate] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState('');
  const [isddSelected, setIsDdSelected] = useState(false);

  const currentDate = moment(new Date()).format('YYYY-MM-DD')
  useEffect(() => {
    getCycle();
  }, [currentDate]);

  const orgType = 5;
  useEffect(() => {
    getDropdownOrganization();
  }, [orgType]);

  const getDropdownOrganization = () => {
    console.log('get dropdown functtion called')
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

  const newData = cycleTableData?.map((item, ind) => {
    return {
      ...item,
      appendDate: `${moment(item.startDate).format('YYYY-MM-DD')} - ${moment(item.endDate).format('YYYY-MM-DD')
        }`,
    };
  });

  const handleConfirm = () => {
    setShowConfirmModal1(false)
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  {
    items?.push({
      heading_1: (
        <CFormSelect
          size="sm"
          onChange={(e) => {
            setSelectedOption(e.target.value);
            setIsDdSelected(Boolean(e.target.value));
            setOrgName(selectorganizationData?.find((org) => org.id == e.target.value)?.name);
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
            to={isddSelected ? `/product-sales-to-agent` : null}
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
              View
            </span>
          </Link>
        </div>
      ),
    });
  }

  const navigateToCycle = () => {
    localStorage.setItem("start-end-date", date);
    localStorage.setItem("BMCId", selectedOption);
    localStorage.setItem("orgName", orgName);
  };

  return (
    <>
      {token ? <div className="cyclebmc">
        <div className="cyclebmc__container">
          <div className="cyclebmc__header">
            <div className="cyclebmc__header__section">
              <div className="cyclebmc__header__section__main">
                <h5>Company: Verka</h5>
                <h4>{`${"Product Sales Cycle"}`}</h4>
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
                className="striped-table" />
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

export default ProductSalesBillingCycle;
