import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import "./Transporter.scss";
import {
  CreateTransporters,
  DeleteTransporters,
  GetTransporters,
  UpdateTransporters,
  GetDropDownState,
  GetDropDownDistrict,
  GetDropDownTalukas,
} from "../../../utils/apiCalls";
import Select from "react-select";
import Confirm from "../../../components/confirmModal/confirm";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Transporter from "./Transporter";
import { Paper } from "@mui/material";
import Header from "../../../components/header/Header";
import Loader from "../../../components/loader";
import * as XLSX from "xlsx";
import download from "../../../../assets/images/icons/download.png";
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
    label: "Firm Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Contact Person",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Transporter Code",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Address",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Action",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Navigate",
    _props: { scope: "col" },
  },
];

const initialState = {
  firmName: "",
  code: "",
  contactPersonName: "",
  mobileNo: "",
  emailId: "",
  addressLine1: "",
  addressLine2: "",
  state: null,
  district: null,
  vtc: null,
  pincode: "",
  geocode: "",
  aadhaarNo: "",
  panNo: "",
  bankAcNo: "",
  bankAcName: "",
  bankIfscCode: "",
  status: null,
};

const Transporters = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const items = [];
  const excelitem = [];
  const [switchValues, setSwitchValues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isCreateTransporter, setIsCreateTransporter] = useState(false);
  const [transportersTableData, setTransportersTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [selectStateData, setSelectStateData] = useState([]);
  const [selectDistrictData, setSelectDistrictData] = useState([]);
  const [selectTalukasData, setSelectTalukasData] = useState([]);
  const [transporterData, setTransporterData] = useState(initialState);
  const [selectedTransporterId, setSelectedTransporterId] = useState(null);
  const [isTransporter, setIsTransporter] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [isId, setIsId] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const TransporterPermissions = userAuthData?.permissions?.find(
        (val) => val?.Transporters
      );
      setPermission(TransporterPermissions?.Transporters);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  useEffect(() => {
    getTalukasData();
  }, [selectedDistrictId, transporterData?.district]);

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  useEffect(() => {
    getDistrictData();
  }, [selectedStateId, transporterData?.state]);

  useEffect(() => {
    getStateData();
    getDistrictData();
    getTalukasData();
    getTransporters();
  }, []);

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Transporters_data.xlsx");
  };

  const clearData = () => {
    setTransporterData(initialState);
    setTransporterDataErr(initialState);
  };

  const handleDelete = (id) => {
    setShowConfirmModal(true);
    setIsId(id);
  };

  const navigateToTransporter = (id) => {
    localStorage.setItem("selectedTransporterId", id);
    setSelectedTransporterId(id);
    setIsTransporter(true);
  };

  const handleOk = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteTransporters((res) => {
        let { status, message, data } = res;
        if (status === 200) {
          getTransporters();
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
          // setShowConfirmModal1(true);
          // setSessionOk(true);
        }
      }, payload);
    }
  };

  // const handleItemsPerPageChange = (perPage) => {
  //   setNewPageSize(perPage);
  //   setActiveNewPage(1);
  // };

  // const handlePageChange = (event) => {
  //   setActiveNewPage(event);
  // };

  // useEffect(() => {
  //   getTransporters();
  // }, [activeNewPage, newPageSize, totalRecordsCount]);

  // const getTransporters = () => {
  //   const pageSize = newPageSize ? newPageSize : pageSize;
  //   const pageIndex = activeNewPage - 1 ? activeNewPage - 1 : activePage - 1;
  //   GetTransporters(
  //     (res) => {
  //       setTransportersTableData(res?.data?.data);
  //       setFilteredData(res?.data?.data);
  //       setTotalRecordsCount(res?.data?.totalRecords);
  //       setTotalPagesCount(res?.data?.totalPages);
  //     },
  //     pageSize,
  //     pageIndex
  //   );
  // };

  const getTransporters = () => {
    setIsLoading(true); // Show the loading spinner
    GetTransporters(
      (res) => {
        let { status, data, message } = res;
        if (status === 200) {
          setTransportersTableData(data);
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
      }
    );
  };

  const getStateData = () => {
    GetDropDownState((res) => {
      setSelectStateData(res.data);
    });
  };

  const getDistrictData = () => {
    GetDropDownDistrict((res) => {
      setSelectDistrictData(res.data);
    }, selectedStateId || transporterData?.state);
  };

  const getTalukasData = () => {
    GetDropDownTalukas((res) => {
      setSelectTalukasData(res.data);
    }, selectedDistrictId || transporterData?.district);
  };

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(transportersTableData);
    } else {
      const filteredData = transportersTableData.filter((item) =>
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
      const slNo = ind + 1;
      items.push({
        SlNo: slNo,
        id: val?.id,
        heading_1: val?.firmName ?? "--",
        heading_2: val?.contactPersonName ?? "--",
        heading_3: val?.code ?? "--",
        heading_4: val?.addressLine1 ?? " ",
        heading_5: (
          <div style={{
            display: "flex",
            flexDirection: "row",
            background: "none",
            alignItems: "flex-start",
          }}>
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
            <Link to={`/transporter`}>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  navigateToTransporter(val?.id);
                }}
              >
                Details
              </span>
            </Link>
          </div>
        ),
      });

      excelitem.push({
        'SlNo': ind + 1,
        'Firm Name': val?.firmName ?? "--",
        'Contact Person': val?.contactPersonName ?? "--",
        'Transporter Code': val?.code ?? "--",
        'Address': val?.addressLine1 ?? "--",
      })
    });
  }

  // switchValue = Object.keys(switchValues)
    // ?.filter((id) => switchValues[id])
    // ?.map((id) => parseInt(id));
  const [transporterDataErr, setTransporterDataErr] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransporterData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setTransporterDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDropDown = (name, value) => {
    setTransporterData((prev) => ({ ...prev, [name]: value }));
    setTransporterDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStateDropDown = (name, value) => {
    setTransporterData((prev) => ({ ...prev, [name]: value }));
    setTransporterDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedStateId(value);
  };
  const handleDistrictDropDown = (name, value) => {
    setTransporterData((prev) => ({ ...prev, [name]: value }));
    setTransporterDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedDistrictId(value);
    getTalukasData();
  };

  const handleTalukaDropDown = (name, value) => {
    setTransporterData((prev) => ({ ...prev, [name]: value }));
    setTransporterDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    let errObj = { ...initialState };

    if (!transporterData.firmName) {
      errObj.firmName = "This field is required";
    } else {
      errObj.firmName = "";
    }

    if (!transporterData.contactPersonName) {
      errObj.contactPersonName = "This field is required";
    } else {
      errObj.contactPersonName = "";
    }

    if (!transporterData.code) {
      errObj.code = "This field is required";
    } else {
      errObj.code = "";
    }

    // if (!transporterData.addressLine1) {
    //   errObj.addressLine1 = "This field is required";
    // } else {
    //   errObj.addressLine1 = "";
    // }

    // if (!transporterData.addressLine2) {
    //   errObj.addressLine2 = "This field is required";
    // } else {
    //   errObj.addressLine2 = "";
    // }

    // if (!transporterData.emailId) {
    //   errObj.emailId = "This field is required";
    // } else if (
    //   !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    //     transporterData.emailId
    //   )
    // ) {
    //   errObj.emailId = "Enter valid E-mail ID";
    // } else {
    //   errObj.emailId = "";
    // }

    if (!transporterData.mobileNo) {
      errObj.mobileNo = "This field is required";
    } else if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        transporterData.mobileNo
      )
    ) {
      errObj.mobileNo = "Enter valid Mobile Number";
    } else {
      errObj.mobileNo = "";
    }

    if (transporterData.panNo === "") {
      errObj.panNo = "This Field is Required";
    } 
    else if (
      transporterData.panNo &&
      !/^[A-Z]{5}\d{4}[A-Z]$/.test(transporterData.panNo)
    ) {
      errObj.panNo = "Enter Valid Pancard Number";
    } else {
      errObj.panNo = "";
    }

    if (transporterData.pincode === "") {
      errObj.pincode = "This Field is Required";
    } else if (
      transporterData.pincode &&
      !/^(\d{4}|\d{6})$/.test(transporterData.pincode)
    ) {
      errObj.pincode = "Enter Valid PIN Code";
    } else {
      errObj.pincode = "";
    }

    // if (transporterData.geocode === "") {
    //   errObj.geocode = "This Field is Required";
    // } else if (
    //   transporterData.geocode &&
    //   !/^(\d{4}|\d{6})$/.test(transporterData.geocode)
    // ) {
    //   errObj.geocode = "Enter Valid Geo Code";
    // } else {
    //   errObj.geocode = "";
    // }

    if (transporterData.aadhaarNo === "") {
      errObj.aadhaarNo = "This Field is Required";
    } else if (
      transporterData.aadhaarNo &&
      !/^[2-9][0-9]{11}$/.test(transporterData.aadhaarNo)
    ) {
      errObj.aadhaarNo = "Enter Valid Aadhaar Number";
    } else {
      errObj.aadhaarNo = "";
    }

    // if (transporterData.bankAcNo === "") {
    //   errObj.bankAcNo = "This Field is Required";
    // } else if (
    //   transporterData.bankAcNo &&
    //   !/^\d{9,18}$/.test(transporterData.bankAcNo)
    // ) {
    //   errObj.bankAcNo = "Enter Valid Bank Account Number";
    // } else {
    //   errObj.bankAcNo = "";
    // }

    // if (!transporterData.bankAcName) {
    //   errObj.bankAcName = "This field is required";
    // } else {
    //   errObj.bankAcName = "";
    // }

    if (!transporterData.state) {
      errObj.state = "This field is required";
    } else if (transporterData.state == 0) {
      errObj.state = "This field is required";
    } else {
      errObj.state = "";
    }

    if (!transporterData.district) {
      errObj.district = "This field is required";
    } else if (transporterData.district == 0) {
      errObj.district = "This field is required";
    } else {
      errObj.district = "";
    }

    if (!transporterData.vtc) {
      errObj.vtc = "This field is required";
    } else if (transporterData.vtc == 0) {
      errObj.vtc = "This field is required";
    } else {
      errObj.vtc = "";
    }

    // if (!transporterData.status) {
    //   errObj.status = "This field is required";
    // } else if (transporterData.status == 0) {
    //   errObj.status = "This field is required";
    // } else {
    //   errObj.status = "";
    // }

    if (!transporterData.bankIfscCode) {
      errObj.bankIfscCode = "This field is required";
    } else {
      errObj.bankIfscCode = "";
    }
    setTransporterDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "" || x === null);
    console.log(errObj);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTransporters = () => {
    setIsCreateTransporter(!isCreateTransporter);
    setTransporterData(initialState);
    setIsId(null);
    setSwitchValues({});
  };

  const handleCancelTranporter = () => {
    setIsCreateTransporter(false);
    clearData();
  };

  const handleSubmit = (e) => {
    if (validateFields()) {
      e.preventDefault();
      const payload = {
        firmName: transporterData?.firmName,
        code: transporterData?.code,
        contactPersonName: transporterData?.contactPersonName,
        mobileNo: transporterData?.mobileNo,
        emailId: transporterData?.emailId,
        addressLine1: transporterData?.addressLine1,
        addressLine2: transporterData?.addressLine2,
        state: transporterData?.state,
        district: transporterData?.district,
        vtc: transporterData?.vtc,
        pincode: transporterData?.pincode,
        geocode: transporterData?.geocode,
        aadhaarNo: transporterData?.aadhaarNo,
        panNo: transporterData?.panNo,
        bankAcNo: transporterData?.bankAcNo,
        bankAcName: transporterData?.bankAcName,
        bankIfscCode: transporterData?.bankIfscCode,
        status: transporterData.status === "1" ? true : false,
      };
      if (isId) {
        payload.id = isId;
        UpdateTransporters((res) => {
          let { status, message } = res;
          if (status === 200) {
            getTransporters();
            clearData();
            setAlertText("Updated Successfully");
            setShowConfirmModal1(true);
            setIsCreateTransporter(!isCreateTransporter);
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
        CreateTransporters((res) => {
          let { status, message } = res;
          if (status === 200) {
            getTransporters();
            clearData();
            setSwitchValues({});
            setAlertText(message);
            setIsCreateTransporter(!isCreateTransporter);
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

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateTransporter(isCreateTransporter);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleEdit = (id) => {
    setIsCreateTransporter(!isCreateTransporter);
    const payload = {
      id: transportersTableData.find((transporter) => transporter.id === id)
        ?.id,
    };
    setTransporterData(
      {
        firmName:
          transportersTableData.find((transporter) => transporter.id === id)
            ?.firmName || "",
        code: transportersTableData.find((code) => code.id === id)?.code || "",
        contactPersonName:
          transportersTableData.find((contactPerson) => contactPerson.id === id)
            ?.contactPersonName || "",
        mobileNo:
          transportersTableData.find((mobileNo) => mobileNo.id === id)
            ?.mobileNo || "",
        emailId:
          transportersTableData.find((emailId) => emailId.id === id)?.emailId ||
          "",
        addressLine1:
          transportersTableData.find((addressLine1) => addressLine1.id === id)
            ?.addressLine1 || "",
        addressLine2:
          transportersTableData.find((addressLine2) => addressLine2.id === id)
            ?.addressLine2 || "",
        state:
          transportersTableData.find((state) => state.id === id)?.state || "",
        district:
          transportersTableData.find((district) => district.id === id)
            ?.district || "",
        vtc: transportersTableData.find((vtc) => vtc.id === id)?.vtc || "",
        pincode:
          transportersTableData.find((pincode) => pincode.id === id)?.pincode ||
          "",
        geocode:
          transportersTableData.find((geocode) => geocode.id === id)?.geocode ||
          "",
        aadhaarNo:
          transportersTableData.find((aadhaarNo) => aadhaarNo.id === id)
            ?.aadhaarNo || "",
        panNo:
          transportersTableData.find((panNo) => panNo.id === id)?.panNo || "",
        bankAcNo:
          transportersTableData.find((bankAcNo) => bankAcNo.id === id)
            ?.bankAcNo || "",
        bankAcName:
          transportersTableData.find((bankAcName) => bankAcName.id === id)
            ?.bankAcName || "",
        bankIfscCode:
          transportersTableData.find((bankIfscCode) => bankIfscCode.id === id)
            ?.bankIfscCode || "",
        status:
          transportersTableData.find((role) => role.id === id)?.isActive ===
            true
            ? 1
            : 2 || "",
      },
      payload
    );
    setIsId(
      transportersTableData.find((transporter) => transporter.id === id)?.id
    );
  };

  return (
    <>
      {token ? (
        <>
          {isTransporter ? (
            <CButton
              style={{ position: "absolute", right: 10, top: 50 }}
              onClick={() => setIsTransporter(!isTransporter)}
            >
              Back
            </CButton>
          ) : null}
          {isTransporter ? (
            <Transporter selectedTransporterId={selectedTransporterId} />
          ) : (
            <div className="transporter">
              <div className="transporter__container">
                <div className="transporter__header">
                  <div className="transporter__header__section">
                    <div className="transporter__header__section__main">
                      <h5>Company: Verka</h5>
                      <h4>{`MDM -   ${isCreateTransporter
                        ? isId
                          ? "Edit Transporter"
                          : "Create Transporter"
                        : "Transporter List"
                        }`}</h4>
                    </div>
                    <div className="transporter__header__section__bottom">
                      <Header />
                    </div>
                  </div>
                </div>
                {isCreateTransporter ? (
                  <>
                    <div className="Cbody">
                      <Paper elevation={3}>
                        <div className="container">
                          <div>
                            <CForm method="post" onSubmit={handleSubmit}>
                              <CRow>
                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Firm Name{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="Name"
                                    name="firmName"
                                    value={transporterData?.firmName}
                                    onChange={handleInputChange}
                                    placeholder="Enter  Transporter Firm Name"
                                    aria-label="default input example"
                                  />
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.firmName}
                                  </p>
                                </CCol>
                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Transporter Code{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    value={transporterData?.code}
                                    onChange={handleInputChange}
                                    id="code"
                                    name="code"
                                    placeholder="Enter Transporter Code.."
                                  />
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.code}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Contact Person{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="Name"
                                    value={transporterData?.contactPersonName}
                                    onChange={handleInputChange}
                                    id="contactPersonName"
                                    name="contactPersonName"
                                    placeholder="Enter Contact Person Name.."
                                    aria-label="default input example"
                                  />
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.contactPersonName}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Email{" "}
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="email"
                                    value={transporterData?.emailId}
                                    onChange={handleInputChange}
                                    id="emailId"
                                    name="emailId"
                                    placeholder="Enter Email.."
                                  />
                                  {/* <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.emailId}
                                  </p> */}
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Address Line 1{" "}
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="Name"
                                    value={transporterData?.addressLine1}
                                    onChange={handleInputChange}
                                    id="addressLine1"
                                    name="addressLine1"
                                    placeholder="Enter Address Line 1.."
                                  />
                                  {/* <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.addressLine1}
                                  </p> */}
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Address Line 2{" "}
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="Name"
                                    value={transporterData?.addressLine2}
                                    onChange={handleInputChange}
                                    id="addressLine2"
                                    name="addressLine2"
                                    placeholder="Enter Addres Line 2.."
                                  />
                                  {/* <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.addressLine2}
                                  </p> */}
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    State{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    value={transporterData.state}
                                    onChange={(e) =>
                                      handleStateDropDown(
                                        "state",
                                        e.target.value
                                      )
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
                                    {transporterDataErr.state}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    District{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    value={transporterData.district}
                                    onChange={(e) =>
                                      handleDistrictDropDown(
                                        "district",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value={0}>Select District</option>
                                    {selectDistrictData?.length &&
                                      selectDistrictData?.map(
                                        (option, index) => {
                                          return (
                                            <option
                                              key={index}
                                              value={option.id}
                                            >
                                              {option.name}
                                            </option>
                                          );
                                        }
                                      )}
                                  </CFormSelect>
                                  <p style={{ color: "red", fontSize: "x-small" }}>
                                    {transporterDataErr.district}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Village/Town/City{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <Select
                                    options={selectTalukasData}
                                    value={selectTalukasData?.find(
                                      (option) =>
                                        option.id === transporterData.vtc
                                    )}
                                    onChange={(selectedOption) =>
                                      handleTalukaDropDown(
                                        "vtc",
                                        selectedOption?.id
                                      )
                                    }
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
                                    isSearchable
                                    placeholder="Select Village/Town"
                                    styles={{
                                      control: (provided, state) => ({
                                        ...provided,
                                        height: '33px',
                                        minHeight: '32px',
                                      }),
                                    }}
                                  />
                                  <p style={{ color: "red", fontSize: "x-small" }}>
                                    {transporterDataErr.vtc}
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
                                    value={transporterData?.mobileNo}
                                    maxLength={10}
                                    onChange={handleInputChange}
                                    id="mobileNo"
                                    name="mobileNo"
                                    placeholder="Enter Mobile Number.."
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^0-9.-]/g,
                                        ""
                                      );
                                    }}
                                  />
                                  <p style={{ color: "red", fontSize: "x-small" }}>
                                    {transporterDataErr.mobileNo}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    PIN Code{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    value={transporterData?.pincode}
                                    onChange={handleInputChange}
                                    id="pincode"
                                    name="pincode"
                                    placeholder="Enter PIN code"
                                  />
                                  <p style={{ color: "red", fontSize: "x-small" }}>
                                    {transporterDataErr.pincode}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Geo Code{" "}
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    value={transporterData?.geocode}
                                    onChange={handleInputChange}
                                    id="geocode"
                                    name="geocode"
                                    placeholder="Enter Geo code"
                                  />
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.geocode}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Aadhar{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    value={transporterData?.aadhaarNo}
                                    onChange={handleInputChange}
                                    id="aadhaarNo"
                                    name="aadhaarNo"
                                    placeholder="Enter Aadhar number.."
                                  />
                                  <p style={{ color: "red", fontSize: "x-small" }}>
                                    {transporterDataErr.aadhaarNo}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Pan no.{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    value={transporterData?.panNo}
                                    onChange={handleInputChange}
                                    id="panNo"
                                    name="panNo"
                                    placeholder="Enter Pan No.."
                                  // maxLength={6}
                                  />
                                  <p style={{ color: "red", fontSize: "x-small" }}>
                                    {transporterDataErr.panNo}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Bank Acc. no{" "}
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    value={transporterData?.bankAcNo}
                                    onChange={handleInputChange}
                                    id="bankAcNo"
                                    name="bankAcNo"
                                    placeholder="Enter Bank Account no.."
                                  />
                                  {/* <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.bankAcNo}
                                  </p> */}
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Bank Acc. name{" "}
                                    {/* <span style={{ color: "red" }}>*</span> */}
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    value={transporterData?.bankAcName}
                                    onChange={handleInputChange}
                                    id="bankAcName"
                                    name="bankAcName"
                                    placeholder="Enter Bank Account name.."
                                  />
                                  {/* <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.bankAcName}
                                  </p> */}
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    IFSC Code{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    size="sm"
                                    type="text"
                                    value={transporterData?.bankIfscCode}
                                    onChange={handleInputChange}
                                    id="bankIfscCode"
                                    name="bankIfscCode"
                                    placeholder="Enter IFSC Code"
                                  />
                                  <p style={{ color: "red", fontSize: "x-small" }}>
                                    {transporterDataErr.bankIfscCode}
                                  </p>
                                </CCol>

                                <CCol lg={4}>
                                  <CFormLabel htmlFor="nf-email">
                                    Status{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    value={transporterData.status}
                                    onChange={(e) =>
                                      handleDropDown("status", e.target.value)
                                    }
                                  >
                                    <option>Select Status</option>
                                    <option value="1" key={1}>
                                      Active
                                    </option>
                                    <option value="2" key={2}>
                                      Inactive
                                    </option>
                                  </CFormSelect>
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {transporterDataErr.status}
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
                                  {isId ? "Update" : "Save"}
                                </CButton>
                                <CButton
                                  target="_blank"
                                  style={{
                                    border: 0,
                                    backgroundColor: "lightslategrey",
                                  }}
                                  onClick={handleCancelTranporter}
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
                    <div className="transporter__table">
                      <div className="transporter__table__header">
                        <div className="transporter__table__header__section">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                            onKeyPress={(e) => {
                              if (
                                e.target.value.length === 0 &&
                                e.key === " "
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.target.value.length > 1 &&
                                e.key === " " &&
                                e.target.value[e.target.value.length - 1] ===
                                " "
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <div className="buttons">
                            <button
                              onClick={handleTransporters}
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
                              Add Transporter
                            </button>
                            <img
                              onClick={handleExportToExcel}
                              src={download}
                              alt="download-icon"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="transporter__table__body"
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
                      {/* <div
                        style={{
                          marginTop: "1vw",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div className="organization__table__pagination__container">
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
                            activePage={
                              activeNewPage ? activeNewPage : activePage
                            }
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
          )}
        </>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default Transporters;
