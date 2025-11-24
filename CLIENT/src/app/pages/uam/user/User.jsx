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
import {
  CreateUsers,
  DeleteUsers,
  GetDropDownDistrict,
  GetDropDownState,
  GetDropDownTalukas,
  GetOrganization1,
  GetRoles,
  GetUser,
  UpdateUser,
  GetDropDownOrganization
} from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import "./User.scss";
import { Paper } from "@mui/material";
import Header from "../../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
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
    label: "Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Organization Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Address",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Mobile No",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Role",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Email",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Status",
    _props: { scope: "col" },
  },
  {
    key: "heading_8",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialState = {
  organizationUnitId: null,
  organizationUnitTypeId: "",
  name: "",
  address: "",
  email: "",
  mobileNo: "",
  aadhaarNo: "",
  panNo: "",
  bankAccNo: "",
  bankAccName: "",
  bankIfscCode: "",
  state: null,
  district: null,
  talukas: null,
  role: null,
  password: "",
  status: null,
  userName: "",
  headLoad: "",
  commission: "",
};

const User = () => {
  const token = localStorage.getItem("token");
  // console.log(token);
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const items = [];
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [userTableData, setUserTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [isId, setIsId] = useState();
  const [selectStateData, setSelectStateData] = useState([]);
  const [selectDistrictData, setSelectDistrictData] = useState([]);
  const [selectTalukasData, setSelectTalukasData] = useState([]);
  const [selectRoleData, setSelectRoleData] = useState([]);
  const [selectOrganizationUnitData, setSelectOrganizationUnitData] = useState([]);
  const [userData, setUserData] = useState(initialState);
  const [userDataErr, setUserDataErr] = useState(initialState);
  const [selectedStateId, setSelectedStateId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [dropdownOrganization, setDropdownOrganization] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const UsersPermissions = userAuthData?.permissions?.find(
        (val) => val?.Users
      );
      setPermission(UsersPermissions?.Users);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const orgType = 5;
  useEffect(() => {
    getDropdownOrganization();
  }, [orgType]);

  const getDropdownOrganization = () => {
    GetDropDownOrganization((res) => {
      setDropdownOrganization(res.data);
    }, orgType);
  };

  const clearDataErr = () => {
    setUserDataErr(initialState);
  };

  const clearData = () => {
    setUserData(initialState);
  };

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(userTableData);
    } else {
      const filteredData = userTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase()?.includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filteredData);
    }
  };

  // console.log('Read',hasPermission("Read"));
  // console.log('Create',hasPermission("Create"));
  // console.log('Update',hasPermission("Update"));
  // console.log('Delete',hasPermission("Delete"));


  {
    filteredData?.map((val, ind) => {
      items.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.name ? val?.name : "--",
        heading_2: val?.organizationUnitName ? val?.organizationUnitName : "--",
        heading_3: val?.address ? val?.address : "--",
        heading_4: val?.mobileNo ? val?.mobileNo : "--",
        heading_5: val?.roleName ? val?.roleName : "--",
        heading_6: val?.emailId ? val?.emailId : "--",
        heading_7: val?.isActive == 1 ? "Active" : "Inactive" ?? "--",
        heading_8: (
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

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setIsId(id);
  };

  const handleOk = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteUsers((res) => {
        let { status, message } = res;
        if (status === 200) {
          getUser();
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
        } else if (message?.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModal1(true);
          setSessionOk(true);
        }
      }, payload);
    }
  };

  useEffect(() => {
    getUser();
    getStateData();
    getDistrictData();
    getTalukasData();
    getRoleData();
  }, []);

  const getUser = () => {
    setIsLoading(true); // Show the loading spinner
    GetUser((res) => {
      let { status, data, message } = res;
      // console.log(res);
      if (res.status === 200) {
        setUserTableData(data);
        setFilteredData(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowConfirmModal(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModal1(true);
        // setIsLoading(false);
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
    });
  };

  const getStateData = () => {
    GetDropDownState((res) => {
      setSelectStateData(res.data);
    });
  };

  useEffect(() => {
    getDistrictData();
  }, [selectedStateId]);

  const getDistrictData = () => {
    GetDropDownDistrict((res) => {
      setSelectDistrictData(res.data);
    }, selectedStateId);
  };

  useEffect(() => {
    getTalukasData();
  }, [selectedDistrictId]);

  const getTalukasData = () => {
    GetDropDownTalukas((res) => {
      setSelectTalukasData(res.data);
    }, selectedDistrictId);
  };

  const getRoleData = () => {
    GetRoles((res) => {
      setSelectRoleData(res.data);
    });
  };

  useEffect(() => {
    getOrganizationUnit();
  }, [selectedOption]);

  const getOrganizationUnit = () => {
    GetOrganization1((res) => {
      setSelectOrganizationUnitData(res.data);
    }, selectedOption);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateUser = () => {
    setIsCreateUser(!isCreateUser);
  };

  const handleCancleUser = () => {
    setIsCreateUser(!isCreateUser);
    setIsId(null);
    clearData();
    clearDataErr();
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateUser(isCreateUser);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleInput = (e) => {
    if (e.target.name === "bankIfscCode" || e.target.name === "panNo") {
      setUserData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
    setUserDataErr((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleDropDown = (name, value) => {
    console.log(name, value);
    setUserData((prev) => ({ ...prev, [name]: value }));
    setUserDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStateDropDown = (name, value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
    setUserDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedStateId(value);
  };
  const handleDistrictDropDown = (name, value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
    setUserDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedDistrictId(value);
    getTalukasData();
  };

  const handleTalukaDropDown = (name, value) => {
    setUserData((prev) => ({ ...prev, [name]: value }));
    setUserDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    let errObj = { ...initialState };
    if (!userData.organizationUnitId) {
      errObj.organizationUnitId = "This field is required";
    } else if (userData.organizationUnitId == 0) {
      errObj.organizationUnitId = "This field is required";
    } else {
      errObj.organizationUnitId = "";
    }
    if (!userData.name) {
      errObj.name = "This field is required";
    } else if (!/^[a-zA-Z ]{1,30}$/.test(userData.name)) {
      errObj.name = "Name field accepts Max 30 characters";
    }
    if (!userData.address) {
      errObj.address = "This field is required";
    } else {
      errObj.address = "";
    }
    if (!userData.email) {
      errObj.email = "This field is required";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)
    ) {
      errObj.email = "Enter valid E-mail ID";
    }
    if (!userData.state) {
      errObj.state = "This field is required";
    } else if (userData.state == 0) {
      errObj.state = "This field is required";
    } else {
      errObj.state = "";
    }
    if (!userData.district) {
      errObj.district = "This field is required";
    } else if (userData.district == 0) {
      errObj.district = "This field is required";
    } else {
      errObj.district = "";
    }
    if (!userData.talukas) {
      errObj.talukas = "This field is required";
    } else if (userData.talukas == 0) {
      errObj.talukas = "This field is required";
    } else {
      errObj.talukas = "";
    }
    if (!userData.role) {
      errObj.role = "This field is required";
    } else {
      errObj.role = "";
    }
    if (!userData.status) {
      errObj.status = "This field is required";
    } else {
      errObj.status = "";
    }
    if (!userData.userName) {
      errObj.userName = "This field is required";
    } else {
      errObj.userName = "";
    }
    // if (!userData.organizationUnitTypeId) {
    //   errObj.organizationUnitTypeId = "";
    // }
    // if (!userData.password) {
    //   errObj.password = "This field is required";
    // } else if (
    //   !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])/.test(userData.password)
    // ) {
    //   errObj.password =
    //     "Minimum eight characters, at least one letter, one number and one special character";
    // }
    // console.log(errObj);
    setUserDataErr((prev) => ({ ...prev, ...errObj }));
    console.log('errobj : ',errObj)
    return Object.values(errObj).every((x) => x === "");
  };

  const handleSubmit = () => {
    // console.log(validateFields());
    if (validateFields()) {
      const payload = {
        organizationUnitId: Number(userData.organizationUnitId),
        organizationUnitTypeId: Number(userData.organizationUnitTypeId),
        name: userData.name,
        address: userData.address,
        mobileNo: userData.mobileNo,
        emailId: userData.email,
        roleId: Number(userData.role),
        stateId: Number(userData.state),
        districtId: Number(userData.district),
        vctId: Number(userData.talukas),
        aadhaarNo: userData.aadhaarNo,
        panNo: userData.panNo,
        bankAccNo: userData.bankAccNo,
        bankAccName: userData.bankAccName,
        bankBranchId: userData.bankIfscCode,
        username: userData.userName,
        password: userData.password,
        isActive: Number(userData.status) == 1 ? true : false,
      };
      console.log('payload: ', payload);
      if (isId) {
        payload.id = isId;
        UpdateUser((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData();
            getUser();
            setIsId(null);
            setAlertText(message);
            setIsCreateUser(!isCreateUser);
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
          } else if (message?.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          }
        }, payload);
      } else {
        CreateUsers((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData();
            getUser();
            setIsId(null);
            setAlertText(message);
            setIsCreateUser(!isCreateUser);
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
          } else if (message?.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          }
        }, payload);
      }
    }
  };

  const handleEdit = (id) => {
    setIsCreateUser(!isCreateUser);
    const payload = {
      id: userTableData.find((role) => role.id === id)?.id,
    };
    setSelectedStateId(userTableData.find((role) => role.id === id)?.stateId);
    setSelectedDistrictId(userTableData.find((role) => role.id === id)?.districtId);
    console.log('userTableData: ', userTableData);
    setUserData(
      {
        organizationUnitId:
          userTableData.find((role) => role.id === id)?.organizationUnitId ||
          "",
        name: userTableData.find((role) => role.id === id)?.name || "",
        address: userTableData.find((role) => role.id === id)?.address || "",
        mobileNo: userTableData.find((role) => role.id === id)?.mobileNo || "",
        email: userTableData.find((role) => role.id === id)?.emailId || "",
        role: userTableData.find((role) => role.id === id)?.roleId || "",
        state: userTableData.find((role) => role.id === id)?.stateId || "",
        district: userTableData.find((role) => role.id === id)?.districtId || "",
        talukas: userTableData.find((role) => role.id === id)?.vctId || "",
        aadhaarNo: userTableData.find((role) => role.id === id)?.aadhaarNo || "",
        bankAccNo: userTableData.find((role) => role.id === id)?.bankAccNo || "",
        bankAccName: userTableData.find((role) => role.id === id)?.bankAccName || "",
        bankIfscCode: userTableData.find((role) => role.id === id)?.bankBranchId || "",
        userName: userTableData.find((role) => role.id === id)?.roleName || "",
        password: userTableData.find((role) => role.id === id)?.password || "",
        status: userTableData.find((role) => role.id === id)?.isActive === true ? 1 : 0,
        panNo: userTableData.find((role) => role.id === id)?.panNo || "",
      },
      payload
    );
    setIsId(userTableData.find((role) => role.id === id)?.id);
  };

  console.log('userData: ', userData);

  return (
    <>
      {token ? (
        <div className="users">
          <div className="users__container">
            <div className="users__header">
              <div className="users__header__section">
                <div className="users__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`UAM -   ${isCreateUser
                    ? isId
                      ? "Edit User"
                      : "Create User"
                    : "User List"
                    }`}</h4>
                </div>
                <div className="users__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            {isCreateUser ? (
              <>
                <div className="Cbody">
                  <Paper elevation={3}>
                    <div className="container">
                      <div>
                        <CForm method="post" onSubmit="">
                          <CRow>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Organization Unit{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={userData.organizationUnitId}
                                onChange={(e) => {
                                  const selectedOrgId = e.target.value;
                                  // console.log(selectedOrgId);
                                  if (selectedOrgId != 0) {
                                    const selectedOrg = dropdownOrganization.find((option) => option.id === parseInt(selectedOrgId, 10));
                                    if (selectedOrg) {
                                      setUserData((prev) => ({ ...prev, "organizationUnitTypeId": selectedOrg.organizationType }));
                                    } else {
                                      setUserData((prev) => ({ ...prev, "organizationUnitTypeId": "" }));
                                    }
                                  } else {
                                    setUserData((prev) => ({ ...prev, "organizationUnitTypeId": "" }));
                                  }
                                  handleDropDown(
                                    "organizationUnitId",
                                    e.target.value
                                  );
                                }}
                              >
                                <option value={0}>
                                  Select organization Unit
                                </option>
                                {dropdownOrganization?.length &&
                                  dropdownOrganization?.map(
                                    (option, index) => {
                                      return (
                                        <option key={index} value={option.id}>
                                          {option.name}
                                        </option>
                                      );
                                    }
                                  )}
                              </CFormSelect>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.organizationUnitId}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Full Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="Name"
                                name="name"
                                value={userData.name}
                                onChange={handleInput}
                                placeholder="Enter Full Name.."
                                aria-label="default input example"
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^a-zA-Z\s]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.name}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Address{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="Name"
                                name="address"
                                value={userData.address}
                                onChange={handleInput}
                                placeholder="Enter Address.."
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.address}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Email{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="email"
                                id="email"
                                name="email"
                                value={userData.email}
                                onChange={handleInput}
                                placeholder="Enter Email.."
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.email}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Mobile No.{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                id="mobile"
                                name="mobileNo"
                                value={userData.mobileNo}
                                maxLength={10}
                                onChange={handleInput}
                                placeholder="Enter Mobile Number.."
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.mobileNo}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Aadhaar
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="Name"
                                name="aadhaarNo"
                                maxLength={12}
                                value={userData.aadhaarNo}
                                onChange={handleInput}
                                placeholder="Enter Aadhaar number.."
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.aadhaarNo}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">Pan</CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                id="pan"
                                name="panNo"
                                maxLength={10}
                                value={userData.panNo}
                                onChange={handleInput}
                                placeholder="Enter Pan.."
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.panNo}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Bank Acc. no
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                id="accno"
                                name="bankAccNo"
                                maxLength={17}
                                value={userData.bankAccNo}
                                onChange={handleInput}
                                placeholder="Enter Bank Account no.."
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.bankAccNo}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Bank Acc. name
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                id="accname"
                                name="bankAccName"
                                value={userData.bankAccName}
                                onChange={handleInput}
                                placeholder="Enter Bank Account name.."
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.bankAccName}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Bank IFSC Code
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                name="bankIfscCode"
                                maxLength={11}
                                value={userData.bankIfscCode}
                                onChange={handleInput}
                                placeholder="Enter Bank IFSC Code.."
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.bankIfscCode}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                State{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={userData.state}
                                onChange={(e) =>
                                  handleStateDropDown("state", e.target.value)
                                }
                              >
                                <option value={0}>Select State</option>
                                {selectStateData?.length &&
                                  selectStateData?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.name}
                                      </option>
                                    );
                                  })}
                              </CFormSelect>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.state}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                District{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={userData.district}
                                onChange={(e) =>
                                  handleDistrictDropDown(
                                    "district",
                                    e.target.value
                                  )
                                }
                              >
                                <option value={0}>Select District</option>
                                {selectDistrictData?.length &&
                                  selectDistrictData?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.name}
                                      </option>
                                    );
                                  })}
                              </CFormSelect>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.district}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Village/Town{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={userData.talukas}
                                onChange={(e) =>
                                  handleTalukaDropDown(
                                    "talukas",
                                    e.target.value
                                  )
                                }
                              >
                                <option value={0}>Select Village/Town</option>
                                {selectTalukasData?.length &&
                                  selectTalukasData?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.name}
                                      </option>
                                    );
                                  })}
                              </CFormSelect>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.talukas}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Role{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={userData.role}
                                onChange={(e) =>
                                  handleDropDown("role", e.target.value)
                                }
                              >
                                <option value={0}>Select Roles</option>
                                {selectRoleData?.length &&
                                  selectRoleData?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.name}
                                      </option>
                                    );
                                  })}
                              </CFormSelect>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.role}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Status{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={userData.status}
                                onChange={(e) =>
                                  handleDropDown("status", e.target.value)
                                }
                              >
                                <option>Select Status</option>
                                <option value={1} key={1}>
                                  Active
                                </option>
                                <option value={0} key={2}>
                                  Inactive
                                </option>
                              </CFormSelect>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {userDataErr.status}
                              </p>
                            </CCol>
                            {isId ? (
                              " "
                            ) : (
                              <CCol lg={4}>
                                <CFormLabel htmlFor="nf-email">
                                  User Name{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  type="Name"
                                  name="userName"
                                  value={userData.userName}
                                  onChange={handleInput}
                                  placeholder="Enter User Name.."
                                />
                                <p
                                  style={{ color: "red", fontSize: "x-small" }}
                                >
                                  {userDataErr.userName}
                                </p>
                              </CCol>
                            )}
                            {isId ? (
                              ""
                            ) : (
                              <CCol lg={4}>
                                <CFormLabel htmlFor="nf-email">
                                  Password{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </CFormLabel>
                                <CFormInput
                                  size="sm"
                                  type="text"
                                  id="password"
                                  name="password"
                                  value={userData.password}
                                  onChange={handleInput}
                                  placeholder="Enter Password.."
                                />
                                <p
                                  style={{ color: "red", fontSize: "x-small" }}
                                >
                                  {userDataErr.password}
                                </p>
                              </CCol>
                            )}
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
                              {isId ? "Update" : "Save"}
                            </CButton>
                            <CButton
                              target="_blank"
                              style={{
                                border: 0,
                                backgroundColor: "lightslategrey",
                              }}
                              onClick={handleCancleUser}
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
                <div className="users__table">
                  <div className="users__table__header">
                    <div className="users__table__header__section">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
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
                        onClick={handleCreateUser}
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
                        Add User
                      </button>
                    </div>
                  </div>
                  <div
                    className="users__table__body"
                    style={{ height: "75vh", overflowY: "scroll" }}
                  >
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <CTable
                        hover
                        columns={columns}
                        items={items}
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

export default User;
