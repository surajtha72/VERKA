import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CFormSelect,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import "./CycleList.scss";
import {
  GetCycle,
  CreateCycle,
  UpdateCycle,
  DeleteCycle,
  GetDropDownFinYear,
  LockCycle,
} from "../../../../utils/apiCalls";
import moment from "moment";
import { Paper } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "../../../../components/header/Header";
import Confirm from "../../../../components/confirmModal/confirm";
import Loader from "../../../../components/loader";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LockIcon from '@mui/icons-material/Lock';

const columns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Cycle No.",
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
    label: "Actions",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Freeze",
    _props: { scope: "col" },
  },
];

const initialCycle = {
  financialYearId: "",
  cycleNo: "",
  startDate: "",
  endDate: "",
};

const CycleList = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const items = [];
  let switchValue = [];
  const [switchValues, setSwitchValues] = useState([]);
  const [cycleTableData, setCycleTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [showConfirmModal2, setShowConfirmModal2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateCycle, setIsCreateCycle] = useState(false);
  const [isEditCycle, setIsEditCycle] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cycleData, setCycleData] = useState(initialCycle);
  const [cycleDataErr, setCycleDataErr] = useState(initialCycle);
  const [isId, setIsId] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFinyearId, setSelectedFinyearId] = useState(null);
  const [selectFinyearData, setSelectFinyearData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const CyclePermissions = userAuthData?.permissions?.find(
        (val) => val?.BillingCycleMaster
      );
      setPermission(CyclePermissions?.BillingCycleMaster);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearDataErr = () => {
    setCycleDataErr(initialCycle);
  };

  const clearData = () => {
    setCycleData(initialCycle);
  };

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setIsId(id);
  };

  const handleLock = (id) => {
    setShowConfirmModal2(true);
    setIsId(id);
  };

  const handleOk = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteCycle((res) => {
        const { status, message } = res;
        if (status === 200) {
          getCycle();
          setIsId(null);
          setShowConfirmModal(false);
          setAlertText(message);
          setShowConfirmModal1(true);
        }
      }, payload);
    }
  };

  const handleLockOk = () => {
    setIsLoading(true);
    const payload = {
      id: isId,
    };
    // console.log("payload",payload);
    if (isId != null) {
      setShowConfirmModal2(false);
      LockCycle((res) => {
        const { status, message } = res;
        if (status === 200) {
          getCycle();
          setIsId(null);
          setShowConfirmModal(false);
          setAlertText(message);
          setIsLoading(false);
        }
      }, payload);
    }
  };

  useEffect(() => {
    getCycle();
    getAllFinYearData();
  }, []);

  const getCycle = () => {
    setIsLoading(true); // Show the loading spinner
    GetCycle((res) => {
      const { status, data, message } = res;
      if (status === 200) {
        // console.log("cycle data",data);
        setCycleTableData(data);
        setFilteredData(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowConfirmModal(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowConfirmModal(false);
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

  const getAllFinYearData = () => {
    GetDropDownFinYear((res) => {
      // console.log(res);
      setSelectFinyearData(res.data);
    });
  };

  const handleDropDown = (name, value) => {
    setCycleData((prev) => ({ ...prev, [name]: value }));
    setCycleDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedFinyearId(value);
    // console.log(selectedFinyearId);
  };

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(cycleTableData);
    } else {
      const filteredData = cycleTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filteredData);
    }
  };

  {
    filteredData?.map((val, ind) => {
      items?.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.cycleNo ?? "--",
        heading_2: moment(val?.startDate).format('DD-MM-YYYY') ?? "--",
        heading_3: moment(val?.endDate).format('DD-MM-YYYY') ?? "--",
        heading_4: (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              disabled={!hasPermission("Update")}
              title={!hasPermission("Update") ? "No permission to Update" : ""}
              className={hasPermission("Update") ? "" : "disabled-button"}
              style={{
                color: "green",
                cursor: "pointer",
                border: "none",
                background: "none",
              }}
              onClick={() => handleEdit(val?.id)}
            >
              <EditNoteOutlinedIcon />
            </button>
            <button
              disabled={!hasPermission("Delete")}
              title={!hasPermission("Delete") ? "No permission to Delete" : ""}
              className={hasPermission("Delete") ? "" : "disabled-button"}
              style={{
                color: "red",
                cursor: "pointer",
                border: "none",
                background: "none",
                // marginLeft: 10,
              }}
              onClick={() => {
                handleDelete(val?.id);
              }}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
        heading_5: (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              disabled={val?.isFrozen}
              title={val?.isFrozen ? "Locked" : "Freeze this cycle"}
              className={val?.isFrozen ? "disabled-button" : ""}
              style={{
                color: "#0e419d",
                cursor: "pointer",
                border: "none",
                background: "none",
              }}
              onClick={() => { 
                handleLock(val?.id)
              }}
            >
              <LockIcon />
            </button>
          </div>
        ),
      });
    });
  }

  const navigateToCycle = (id) => {
    localStorage.setItem(
      "startDateCycle",
      cycleTableData
        .find((startDate) => startDate.id === id)
        ?.startDate?.split("T")[0]
    );
    localStorage.setItem(
      "endDateCycle",
      cycleTableData
        .find((endDate) => endDate.id === id)
        ?.endDate?.split("T")[0]
    );
  };

  switchValue = Object.keys(switchValues)
    ?.filter((id) => switchValues[id])
    ?.map((id) => parseInt(id));

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCycleData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCycleDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateFields = () => {
    let errObj = { ...initialCycle };

    if (!cycleData.financialYearId) {
      errObj.financialYearId = "This field is required";
    } else if (cycleData.financialYearId == 0) {
      errObj.financialYearId = "This field is required";
    } else {
      errObj.financialYearId = "";
    }
    if (!cycleData.cycleNo) {
      errObj.cycleNo = "This field is required";
    } else {
      errObj.cycleNo = "";
    }
    if (!cycleData.startDate) {
      errObj.startDate = "This field is required";
    } else {
      errObj.startDate = "";
    }
    if (!cycleData.endDate) {
      errObj.endDate = "This field is required";
    } else {
      errObj.endDate = "";
    }

    setCycleDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleCycle = () => {
    setIsCreateCycle(!isCreateCycle);
    setIsEditCycle(false);
    setIsCreateCycle(initialCycle);
    setIsId(null);
    setSwitchValues({});
    setVisible(!visible);
    clearData();
  };

  const handleCancelcycle = () => {
    setIsCreateCycle(false);
    clearData();
    setVisible(false);
    clearDataErr();
  };

  const handleSubmit = (e) => {
    if (validateFields()) {
      e.preventDefault();
      const payload = {
        financialYearId: cycleData?.financialYearId,
        cycleNo: cycleData?.cycleNo,
        startDate: cycleData?.startDate,
        endDate: cycleData?.endDate,
      };
      if (isId) {
        payload.id = isId;
        UpdateCycle((res) => {
          const { status, message } = res;
          if (status === 200) {
            getCycle();
            clearData();
            setAlertText(message);
            setShowConfirmModal1(true);
            setIsCreateCycle(false);
            setIsEditCycle(false);
          } else if (status === 403) {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModal1(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowConfirmModal(false);
            setAlertText("Something wrong happened in API");
            setShowConfirmModal1(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          }
        }, payload);
      } else {
        CreateCycle((res) => {
          const { status, message } = res;
          if (status === 200) {
            getCycle();
            clearData();
            setSwitchValues({});
            setAlertText(message);
            setShowConfirmModal1(true);
            setIsCreateCycle(false);
            setIsEditCycle(false);
          } else if (status === 403) {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModal1(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowConfirmModal(false);
            setAlertText("Something wrong happened in API");
            setShowConfirmModal1(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          }
        }, payload);
      }
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleEdit = (id) => {
    // console.log("cycledata: ", cycleTableData);
    setIsCreateCycle(!isCreateCycle);
    setIsEditCycle(true);
    setCycleData({
      financialYearId:
        cycleTableData.find((financialYearId) => financialYearId.id === id)
          ?.financialYearId || "",
      cycleNo:
        cycleTableData.find((cycleNo) => cycleNo.id === id)?.cycleNo || "",
      startDate:
        moment(
          cycleTableData.find((startDate) => startDate.id === id)?.startDate
        ).format("YYYY-MM-DD") || "",
      endDate:
        moment(
          cycleTableData.find((endDate) => endDate.id === id)?.endDate
        ).format("YYYY-MM-DD") || "",
    });
    // console.log(cycleTableData.find((cycle) => cycle.id === id)?.id);
    setIsId(cycleTableData.find((cycle) => cycle.id === id)?.id);
    const payload = {
      id: cycleTableData.find((cycle) => cycle.id === id)?.id,
    };
    setSwitchValues({});
    setVisible(!visible);
  };

  return (
    <>
      {token ? (
        <div className="cycle">
          <div className="cycle__container">
            <div className="cycle__header">
              <div className="cycle__header__section">
                <div className="cycle__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`MDM - ${isCreateCycle
                    ? isEditCycle
                      ? "Edit Billing Cycle Master"
                      : "Create Billing Cycle Master"
                    : "Billing Cycle Master"
                    }`}</h4>
                </div>
                <div className="cycle__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            {isCreateCycle ? (
              <>
                <div className="Cbody">
                  <Paper elevation={3}>
                    <CForm method="post" onSubmit="">
                      <CRow>
                        <CCol lg={6}>
                          <CFormLabel htmlFor="nf-email">
                            Select Financial Year{" "}
                            <span style={{ color: "red" }}>*</span>
                          </CFormLabel>
                          <CFormSelect
                            size="sm"
                            id="financialYearId"
                            name="financialYearId"
                            value={cycleData.financialYearId}
                            onChange={(e) =>
                              handleDropDown("financialYearId", e.target.value)
                            }
                          >
                            <option value={0}>Select Financial Year</option>
                            {selectFinyearData?.length &&
                              selectFinyearData?.map((option, index) => {
                                return (
                                  <option key={index} value={option.id}>
                                    {`${moment
                                      .utc(option.startDate)
                                      .format("YYYY")} - ${moment
                                        .utc(option.endDate)
                                        .format("YYYY")}`}
                                  </option>
                                );
                              })}
                          </CFormSelect>
                          <span style={{ color: "red", fontSize: "x-small" }}>
                            {cycleDataErr.financialYearId}
                          </span>
                        </CCol>

                        <CCol lg={6}>
                          <CFormLabel htmlFor="nf-email">
                            Billing Cycle Number{" "}
                            <span style={{ color: "red" }}>*</span>
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            type="number"
                            value={cycleData.cycleNo}
                            onChange={handleInput}
                            id="cycleNo"
                            name="cycleNo"
                            placeholder="Enter Cycle Number.."
                            aria-label="default input example"
                          />
                          <span style={{ color: "red", fontSize: "x-small", }}>
                            {cycleDataErr.cycleNo}
                          </span>
                        </CCol>

                        <CCol lg={6}>
                          <CFormLabel htmlFor="nf-email">
                            Start Date{" "}
                            <span style={{ color: "red" }}>*</span></CFormLabel>
                          <CFormInput
                            size="sm"
                            type="date"
                            value={cycleData.startDate}
                            onChange={handleInput}
                            id="startDate"
                            name="startDate"
                            placeholder="Enter Start Date.."
                            aria-label="default input example"
                          />
                          <span style={{ color: "red", fontSize: "x-small", }}>
                            {cycleDataErr.startDate}
                          </span>
                        </CCol>
                        <CCol lg={6}>
                          <CFormLabel htmlFor="nf-email">
                            End Date{" "}
                            <span style={{ color: "red" }}>*</span>
                          </CFormLabel>
                          <CFormInput
                            size="sm"
                            type="date"
                            value={cycleData.endDate}
                            onChange={handleInput}
                            id="endDate"
                            name="endDate"
                            placeholder="Enter End Date.."
                            aria-label="default input example"
                          />
                          <span style={{ color: "red", fontSize: "x-small", }}>
                            {cycleDataErr.endDate}
                          </span>
                        </CCol>
                      </CRow>
                      <div style={{ marginTop: "1vw" }}>
                        <CButton
                          style={{
                            border: 0,
                            backgroundColor: "#0e419d",
                            "margin-right": "15px",
                          }}
                          target="_blank"
                          onClick={handleSubmit}
                        >
                          {isEditCycle ? "Update" : "Save"}
                        </CButton>
                        <CButton
                          target="_blank"
                          style={{
                            border: 0,
                            backgroundColor: "lightslategrey",
                          }}
                          onClick={handleCancelcycle}
                        >
                          Cancel
                        </CButton>
                      </div>
                    </CForm>
                  </Paper>
                </div>
              </>
            ) : (
              <>
                <div className="cycle__table">
                  <div className="cycle__table__header">
                    <div className="cycle__table__header__section">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9.-]/g,
                            ""
                          );
                        }}
                        onKeyPress={(e) => {
                          if (e.target.value.length === 0 && e.key === " ") {
                            e.preventDefault();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.target.value.length > 1 &&
                            e.key === " " &&
                            e.target.value[e.target.value.length - 1] === " "
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <button
                        disabled={!hasPermission("Create")}
                        title={
                          !hasPermission("Create")
                            ? "No permission to Create"
                            : ""
                        }
                        className={
                          hasPermission("Create") ? "" : "disabled-button"
                        }
                        onClick={handleCycle}
                      >
                        Add Billing Cycle
                      </button>
                    </div>
                  </div>
                  <div
                    className="cycle__table__body"
                    style={{ height: "72vh", overflowY: "scroll" }}
                  >
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <CTable
                        columns={columns}
                        items={items}
                        hover
                        className="striped-table"
                      />
                    )}
                  </div>
                </div>

              </>
            )}
          </div>

          {showConfirmModal && (
            <Confirm
              buttonText={"OK"}
              isCancelRequired={true}
              confirmTitle={"Are you sure ?"}
              onConfirm={() => {
                handleOk();
              }}
              onCancel={() => {
                setShowConfirmModal(false);
              }}
            />
          )}
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
          {showConfirmModal2 && (
            <Confirm
              buttonText={"OK"}
              isCancelRequired={true}
              confirmTitle={"Are you sure you want to freeze ?"}
              onConfirm={() => {
                handleLockOk();
              }}
              onCancel={() => {
                setShowConfirmModal2(false);
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

export default CycleList;
