import { CTable, CFormSelect } from "@coreui/react";
import React, { useState, useEffect } from "react";
import "./AgentLedgerCycleList.scss";
import { CPagination, CPaginationItem } from "@coreui/react";
import { GetBillingCycle, GetAllAgents } from "../../../utils/apiCalls";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "../../../components/header/Header";
import Confirm from "../../../components/confirmModal/confirm";
import moment from "moment";
import Select from "react-select";
import { CCol } from "@coreui/react";

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
    label: "Bill Generation",
    _props: { scope: "col" },
  },
];

const PayoutCycleList = () => {
  const token = localStorage.getItem("token");
  const items = [];
  const [cycleTableData, setCycleTableData] = useState([]);
  const [selectorganizationData, setSelectorganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [date, setDate] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [allAgentDropdownData, setAllAgentDropdownData] = useState([]);
  const [isddSelected, setIsddSelected] = useState(false);
  const navigate = useNavigate();

  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  useEffect(() => {
    getCycle();
  }, [currentDate]);

  const orgUnitType = 5;
  useEffect(() => {
    getOrganizationData();
  }, [orgUnitType]);

  const getOrganizationData = () => {
    GetAllAgents(
      (res) => {
        setAllAgentDropdownData(res.data);
      },
      orgUnitType,
    );
  };

  const getCycle = () => {
    GetBillingCycle((result) => {
      setCycleTableData(result.data);
    }, currentDate);
  };

  const newData = cycleTableData?.map((item, ind) => {
    return {
      ...item,
      appendDate: ` ${moment(item.startDate).format('YYYY-MM-DD')} - ${moment(item.endDate).format('YYYY-MM-DD')
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
        <Select
          options={allAgentDropdownData}
          value={allAgentDropdownData?.find(
            (option) =>
              option.id === selectedOption
          )}
          onChange={(selectedOption) => {
            setSelectedOption(selectedOption?.id);
            setIsddSelected(Boolean(selectedOption));
          }}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          isSearchable
          placeholder="Select Agent"
          menuPortalTarget={document.body}
          styles={{
            control: (provided, state) => ({
              ...provided,
              height: '32px',
              minHeight: '32px',
            }),
          }}
        />
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
            to={isddSelected ? `/agent-ledger-report` : null}
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
              Generate Agent Ledger
            </span>
          </Link>
        </div>
      ),
    });
  }

  const navigateToCycle = () => {
    localStorage.setItem("start-end-date", date);
    localStorage.setItem("agentId", selectedOption);
  };

  return (
    <>
      {token ? <div className="cyclebmc">
        <div className="cyclebmc__container">
          <div className="cyclebmc__header">
            <div className="cyclebmc__header__section">
              <div className="cyclebmc__header__section__main">
                <h5>Company: Verka</h5>
                <h4>{`${"Agent Ledger Report"}`}</h4>
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
              <CTable columns={columns} items={items} hover className="striped-table" />
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

export default PayoutCycleList;
