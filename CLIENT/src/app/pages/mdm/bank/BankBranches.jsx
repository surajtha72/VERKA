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
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { CPagination, CPaginationItem } from "@coreui/react";
import {
  CreateBankBranch,
  DeleteBankBranch,
  GetBankBranches,
  UpdateBankBranch,
} from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import { Paper } from "@mui/material";
import { IconButton } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import images from "../../../../assets/images/log_out.png";
import Header from "../../../components/header/Header";
import Loader from "../../../components/loader";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const columns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Branch Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "IFSC Code",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Address",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Branches",
    _props: { scope: "col" },
  },
];

const BankBranches = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const selectedBankId = localStorage.getItem("selectedBankId");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isCreateBankBranch, setIsCreateBankBranch] = useState(false);
  const [bankBranchTableData, setBankBranchTableData] = useState([]);
  const [bankBranchData, setBankBranchData] = useState({
    id: null,
    bankId: selectedBankId,
    branchName: "",
    ifscCode: "",
    address: "",
    isActive: true,
  });
  const [isId, setIsId] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [alertText, setAlertText] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const BankPermissions = userAuthData?.permissions?.find(
        (val) => val?.Bank
      );
      setPermission(BankPermissions?.Bank);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const clearData = () => {
    setBankBranchData({
      bankId: selectedBankId,
      branchName: "",
      ifscCode: "",
      address: "",
      isActive: true,
    });
  };

  const [bankBranchDataErr, setBankBranchDataErr] = useState(bankBranchData);
  const clearDataErr = () => {
    setBankBranchDataErr({
      bankId: selectedBankId,
      branchName: "",
      ifscCode: "",
      address: "",
      isActive: true,
    });
  };

  // const clearDataErr = () => {
  //   setUserDataErr(initialState);
  // };

  useEffect(() => {
    getBankBranches();
  }, [selectedBankId]);

  const getBankBranches = () => {
    setIsLoading(true); // Show the loading spinner
    const payload = {
      id: selectedBankId,
    };
    GetBankBranches((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setBankBranchTableData(data);
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
    }, selectedBankId);
  };

  const items = [];
  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(bankBranchTableData);
    } else {
      const filteredData = bankBranchTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filteredData);
    }
  };

  filteredData.map((val, ind) => {
    items.push({
      SlNo: ind + 1,
      id: val?.id,
      heading_1: val?.branchName ?? "--",
      heading_2: val?.ifscCode ?? "--",
      heading_3: val?.address ?? "--",
      heading_4: (
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
      heading_6: (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{ color: "blue", cursor: "pointer" }}
          // onClick={() => {navigateToTransporter(val?.id);}}
          >
            Details
          </span>
        </div>
      ),
    });
  });

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setIsId(id);
  };

  const handleOk = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteBankBranch((res) => {
        let { status, message, data } = res;
        if (status === 200) {
          getBankBranches();
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
  };

  const handleCreateBank = () => {
    setShowConfirmModal1(false);
    setIsCreateBankBranch(!isCreateBankBranch);
  };

  // const handleCancelBank = () => {
  //   setIsCreateBank(!isCreateBank);
  //   clearData();
  //   // clearDataErr();
  // };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateBankBranch(isCreateBankBranch);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankBranchData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // setProductsDataErr((prev) => ({
    //   ...prev,
    //   [name]: "",
    // }));
  };

  // const handleDropDown = (name, value) => {
  //   setProductsData((prev) => ({ ...prev, [name]: value }));
  //   // setUserDataErr((prev) => ({ ...prev, [name]: "" }));
  // };
  const validateFields = () => {
    let errObj = { ...bankBranchData };

    if (!bankBranchData.branchName) {
      errObj.branchName = "This field is required";
    } else if (!/^[a-zA-Z ]{1,30}$/.test(bankBranchData.branchName)) {
      errObj.branchName = "Name field accepts Max 30 characters";
    } else {
      errObj.branchName = "";
    }

    if (!bankBranchData.ifscCode) {
      errObj.ifscCode = "This field is required";
    } else {
      errObj.ifscCode = "";
    }

    // console.log(errObj);

    setBankBranchDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleSubmit = () => {
    // console.log(validateFields());
    // if (validateFields()) {
    const payload = {
      bankId: selectedBankId,
      branchName: bankBranchData.branchName,
      ifscCode: bankBranchData.ifscCode,
      address: bankBranchData.address,
      isActive: Number(bankBranchData.isActive) === 0 ? false : true,
    };
    if (isId) {
      payload.id = isId;
      UpdateBankBranch((res) => {
        let { status, message } = res;
        if (status === 200) {
          clearData();
          getBankBranches();
          setIsId(null);
          setAlertText(message);
          setIsCreateBankBranch(!isCreateBankBranch);
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
      CreateBankBranch((res) => {
        let { status, message } = res;
        if (status === 200) {
          clearData();
          getBankBranches();
          setIsId(null);
          setAlertText(message);
          setIsCreateBankBranch(!isCreateBankBranch);
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
    // }
  };

  const handleEdit = (id) => {
    setIsCreateBankBranch(!isCreateBankBranch);
    setBankBranchData({
      bankId: selectedBankId,
      branchName:
        bankBranchTableData.find((branchName) => branchName.id === id)
          ?.branchName || "",
      ifscCode:
        bankBranchTableData.find((ifscCode) => ifscCode.id === id)?.ifscCode ||
        "",
      address:
        bankBranchTableData.find((address) => address.id === id)?.address || "",
      isActive:
        bankBranchTableData.find((isActive) => isActive.id === id)?.isActive ===
          true
          ? 1
          : false,
    });
    setIsId(bankBranchTableData.find((bankBranch) => bankBranch.id === id)?.id);
    const payload = {
      id: bankBranchTableData.find((bankBranch) => bankBranch.id === id)?.id,
    };
  };
  const bankBranchModalClose = () => {
    setIsCreateBankBranch(false);
  };

  const handleCancelBankBranch = () => {
    setIsCreateBankBranch(false);
    clearData();
  };

  const handleDropDown = (name, value) => {
    setBankBranchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBank = () => {
    navigate("/bank");
  };

  return (
    <>
      {token ? (
        <div className="bank">
          <div className="bank__container">
            <div className="bank__header">
              <div className="bank__header__section">
                <div className="bank__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`MDM - ${"Bank Branch"
                    }`}</h4>
                </div>
                <div className="bank__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            <div
              className="transporter1__header__section__logo"
              style={{ marginTop: -40 }}
            >
              <IconButton onClick={handleBank} style={{ top: "40px" }}>
                <img src={images} alt="back" />
              </IconButton>
            </div>
            {isCreateBankBranch ? (
              <>
                <div className="Cbody"  style={{ marginTop: 40 }}>
                  <Paper elevation={3}>
                    <CForm method="post" onSubmit="">
                      <CRow>
                        <CCol lg={12}>
                          <CFormLabel>Branch Name</CFormLabel>
                          <CFormInput
                            size="sm"
                            type="text"
                            name="branchName"
                            id="branchName"
                            value={bankBranchData.branchName}
                            onChange={handleInputChange}
                            placeholder="Enter Branch Name"
                          />
                        </CCol>

                        <CCol lg={12}>
                          <CFormLabel>Address</CFormLabel>
                          <CFormInput
                            size="sm"
                            type="text"
                            name="address"
                            id="address"
                            value={bankBranchData.address}
                            onChange={handleInputChange}
                            placeholder="Enter Address"
                          />
                        </CCol>

                        <CCol lg={12}>
                          <CFormLabel>IFSC Code</CFormLabel>
                          <CFormInput
                            size="sm"
                            type="text"
                            name="ifscCode"
                            id="ifscCode"
                            value={bankBranchData.ifscCode}
                            onChange={handleInputChange}
                            placeholder="Enter IFSC Code"
                          />
                          <span style={{ color: "red" }}>
                            {bankBranchDataErr.ifscCode}
                          </span>
                        </CCol>

                        <CCol lg={12}>
                          <CFormLabel htmlFor="nf-email">Status</CFormLabel>
                          <CFormSelect
                            size="sm"
                            value={bankBranchData.isActive}
                            onChange={(e) =>
                              handleDropDown("isActive", e.target.value)
                            }
                          >
                            <option>Select status</option>
                            <option value="1" key={1}>
                              Active
                            </option>
                            <option value="2" key={2}>
                              Inactive
                            </option>
                          </CFormSelect>
                        </CCol>
                      </CRow>

                      <br></br>
                      <div style={{ display: "flex" }}>
                        <CButton
                          //color="primary"
                          style={{
                            backgroundColor: "#0060f1",
                            "margin-right": "15px",
                          }}
                          target="_blank"
                          onClick={handleSubmit}
                        >
                          Submit
                        </CButton>
                        <CButton
                          color="primary"
                          target="_blank"
                          style={{
                            backgroundColor: "gray",
                          }}
                          onClick={handleCancelBankBranch}
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
                <div className="bank__table" style={{ marginTop: 20 }}>
                  <div className="bank__table__header">
                    <div className="bank__table__header__section">
                      <input
                        type="text"
                        className="form-control"
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
                        onClick={handleCreateBank}
                      >
                        Add Bank Branch
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
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default BankBranches;
