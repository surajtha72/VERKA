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
import "./RoutesStop.scss";
import { CPagination, CPaginationItem } from "@coreui/react";
import Confirm from "../../../components/confirmModal/confirm";
import {
  CreateRouteStop,
  DeleteRouteStop,
  GetOrganizationFrom,
  GetRouteMaster,
  GetRouteStops,
  GetRouteStopsDropdownList,
  UpdateRouteStop,
} from "../../../utils/apiCalls";
import { IconButton, Paper } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../../../components/header/Header";
import Select from "react-select";
import Loader from "../../../components/loader";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const routeStop = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Route Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Sequence No",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Stops",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Travel Kms",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Actions",
    _props: { scope: "col" },
  },
];
const initialRouteStop = {
  routeId: null,
  sequenceNo: "",
  stopId: null,
  travelKms: "",
};

const RouteStop = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const [isCreateStop, setIsCreateStop] = useState(false);
  const [isEditStop, setIsEditStop] = useState(false);
  const [stopData, setStopData] = useState(initialRouteStop);
  const [stopDataErr, setStopDataErr] = useState(initialRouteStop);
  const [routeStopTableData, setRouteStopTableData] = useState([]);
  const [filteredDataStop, setFilteredDataStop] = useState([]);
  const items = [];
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [isId, setIsId] = useState();
  const [searchTermStop, setSearchTermStop] = useState("");
  const [routeMasterDropDownData, setRouteMasterDropDownData] = useState([]);
  const [routeStopDropDownData, setRouteStopDropDownData] = useState([]);
  const [selectedOptionFrom, setSelectedOptionFrom] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
const [selectedRoute, setSelectedRoute] = useState(null);
const loadStopsBasedOnRouteType = (route) => {
  if (!route) return;

  // CASE 1: DcsToBmc → existing logic
  if (route.routeTypeName === "DcsToBmc") {
    GetRouteStopsDropdownList((res) => {
      setRouteStopDropDownData(res.data);
    }, 5);
    return;
  }

  // CASE 2: BmcToFactory → call GetOrganizationFrom with 2,3,4
  if (route.routeTypeName === "BmcToFactory") {
    Promise.all([
      new Promise((resolve) =>
        GetOrganizationFrom((res) => resolve(res.data), 2)
      ),
      new Promise((resolve) =>
        GetOrganizationFrom((res) => resolve(res.data), 3)
      ),
      new Promise((resolve) =>
        GetOrganizationFrom((res) => resolve(res.data), 4)
      )
    ]).then((results) => {
      // Merge all responses into single array
      const merged = [...results[0], ...results[1], ...results[2]];
      setRouteStopDropDownData(merged);
    });
  }
};

  useEffect(() => {
    if (userAuthData) {
      const RStopPermissions = userAuthData?.permissions?.find(
        (val) => val?.RouteStop
      );
      setPermission(RStopPermissions?.RouteStop);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  let selectRouteMasterId = parseInt(
    localStorage.getItem("selectRouteMasterId")
  );

  useEffect(() => {
    getRouteStopData();
  }, [selectRouteMasterId]);

  useEffect(() => {
    getRouteMasterData();
  }, []);

  // useEffect(() => {
  //   getOrganizationDataFrom();
  // }, [selectedOptionFrom]);

  const getRouteMasterData = () => {
    GetRouteMaster((res) => {
      const { data } = res;
      setRouteMasterDropDownData(data);
    });
  };

  const getOrganizationDataFrom = () => {
    const selected = localStorage.getItem("selectedOption1");
    setSelectedOptionFrom(selected);
    GetRouteStopsDropdownList((res) => {
      setRouteStopDropDownData(res.data);
    }, 5);
  };

  const getRouteStopData = () => {
    setIsLoading(true); // Show the loading spinner
    GetRouteStops((res) => {
      const { status, data, message } = res;
      if (status === 200) {
        setRouteStopTableData(data);
        setFilteredDataStop(data);
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
    }, selectRouteMasterId);
  };
  useEffect(() => {
    filterTableDataStop();
  }, [searchTermStop]);

  const filterTableDataStop = () => {
    if (searchTermStop === "") {
      setFilteredDataStop(routeStopTableData);
    } else {
      const filteredDataStop = routeStopTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTermStop.toLowerCase())
        )
      );
      setFilteredDataStop(filteredDataStop);
    }
  };

  {
    filteredDataStop?.map((val, ind) => {
      items.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.routeName ? val?.routeName : "--",
        heading_2: val?.sequenceNo ? val?.sequenceNo : "--",
        heading_3: val?.stopName ? val?.stopName : "--",
        heading_4: val?.travelKms ? val?.travelKms : "--",
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
              onClick={() => handleEditStop(val?.id)}
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
              onClick={() => handleDeleteStop(val?.id)}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
      });
    });
  }

  const handleCreateRouteStop = () => {
    setIsCreateStop(!isCreateStop);
    setIsEditStop(false);
  };

  const handleCancleRouteStop = () => {
    clearRouteStop();
    setIsCreateStop(!isCreateStop);
    setIsEditStop(false);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setStopData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setStopDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDropDown = (name, value) => {
    setStopData((prev) => ({ ...prev, [name]: value }));
    setStopDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const clearRouteStop = () => {
    setStopData(initialRouteStop);
    setStopDataErr(initialRouteStop);
    setIsId(null);
  };

  const handleSearchStop = (event) => {
    setSearchTermStop(event.target.value);
  };
  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateStop(isCreateStop);
    setIsEditStop(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const validateFieldStop = () => {
    let errObj = { ...initialRouteStop };

    if (!stopData.routeId) {
      errObj.routeId = "This field is required";
    } else {
      errObj.routeId = "";
    }
    if (!stopData.sequenceNo) {
      errObj.sequenceNo = "This field is required";
    } else {
      errObj.sequenceNo = "";
    }
    if (!stopData.stopId) {
      errObj.stopId = "This field is required";
    } else {
      errObj.stopId = "";
    }
    if (!stopData.travelKms) {
      errObj.travelKms = "This field is required";
    } else {
      errObj.travelKms = "";
    }

    setStopDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleSubmit = () => {
    if (validateFieldStop()) {
      const payload = {
        routeId: stopData.routeId,
        sequenceNo: stopData.sequenceNo,
        stopId: stopData.stopId,
        travelKms: stopData.travelKms,
      };
      if (isId) {
        payload.id = isId;
        UpdateRouteStop((res) => {
          const { status, message } = res;
          if (status === 200) {
            clearRouteStop();
            getRouteStopData();
            setIsId(null);
            setIsCreateStop(!isCreateStop);
            setIsEditStop(false);
            setAlertText(message);
            setStopData(initialRouteStop);
            setStopDataErr(initialRouteStop);
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
        CreateRouteStop((res) => {
          const { status, message } = res;
          if (status === 200) {
            clearRouteStop();
            getRouteStopData();
            setIsId(null);
            setIsCreateStop(!isCreateStop);
            setIsEditStop(false);
            setAlertText(message);
            setStopData(initialRouteStop);
            setStopDataErr(initialRouteStop);
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

  const handleEditStop = (id) => {
    setIsCreateStop(!isCreateStop);
    setIsEditStop(true);
    const payload = {
      id: routeStopTableData.find((role) => role.id === id)?.id,
    };

    setStopData(
      {
        routeId: routeStopTableData.find((role) => role.id === id)?.routeId,
        sequenceNo: routeStopTableData.find((role) => role.id === id)
          ?.sequenceNo,
        stopId: routeStopTableData.find((role) => role.id === id)?.stopId,
        travelKms: routeStopTableData.find((role) => role.id === id)?.travelKms,
      },
      payload
    );
    setIsId(routeStopTableData.find((role) => role.id === id)?.id);
  };

  const handleDeleteStop = (id) => {
    setShowConfirmModal(true);
    setIsId(id);
  };

  const handleOkStop = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteRouteStop((res) => {
        const { status, message } = res;
        if (status === 200) {
          getRouteStopData();
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
  const handleRoute = () => {
    navigate("/routes-list");
  };

  return (
    <>
      {token ? (
        <div className="routestop">
          <div className="routestop__container">
            <div className="routestop__header">
              <div className="routestop__header__section">
                <div className="routestop__header__section__main">
                  <h5>Company: Ganga Dairy Pvt Ltd</h5>
                  <h4>{`MDM - ${!isCreateStop
                    ? "Route Stop"
                    : isEditStop
                      ? "Edit Stop"
                      : "Create Stop"
                    }`}</h4>
                </div>
                <div className="routestop__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            {!isCreateStop ? (
              <div className="routestop__header__section__logo">
                <IconButton onClick={handleRoute}>
                  <img src={images} alt="back" />
                </IconButton>
              </div>
            ) : (
              <></>
            )}
            {isCreateStop ? (
              <>
                <div className="Cbody">
                  <Paper elevation={3}>
                    <div className="container">
                      <div>
                        <CForm method="post">
                          <CRow>
                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Route <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <Select
  options={routeMasterDropDownData}
  value={routeMasterDropDownData.find((option) => option.id === stopData.routeId)}
  onChange={(option) => {
    handleDropDown("routeId", option.id);
    setSelectedRoute(option);
    loadStopsBasedOnRouteType(option);
  }}
  getOptionLabel={(option) => option.routeName}
  getOptionValue={(option) => option.id}
  isSearchable
  placeholder="Select Route"
/>


                              {/* <CFormSelect
                                size="sm"
                                value={stopData.routeId}
                                onChange={(e) =>
                                  handleDropDown("routeId", e.target.value)
                                }
                              >
                                <option value={0}>Select Route </option>
                                {routeMasterDropDownData?.length &&
                                  routeMasterDropDownData?.map(
                                    (option, index) => {
                                      return (
                                        <option key={index} value={option.id}>
                                          {option.routeName}
                                        </option>
                                      );
                                    }
                                  )}
                              </CFormSelect> */}
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {stopDataErr.routeId}
                              </p>
                            </CCol>
                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Sequence No{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="Name"
                                value={stopData.sequenceNo}
                                onChange={handleInput}
                                name="sequenceNo"
                                placeholder="Enter Sequence No.."
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                }}
                              />

                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {stopDataErr.sequenceNo}
                              </p>
                            </CCol>

                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Stop <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <Select
                                options={routeStopDropDownData}
                                value={routeStopDropDownData?.find(
                                  (option) =>
                                    option.id === stopData.stopId
                                )}
                                onChange={(selectedOption) =>
                                  handleDropDown("stopId", selectedOption?.id)
                                }
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                isSearchable
                                placeholder="Select Stop"
                                styles={{
                                  control: (provided, state) => ({
                                    ...provided,
                                    height: '32px',
                                    minHeight: '32px',
                                  }),
                                }}
                              />

                              {/* <CFormSelect
                                size="sm"
                                value={stopData.stopId}
                                onChange={(e) =>
                                  handleDropDown("stopId", e.target.value)
                                }
                              >
                                <option value={0}>Select Stop </option>
                                {routeStopDropDownData?.length &&
                                  routeStopDropDownData?.map(
                                    (option, index) => {
                                      return (
                                        <option key={index} value={option.id}>
                                          {option.name}
                                        </option>
                                      );
                                    }
                                  )}
                              </CFormSelect> */}

                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {stopDataErr.stopId}
                              </p>
                            </CCol>
                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Travel Kms{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>

                              <CFormInput
                                size="sm"
                                type="Name"
                                value={stopData.travelKms}
                                onChange={handleInput}
                                name="travelKms"
                                placeholder="Enter Travel Kms.."
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {stopDataErr.travelKms}
                              </p>
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
                              {isEditStop ? "Update" : "Save"}
                            </CButton>
                            <CButton
                              target="_blank"
                              style={{
                                border: 0,
                                backgroundColor: "lightslategrey",
                              }}
                              onClick={handleCancleRouteStop}
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
                <div className="routestop__table">
                  <div className="routestop__table__header">
                    <div className="routestop__table__header__section">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchTermStop}
                        onChange={handleSearchStop}
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
                        onClick={handleCreateRouteStop}
                      >
                        Add Stop
                      </button>
                    </div>
                  </div>
                  <div
                    className="routestop__table__body"
                    style={{ height: "55vh", overflowY: "scroll" }}
                  >
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <CTable
                        columns={routeStop}
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
                    <CPagination activepage={1} pages={1}>
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
                handleOkStop();
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

export default RouteStop;