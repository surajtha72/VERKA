import moment from "moment";
import {
  CreateComplaint,
  GetAllAgents,
  GetBillingCycle,
  GetComplaints,
  UpdateComplaint,
} from "../../../utils/apiCalls";
import { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
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
import { Paper } from "@mui/material";
import Select from "react-select";
import Loader from "../../../components/loader";
import Confirm from "../../../components/confirmModal/confirm";
import { Navigate, useNavigate } from "react-router-dom";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

const initialState = {
  id: null,
  agentId: null,
  billingCycleId: null,
  settlementAmount: null,
  complaint: "",
  toBeSettledStartDate: "",
  toBesettledEndDate: "",
};

const complaintColumns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "agent_id",
    label: "Agent Id",
    _props: { scope: "col" },
  },
  {
    key: "agent_name",
    label: "Agent Name",
    _props: { scope: "col" },
  },
  {
    key: "cycle",
    label: "Cycle",
    _props: { scope: "col" },
  },
  {
    key: "settlement_amount",
    label: "Amount",
    _props: { scope: "col" },
  },
  {
    key: "complaint",
    label: "Complaint",
    _props: { scope: "col" },
  },
  {
    key: "settlement_cycle",
    label: "Settlement Cycle",
    _props: { scope: "col" },
  },
  {
    key: "actions",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const CompaintResolutionForm = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [isLoading, setIsLoading] = useState(true);
  const [alertText, setAlertText] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  const [agentsData, setAgentsData] = useState([]);
  const [cycleData, setCycleData] = useState([]);
  const [complaintData, setComplaintData] = useState(initialState);
  const [isCreateComplaint, setIsCreateComplaint] = useState(false);
  const [permission, setPermission] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const complaintItems = [];
  const [isEditComplaint, setIsEditComplaint] = useState(false);
  const [complaintsArr, setComplaintsArr] = useState([]);
  const [complaintId, setCompalintId] = useState(null);
  const billingCycleId = localStorage.getItem("billingCycleId");
  const [filteredComplaintData, setFilteredComplaintedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [agentData, setAgentData] = useState({});
  const [billingCycleData, setBillingCycleData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getComplaints();
  }, []);
  const getComplaints = () => {
    setIsLoading(true);
    GetComplaints((res) => {
      let { status, data, message } = res;
      console.log("res: ", res);
      if (status === 200) {
        setComplaintsArr(data);
        setFilteredComplaintedData(data);
        setIsLoading(false);
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
      } else if (message?.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModal1(true);
        setSessionOk(true);
      }
    }, billingCycleId);
  };

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const clearData = () => {
    setComplaintData(initialState);
    setAgentData({});
    setBillingCycleData({});
  };

  const orgType = 5;
  useEffect(() => {
    getAgents();
  }, []);
  const getAgents = () => {
    GetAllAgents((res) => {
      setAgentsData(res.data);
    }, orgType);
  };
  const handleDropDown = (name, selectedOption) => {
    setComplaintData((prev) => ({ ...prev, [name]: selectedOption }));
    // setStopDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    getCycle();
  }, [currentDate]);
  const getCycle = () => {
    GetBillingCycle((result) => {
      setCycleData(result.data);
    }, currentDate);
  };

  const newData = cycleData?.map((item, ind) => {
    return {
      ...item,
      appendDate: `${moment(item.startDate).format("YYYY-MM-DD")} - ${moment(
        item.endDate
      ).format("YYYY-MM-DD")}`,
    };
  });

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredComplaintedData(complaintsArr);
    } else {
      const filteredData = complaintsArr.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredComplaintedData(filteredData);
    }
  };

  {
    filteredComplaintData?.map((val, ind) => {
      // console.log(val?.productId.ProductName)
      complaintItems.push({
        SlNo: ind + 1,
        agent_id: val?.agentId.Id ?? " ",
        agent_name: val?.agentId.Name ?? " ",
        settlement_amount: val?.settlementAmount ?? " ",
        cycle:
          `${moment(val?.billingCycleId.StartDate).format(
            "DD/MM/YYYY"
          )} - ${moment(val?.billingCycleId?.EndDate).format("DD/MM/YYYY")}` ??
          " ",
        complaint: val?.complaint ?? " ",
        settlement_cycle:
          `${moment(val?.toBeSettledStartDate).format("DD/MM/YYYY")} - ${moment(
            val?.toBeSettledEndDate
          ).format("DD/MM/YYYY")}` ?? " ",
        actions: (
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
              onClick={() => {
                handleEdit(val?.id);
              }}
            >
              <EditNoteOutlinedIcon />
            </button>
            {/* <button
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
                        </button> */}
          </div>
        ),
        // details: (
        //     <span
        //         style={{ cursor: 'pointer' }}
        //         onClick={() => { navigateToProductsSold(val?.id); console.log(val.id) }}
        //     >Details</span>
        // )
      });
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (userAuthData) {
      const ProductPermissions = userAuthData?.permissions?.find(
        (val) => val?.Products
      );
      setPermission(ProductPermissions?.Products);
    }
  }, []);

  const handleCreateComplaint = () => {
    setIsCreateComplaint(!isCreateComplaint);
    // setIsEditProductSales(false);
  };

  const handleCancel = () => {
    setIsCreateComplaint(!isCreateComplaint);
    setIsEditComplaint(false);
    clearData();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const selectedIndentId = localStorage.getItem("selectedProductSupply");
    const payload = {
      agentId: complaintData?.agentId,
      billingCycleId: complaintData?.billingCycleId,
      settlementAmount: complaintData?.settlementAmount,
      complaint: complaintData?.complaint,
      toBeSettledStartDate: new Date(complaintData?.toBeSettledStartDate),
      toBeSettledEndDate: new Date(complaintData?.toBesettledEndDate),
    };
    console.log(payload);
    if (complaintId) {
      payload.id = complaintId;

      UpdateComplaint((res) => {
        let { status, message } = res;
        if (status === 200) {
          getComplaints();
          clearData();
          setAlertText(message);
          setShowConfirmModal1(true);
          setIsCreateComplaint(!isCreateComplaint);
          setIsEditComplaint(false);
          setComplaintData(initialState);
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
        } else if (message?.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModal1(true);
          setSessionOk(true);
        }
      }, payload);
    } else {
      CreateComplaint((res) => {
        let { status, message } = res;
        if (status === 200) {
          getComplaints();
          clearData();
          setAlertText(message);
          setShowConfirmModal1(true);
          setIsCreateComplaint(!isCreateComplaint);
          setIsEditComplaint(false);
          setComplaintData(initialState);
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
        } else if (message?.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModal1(true);
          setSessionOk(true);
        }
      }, payload);
    }
  };

  const handleEdit = (id) => {
    setIsCreateComplaint(!isCreateComplaint);
    setIsEditComplaint(true);
    const complaint = complaintsArr.find((data) => data.id === id);
    if (complaint) {
      setComplaintData({
        id: complaint.id,
        agentId: complaint?.agentId,
        billingCycleId: complaint?.billingCycleId,
        settlementAmount: complaint?.settlementAmount,
        complaint: complaint?.complaint,
        toBeSettledStartDate: complaint?.toBeSettledStartDate,
        toBeSettledEndDate: complaint?.toBeSettledEndDate,
      });
    }
    setCompalintId(complaintsArr.find((complaint) => complaint.id === id)?.id);
    setAgentData(agentsData.find((agent) => agent.id === complaint.agentId.Id));
    setBillingCycleData(
      cycleData.find((cycle) => cycle.id === complaint.billingCycleId.Id)
    );
    console.log(
      "ksgdjnfdg",
      cycleData.find((cycle) => cycle.id === complaint.billingCycleId.Id)
    );
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsEditComplaint(false);
    setIsCreateComplaint(isCreateComplaint);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <>
      {token ? (
        <>
          <div className="bank">
            <div className="bank__container">
              <div className="bank__header">
                <div className="bank__header__section">
                  <div className="bank__header__section__main">
                    <h5>Company: Verka</h5>
                    <h4>{`MDM - ${"Complaint Resolution"}`}</h4>
                  </div>
                  <div className="bank__header__section__bottom">
                    <Header />
                  </div>
                </div>
              </div>
              {isCreateComplaint ? (
                <>
                  <div className="Cbody">
                    <Paper elevation={3}>
                      <div className="container">
                        <div>
                          <CForm method="post" onSubmit="">
                            <CRow>
                              <CCol lg={6}>
                                <CFormLabel htmlFor="nf-email">
                                  Select Agent{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </CFormLabel>
                                <Select
                                  id="agentId"
                                  name="agentId"
                                  options={agentsData}
                                  // value={agentData}
                                  onChange={(selectedOption) => {
                                    handleDropDown(
                                      "agentId",
                                      selectedOption.id
                                    );
                                    console.log(selectedOption);
                                  }}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option.id}
                                  isSearchable
                                  placeholder="Select agent"
                                  styles={{
                                    control: (provided, state) => ({
                                      ...provided,
                                      height: "32px",
                                      minHeight: "32px",
                                      alignItems: "center",
                                    }),
                                  }}
                                />
                              </CCol>

                              <CCol lg={6}>
                                <CFormLabel htmlFor="nf-email">
                                  Billing Cycle
                                </CFormLabel>
                                <CFormSelect
                                  // value={billingCycleData}
                                  size="sm"
                                  id="billingCycleId"
                                  name="billingCycleId"
                                  onChange={(e) => {
                                    handleDropDown(
                                      "billingCycleId",
                                      e.target.value
                                    );
                                    console.log(e.target.value);
                                  }}
                                >
                                  <option value={0}>
                                    Select complaint cycle
                                  </option>
                                  {newData?.length &&
                                    newData?.map((option, index) => {
                                      // console.log('cycle dates: ',option);
                                      return (
                                        <option key={index} value={option.id}>
                                          {moment(option.startDate).format(
                                            "YYYY-MM-DD"
                                          )}{" "}
                                          -{" "}
                                          {moment(option.endDate).format(
                                            "YYYY-MM-DD"
                                          )}
                                        </option>
                                      );
                                    })}
                                </CFormSelect>
                              </CCol>

                              <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                <CFormLabel
                                  style={{
                                    fontSize: "0.9vw",
                                    marginBottom: "0",
                                  }}
                                >
                                  Settlement Amout
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  type="text"
                                  id="settlementAmount"
                                  name="settlementAmount"
                                  value={complaintData.settlementAmount}
                                  placeholder="Enter the amount in -ve incase of deduction."
                                  onChange={handleInputChange}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^0-9.-]/g,
                                      ""
                                    );
                                  }}
                                />
                              </CCol>
                              <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                <CFormLabel
                                  style={{
                                    fontSize: "0.9vw",
                                    marginBottom: "0",
                                  }}
                                >
                                  Complaint
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  type="text"
                                  id="complaint"
                                  name="complaint"
                                  value={complaintData.complaint}
                                  placeholder="Enter the complaint(max 100 letters)"
                                  onChange={handleInputChange}
                                />
                              </CCol>

                              <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                <CFormLabel
                                  style={{
                                    fontSize: "0.9vw",
                                    marginBottom: "0",
                                  }}
                                >
                                  Settlement Cycle
                                </CFormLabel>
                                <CFormSelect
                                  size="sm"
                                  onChange={(e) => {
                                    const dateParts = e.target.value.split(" ");
                                    console.log(dateParts);
                                    setComplaintData((prev) => ({
                                      ...prev,
                                      toBeSettledStartDate: dateParts[0],
                                    }));
                                    setComplaintData((prev) => ({
                                      ...prev,
                                      toBesettledEndDate: dateParts[2],
                                    }));
                                  }}
                                  // value={complaintData.toBeSettledStartDate ? `${moment(complaintData.toBeSettledStartDate).format('YYYY-MM-DD')} - ${moment(complaintData.toBesettledEndDate).format('YYYY-MM-DD')}` : null}
                                >
                                  <option value={0}>
                                    Select Settlement Cycle
                                  </option>
                                  {newData?.length &&
                                    newData?.map((option, index) => {
                                      // console.log(option);
                                      return (
                                        <option
                                          key={index}
                                          value={option.appendDate}
                                        >
                                          {option.appendDate}
                                        </option>
                                      );
                                    })}
                                </CFormSelect>
                              </CCol>
                            </CRow>

                            <br></br>
                            <div style={{ display: "flex" }}>
                              <CButton
                                //color="primary"
                                style={{
                                  backgroundColor: "#0e419d",
                                  "margin-right": "15px",
                                }}
                                target="_blank"
                                onClick={handleSubmit}
                              >
                                {isEditComplaint ? "Update" : "Save"}
                              </CButton>
                              <CButton
                                color="primary"
                                target="_blank"
                                style={{
                                  backgroundColor: "gray",
                                }}
                                onClick={handleCancel}
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
                  {complaintsArr.length > 0 ? (
                    <div className="bank__table">
                      <div className="bank__table__header">
                        <div className="bank__table__header__section">
                          {/* <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search"
                                                        value={searchTerm}
                                                        onChange={handleSearch}
                                                    /> */}
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
                            onClick={handleCreateComplaint}
                          >
                            Create a Complaint
                          </button>
                        </div>
                      </div>
                      <div
                        className="bank__table__body"
                        style={{ height: "60vh", overflowY: "scroll" }}
                      >
                        {isLoading ? (
                          <Loader />
                        ) : (
                          <CTable
                            columns={complaintColumns}
                            items={complaintItems}
                            hover
                            className="striped-table"
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="empty_data">
                      <Paper elevation={3}>
                        <h1>No Complaints</h1>
                        <h3>For Tthe selected cycle</h3>
                        <div className="bank__table__header__section">
                          {/* <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search"
                                                        value={searchTerm}
                                                        onChange={handleSearch}
                                                    /> */}
                          <button
                            disabled={!hasPermission("Create")}
                            title={
                              !hasPermission("Create")
                                ? "No permission to Create"
                                : ""
                            }
                            onClick={handleCreateComplaint}
                          >
                            Create a new complaint
                          </button>
                        </div>
                      </Paper>
                    </div>
                  )}
                </>
              )}
            </div>
            {showConfirmModal && (
              <Confirm
                buttonText={"OK"}
                isCancelRequired={true}
                confirmTitle={"Are you sure ?"}
                // onConfirm={() => {
                //     handleOk();
                // }}
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
        </>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default CompaintResolutionForm;
