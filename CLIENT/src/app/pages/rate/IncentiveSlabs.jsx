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
import React, { useEffect, useState } from "react";
import { CPagination, CPaginationItem } from "@coreui/react";
import Confirm from "../../components/confirmModal/confirm";
import {
  CreateIncentiveSlab,
  DeleteIncentiveSlab,
  GetIncentiveSlab,
  UpadteIncentiveSlab,
  GetIncentiveMaster,
} from "../../utils/apiCalls";
import { IconButton } from "@mui/material";
import images from "../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import "./IncentiveSlabs.scss";
import Header from "../../components/header/Header";
import Loader from "../../components/loader";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const IncentiveSlabs = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const selectedIncentiveId = localStorage.getItem("selectedIncentiveId");

  const initialIncentive = {
    incentiveId: Number(selectedIncentiveId),
    slabType: "",
    slabFrom: "",
    slabTo: "",
    incentivePerKg: "",
  };

  const initialIncentiveClear = {
    incentiveId: "",
    slabType: "",
    slabFrom: "",
    slabTo: "",
    incentivePerKg: "",
  };

  const columns = [
    {
      key: "SlNo",
      label: "#",
      _props: { scope: "col" },
    },
    {
      key: "heading_1",
      label: "Slab Type",
      _props: { scope: "col" },
    },
    {
      key: "heading_2",
      label: "Slab From",
      _props: { scope: "col" },
    },
    {
      key: "heading_3",
      label: "Slab To",
      _props: { scope: "col" },
    },
    {
      key: "heading_4",
      label: "Incentive Per/Kg (Rs)",
      _props: { scope: "col" },
    },
    {
      key: "heading_5",
      label: "Actions",
      _props: { scope: "col" },
    },
  ];
  const items = [];

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateIncentiveSlab, setIsCreateIncentiveSlab] = useState(false);
  const [incentiveSlabData, setIncentiveSlabData] = useState(initialIncentive);
  const [incentiveSlabDataErr, setIncentiveSlabDataErr] = useState(
    initialIncentiveClear
  );
  const [incentiveSlabTableData, setIncentiveSlabTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [isId, setIsId] = useState();
  const [incentiveData, setIncentiveData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const SlabPermissions = userAuthData?.permissions?.find(
        (val) => val?.IncentiveList
      );
      setPermission(SlabPermissions?.IncentiveList);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  useEffect(() => {
    getIncentiveslabData();
    getIncentive();
  }, [Number(selectedIncentiveId)]);

  const getIncentiveslabData = () => {
    setIsLoading(true); // Show the loading spinner
    const payload = {
      id: Number(selectedIncentiveId),
    };
    GetIncentiveSlab((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setIncentiveSlabTableData(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowConfirmModal(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
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
    }, Number(selectedIncentiveId));
  };

  const getIncentive = () => {
    GetIncentiveMaster((result) => {
      setIncentiveData(result.data);
    });
  };

  {
    incentiveSlabTableData?.map((val, ind) => {

      const slabTypeMapping = {
        1: 'Quality based',
        2: 'Quantity achievement %',
        3: 'FAT%',
        4: 'SNF%',
      };

      items.push({
        id: val?.id,
        SlNo: ind + 1,
        heading_1: slabTypeMapping[val?.slabType] || " ",
        heading_2:
          val?.slabFrom != null
            ? val?.slabFrom != 0
              ? val?.slabFrom
              : "0"
            : "0",
        heading_3: val?.slabTo ? val?.slabTo : " ",
        heading_4:
          val?.incentivePerKg != null
            ? val?.incentivePerKg != 0
              ? val?.incentivePerKg
              : "0"
            : "0",
        heading_5: (
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
      DeleteIncentiveSlab((res) => {
        let { status, message } = res;
        if (status === 200) {
          getIncentiveslabData();
          setIsId(null);
          setShowConfirmModal(false);
          setAlertText(message);
          setShowConfirmModal1(true);
        } else if (status === 403) {
          setShowConfirmModal(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModal1(true);
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
    setIncentiveSlabDataErr(initialIncentiveClear);
  };

  const clearData = () => {
    setIncentiveSlabData(initialIncentiveClear);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setIncentiveSlabData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIncentiveSlabDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCreateRoute = () => {
    setIsCreateIncentiveSlab(!isCreateIncentiveSlab);
  };

  const handleCancelRoute = () => {
    setIsCreateIncentiveSlab(!isCreateIncentiveSlab);
    clearData();
    clearDataErr();
    setIsId(null);
  };

  const validateFields = () => {
    let errObj = { ...initialIncentive };

    // console.log(incentiveSlabData);

    if (!incentiveSlabData.incentiveId) {
      errObj.incentiveId = "This field is required";
    } else if (incentiveSlabData.incentiveId == 0) {
      errObj.incentiveId = "This field is required";
    } else {
      errObj.incentiveId = "";
    }
    if (!incentiveSlabData.slabType) {
      errObj.slabType = "This field is required";
    } else if (incentiveSlabData.slabType == 0) {
      errObj.slabType = "This field is required";
    } else {
      errObj.slabType = "";
    }
    if (!incentiveSlabData.slabFrom) {
      errObj.slabFrom = "This field is required";
    } 
    // else if (incentiveSlabData.slabFrom != 0) {
    //   errObj.slabFrom = "This field is required";
    // } 
    else {
      errObj.slabFrom = "";
    }
    if (!incentiveSlabData.slabTo) {
      errObj.slabTo = "This field is required";
    } else {
      errObj.slabTo = "";
    }
    if (!incentiveSlabData.incentivePerKg) {
      errObj.incentivePerKg = "This field is required";
    } else {
      errObj.incentivePerKg = "";
    }

    // console.log(errObj);

    setIncentiveSlabDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleSubmit = () => {
    // console.log(validateFields());
    if (validateFields()) {
      const payload = {
        incentiveId: incentiveSlabData.incentiveId,
        slabType: incentiveSlabData.slabType,
        slabFrom: parseFloat(incentiveSlabData.slabFrom),
        slabTo: parseFloat(incentiveSlabData?.slabTo),
        incentivePerKg: parseFloat(incentiveSlabData?.incentivePerKg),
      };

      // console.log(payload);
      if (isId) {
        payload.id = isId;
        // console.log(payload.id === isId);

        UpadteIncentiveSlab((res) => {
          clearData();
          let { status, message } = res;
          if (status === 200) {
            getIncentiveslabData();
            setIsId(null);
            setIsCreateIncentiveSlab(!isCreateIncentiveSlab);
            setAlertText(message);
            setShowConfirmModal1(true);
          } else if (status === 403) {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModal1(true);
          } else if (status === 400) {
            setAlertText("Update Failed");
            setShowConfirmModal1(true);
            setSessionOk(false);
            setIsCreateIncentiveSlab(!isCreateIncentiveSlab);
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
        CreateIncentiveSlab((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData();
            getIncentiveslabData();
            setIsId(null);
            setIsCreateIncentiveSlab(!isCreateIncentiveSlab);
            setAlertText(message);
            setShowConfirmModal1(true);
          } else if (status === 403) {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModal1(true);
          } else if (status === 400) {
            setAlertText("Add Failed");
            setShowConfirmModal1(true);
            setSessionOk(false);
            setIsCreateIncentiveSlab(!isCreateIncentiveSlab);
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

  const handleEdit = (incentiveSlabData) => {
    setIsCreateIncentiveSlab(!isCreateIncentiveSlab);
    const payload = {
      id: incentiveSlabData.id,
    };
    setIncentiveSlabData(
      {
        id: incentiveSlabData.id,
        incentiveId: selectedIncentiveId,
        slabType: incentiveSlabData.slabType,
        slabFrom: parseFloat(incentiveSlabData?.slabFrom),
        slabTo: parseFloat(incentiveSlabData?.slabTo),
        incentivePerKg: parseFloat(incentiveSlabData?.incentivePerKg),
      },
      payload
    );
    setIsId(payload?.id);
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateIncentiveSlab(isCreateIncentiveSlab);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleDropDown = (name, value) => {
    // console.log(name,value);
    setIncentiveSlabData((prev) => ({ ...prev, [name]: value }));
    setIncentiveSlabDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const handleIncentive = () => {
    navigate("/rate-incentive");
  };

  return (
    <>
      {token ? (
        <div className="slabs">
          <div className="slabs__container">
            <div className="slabs__header">
              <div className="slabs__header__section">
                <div className="slabs__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`${!isCreateIncentiveSlab
                    ? "Incentive Slab List"
                    : isId
                      ? "Edit Incentive Slab"
                      : "Create Incentive Slab"
                    }`}</h4>
                </div>
                <div className="slabs__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            <div className="slabs__header__section__logo">
              <IconButton onClick={handleIncentive}>
                <img src={images} alt="back" />
              </IconButton>
            </div>
            {isCreateIncentiveSlab ? (
              <>
                <div className="Cbody">
                  <Paper elevation={3}>
                    <div className="container">
                      <br></br>
                      <div>
                        <CForm method="post">
                          <CRow>
                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Incentive{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="incentiveId"
                                name="incentiveId"
                                value={incentiveSlabData.incentiveId}
                                onChange={(e) =>
                                  handleDropDown("incentiveId", e.target.value)
                                }
                              >
                                <option value={0}>Select Incentive</option>
                                {/* <option value={1}>1</option> */}
                                {incentiveData?.length &&
                                  incentiveData?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.incentiveName}
                                      </option>
                                    );
                                  })}
                              </CFormSelect>
                              <span style={{ color: "red", fontSize: "x-small" }}>
                                {incentiveSlabDataErr.incentiveId}
                              </span>
                            </CCol>

                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Slab Type{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                id="slabType"
                                name="slabType"
                                value={incentiveSlabData.slabType}
                                onChange={(e) =>
                                  handleDropDown("slabType", e.target.value)
                                }
                              >
                                <option value={0}>Select Slab Type</option>
                                <option value={1}>Quality based</option>
                                <option value={2}>
                                  Quantity achievement %
                                </option>
                                <option value={3}>FAT%</option>
                                <option value={4}>SNF%</option>
                              </CFormSelect>
                              <span style={{ color: "red", fontSize: "x-small" }}>
                                {incentiveSlabDataErr.slabType}
                              </span>
                            </CCol>

                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Slab From{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="slabFrom"
                                name="slabFrom"
                                type="text"
                                value={incentiveSlabData.slabFrom}
                                onChange={handleInput}
                                placeholder="Enter Slab From"
                                aria-label="default input example"
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small" }}>
                                {incentiveSlabDataErr.slabFrom}
                              </span>
                            </CCol>

                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Slab To{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="slabTo"
                                name="slabTo"
                                value={incentiveSlabData.slabTo}
                                onChange={handleInput}
                                placeholder="Enter Slab To"
                                aria-label="default input example"
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small" }}>
                                {incentiveSlabDataErr.slabTo}
                              </span>
                            </CCol>

                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Incentive Per/Kg (Rs){" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                id="incentivePerKg"
                                name="incentivePerKg"
                                value={incentiveSlabData.incentivePerKg}
                                onChange={handleInput}
                                placeholder="Enter Incentive Per/Kg"
                                aria-label="default input example"
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small" }}>
                                {incentiveSlabDataErr.incentivePerKg}
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
                <div className="slabs__table">
                  <div className="slabs__table__header">
                    <div className="slabs__table__header__section">
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
                        Add Incentive Slabs
                      </button>
                    </div>
                  </div>
                  <div
                    className="slabs__table__body"
                    style={{ height: "59vh", overflowY: "scroll" }}
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

export default IncentiveSlabs;
