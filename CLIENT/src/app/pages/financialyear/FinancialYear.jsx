import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CPagination,
  CPaginationItem
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import "./FinancialYear.scss";
import {
  GetFinyear,
  CreateFinyear,
  UpdateFinyear,
  DeleteFinyear,
} from "../../utils/apiCalls";
import Confirm from "../../components/confirmModal/confirm";
import moment from "moment";
import { Paper } from "@mui/material";
// import Pagination from "react-js-pagination";
import Header from "../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const initialFinyear = {
  startDate: "",
  endDate: "",
};

const FinancialYear = () => {
  const userAuthData = JSON.parse(localStorage.getItem("userData"));

  const columns = [
    {
      key: "SlNo",
      label: "#",
      _props: { scope: "col" },
    },
    {
      key: "heading_1",
      label: "Start Date",
      _props: { scope: "col" },
    },
    {
      key: "heading_2",
      label: "End Date",
      _props: { scope: "col" },
    },
    {
      key: "heading_3",
      label: "Actions",
      _props: { scope: "col" },
    },
  ];
  const items = [];

  let switchValue = [];
  const token = localStorage.getItem("token");
  const [permission, setPermission] = useState([]);
  const [switchValues, setSwitchValues] = useState([]);
  const [finyearTableData, setFinyearTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatefinancialYear, setIsCreateFinancialYear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [finyearData, setFinyearData] = useState(initialFinyear);
  const [finyearDataErr, setFinyearDataErr] = useState(initialFinyear);
  const [isId, setIsId] = useState();
  const [isEditfinancialYear, setIsEditFinancialYear] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const FYPermissions = userAuthData?.permissions?.find(
        (val) => val?.FinancialYear
      );
      setPermission(FYPermissions?.FinancialYear);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Perform search logic or update search results
  };

  const clearDataErr = () => {
    setFinyearDataErr(initialFinyear);
  };

  const clearData = () => {
    setFinyearData(initialFinyear);
  };

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setIsId(id);
  };

  const handleOk = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteFinyear((res) => {
        let { status, message, data } = res;
        if (status === 200) {
          getFinyear();
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

  useEffect(() => {
    getFinyear();
  }, []);

  // const handleItemsPerPageChange = (perPage) => {
  //   setNewPageSize(perPage);
  //   setActiveNewPage(1); // Reset to the first page when changing items per page
  // };

  // const handlePageChange = (event) => {
  //   setActiveNewPage(event);
  // };

  const getFinyear = () => {
    setIsLoading(true); // Show the loading spinner
    // console.log(pageSize, pageIndex);
    GetFinyear(
      (res) => {
        let { status, data, message } = res;
        if (status === 200) {
          // console.log(data, "data");
          setFinyearTableData(data);
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
      }
    );
  };

  {
    finyearTableData?.map((val, ind) => {
      items.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: moment(val?.startDate).format("DD-MM-YYYY") ?? "--",
        heading_2: moment(val?.endDate).format("DD-MM-YYYY") ?? "--",
        heading_3: (
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
      });
    });
  }

  switchValue = Object.keys(switchValues)
    ?.filter((id) => switchValues[id])
    ?.map((id) => parseInt(id));

  const handleInput = (e) => {
    const { name, value } = e.target;
    //start date should be less than end date
    setFinyearData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFinyearDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateFields = () => {
    let errObj = { ...initialFinyear };

    if (!finyearData.startDate) {
      errObj.startDate = "This field is required";
    } else {
      errObj.startDate = "";
    }
    if (!finyearData.endDate) {
      errObj.endDate = "This field is required";
    } else {
      errObj.endDate = "";
    }

    setFinyearDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleFinyear = () => {
    setFinyearData(initialFinyear);
    setIsId(null);
    setSwitchValues({});
    setVisible(!visible);
    setIsCreateFinancialYear(true);
    setIsEditFinancialYear(false);
  };

  const handleCancelfinyear = () => {
    setIsCreateFinancialYear(false);
    clearData();
    setVisible(false);
    clearDataErr();
    setIsCreateFinancialYear(false);
    setIsEditFinancialYear(false);
  };

  const handleSubmit = (e) => {
    console.log(validateFields());
    if (finyearData.startDate < finyearData.endDate) {
      if (validateFields()) {
        e.preventDefault();
        const payload = {
          startDate: finyearData?.startDate,
          endDate: finyearData?.endDate,
        };
        if (isId) {
          payload.id = isId;
          UpdateFinyear((res) => {
            let { status, data, message } = res;
            if (status === 200) {
              getFinyear();
              clearData();
              setAlertText(message);
              setShowConfirmModal1(true);
              closeFinyearModal();
              setIsCreateFinancialYear(false);
              setIsEditFinancialYear(false);
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
          CreateFinyear((res) => {
            let { status, data, message } = res;
            if (status === 200) {
              getFinyear();
              clearData();
              setSwitchValues({});
              setAlertText(message);
              setShowConfirmModal1(true);
              closeFinyearModal();
              setIsCreateFinancialYear(false);
              setIsEditFinancialYear(false);
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
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateFinancialYear(false);
    setIsEditFinancialYear(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleEdit = (id) => {
    setIsCreateFinancialYear(!isCreatefinancialYear);
    setIsEditFinancialYear(true);
    setVisible(!visible);
    const selectedYear = finyearTableData.find((role) => role.id === id);
    if (selectedYear) {
      setFinyearData({
        ...finyearData,
        startDate:
          moment(
            finyearTableData.find((startDate) => startDate.id === id)?.startDate
          ).format("YYYY-MM-DD") || "",
        endDate:
          moment(
            finyearTableData.find((endDate) => endDate.id === id)?.endDate
          ).format("YYYY-MM-DD") || "",
      });
    }
    setIsId(id);
  };

  const closeFinyearModal = () => {
    setVisible(false);
    clearDataErr();
  };

  return (
    <>
      {token ? (
        <div className="finyear">
          <div className="finyear__container">
            <div className="finyear__header">
              <div className="finyear__header__section">
                <div className="finyear__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`MDM - ${!isCreatefinancialYear
                    ? "Financial Year"
                    : isEditfinancialYear
                      ? "Edit Financial Year"
                      : "Create Financial Year"
                    }`}</h4>
                </div>
                <div className="roles__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            {isCreatefinancialYear ? (
              <>
                <div className="Cbody">
                  <Paper elevation={3}>
                    <div className="container">
                      <div>
                        <CForm method="post" onSubmit="">
                          <CRow>
                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Start Date
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="date"
                                value={finyearData.startDate}
                                onChange={handleInput}
                                id="startDate"
                                name="startDate"
                                placeholder="Enter Start Date.."
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {finyearData.startDate > finyearData.endDate ? "Start date should be less than end date" : " "}
                              </p>
                            </CCol>

                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                End Date
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="date"
                                value={finyearData.endDate}
                                onChange={handleInput}
                                id="endDate"
                                name="endDate"
                                placeholder="Enter End Date.."
                                aria-label="default input example"
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {finyearData.endDate < finyearData.startDate ? "End date should be greater than start date" : " "}
                              </p>
                            </CCol>
                          </CRow>

                          <div>
                            <CButton
                              style={{
                                marginRight: "15px",
                                backgroundColor: "#0e419d",
                              }}
                              onClick={handleSubmit}
                            >
                              {isEditfinancialYear ? "Update" : "Save"}
                            </CButton>
                            <CButton
                              color="secondary"
                              onClick={handleCancelfinyear}
                            >
                              Close
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
                <div className="finyear__table">
                  <div className="finyear__table__header">
                    <div className="finyear__table__header__section">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <button
                        onClick={handleFinyear}
                        disabled={!hasPermission("Create")}
                        title={
                          !hasPermission("Create")
                            ? "No permission to Create"
                            : ""
                        }
                        className={
                          hasPermission("Create") ? "" : "disabled-button"
                        }
                      >
                        Add Financial Year
                      </button>
                    </div>
                  </div>
                  <div
                    className="finyear__table__body"
                    style={{ height: "380px", overflowY: "scroll" }}
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
                    className="finyear__table__pagination"
                    style={{
                      marginTop: "1vw",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div className="finyear__table__pagination__container">
                      <select
                        value={newPageSize}
                        onChange={(e) =>
                          handleItemsPerPageChange(parseInt(e.target.value))
                        }
                      >
                        {itemsPerPageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <Pagination
                        activePage={activeNewPage ? activeNewPage : activePage}
                        itemsCountPerPage={newPageSize}
                        totalItemsCount={totalRecordsCount}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                      />
                    </div>
                  </div> */}
                  {/* <div
                    style={{
                      marginTop: "1vw",
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
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default FinancialYear;
