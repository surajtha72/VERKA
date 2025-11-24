import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CTable,
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import "./RateApplied.scss";
import React, { useEffect, useState } from "react";
import { CPagination, CPaginationItem } from "@coreui/react";
import {
  CreateRateApplied,
  DeleteRateApplied,
  GetDropDownOrganizationTypes,
  GetRateApplied,
  GetRateMaster,
  GetShiftApplicable,
  UpdateRateApplied,
} from "../../utils/apiCalls";
import Confirm from "../../components/confirmModal/confirm";
import { Paper } from "@mui/material";
import { Select } from "antd";
import Header from "../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";

const columns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Applied to",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Applied on",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialState = {
  rateId: "",
  appliedTo: [],
  appliedOn: "",
};

const RateApplied = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));

  const items = [];
  const [searchTerm, setSearchTerm] = useState("");
  const [isRateApplied, setIsRateApplied] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [isId, setIsId] = useState();
  const [organisationData, setOrganisationData] = useState([]);
  const [rateData, setRateData] = useState([]);
  const [rateAppliedTableData, setRateAppliedTableData] = useState([]);
  const [rateAppliedData, setRateAppliedData] = useState(initialState);
  const [rateAppliedDataErr, setRateAppliedDataErr] = useState(initialState);
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  const clearData = () => {
    setRateAppliedData(initialState);
    setRateAppliedDataErr(initialState);
  };

  useEffect(() => {
    getRateAppliedData();
    getDropDownOrganisation();
    getDropDownRate();
  }, []);

  const getRateAppliedData = () => {
    setIsLoading(true); // Show the loading spinner
    GetRateApplied((res) => {
      const { status, data, message } = res;
      if (status === 200) {
        setRateAppliedTableData(data);
        setFilteredData(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (message = "Invalid access token") {
        setAlertText("User Session has Expired");
        setShowConfirmModal1(true);
        setSessionOk(true);
      } else {
        setShowConfirmModal(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
      }
    });
  };

  const getDropDownOrganisation = () => {
    GetDropDownOrganizationTypes((res) => {
      setOrganisationData(res.data);
    });
  };

  const getDropDownRate = () => {
    GetRateMaster((res) => {
      setRateData(res.data);
    });
  };
  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(rateAppliedTableData);
    } else {
      const filteredData = rateAppliedTableData.filter((item) =>
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
      items.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.appliedTo ? val?.appliedTo : "--",
        heading_2: val?.appliedOn ? val?.appliedOn.split("T")[0] : "--",
        heading_3: (
          <div key={ind} style={{ display: "flex", flexDirection: "row" }}>
            <span
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => handleEdit(val?.id)}
            >
              Edit
            </span>
            <span
              style={{ color: "red", cursor: "pointer", marginLeft: 10 }}
              onClick={() => {
                handleDelete(val?.id);
              }}
            >
              Delete
            </span>
          </div>
        ),
      });
    });
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsRateApplied(isRateApplied);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleCreateRateApplied = () => {
    setIsRateApplied(!isRateApplied);
  };

  const handleCancelRateApplied = () => {
    setIsRateApplied(!isRateApplied);
    clearData();
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRateAppliedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropDown = (name, value) => {
    setRateAppliedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = () => {
    let errObj = { ...initialState };
    let isValid = true;

    if (!rateAppliedData.rateId) {
      errObj.rateId = "This field is required";
      isValid = false;
    }
    if (!rateAppliedData.appliedTo) {
      errObj.appliedTo = "This field is required";
      isValid = false;
    }
    if (!rateAppliedData.appliedOn) {
      errObj.appliedOn = "This field is required";
      isValid = false;
    }

    setRateAppliedDataErr(errObj);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      const payload = {
        rateId: Number(rateAppliedData.rateId),
        appliedTo: rateAppliedData.appliedTo.join(","),
        appliedOn: new Date(rateAppliedData.appliedOn).toISOString(),
      };
      // console.log(payload);
      if (isId) {
        payload.id = isId;
        // console.log(payload.id === isId);
        UpdateRateApplied((res) => {
          clearData();
          const { status, message } = res;
          if (status === 200) {
            clearData();
            getRateAppliedData();
            setIsId(null);
            setIsRateApplied(!isRateApplied);
            setAlertText(message);
            setShowConfirmModal1(true);
          } else if (message = "Invalid access token") {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          } else {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModal1(true);
          }
        }, payload);
      } else {
        CreateRateApplied((res) => {
          const { status, message } = res;
          if (status === 200) {
            clearData();
            getRateAppliedData();
            setIsId(null);
            setIsRateApplied(!isRateApplied);
            setAlertText(message);
            setShowConfirmModal1(true);
          } else if (message = "Invalid access token") {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          } else {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModal1(true);
          }
        }, payload);
      }
    }
  };

  const [isAppliedToNames, setIsAppliedToNames] = useState([]);

  const handleEdit = (id) => {
    setIsRateApplied(!isRateApplied);
    const payload = {
      id: rateAppliedTableData.find((role) => role.id === id)?.id,
    };
    const selectedData = rateAppliedTableData.find((role) => role.id === id);

    const appliedToNames = (selectedData.appliedTo || "")
      .split(",")
      .map((appliedToId) => {
        // console.log(appliedToId, organisationData);

        const foundOrg = organisationData.find((org) => {
          return String(org.id) === String(appliedToId);
        });

        // console.log("foundOrg:", foundOrg);

        return foundOrg ? foundOrg.id : "";
      });
    setIsAppliedToNames(appliedToNames);
    setRateAppliedData({
      ...rateAppliedData,
      id: selectedData?.id,
      rateId: selectedData?.rateId,
      appliedTo: appliedToNames || [],
      appliedOn: selectedData?.appliedOn?.split("T")[0],
    });
    setIsId(payload?.id);
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
      DeleteRateApplied((res) => {
        const { status, message } = res;
        if (status === 200) {
          getRateAppliedData();
          setIsId(null);
          setShowConfirmModal(false);
          setAlertText(message);
          setShowConfirmModal1(true);
        } else if (message = "Invalid access token") {
          setAlertText("User Session has Expired");
          setShowConfirmModal1(true);
          setSessionOk(true);
        } else {
          setShowConfirmModal(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModal1(true);
        }
      }, payload);
    }
  };

  return (
    <>
      {token ? (
        <div className="rateapplied">
          <div className="rateapplied__container">
            <div className="rateapplied__header">
              <div className="rateapplied__header__section">
                <div className="rateapplied__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`${isRateApplied ? "Apply Rate" : "Rate Applied List"
                    }`}</h4>
                </div>
                <div className="rateapplied__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            {isRateApplied ? (
              <>
                <div className="Cbody">
                  <Paper>
                    <div className="container">
                      <div>
                        <CForm method="post">
                          <CRow>
                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Rate Id <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={rateAppliedData.rateId}
                                onChange={(e) =>
                                  handleDropDown("rateId", e.target.value)
                                }
                              >
                                <option value={0}>Select Rate Id</option>
                                {rateData?.length &&
                                  rateData?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.shortDesc}
                                      </option>
                                    );
                                  })}
                              </CFormSelect>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {rateAppliedDataErr.rateId}
                              </p>
                            </CCol>
                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Applied To{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <Select
                                style={{ width: "100%" }}
                                size="sm"
                                mode="multiple"
                                value={rateAppliedData?.appliedTo || []}
                                defaultValue={isAppliedToNames}
                                onChange={(value) =>
                                  handleDropDown("appliedTo", value)
                                }
                              >
                                <option value={0}>Select Applied To</option>
                                {organisationData?.length &&
                                  organisationData?.map((option, index) => (
                                    <option key={index} value={option.id}>
                                      {option.name}
                                    </option>
                                  ))}
                              </Select>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {rateAppliedDataErr.appliedTo}
                              </p>
                            </CCol>

                            <CCol lg={6}>
                              <CFormLabel htmlFor="nf-email">
                                Applied On
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="date"
                                name="appliedOn"
                                value={rateAppliedData.appliedOn}
                                onChange={handleInput}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {rateAppliedDataErr.appliedOn}
                              </p>
                            </CCol>
                          </CRow>

                          <div style={{ marginTop: "0.3vw" }}>
                            <CButton
                              style={{
                                border: 0,
                                backgroundColor: "#0e419d",
                                "margin-right": "15px",
                              }}
                              target="_blank"
                              onClick={handleSubmit}
                            >
                              Submit
                            </CButton>
                            <CButton
                              target="_blank"
                              style={{
                                border: 0,
                                backgroundColor: "lightslategrey",
                              }}
                              onClick={handleCancelRateApplied}
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
                <div className="rateapplied__table">
                  <div className="rateapplied__table__header">
                    <div className="rateapplied__table__header__section">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <button onClick={handleCreateRateApplied}>
                        Apply Rate
                      </button>
                    </div>
                  </div>
                  <div
                    className="rateapplied__table__body"
                    style={{ height: "60vh", overflowY: "scroll" }}
                  >
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <CTable
                        columns={columns}
                        items={items}
                        className="striped-table"
                      />
                    )}
                  </div>
                  <div
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
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default RateApplied;
