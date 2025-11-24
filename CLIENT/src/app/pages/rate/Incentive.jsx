import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CTable,
  CFormSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Confirm from "../../components/confirmModal/confirm";
import {
  CreateIncentiveMaster,
  DeleteIncentiveMaster,
  GetIncentiveMaster,
  UpadteIncentiveMaster,
  GetCycle,
  GetShiftApplicable,
} from "../../utils/apiCalls";
import IncentiveSlabs from "./IncentiveSlabs";
import { Paper } from "@mui/material";
import "./RateList.scss";
import Header from "../../components/header/Header";
import Loader from "../../components/loader";
import moment from "moment";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const initialIncentive = {
  incentiveName: "",
  incentiveType: "",
  effectiveFrom: "",
  billingCycleRef: "",
  minFatLimit: "",
  minSnfLimit: "",
  shiftsApplicable: "",
};

const Incentive = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const columns = [
    {
      key: "SlNo",
      label: "#",
      _props: { scope: "col" },
    },
    {
      key: "heading_1",
      label: "Incentive Name",
      _props: { scope: "col" },
    },
    {
      key: "heading_2",
      label: "Incentive Type",
      _props: { scope: "col" },
    },
    {
      key: "heading_3",
      label: "Effective From",
      _props: { scope: "col" },
    },
    {
      key: "heading_4",
      label: "Biling Cycle",
      _props: { scope: "col" },
    },
    {
      key: "heading_5",
      label: "Min Fat",
      _props: { scope: "col" },
    },
    {
      key: "heading_6",
      label: "Min Snf",
      _props: { scope: "col" },
    },
    // {
    //   key: "heading_7",
    //   label: "Shifts",
    //   _props: { scope: "col" },
    // },
    {
      key: "heading_7",
      label: "Actions",
      _props: { scope: "col" },
    },
    {
      key: "heading_8",
      label: "Slabs",
      _props: { scope: "col" },
    },
  ];

  const handleSlabs = (id) => {
    localStorage.setItem("selectedIncentiveId", id);
    setSelectedIncentiveId(id);
    setIsIncentive(true);
  };

  const items = [];

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateIncentive, setIsCreateIncentive] = useState(false);
  const [incentiveData, setIncentiveData] = useState(initialIncentive);
  const [incentiveDataErr, setIncentiveDataErr] = useState(initialIncentive);
  const [incentiveTableData, setIncentiveTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [isId, setIsId] = useState();
  const [cycleData, setCycleData] = useState([]);
  const [shiftsData, setShiftsData] = useState([]);
  const [selectedIncentiveId, setSelectedIncentiveId] = useState(null);
  const [isIncentive, setIsIncentive] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const IncentivePermissions = userAuthData?.permissions?.find(
        (val) => val?.IncentiveList
      );
      setPermission(IncentivePermissions?.IncentiveList);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  useEffect(() => {
    getIncentivemasterData();
    getCycle();
    getDropDownShifts();
  }, []);

  // console.log('cycledata', cycleData);

  const getIncentivemasterData = () => {
    setIsLoading(true); // Show the loading spinner
    GetIncentiveMaster((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setIncentiveTableData(data);
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

  const getCycle = () => {
    GetCycle((result) => {
      setCycleData(result.data);
    });
  };
  // console.log(cycleData);

  const getDropDownShifts = () => {
    GetShiftApplicable((res) => {
      setShiftsData(res.data);
    });
  };

  {
    incentiveTableData?.map((val, ind) => {
      // console.log(val);
      items.push({
        id: val?.id,
        SlNo: ind + 1,
        heading_1: val?.incentiveName ?? "--",
        heading_2:
          val?.incentiveType == 1
            ? "Quality Based"
            : "Quantity Achievement %" ?? "--",
        heading_3: moment(val?.effectiveFrom).format("YYYY-MM-DD") ?? "--",
        heading_4: val?.billingCycleRef.CycleNo ?? "--",
        heading_5: val?.minFatLimit ?? "--",
        heading_6: val?.minSnfLimit ?? "--",
        // heading_7: val?.shiftsApplicable ?? "--",
        heading_7: (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              background: "none",
              alignItems: "flex-start",
            }}
          >
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
              onClick={() => handleEdit(val)}
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
                marginLeft: 10,
              }}
              onClick={() => {
                handleDelete(val?.id);
              }}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
        heading_8: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link to={`/rate-incentive-slabs`}>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  handleSlabs(val?.id);
                }}
              >
                Details
              </span>
            </Link>
          </div>
        ),
      });
    });
  }

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setIsId(id);
  };

  const handleOk = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteIncentiveMaster((res) => {
        let { status, message } = res;
        if (status === 200) {
          getIncentivemasterData();
          setIsId(null);
          setShowConfirmModal(false);
          setAlertText(message);
          setShowConfirmModal1(true);
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
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Perform search logic or update search results
  };

  const clearDataErr = () => {
    setIncentiveDataErr(initialIncentive);
  };

  const clearData = () => {
    setIncentiveData(initialIncentive);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setIncentiveData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIncentiveDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCreateRoute = () => {
    setIsCreateIncentive(!isCreateIncentive);
  };

  const handleCancelRoute = () => {
    setIsCreateIncentive(!isCreateIncentive);
    clearData();
    clearDataErr();
    setIsId(null);
  };

  const validateFields = () => {
    let errObj = { ...initialIncentive };

    if (!incentiveData.incentiveName) {
      errObj.incentiveName = "This field is required";
    } else {
      errObj.incentiveName = "";
    }
    if (!incentiveData.incentiveType) {
      errObj.incentiveType = "This field is required";
    } else if (incentiveData.incentiveType == 0) {
      errObj.incentiveType = "This field is required";
    } else {
      errObj.incentiveType = "";
    }
    if (!incentiveData.effectiveFrom) {
      errObj.effectiveFrom = "This field is required";
    } else {
      errObj.effectiveFrom = "";
    }
    if (!incentiveData.billingCycleRef) {
      errObj.billingCycleRef = "This field is required";
    } else if (incentiveData.billingCycleRef == 0) {
      errObj.billingCycleRef = "This field is required";
    } else {
      errObj.billingCycleRef = "";
    }
    if (!incentiveData.minFatLimit) {
      errObj.minFatLimit = "This field is required";
    } else {
      errObj.minFatLimit = "";
    }
    if (!incentiveData.minSnfLimit) {
      errObj.minSnfLimit = "This field is required";
    } else {
      errObj.minSnfLimit = "";
    }
    if (!incentiveData.shiftsApplicable) {
      errObj.shiftsApplicable = "This field is required";
    } else if (incentiveData.shiftsApplicable == 0) {
      errObj.shiftsApplicable = "This field is required";
    } else {
      errObj.shiftsApplicable = "";
    }

    setIncentiveDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleSubmit = () => {
    // console.log(validateFields());
    if (validateFields()) {
      const payload = {
        incentiveName: incentiveData.incentiveName,
        incentiveType: incentiveData.incentiveType,
        effectiveFrom: incentiveData.effectiveFrom,
        billingCycleRef: incentiveData.billingCycleRef,
        minFatLimit: incentiveData.minFatLimit,
        minSnfLimit: incentiveData.minSnfLimit,
        shiftsApplicable: incentiveData.shiftsApplicable,
      };

      if (isId) {
        payload.id = isId;
        // console.log(payload.id === isId);
        UpadteIncentiveMaster((res) => {
          clearData();
          let { status, message } = res;
          if (status === 200) {
            getIncentivemasterData();
            setIsId(null);
            setIsCreateIncentive(!isCreateIncentive);
            setAlertText(message);
            setShowConfirmModal1(true);
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
        CreateIncentiveMaster((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData();
            getIncentivemasterData();
            setIsId(null);
            setIsCreateIncentive(!isCreateIncentive);
            setAlertText(message);
            setShowConfirmModal1(true);
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

  const handleEdit = (incentiveData) => {
    setIsCreateIncentive(!isCreateIncentive);
    const payload = {
      id: incentiveData.id,
    };
    console.log("incentiveData: ", incentiveData);
    setIncentiveData(
      {
        id: incentiveData.id,
        incentiveName: incentiveData.incentiveName,
        incentiveType: incentiveData.incentiveType,
        effectiveFrom: moment(incentiveData.effectiveFrom).format("YYYY-MM-DD"),
        billingCycleRef: incentiveData.billingCycleRef.Id,
        minFatLimit: incentiveData.minFatLimit,
        minSnfLimit: incentiveData.minSnfLimit,
        shiftsApplicable: incentiveData.shiftsApplicable,
      },
      payload
    );
    setIsId(payload?.id);
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateIncentive(isCreateIncentive);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleDropDown = (name, value) => {
    setIncentiveData((prev) => ({ ...prev, [name]: value }));
    setIncentiveDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <>
      {token ? (
        <>
          {isIncentive ? (
            <CButton
              style={{ position: "absolute", right: 10, top: 70 }}
              onClick={() => setIsIncentive(!isIncentive)}
            >
              Back
            </CButton>
          ) : null}
          {isIncentive ? (
            <IncentiveSlabs selectedIncentiveId={selectedIncentiveId} />
          ) : (
            <div className="ratelist">
              <div className="ratelist__container">
                <div className="ratelist__header">
                  <div className="ratelist__header__section">
                    <div className="ratelist__header__section__main">
                      <h5>Company: Verka</h5>
                      <h4>{`${
                        !isCreateIncentive
                          ? "Incentive List"
                          : isId
                          ? "Edit Incentive"
                          : "Create Incentive"
                      }`}</h4>
                    </div>
                    <div className="routes__header__section__bottom">
                      <Header />
                    </div>
                  </div>
                </div>
                {isCreateIncentive ? (
                  <>
                    <div className="Cbody">
                      {/* <Header /><br></br> */}
                      <Paper elevation={3}>
                        <div className="container">
                          <br></br>
                          <div>
                            <CForm method="post">
                              <CRow>
                                <CCol lg={6}>
                                  <CFormLabel htmlFor="nf-email">
                                    Incentive name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    id="incentiveName"
                                    name="incentiveName"
                                    value={incentiveData.incentiveName}
                                    onChange={handleInput}
                                    placeholder="Enter Incentive Name"
                                    aria-label="default input example"
                                  />
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {incentiveDataErr.incentiveName}
                                  </span>
                                </CCol>

                                <CCol lg={6}>
                                  <CFormLabel htmlFor="nf-email">
                                    Incentive Type{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    id="incentiveType"
                                    name="incentiveType"
                                    value={incentiveData.incentiveType}
                                    onChange={(e) =>
                                      handleDropDown(
                                        "incentiveType",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value={0}>
                                      Select Incentive Type
                                    </option>
                                    <option value={1}>Quality based</option>
                                    <option value={2}>
                                      Quantity achievement %
                                    </option>
                                  </CFormSelect>
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {incentiveDataErr.incentiveType}
                                  </span>
                                </CCol>

                                <CCol lg={6}>
                                  <CFormLabel htmlFor="nf-email">
                                    Effective From{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="date"
                                    id="effectiveFrom"
                                    name="effectiveFrom"
                                    value={incentiveData.effectiveFrom}
                                    onChange={handleInput}
                                    placeholder="Enter Effective From.."
                                    aria-label="default input example"
                                  />
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {incentiveDataErr.effectiveFrom}
                                  </span>
                                </CCol>

                                <CCol lg={6}>
                                  <CFormLabel htmlFor="nf-email">
                                    Billing Cycle Ref{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    id="billingCycleRef"
                                    name="billingCycleRef"
                                    value={incentiveData.billingCycleRef}
                                    onChange={(e) =>
                                      handleDropDown(
                                        "billingCycleRef",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value={0}>
                                      Select Billing Cycle Ref
                                    </option>
                                    {cycleData?.length &&
                                      cycleData?.map((option, index) => {
                                        return (
                                          <option key={index} value={option.id}>
                                            {`${
                                              option.cycleNo
                                            } - From: ${moment(
                                              option.startDate
                                            ).format(
                                              "YYYY-MM-DD"
                                            )} - To: ${moment(
                                              option.endDate
                                            ).format("YYYY-MM-DD")}`}
                                          </option>
                                        );
                                      })}
                                  </CFormSelect>
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {incentiveDataErr.billingCycleRef}
                                  </span>
                                </CCol>

                                <CCol lg={6}>
                                  <CFormLabel htmlFor="nf-email">
                                    Min fat limit{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="minFatLimit"
                                    name="minFatLimit"
                                    value={incentiveData.minFatLimit}
                                    onChange={handleInput}
                                    placeholder="Enter fat limit"
                                    aria-label="default input example"
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^0-9.-]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {incentiveDataErr.minFatLimit}
                                  </span>
                                </CCol>

                                <CCol lg={6}>
                                  <CFormLabel htmlFor="nf-email">
                                    Min snf limit{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    id="minSnfLimit"
                                    name="minSnfLimit"
                                    value={incentiveData.minSnfLimit}
                                    onChange={handleInput}
                                    placeholder="Enter fat limit"
                                    aria-label="default input example"
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^0-9.-]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {incentiveDataErr.minSnfLimit}
                                  </span>
                                </CCol>

                                <CCol lg={6}>
                                  <CFormLabel htmlFor="nf-email">
                                    Shifts Applicable{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    id="shiftsApplicable"
                                    name="shiftsApplicable"
                                    value={incentiveData.shiftsApplicable}
                                    onChange={(e) =>
                                      handleDropDown(
                                        "shiftsApplicable",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value={0}>Select Shifts</option>
                                    {shiftsData?.length &&
                                      shiftsData?.map((option, index) => {
                                        return (
                                          <option key={index} value={option.id}>
                                            {option.name}
                                          </option>
                                        );
                                      })}
                                  </CFormSelect>
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {incentiveDataErr.shiftsApplicable}
                                  </span>
                                </CCol>
                              </CRow>

                              <div>
                                <CButton
                                  //color="primary"
                                  style={{
                                    marginRight: "15px",
                                    backgroundColor: "#0e419d",
                                  }}
                                  target="_blank"
                                  onClick={handleSubmit}
                                >
                                  {isId ? "Update" : "Save"}
                                </CButton>
                                <CButton
                                  color="primary mr-3"
                                  target="_blank"
                                  style={{
                                    backgroundColor: "gray",
                                  }}
                                  onClick={handleCancelRoute}
                                >
                                  Cancel
                                </CButton>
                              </div>
                            </CForm>
                          </div>
                        </div>
                      </Paper>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ratelist__table">
                      <div className="ratelist__table__header">
                        <div className="ratelist__table__header__section">
                          <CFormInput
                            type="text"
                            aria-label="default input example"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
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
                            onClick={handleCreateRoute}
                          >
                            Add Incentive
                          </button>
                        </div>
                      </div>
                      <div
                        className="ratelist__table__body"
                        style={{ height: "60vh", overflowY: "scroll" }}
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
                      {/* <div
                        style={{
                          marginTop: "0.8vw",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <CPagination
                          activepage={1}
                          pages={1}
                        // onactivepageChange={handlePageChange}
                        >
                          <CPaginationItem>First</CPaginationItem>
                          <CPaginationItem>Next</CPaginationItem>
                          <CPaginationItem>Previous</CPaginationItem>
                          <CPaginationItem>Last</CPaginationItem>
                        </CPagination>
                      </div> */}
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
            </div>
          )}
        </>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default Incentive;
