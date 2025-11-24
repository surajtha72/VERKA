import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CreateBank, DeleteBank, GetBanks, UpdateBank } from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import BankBranches from "./BankBranches";
import "./Bank.scss";
import { Paper } from "@mui/material";
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
    label: "Bank Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Actions",
    _props: { scope: "col" }
  },
  {
    key: "heading_6",
    label: "Branches",
    _props: { scope: "col" }
  }
];

const initialState = {
  id: "",
  bankName: "",
  isActive: ""
}

const Bank = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isCreateBank, setIsCreateBank] = useState(false);
  const [bankTableData, setBankTableData] = useState([]);
  const [bankData, setBankData] = useState(initialState);
  const [isId, setIsId] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isBankBranch, setIsBankBranch] = useState(false);

  const [bankDataErr, setBankDataErr] = useState({
    bankName: "",
    isActive: ""
  })

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

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

  const navigate = useNavigate();

  const clearData = () => {
    setBankData(initialState);
  };

  const clearDataErr = () => {
    setBankDataErr(initialState);
  };

  useEffect(() => {
    getBanks();
  }, [])

  const getBanks = () => {
    setIsLoading(true); // Show the loading spinner
    GetBanks((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setBankTableData(data);
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
    })
  }

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(bankTableData);
    } else {
      const filteredData = bankTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filteredData);
    }
  };

  const items = [];

  filteredData.map((val, ind) => {
    items.push({
      SlNo: ind + 1,
      id: val?.id,
      heading_1: val?.bankName ?? "--",
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
          <Link to={`/bank-branches`}>
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                handleBankBranch(val?.id);
              }}
            >
              Branches
            </span>
          </Link>
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
      DeleteBank((res) => {
        let { status, message, data } = res;
        if (status === 200) {
          getBanks();
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
    setIsCreateBank(!isCreateBank);
  };

  // const handleCancelBank = () => {
  //   setIsCreateBank(!isCreateBank);
  //   clearData();
  //   // clearDataErr();
  // };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateBank(isCreateBank);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankData((prev) => ({
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
    let errObj = { ...bankData };

    if (!bankData.bankName) {
      errObj.bankName = "This field is required";
    } else if (!/^[a-zA-Z ]{1,30}$/.test(bankData.bankName)) {
      errObj.bankName = "Name field accepts Max 30 characters";
    } else { 
      errObj.bankName = '' 
    }

    if (!bankData.isActive) {
      errObj.isActive = "This field is required";
    } else if (bankData.isActive == "0") {
      errObj.isActive = "This field is required";
    } else {
      errObj.isActive = "";
    }

    setBankDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleSubmit = () => {
    if (validateFields()) {
    const payload = {
      bankName: bankData.bankName,
      isActive: Number(bankData.isActive) === 2 ? false : true
    };
    // console.log(payload);
    if (isId) {
      payload.id = isId;
      UpdateBank(
        (res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData();
            getBanks();
            setIsId(null);
            setAlertText(res.message);
            setIsCreateBank(!isCreateBank);
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
      CreateBank((res) => {
        let { status, message } = res;
        if (status === 200) {
          clearData();
          getBanks();
          setIsId(null);
          setAlertText(res.message);
          setIsCreateBank(!isCreateBank);
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
    setIsUpdate(false);
  };

  const [isUpdate, setIsUpdate] = useState(false);

  const handleEdit = (id) => {
    setIsCreateBank(!isCreateBank);
    setBankData({
      bankName:
        bankTableData.find((bankName) => bankName.id === id)
          ?.bankName || "",
      isActive: bankTableData.find((isActive) => isActive.id === id)?.isActive === true ? 1 : false

    });
    setIsId(
      bankTableData.find((bank) => bank.id === id)?.id
    );
    const payload = {
      id: bankTableData.find((bank) => bank.id === id)
        ?.id,
    };
    setIsUpdate(true);
  }
  const bankModalClose = () => {
    handleCloseModal();
  };
  const handleCloseModal = () => {
    const timeout = setTimeout(() => {
      setIsUpdate(false);
    }, 1000)
  }

  const handleCancelBank = () => {
    setIsCreateBank(false);
    clearData();
    clearDataErr();
    handleCloseModal();
  };

  const handleDropDown = (name, value) => {
    setBankData((prev) => ({ ...prev, [name]: value }));
    clearDataErr();
  };

  const [selectedBankId, setSelectedBankId] = useState(null);
  const handleBankBranch = (id) => {
    localStorage.setItem("selectedBankId", id);
    setSelectedBankId(id);
    setIsBankBranch(true);
  };

  return (
    <>
      {token ? <>
        {isBankBranch ? <CButton style={{ position: 'absolute', right: 10, top: 50 }} onClick={() => setIsBankBranch(!isBankBranch)}>Back</CButton> : null}
        {isBankBranch ? (<BankBranches selectedBankId={selectedBankId} />) :
          (
            <div className="bank">
              <div className="bank__container">
                <div className="bank__header">
                  <div className="bank__header__section">
                    <div className="bank__header__section__main">
                      <h5>Company: Verka</h5>
                      <h4>{`MDM - ${"Bank"
                        }`}</h4>
                    </div>
                    <div className="bank__header__section__bottom">
                      <Header />
                    </div>
                  </div>
                </div>
                {isCreateBank ? (
                  <>
                    <div className="Cbody">
                      <Paper elevation={3}>
                        <div className="container">
                          <div>
                            <CForm method="post" onSubmit="">
                              <CRow>
                                <CCol lg={6}>
                                  <CFormLabel>Bank Name</CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    name="bankName"
                                    id="bankName"
                                    value={bankData.bankName}
                                    onChange={handleInputChange}
                                    placeholder="Enter Bank Name"
                                  />
                                  <span style={{ color: "red" }}>
                                    {bankDataErr.bankName}
                                  </span>
                                </CCol>

                                <CCol lg={6}>
                                  <CFormLabel htmlFor="nf-email">Status</CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    value={bankData.isActive}
                                    onChange={(e) =>
                                      handleDropDown("isActive", e.target.value)
                                    }
                                  >
                                    <option value="0" key={0}>Select status</option>
                                    <option value="1" key={1}>
                                      Active
                                    </option>
                                    <option value="2" key={2}>
                                      Inactive
                                    </option>
                                  </CFormSelect>
                                  <span style={{ color: "red" }}>
                                    {bankDataErr.isActive}
                                  </span>
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
                                  {isUpdate ? "Update" : "Save"}
                                </CButton>
                                <CButton
                                  color="primary"
                                  target="_blank"
                                  style={{
                                    backgroundColor: "gray",
                                  }}
                                  onClick={handleCancelBank}
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
                    <div className="bank__table">
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
                            Add Bank
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

            </div>)}</> : <Navigate to={"/"} />}
    </>
  );
};

export default Bank;