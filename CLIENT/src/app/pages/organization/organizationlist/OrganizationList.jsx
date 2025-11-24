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
import "./OrganizationList.scss";
import {
  CreateOrganization,
  DeleteOrganization,
  GetOrganization,
  UpdateOrganization,
  GetDropDownOrganizationTypes,
  GetDropDownPayroll,
  GetDropDownCollectType,
  GetDropDownTalukas,
  GetDropDownDistrict,
  GetDropDownState,
  GetAllOrganization,
  GetDropDownOrganization,
} from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import { Paper } from "@mui/material";
import * as XLSX from "xlsx";
import Select from "react-select";
import download from "../../../../assets/images/icons/download.png";
import { useRef } from "react";
import Header from "../../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import Loader from "../../../components/loader";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const columns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "OrganizationType",
    label: "Organization Type",
    _props: { scope: "col" },
  },
  {
    key: "ParentOU",
    label: "Parent OU",
    _props: { scope: "col" },
  },
  {
    key: "Name",
    label: "Name",
    _props: { scope: "col" },
  },  { key: "OUCode", label: "OU Code", _props: { scope: "col" } }, // <---

  {
    key: "Address1",
    label: "Address",
    _props: { scope: "col" },
  },
  {
    key: "Capacity",
    label: "Capacity",
    _props: { scope: "col" },
  },
  {
    key: "Actions",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialState = {
  outletType: null,
  procurementTypes: null,
  parentId: null,
  name: "",
  businessRegnNo: "",
  gstNo: "",
  addressLine1: "",
  addressLine2: "",
  vctId: null,
  geocode: "",
  capacity: "",
  headload: "",
  accountNo: null,
  accountHolder: "",
  morningShiftStartTime: "",
  morningShiftEndTime: "",
  eveningShiftStartTime: "",
  eveningShiftEndTime: "",
  defaultCollectionType: null,
  payrollTypes: null,
  enforceStrictTiming: null,
  enforceNoDueCollection: null,
  ouCode: "",
};

const OrganizationList = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allFilteredData, setAllFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOrganization, setIsCreateOrganization] = useState(false);
  const [selectorganizationData, setSelectorganizationData] = useState([]);
  const [organizationTableData, setOrganizationTableData] = useState([]);
  const [allOrganizationTableData, setAllOrganizationTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState();
  const [isId, setIsId] = useState();
  const items = [];
  const excelitem = [];
  const [organizationData, setOrganizationData] = useState(initialState);
  const [organizationDataErr, setOrganizationDataErr] = useState(initialState);
  const [selectedDistrictId, setSelectedDistrictId] = useState();
  const [selectedOption, setSelectedOption] = useState(0);
  const [payrollData, setPayrollData] = useState([]);
  const [collectTypeData, setCollectTypeData] = useState([]);
  const [selectStateData, setSelectStateData] = useState([]);
  const [selectDistrictData, setSelectDistrictData] = useState([]);
  const [selectTalukasData, setSelectTalukasData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const timeoutRef = useRef();

  const [activePage, setActivePage] = useState(1);
  const [activeNewPage, setActiveNewPage] = useState(1);
  const [pageSize, setpageSize] = useState(50);
  const [newPageSize, setNewPageSize] = useState(50);
  const [totalRecordsCount, setTotalRecordsCount] = useState("");
  const [totalPagesCount, setTotalPagesCount] = useState("");
  const itemsPerPageOptions = [50, 100, 150];
  const [dropdownOrganization, setDropdownOrganization] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const organizationPermissions = userAuthData?.permissions?.find(
        (val) => val?.Organization
      );
      setPermission(organizationPermissions?.Organization);
    }
  }, []);

  const handleItemsPerPageChange = (perPage) => {
    setNewPageSize(perPage);
    setActiveNewPage(1);
  };

  const handlePageChange = (event) => {
    setActiveNewPage(event);
  };

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Organization_data.xlsx");
  };

  const clearData = () => {
    setOrganizationData(initialState);
    setOrganizationDataErr(initialState);
  };

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(organizationTableData);
    } else {
      const filteredData = allOrganizationTableData.filter((item) =>
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
    allFilteredData.map((val, ind) => {
      excelitem.push({
        SlNo: ind + 1,
        OrganizationType: val?.organizationName ? val?.organizationName : "--",
        ParentOU: val?.parentName ? val?.parentName : "--",
          OUCode: val?.ouCode ? val?.ouCode : "--",       // <---

        Name: val?.name ? val?.name : "--",
        Address1: val?.addressLine1 ? val?.addressLine1 : "--",
        Capacity: val?.capacity ? val?.capacity : "--",
      });
    });
  }

  const pageIndex = activeNewPage - 1 ? activeNewPage - 1 : activePage - 1;
  {
    filteredData.map((val, ind) => {
      const slNo = pageIndex * newPageSize + ind + 1;
      items.push({
        SlNo: slNo,
        id: val?.id,
        OrganizationType: val?.organizationName ? val?.organizationName : "--",
        ParentOU: val?.parentName ? val?.parentName : "--",
        Name: val?.name ? val?.name : "--",
        Address1: val?.addressLine1 ? val?.addressLine1 : "--",
        Capacity: val?.capacity ? val?.capacity : "--",
        Actions: (
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

  useEffect(() => {
    getSelectOrganizationData();
    getPayrollData();
    getSelectCollectTypeData();
    getStateData();
    getDistrictData();
    getTalukasData();
    getAllOrganizationData();
  }, []);

  useEffect(() => {
    getOrganizationData();
  }, [activeNewPage, newPageSize, totalRecordsCount]);

  const orgType = 5;
  useEffect(() => {
    getDropdownOrganization();
  }, [orgType]);

  const getDropdownOrganization = () => {
    GetDropDownOrganization((res) => {
      setDropdownOrganization(res.data);
    }, orgType);
  };

  const getOrganizationData = () => {
    const pageSize = newPageSize ? newPageSize : pageSize;
    const pageIndex = activeNewPage - 1 ? activeNewPage - 1 : activePage - 1;
    setIsLoading(true); // Show the loading spinner
    GetOrganization(
      (res) => {
        let { status, data, message } = res;
        if (status === 200) {
          setOrganizationTableData(data.data);
          setFilteredData(data.data);
          setTotalRecordsCount(data?.totalRecords);
          setTotalPagesCount(data?.totalPages);
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
      },
      pageSize,
      pageIndex
    );
  };

  const getAllOrganizationData = () => {
    setIsLoading(true); // Show the loading spinner
    GetAllOrganization((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setAllOrganizationTableData(data);
        setAllFilteredData(data);
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

  const getSelectOrganizationData = () => {
    GetDropDownOrganizationTypes((res) => {
      setSelectorganizationData(res.data);
    });
  };

  const getPayrollData = () => {
    GetDropDownPayroll((res) => {
      setPayrollData(res.data);
    });
  };

  const getSelectCollectTypeData = () => {
    GetDropDownCollectType((res) => {
      setCollectTypeData(res.data);
    });
  };

  const getStateData = () => {
    GetDropDownState((res) => {
      setSelectStateData(res.data);
    });
  };

  const handleStateDropDown = (name, value) => {
    setOrganizationData((prev) => ({ ...prev, [name]: value }));
    setOrganizationDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedStateId(value);
  };

  const handleDistrictDropDown = (name, value) => {
    setOrganizationData((prev) => ({ ...prev, [name]: value }));
    setOrganizationDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedDistrictId(value);
    getTalukasData();
  };

  useEffect(() => {
    getDistrictData();
  }, [selectedStateId, organizationData?.state]);

  const getDistrictData = () => {
    GetDropDownDistrict((res) => {
      setSelectDistrictData(res.data);
    }, selectedStateId || organizationData?.state);
  };

  useEffect(() => {
    getTalukasData();
  }, [selectedDistrictId || organizationData?.district]);

  const getTalukasData = () => {
    GetDropDownTalukas((res) => {
      setSelectTalukasData(res.data);
    }, selectedDistrictId || organizationData?.district);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateOrg = () => {
    setIsCreateOrganization(!isCreateOrganization);
    setIsId("");
  };

  const handleCancelOrg = () => {
    setIsCreateOrganization(!isCreateOrganization);
    setSelectedOption(0);
    clearData();
    setIsId(null);
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
      DeleteOrganization((res) => {
        let { status, message } = res;
        if (status === 200) {
          getOrganizationData();
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

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateOrganization(isCreateOrganization);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganizationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setOrganizationDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDropDown = (name, value) => {
    setOrganizationData((prev) => ({ ...prev, [name]: value }));
    setOrganizationDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    let errObj = { ...initialState };
    if (!organizationData.outletType) {
      errObj.outletType = "This field is required";
    } else if (organizationData.outletType == 0) {
      errObj.outletType = "This field is required";
    } else {
      errObj.outletType = "";
    }
    if (!organizationData.parentId) {
      errObj.parentId = "";
    }
    if (!organizationData.name) {
      errObj.name = "This field is required";
    } else {
      errObj.name = "";
    }
    if (!organizationData.state) {
      errObj.state = "This field is required";
    } else if (organizationData.state == 0) {
      errObj.state = "This field is required";
    } else {
      errObj.state = "";
    }
    if (!organizationData.district) {
      errObj.district = "This field is required";
    } else if (organizationData.district == 0) {
      errObj.district = "This field is required";
    } else {
      errObj.district = "";
    }
    if (!organizationData.vctId) {
      errObj.vctId = "This Field is Required";
    } else if (organizationData.vctId == 0) {
      errObj.vctId = "This Field is Required";
    } else {
      errObj.vctId = "";
    }
    if (!organizationData.ouCode) {
  errObj.ouCode = "This field is required";
} else {
  errObj.ouCode = "";
}

    if (organizationData.headload === "") {
      errObj.headload = "This field is required";
    } else if (
      organizationData.headload !== 0 &&
      !/^\d+(\.\d{1,9})?$/.test(organizationData.headload)
    ) {
      errObj.headload = "This field is required";
    } else {
      errObj.headload = "";
    }
    if (organizationData.commission === "") {
      errObj.commission = "This field is required";
    } else if (
      organizationData.commission !== 0 &&
      !/^\d+(\.\d{1,9})?$/.test(organizationData.commission)
    ) {
      errObj.commission = "This field is required";
    } else {
      errObj.commission = "";
    }

if (selectedOption === "3") {
  if (!organizationData.payrollTypes || organizationData.payrollTypes == 0) {
    errObj.payrollTypes = "This field is required";
  } else {
    errObj.payrollTypes = "";
  }
} else {
  // not required for other org types
  errObj.payrollTypes = "";
}

    if (!organizationData.gstNo) {
      errObj.gstNo = "This field is required";
    } else if (!/^\d+$/.test(organizationData.gstNo)) {
      errObj.gstNo = "";
    } else {
      errObj.gstNo = "";
    }
    if (!organizationData.addressLine1) {
      errObj.addressLine1 = "This field is required";
    } else {
      errObj.addressLine1 = "";
    }
    if (!organizationData.capacity) {
      errObj.capacity = "This Field is Required";
    } else {
      errObj.capacity = "";
    }
    if (organizationData.morningShiftStartTime) {
      errObj.morningShiftStartTime = "";
    }
    if (organizationData.morningShiftEndTime) {
      errObj.morningShiftEndTime = "";
    }
    if (organizationData.eveningShiftStartTime) {
      errObj.eveningShiftStartTime = "";
    }
    if (organizationData.eveningShiftEndTime) {
      errObj.eveningShiftEndTime = "";
    }
    if (organizationData.defaultCollectionType) {
      errObj.defaultCollectionType = "";
    }
    if (organizationData.payrollTypes) {
      errObj.payrollTypes = "";
    }
    if (organizationData.enforceStrictTiming) {
      errObj.enforceStrictTiming = "";
    }
    if (organizationData.enforceNoDueCollection) {
      errObj.enforceNoDueCollection = "";
    }
    if (organizationData.geocode) {
      if (!/^\d+$/.test(organizationData.geocode)) {
        errObj.geocode = "Enter a valid number";
      } else {
        errObj.geocode = "";
      }
    }
    if (selectedOption === "3") {
      if (!organizationData.morningShiftStartTime) {
        errObj.morningShiftStartTime = "This field is required";
      } else {
        errObj.morningShiftStartTime = "";
      }
      if (!organizationData.morningShiftEndTime) {
        errObj.morningShiftEndTime = "This field is required";
      } else {
        errObj.morningShiftEndTime = "";
      }
      if (!organizationData.eveningShiftStartTime) {
        errObj.eveningShiftStartTime = "This field is required";
      } else {
        errObj.eveningShiftStartTime = "";
      }
      if (!organizationData.eveningShiftEndTime) {
        errObj.eveningShiftEndTime = "This field is required";
      } else {
        errObj.eveningShiftEndTime = "";
      }
      if (!organizationData.defaultCollectionType) {
        errObj.defaultCollectionType = "This field is required";
      } else {
        errObj.defaultCollectionType = "";
      }
     
if (selectedOption === "3") {
  if (!organizationData.payrollTypes || organizationData.payrollTypes == 0) {
    errObj.payrollTypes = "This field is required";
  } else {
    errObj.payrollTypes = "";
  }
} else {
  // not required for other org types
  errObj.payrollTypes = "";
}
      if (!organizationData.enforceStrictTiming) {
        errObj.enforceStrictTiming = "This field is required";
      } else {
        errObj.enforceStrictTiming = "";
      }
      if (!organizationData.enforceNoDueCollection) {
        errObj.enforceNoDueCollection = "This field is required";
      } else {
        errObj.enforceNoDueCollection = "";
      }
    }
    if (selectedOption === "4") {
      if (!organizationData.payrollTypes) {
        errObj.payrollTypes = "";
      }
    }
    if (selectedOption === "5") {
      if (!organizationData.payrollTypes) {
        errObj.payrollTypes = "";
      }
    }
    // console.log('village value: ', organizationData.vctId);
    console.log(errObj);
    setOrganizationDataErr((prev) => ({ ...prev, ...errObj }));
    const data = Object.values(errObj).every((x) => x === "" || x === null);
    return data;
  };

  const handleSubmit = () => {
    const isValid = validateFields();
      console.log("isValid =", isValid, "errors =", organizationDataErr);

    if (isValid && !isButtonDisabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsButtonDisabled(true);
        const payload = {
          organizationType: Number(organizationData?.outletType),
          parentId: organizationData?.parentId,
          name: organizationData?.name,
          businessRegnNo: organizationData?.businessRegnNo,
          gstNo: organizationData?.gstNo,
          addressLine1: organizationData?.addressLine1,
          addressLine2: organizationData?.addressLine2,
          stateId: Number(organizationData?.state),
          districtId: Number(organizationData?.district),
          vctId: Number(organizationData?.vctId),
          headload: parseFloat(organizationData?.headload),
          commission: parseFloat(organizationData?.commission),
          geocode: organizationData?.geocode,
          capacity: organizationData?.capacity,
          morningShiftStartTime: organizationData?.morningShiftStartTime,
          morningShiftEndTime: organizationData?.morningShiftEndTime,
          eveningShiftStartTime: organizationData?.eveningShiftStartTime,
          eveningShiftEndTime: organizationData?.eveningShiftEndTime,
          defaultCollectionType: Number(organizationData?.defaultCollectionType)
            ? Number(organizationData?.defaultCollectionType)
            : null,
          payrollTypes: Number(organizationData?.payrollTypes)
            ? Number(organizationData?.payrollTypes)
            : null,
          enforceStrictTiming:
            selectedOption === "3"
              ? organizationData?.enforceStrictTiming === "1"
                ? true
                : false
              : null,
          enforceNoDueCollection:
            selectedOption === "3"
              ? organizationData?.enforceNoDueCollection === "1"
                ? true
                : false
              : null,
                ouCode: organizationData?.ouCode,   // <--- add this

        };

        if (isId) {
          payload.id = isId;
          UpdateOrganization((res) => {
            let { status, message } = res;
            if (status === 200) {
              setIsButtonDisabled(false);
              clearData();
              getOrganizationData();
              setIsId(null);
              setSelectedOption(0);
              setIsCreateOrganization(!isCreateOrganization);
              setAlertText(message);
              setOrganizationData(initialState);
              setOrganizationDataErr(initialState);
              setShowConfirmModal1(true);
            } else if (status === 403) {
              setIsButtonDisabled(false);
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
        } else {
          CreateOrganization((res) => {
            let { status, message } = res;
            if (status === 200) {
              setIsButtonDisabled(false);
              clearData();
              getOrganizationData();
              setIsId(null);
              setSelectedOption(0);
              setIsCreateOrganization(!isCreateOrganization);
              setAlertText(message);
              setOrganizationDataErr(initialState);
              setOrganizationData(initialState);
              setShowConfirmModal1(true);
            } else if (status === 403) {
              setIsButtonDisabled(false);
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
      }, 1000);
    }
  };

  const handleEdit = (id) => {
    setIsCreateOrganization(!isCreateOrganization);
    const payload = {
      id: organizationTableData?.find((role) => role.id === id)?.id,
    };
    if (
      organizationTableData?.find((role) => role.id === id)
        ?.organizationType === 3
    ) {
      setSelectedOption("3");
    } else if (
      organizationTableData?.find((role) => role.id === id)
        ?.organizationType === 4
    ) {
      setSelectedOption("4");
    } else if (
      organizationTableData?.find((role) => role.id === id)
        ?.organizationType === 5
    ) {
      setSelectedOption("5");
    }

    setOrganizationData(
      {
        outletType:
          organizationTableData?.find((role) => role.id === id)
            ?.organizationType || "",
        parentId:
          organizationTableData?.find((role) => role.id === id)?.parentId || "",
        name: organizationTableData?.find((role) => role.id === id)?.name || "",
        businessRegnNo:
          organizationTableData?.find((role) => role.id === id)
            ?.businessRegnNo || "",
        gstNo:
          organizationTableData?.find((role) => role.id === id)?.gstNo || "",
        addressLine1:
          organizationTableData?.find((role) => role.id === id)?.addressLine1 ||
          "",
        addressLine2:
          organizationTableData?.find((role) => role.id === id)?.addressLine2 ||
          "",
        vctId:
          organizationTableData?.find((role) => role.id === id)?.vctId || "",
        state:
          organizationTableData?.find((role) => role.id === id)?.stateId || "",
        district:
          organizationTableData?.find((role) => role.id === id)?.districtId ||
          "",
        geocode:
          organizationTableData?.find((role) => role.id === id)?.geocode || "",
        headload:
          organizationTableData?.find((role) => role.id === id)?.headload ||
          0.0,
        commission:
          organizationTableData?.find((role) => role.id === id)?.commission ||
          0.0,
        capacity:
          organizationTableData?.find((role) => role.id === id)?.capacity || "",
        morningShiftStartTime:
          organizationTableData?.find((role) => role.id === id)
            ?.morningShiftStartTime || "",
        morningShiftEndTime:
          organizationTableData?.find((role) => role.id === id)
            ?.morningShiftEndTime || "",
        eveningShiftStartTime:
          organizationTableData?.find((role) => role.id === id)
            ?.eveningShiftStartTime || "",
        eveningShiftEndTime:
          organizationTableData?.find((role) => role.id === id)
            ?.eveningShiftEndTime || "",
        defaultCollectionType:
          organizationTableData?.find((role) => role.id === id)
            ?.defaultCollectionTypeId || "",
        payrollTypes:
          organizationTableData?.find((role) => role.id === id)
            ?.payrollTypeId || "",
        enforceStrictTiming:
          organizationTableData?.find((role) => role.id === id)
            ?.enforceStrictTiming === true
            ? 1
            : 2 || "",
        enforceNoDueCollection:
          organizationTableData?.find((role) => role.id === id)
            ?.enforceNoDueCollection === true
            ? 1
            : 2 || "",
            ouCode:
    organizationTableData?.find((role) => role.id === id)?.ouCode || "", // <---
      },
      payload
    );
    setIsId(organizationTableData?.find((role) => role.id === id)?.id);
  };

  return (
    <>
      {token ? (
        <div className="organization">
          <div className="organization__container">
            <div className="organization__header">
              <div className="organization__header__section">
                <div className="organization__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`UAM - ${
                    isCreateOrganization
                      ? isId
                        ? "Edit Organization"
                        : "Create Organization"
                      : "Organization"
                  }`}</h4>
                </div>
                <div className="organization__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            {isCreateOrganization ? (
              <>
                <div className="Cbody">
                  <Paper elevation={3}>
                    <div className="container">
                      <div>
                        <CForm>
                          <CRow>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Organization Type{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={organizationData.outletType}
                                onChange={(e) => {
                                  handleDropDown("outletType", e.target.value);
                                  setSelectedOption(e.target.value);
                                  // console.log("drp value:", e.target.value);
                                }}
                              >
                                <option value={0}>
                                  Select Organization Type
                                </option>
                                {selectorganizationData?.length &&
                                  selectorganizationData?.map(
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
                                {organizationDataErr.outletType}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
  <CFormLabel htmlFor="nf-email">
    OU Code <span style={{ color: "red" }}>*</span>
  </CFormLabel>
  <CFormInput
    name="ouCode"
    size="sm"
    value={organizationData.ouCode}
    onChange={handleInputChange}
    placeholder="Enter OU Code"
    aria-label="default input example"
  />
  <p style={{ color: "red", fontSize: "x-small" }}>
    {organizationDataErr.ouCode}
  </p>
</CCol>

                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Parent OU
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={organizationData.parentId}
                                onChange={(e) =>
                                  handleDropDown("parentId", e.target.value)
                                }
                                disabled={selectedOption === 0}
                              >
                                <option value={0}>Select Parent Id</option>
                                {dropdownOrganization?.length &&
                                  dropdownOrganization?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.name}
                                      </option>
                                    );
                                  })}
                              </CFormSelect>
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.parentId}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Name <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                name="name"
                                size="sm"
                                value={organizationData.name}
                                onChange={handleInputChange}
                                placeholder="Enter Name"
                                aria-label="default input example"
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.name}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Business Reg.Number
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                name="businessRegnNo"
                                value={organizationData.businessRegnNo}
                                onChange={handleInputChange}
                                placeholder="Enter Business Reg.Number "
                                aria-label="default input example"
                              />
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                GST Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                name="gstNo"
                                size="sm"
                                value={organizationData.gstNo}
                                onChange={handleInputChange}
                                placeholder="Enter GST Number "
                                aria-label="default input example"
                                maxLength={15}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^a-zA-Z0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.gstNo}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Address Line 1{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                name="addressLine1"
                                value={organizationData.addressLine1}
                                onChange={handleInputChange}
                                placeholder="Enter Address.. "
                                aria-label="default input example"
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.addressLine1}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Address 2
                              </CFormLabel>
                              <CFormInput
                                name="addressLine2"
                                size="sm"
                                value={organizationData.addressLine2}
                                onChange={handleInputChange}
                                placeholder="Enter Address.. "
                                aria-label="default input example"
                              />
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                State <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={organizationData.state}
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
                                {organizationDataErr.state}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                District <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={organizationData.district}
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
                                {organizationDataErr.district}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Village/Town{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <Select
                                options={selectTalukasData}
                                value={selectTalukasData?.find(
                                  (option) =>
                                    option.id === organizationData.vctId
                                )}
                                onChange={(selectedOption) =>
                                  handleDropDown("vctId", selectedOption?.id)
                                }
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                isSearchable
                                placeholder="Select Village/Town"
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.vctId}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Geo Code <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                name="geocode"
                                value={organizationData.geocode}
                                onChange={handleInputChange}
                                placeholder="Enter Geo Code.. "
                                aria-label="default input example"
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.geocode}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Head Load{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                name="headload"
                                value={organizationData.headload}
                                onChange={handleInputChange}
                                placeholder="Enter Head Load.."
                                maxLength={10}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.headload}
                              </p>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Commission{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="text"
                                id="password"
                                name="commission"
                                value={organizationData.commission}
                                onChange={handleInputChange}
                                placeholder="Enter Commission.."
                                maxLength={10}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.commission}
                              </p>
                            </CCol>
                            <CCol lg={4} md={2} sm={3}>
                              <CFormLabel htmlFor="nf-email">
                                Processing Capacity (in Liters){" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                name="capacity"
                                size="sm"
                                value={organizationData.capacity}
                                onChange={handleInputChange}
                                placeholder="Enter Capacity.. "
                                aria-label="default input example"
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <p style={{ color: "red", fontSize: "x-small" }}>
                                {organizationDataErr.capacity}
                              </p>
                            </CCol>
                            {selectedOption === "3" && (
                              <>
                                <CCol lg={4} md={2} sm={3}>
                                  <CFormLabel htmlFor="nf-email">
                                    Morning Shift Start{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    type="time"
                                    id="time"
                                    step="1"
                                    size="sm"
                                    name="morningShiftStartTime"
                                    value={
                                      organizationData.morningShiftStartTime
                                    }
                                    onChange={handleInputChange}
                                    placeholder="Enter Time.."
                                  />
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {organizationDataErr.morningShiftStartTime}
                                  </p>
                                </CCol>
                                <CCol lg={4} md={2} sm={3}>
                                  <CFormLabel>
                                    Morning Shift End{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    type="time"
                                    step="1"
                                    id="time"
                                    size="sm"
                                    name="morningShiftEndTime"
                                    value={organizationData.morningShiftEndTime}
                                    onChange={handleInputChange}
                                    placeholder="Enter Time.."
                                  />
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {organizationDataErr.morningShiftEndTime}
                                  </p>
                                </CCol>
                                <CCol lg={4} md={2} sm={3}>
                                  <CFormLabel>
                                    Evening Shift Start{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    type="time"
                                    step="1"
                                    id="time"
                                    size="sm"
                                    name="eveningShiftStartTime"
                                    value={
                                      organizationData.eveningShiftStartTime
                                    }
                                    onChange={handleInputChange}
                                    placeholder="Enter Time.."
                                  />
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {organizationDataErr.eveningShiftStartTime}
                                  </p>
                                </CCol>
                                <CCol lg={4} md={2} sm={3}>
                                  <CFormLabel>
                                    Evening Shift End{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormInput
                                    type="time"
                                    step="1"
                                    id="time"
                                    size="sm"
                                    name="eveningShiftEndTime"
                                    value={organizationData.eveningShiftEndTime}
                                    onChange={handleInputChange}
                                    placeholder="Enter Time.."
                                  />
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {organizationDataErr.eveningShiftEndTime}
                                  </p>
                                </CCol>
                                <CCol lg={4} md={2} sm={3}>
                                  <CFormLabel htmlFor="nf-email">
                                    Collect Type{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    value={
                                      organizationData.defaultCollectionType
                                    }
                                    onChange={(e) =>
                                      handleDropDown(
                                        "defaultCollectionType",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value={0}>
                                      Select Collect Type
                                    </option>
                                    {collectTypeData?.length &&
                                      collectTypeData?.map((option, index) => {
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
                                    {organizationDataErr.defaultCollectionType}
                                  </span>
                                </CCol>
                                <CCol lg={4} md={2} sm={3}>
                                  <CFormLabel htmlFor="nf-email">
                                    Payroll Type{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    value={organizationData.payrollTypes}
                                    onChange={(e) =>
                                      handleDropDown(
                                        "payrollTypes",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value={0}>
                                      Select Payroll Type
                                    </option>
                                    {payrollData?.length &&
                                      payrollData?.map((option, index) => {
                                        return (
                                          <option key={index} value={option.id}>
                                            {option.name}
                                          </option>
                                        );
                                      })}
                                  </CFormSelect>
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {organizationDataErr.payrollTypes}
                                  </p>
                                </CCol>
                                <CCol lg={4} md={2} sm={3}>
                                  <CFormLabel htmlFor="nf-email">
                                    Enforce Strict Timing{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    value={organizationData.enforceStrictTiming}
                                    onChange={(e) =>
                                      handleDropDown(
                                        "enforceStrictTiming",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option>
                                      Select Enforce Strict Timing
                                    </option>
                                    <option value={1} key={1}>
                                      Yes
                                    </option>
                                    <option value={2} key={2}>
                                      No
                                    </option>
                                  </CFormSelect>
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {organizationDataErr.enforceStrictTiming}
                                  </p>
                                </CCol>
                                <CCol lg={4} md={2} sm={3}>
                                  <CFormLabel htmlFor="nf-email">
                                    Enforce No-Due{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </CFormLabel>
                                  <CFormSelect
                                    size="sm"
                                    value={
                                      organizationData.enforceNoDueCollection
                                    }
                                    onChange={(e) =>
                                      handleDropDown(
                                        "enforceNoDueCollection",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option>
                                      Select Enforce No-Due{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </option>
                                    <option value={1} key={1}>
                                      Yes
                                    </option>
                                    <option value={2} key={2}>
                                      No
                                    </option>
                                  </CFormSelect>
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "x-small",
                                    }}
                                  >
                                    {organizationDataErr.enforceNoDueCollection}
                                  </p>
                                </CCol>
                              </>
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
                              disabled={isButtonDisabled}
onClick={() => {
    console.log("Save clicked");
    handleSubmit();
  }}                            >
                              {isId ? "Update" : "Save"}
                            </CButton>
                            <CButton
                              target="_blank"
                              style={{
                                border: 0,
                                backgroundColor: "lightslategrey",
                              }}
                              onClick={handleCancelOrg}
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
                <div className="organization__table">
                  <div className="organization__table__header">
                    <div className="organization__table__header__section">
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
                      <div className="buttons">
                        <button
                          onClick={handleCreateOrg}
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
                          Add Organization Unit
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
                    className="organization__table__body"
                    style={{ height: "70vh", overflowY: "scroll" }}
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
                  <div
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
                        activePage={activeNewPage ? activeNewPage : activePage}
                        itemsCountPerPage={newPageSize}
                        totalItemsCount={totalRecordsCount}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                      />
                    </div>
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

export default OrganizationList;
