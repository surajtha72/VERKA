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
import "./RoutesList.scss";
import {
  CreateRouteMaster,
  CreateRouteType,
  DeleteRouteMaster,
  DeleteRouteType,
  GetDropDownOrganization,
  GetDropDownOrganizationTypes,
  GetDropDownOrganizationTypes1,
  GetOrganization1,
  GetRouteMaster,
  GetRouteType,
  UpadteRouteMaster,
  UpadteRouteType,
} from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import RouteStop from "./RoutesStop";
import { Paper } from "@mui/material";
import Header from "../../../components/header/Header";
import Loader from "../../../components/loader";
import * as XLSX from "xlsx";
import download from "../../../../assets/images/icons/download.png";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const routeMaster = [
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
    label: "Route Code",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Route Owner",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Morning Shift",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Evening Shift",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Actions",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Stops",
    _props: { scope: "col" },
  },
];

const routeType = [
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
    label: "From Proc Unit",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "To Proc Unit",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Vechile Type",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialRouteType = {
  shortDescription: "",
  fromProc: null,
  toProc: null,
  vehicleType: "",
};

const initialRouteMaster = {
  routeTypeId: null,
  routeOwner: null,
  routeName: "",
  routeCode: "",
  tripType: null,
  mrngShiftTime: "",
  evngShifTime: "",
};

const RoutesList = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const items1 = [];
  const items2 = [];
  const excelitem = [];
  const [searchTermType, setSearchTermType] = useState("");
  const [searchTermMaster, setSearchTermMaster] = useState("");
  const [isCreateRoutesMaster, setIsCreateRoutesMaster] = useState(false);
  const [isEditRoutesMaster, setIsEditRoutesMaster] = useState(false);
  const [isCreateRoutesType, setIsCreateRoutesType] = useState(false);
  const [isEditRoutesType, setIsEditRoutesType] = useState(false);
  const [routeTypeData, setRouteTypeData] = useState(initialRouteType);
  const [routeTypeDataErr, setRouteTypeDataErr] = useState(initialRouteType);
  const [routeMasterData, setRouteMasterData] = useState(initialRouteMaster);
  const [routeMasterDataErr, setRouteMasterDataErr] = useState(initialRouteMaster);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [showConfirmModal2, setShowConfirmModal2] = useState(false);
  const [isId, setIsId] = useState();
  const [fromDropDownData, setFromDropDownData] = useState([]);
  const [routeTypeDropDownData, setRouteTypeDropDownData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [toDropDownData, setToDropDownData] = useState([]);
  const [routeOwnerDropDownData, setRouteOwnerDropDownData] = useState([]);
  const [routeMasterTableData, setRouteMasterTableData] = useState([]);
  const [routeTypeTableData, setRouteTypeTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataMaster, setFilteredDataMaster] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isRoute, setIsRoute] = useState(false);

  const [dropdownOrganization, setDropdownOrganization] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  const navigateToRouteStop = (id) => {
    localStorage.setItem("selectRouteMasterId", id);
    setSelectedRouteId(id);
    setIsRoute(true);
  };


  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "RouteMaster_data.xlsx");
  };

  useEffect(() => {
    if (userAuthData) {
      const RouteMasterPermissions = userAuthData?.permissions?.find(
        (val) => val?.RouteMaster
      );
      // console.log(RouteMasterPermissions?.RouteMaster);
      setPermission(RouteMasterPermissions?.RouteMaster);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  // console.log('Read',hasPermission("Read"));
  // console.log('Create',hasPermission("Create"));
  // console.log('Update',hasPermission("Update"));
  // console.log('Delete',hasPermission("Delete"));

  useEffect(() => {
    getRouteTypeData();
    handleFromData();
    getRouteData();
    getRouteMasterData();
  }, []);

  useEffect(() => {
    getOrganizationData();
  }, [selectedOption]);

  const handleFromData = () => {
    const selectedOption = true;
    GetDropDownOrganizationTypes1((res) => {
      setFromDropDownData(res.data);
    }, selectedOption);
  };

  const getOrganizationData = () => {
    const selected = localStorage.getItem("selectedOption");
    setSelectedOption(selected);
    GetOrganization1((res) => {
      setRouteOwnerDropDownData(res.data);
    }, selectedOption);
  };

  let selectedId = parseInt(localStorage.getItem("selectedOption1"));

  useEffect(() => {
    handleToData();
  }, [selectedId]);

  const handleToData = () => {
    GetDropDownOrganizationTypes((res) => {
      if (selectedId) {
        res.data?.map((val) => { });
        const filteredData = res.data?.filter((val) => val.id !== selectedId);
        setToDropDownData(filteredData);
      } else {
        setToDropDownData(res.data);
      }
    });
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

  const getRouteMasterData = () => {
    setIsLoading(true); // Show the loading spinner
    GetRouteMaster(
      (res) => {
        let { status, data, message } = res;
        if (status === 200) {
          setRouteMasterTableData(data);
          setFilteredDataMaster(data);
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

  const getRouteTypeData = () => {
    setIsLoading(true); // Show the loading spinner
    GetRouteType((res) => {
      let { status, data, message } = res;
      if (res.status === 200) {
        setRouteTypeTableData(res.data);
        setFilteredData(res.data);
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

  const getRouteData = () => {
    GetRouteType((res) => {
      setRouteTypeDropDownData(res.data);
    });
  };

  useEffect(() => {
    filterTableData();
  }, [searchTermType]);

  const filterTableData = () => {
    if (searchTermType === "") {
      setFilteredData(routeTypeTableData);
    } else {
      const filteredData = routeTypeTableData?.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTermType.toLowerCase())
        )
      );
      setFilteredData(filteredData);
    }
  };

  {
    filteredData?.map((val, ind) => {
      items2.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.shortDescription ? val?.shortDescription : "--",
        heading_2: val?.fromProcUnitTypeName ? val?.fromProcUnitTypeName : "--",
        heading_3: val?.toProcOrgUnitTypeName
          ? val?.toProcOrgUnitTypeName
          : "--",
        heading_4: val?.vehicleType ? val?.vehicleType : "--",
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
      });
    });
  }

  useEffect(() => {
    filterTableDataMaster();
  }, [searchTermMaster]);

  const filterTableDataMaster = () => {
    if (searchTermMaster === "") {
      setFilteredDataMaster(routeMasterTableData);
    } else {
      const filteredDataMaster = routeMasterTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTermMaster.toLowerCase())
        )
      );
      setFilteredDataMaster(filteredDataMaster);
    }
  };
  {
    filteredDataMaster?.map((val, ind) => {
      const slNo = ind + 1;
      items1.push({
        SlNo: slNo,
        id: val?.id,
        heading_1: val?.routeName ? val?.routeName : "--",
        heading_2: val?.routeCode ? val?.routeCode : "--",
        heading_3: val?.routeOwnerName ? val?.routeOwnerName : "--",
        heading_4: val?.morningShiftSchTime ? val?.morningShiftSchTime : "--",
        heading_5: val?.eveningShiftSchTime ? val?.eveningShiftSchTime : "--",
        heading_6: (
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
              onClick={() => handleEditMaster(val?.id)}
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
              onClick={() => handleDeleteMaster(val?.id)}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
        heading_7: (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Link to={`/route-stop`}>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  navigateToRouteStop(val?.id);
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
        'Route Name': val?.routeName ? val?.routeName : "--",
        'Route Code': val?.routeCode ? val?.routeCode : "--",
        'Route Owner': val?.routeOwnerName ? val?.routeOwnerName : "--",
        'Morning Shift': val?.morningShiftSchTime ? val?.morningShiftSchTime : "--",
        'Evening Shift': val?.eveningShiftSchTime ? val?.eveningShiftSchTime : "--",
      });
    });
  }

  const handleSearch = (event) => {
    setSearchTermType(event.target.value);
  };
  const handleSearchMaster = (event) => {
    setSearchTermMaster(event.target.value);
  };

  const handleCreateRouteMaster = () => {
    setIsCreateRoutesMaster(!isCreateRoutesMaster);
    setIsEditRoutesMaster(false);
    clearRouteMaster();
  };

  const handleCreateRouteType = () => {
    setIsCreateRoutesType(!isCreateRoutesType);
    setIsEditRoutesType(false);
  };

  const handleCancelRouteType = () => {
    setIsCreateRoutesType(!isCreateRoutesType);
    setIsEditRoutesType(false);
    clearRouteType();
  };

  const handleCancelRouteMaster = () => {
    setIsCreateRoutesMaster(!isCreateRoutesMaster);
    setIsEditRoutesMaster(false);
    clearRouteType();
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRouteTypeData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRouteTypeDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
    setRouteMasterData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRouteMasterDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDropDown = (name, value) => {
    setRouteTypeData((prev) => ({ ...prev, [name]: value }));
    setRouteTypeDataErr((prev) => ({ ...prev, [name]: "" }));
    setRouteMasterData((prev) => ({ ...prev, [name]: value }));
    setRouteMasterDataErr((prev) => ({ ...prev, [name]: "" }));
    // console.log(routeMasterData)
  };

  const clearRouteType = () => {
    setRouteTypeData(initialRouteType);
    setRouteTypeDataErr(initialRouteType);
    setIsId(null);
  };

  const clearRouteMaster = () => {
    setRouteMasterData(initialRouteMaster);
    setRouteMasterDataErr(initialRouteMaster);
    setIsId(null);
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateRoutesType(isCreateRoutesType);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const validateFields = () => {
    let errObj = { ...initialRouteType };
    if (!routeTypeData.shortDescription) {
      errObj.shortDescription = "This field is required";
    } else {
      errObj.shortDescription = "";
    }
    if (!routeTypeData.fromProc) {
      errObj.fromProc = "This field is required";
    } else if (routeTypeData.fromProc == 0) {
      errObj.fromProc = "This field is required";
    } else {
      errObj.fromProc = "";
    }
    if (!routeTypeData.toProc) {
      errObj.toProc = "This field is required";
    } else if (routeTypeData.toProc == 0) {
      errObj.toProc = "This field is required";
    } else {
      errObj.toProc = "";
    }
    if (!routeTypeData.vehicleType) {
      errObj.vehicleType = "This field is required";
    } else if (routeTypeData.vehicleType == 0) {
      errObj.vehicleType = "This field is required";
    } else {
      errObj.vehicleType = "";
    }
    setRouteTypeDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleRouteType = () => {
    if (validateFields()) {
      const payload = {
        shortDescription: routeTypeData.shortDescription,
        fromProcUnitType: Number(routeTypeData.fromProc),
        toProcOrgUnitType: Number(routeTypeData.toProc),
        vehicleType: routeTypeData.vehicleType,
      };
      if (isId) {
        payload.id = isId;
        UpadteRouteType((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearRouteType();
            getRouteTypeData();
            setIsId(null);
            setIsCreateRoutesType(!isCreateRoutesType);
            setIsEditRoutesType(false);
            setAlertText(message);
            setRouteTypeData(initialRouteType);
            setRouteTypeDataErr(initialRouteType);
            setShowConfirmModal1(true);
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
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          }
        }, payload);
      } else {
        CreateRouteType((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearRouteType();
            getRouteTypeData();
            setIsId(null);
            setIsCreateRoutesType(!isCreateRoutesType);
            setIsEditRoutesType(false);
            setAlertText(message);
            setRouteTypeData(initialRouteType);
            setRouteTypeDataErr(initialRouteType);
            setShowConfirmModal1(true);
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
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          }
        }, payload);
      }
    }
  };

  const handleEdit = (id) => {
    setIsCreateRoutesType(!isCreateRoutesType);
    setIsEditRoutesType(true);
    const payload = {
      id: routeTypeTableData.find((role) => role.id === id)?.id,
    };
    setRouteTypeData(
      {
        shortDescription: routeTypeTableData.find((role) => role.id === id)
          ?.shortDescription,
        fromProc: routeTypeTableData.find((role) => role.id === id)
          ?.fromProcUnitType,
        toProc: routeTypeTableData.find((role) => role.id === id)
          ?.toProcOrgUnitType,
        vehicleType: routeTypeTableData.find((role) => role.id === id)
          ?.vehicleType,
      },
      payload
    );
    setIsId(routeTypeTableData.find((role) => role.id === id)?.id);
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
      DeleteRouteType((res) => {
        let { status, message } = res;
        if (status === 200) {
          getRouteTypeData();
          setIsId(null);
          setShowConfirmModal(false);
          setAlertText(message);
          setShowConfirmModal1(true);
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
        } else if (message.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModal1(true);
          setSessionOk(true);
        }
      }, payload);
    }
  };

  const validateMasterFields = () => {
    let errObj = { ...initialRouteMaster };
    if (!routeMasterData.routeTypeId) {
      errObj.routeTypeId = "This field is required";
    } else if (routeMasterData.routeTypeId == 0) {
      errObj.routeTypeId = "This field is required";
    } else {
      errObj.routeTypeId = "";
    }
    if (!routeMasterData.routeOwner) {
      errObj.routeOwner = "This field is required";
    } else if (routeMasterData.routeOwner == 0) {
      errObj.routeOwner = "This field is required";
    } else {
      errObj.routeOwner = "";
    }
    if (!routeMasterData.routeName) {
      errObj.routeName = "This field is required";
    } else {
      errObj.routeName = "";
    }
    if (!routeMasterData.routeCode) {
      errObj.routeCode = "This field is required";
    } else {
      errObj.routeCode = "";
    }
    if (!routeMasterData.tripType) {
      errObj.tripType = "This field is required";
    } else if (routeMasterData.tripType == 0) {
      errObj.tripType = "This field is required";
    } else {
      errObj.tripType = "";
    }
    if (!routeMasterData.mrngShiftTime) {
      errObj.mrngShiftTime = "This field is required";
    } else {
      errObj.mrngShiftTime = "";
    }
    if (!routeMasterData.evngShifTime) {
      errObj.evngShifTime = "This field is required";
    } else {
      errObj.evngShifTime = "";
    }
    setRouteMasterDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleRouteMaster = () => {
    if (validateMasterFields()) {
      const payload = {
        routeTypeId: Number(routeMasterData.routeTypeId),
        routeOwner: Number(routeMasterData.routeOwner),
        routeName: routeMasterData.routeName,
        routeCode: routeMasterData.routeCode,
        tripType: routeMasterData.tripType,
        morningShiftSchTime: routeMasterData.mrngShiftTime,
        eveningShiftSchTime: routeMasterData.evngShifTime,
      };
      if (isId) {
        payload.id = isId;
        UpadteRouteMaster((res) => {
          // console.log(res);
          let { status, message } = res;
          if (status === 200) {
            clearRouteMaster();
            getRouteMasterData();
            setIsId(null);
            setIsCreateRoutesMaster(!isCreateRoutesMaster);
            setIsEditRoutesMaster(false);
            setAlertText(message);
            setRouteTypeData(initialRouteType);
            setRouteTypeDataErr(initialRouteType);
            setShowConfirmModal1(true);
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
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          } else if (status === 422) {
            setShowConfirmModal(false);
            setAlertText(message);
            setShowConfirmModal1(true);
          }
        }, payload);
      } else {
        CreateRouteMaster((res) => {
          // console.log(res);
          let { status, message } = res;
          if (status === 200) {
            clearRouteMaster();
            getRouteMasterData();
            setIsId(null);
            setIsCreateRoutesMaster(!isCreateRoutesMaster);
            setIsEditRoutesMaster(false);
            setAlertText(message);
            setRouteTypeData(initialRouteType);
            setRouteTypeDataErr(initialRouteType);
            setShowConfirmModal1(true);
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
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
          } else if (status === 422) {
            setShowConfirmModal(false);
            setAlertText(message);
            setShowConfirmModal1(true);
          }
        }, payload);
      }
    }
  };

  const handleEditMaster = (id) => {
    setIsCreateRoutesMaster(!isCreateRoutesMaster);
    setIsEditRoutesMaster(true);
    const payload = {
      id: routeMasterTableData.find((role) => role.id === id)?.id,
    };
    setRouteMasterData(
      {
        routeTypeId: routeMasterTableData.find((role) => role.id === id)
          ?.routeTypeId,
        routeOwner: routeMasterTableData.find((role) => role.id === id)
          ?.routeOwnerId,
        routeName: routeMasterTableData.find((role) => role.id === id)
          ?.routeName,
        routeCode: routeMasterTableData.find((role) => role.id === id)
          ?.routeCode,
        tripType: routeMasterTableData.find((role) => role.id === id)?.tripType,
        mrngShiftTime: routeMasterTableData.find((role) => role.id === id)
          ?.morningShiftSchTime,
        evngShifTime: routeMasterTableData.find((role) => role.id === id)
          ?.eveningShiftSchTime,
      },
      payload
    );
    setIsId(routeMasterTableData.find((role) => role.id === id)?.id);
  };

  const handleDeleteMaster = (id) => {
    setShowConfirmModal2(true);
    setIsId(id);
  };

  const handleOkMaster = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteRouteMaster((res) => {
        let { status, message } = res;
        if (status === 200) {
          getRouteMasterData();
          setIsId(null);
          setShowConfirmModal2(false);
          setAlertText(message);
          setShowConfirmModal1(true);
        } else if (status === 403) {
          setShowConfirmModal2(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModal1(true);
          // setIsLoading(false);
        } else if (status === 500) {
          setShowConfirmModal2(false);
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

  return (
    <>
      {token ? (
        <>
          {isRoute ? (
            <CButton
              style={{ position: "absolute", right: 10, top: 50 }}
              onClick={() => setIsRoute(!isRoute)}
            >
              Back
            </CButton>
          ) : null}
          {isRoute ? (
            <RouteStop selectedRouteId={selectedRouteId} />
          ) : (
            <div className="routes">
              <div className="routes__container">
                <div className="routes__header">
                  <div className="routes__header__section">
                    <div className="routes__header__section__main">
                      <h5>Company: Verka</h5>
                      <h4>{`MDM - ${isCreateRoutesType ? "Create Route Type" : "Route Type"
                        }`}</h4>
                    </div>
                    <div className="routes__header__section__bottom">
                      <Header />
                    </div>
                  </div>
                </div>
                <Tabs>
                  <TabList>
                    <Tab>Route Master</Tab>
                    <Tab>Route Type</Tab>
                  </TabList>
                  <TabPanel>
                    {isCreateRoutesMaster ? (
                      <>
                        <div className="Cbody">
                          <Paper elevation={3}>
                            <div className="container">
                              <div>
                                <CForm method="post">
                                  <CRow>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Route Type{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>
                                      <CFormSelect
                                        size="sm"
                                        value={routeMasterData.routeTypeId}
                                        onChange={(e) =>
                                          handleDropDown(
                                            "routeTypeId",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value={0}>
                                          Select Route Type{" "}
                                        </option>
                                        {routeTypeDropDownData?.length &&
                                          routeTypeDropDownData?.map(
                                            (option, index) => {
                                              return (
                                                <option
                                                  key={index}
                                                  value={option.id}
                                                >
                                                  {option.shortDescription}
                                                </option>
                                              );
                                            }
                                          )}
                                      </CFormSelect>
                                      <p
                                        style={{
                                          color: "red", fontSize: "x-small",
                                        }}
                                      >
                                        {routeMasterDataErr.routeTypeId}
                                      </p>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Route Owner{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>

                                      <CFormSelect
                                        size="sm"
                                        value={routeMasterData?.routeOwner}
                                        onChange={(e) => {
                                          handleDropDown(
                                            "routeOwner",
                                            e.target.value
                                          )
                                          // console.log(e.target.value)
                                        }
                                        }
                                      >
                                        <option value={0}>
                                          Select Route Owner
                                        </option>
                                        {dropdownOrganization?.length &&
                                          dropdownOrganization?.map(
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
                                      <p
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeMasterDataErr.routeOwner}
                                      </p>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Route Name{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        type="Name"
                                        value={routeMasterData.routeName}
                                        onChange={handleInput}
                                        name="routeName"
                                        placeholder="Enter Route Name.."
                                      />
                                      <p
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeMasterDataErr.routeName}
                                      </p>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Route Code{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        type="Name"
                                        value={routeMasterData.routeCode}
                                        onChange={handleInput}
                                        name="routeCode"
                                        placeholder="Enter Route Code.."
                                      />
                                      <p
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeMasterDataErr.routeCode}
                                      </p>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Trip Type{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>

                                      <CFormSelect
                                        size="sm"
                                        value={routeMasterData.tripType}
                                        onChange={(e) =>
                                          handleDropDown(
                                            "tripType",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value={0}>
                                          Select Trip Type
                                        </option>
                                        <option value={"Shift-Wise"} key={1}>
                                          Shift-Wise
                                        </option>
                                        <option value={"Day-Wise"} key={2}>
                                          Day-Wise
                                        </option>
                                      </CFormSelect>
                                      <p
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeMasterDataErr.tripType}
                                      </p>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Morning Shift Time{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>

                                      <CFormInput
                                        type="time"
                                        step={1}
                                        value={routeMasterData.mrngShiftTime}
                                        onChange={handleInput}
                                        name="mrngShiftTime"
                                        placeholder="Enter Morning Shift Time.."
                                      />
                                      <p
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeMasterDataErr.mrngShiftTime}
                                      </p>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Evening Shift Time{" "}
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>

                                      <CFormInput
                                        type="time"
                                        step={1}
                                        value={routeMasterData.evngShifTime}
                                        onChange={handleInput}
                                        name="evngShifTime"
                                        placeholder="Enter Evening Shift Time.."
                                      />
                                      <p
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeMasterDataErr.evngShifTime}
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
                                      onClick={handleRouteMaster}
                                    >
                                      {isEditRoutesMaster ? "Update" : "Save"}
                                    </CButton>
                                    <CButton
                                      target="_blank"
                                      style={{
                                        border: 0,
                                        backgroundColor: "lightslategrey",
                                      }}
                                      onClick={handleCancelRouteMaster}
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
                        <div className="routes__table">
                          <div className="routes__table__header">
                            <div className="routes__table__header__section">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={searchTermMaster}
                                onChange={handleSearchMaster}
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
                                    e.target.value[
                                    e.target.value.length - 1
                                    ] === " "
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <div className="buttons">
                                <button
                                  onClick={handleCreateRouteMaster}
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
                                  Add Route Master
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
                            className="routes__table__body"
                            style={{ height: "50vh", overflowY: "scroll" }}
                          >
                            {isLoading ? (
                              <Loader />
                            ) : (
                              <CTable
                                columns={routeMaster}
                                items={items1}
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
                                  handleItemsPerPageChange(
                                    parseInt(e.target.value)
                                  )
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
                  </TabPanel>
                  <TabPanel>
                    {isCreateRoutesType ? (
                      <>
                        <div className="Cbody">
                          <Paper elevation={3}>
                            <div className="container">
                              <div>
                                <CForm method="post">
                                  <CRow>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Route Name
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>
                                      <CFormInput
                                        size="sm"
                                        type="Name"
                                        value={routeTypeData.shortDescription}
                                        onChange={handleInput}
                                        name="shortDescription"
                                        placeholder="Enter Route Name.."
                                        onInput={(e) => {
                                          e.target.value =
                                            e.target.value.replace(
                                              /[^A-Za-z]/g,
                                              ""
                                            );
                                        }}
                                      />
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeTypeDataErr.shortDescription}
                                      </span>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        Vechile Type
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>

                                      <CFormSelect
                                        size="sm"
                                        value={routeTypeData.vehicleType}
                                        onChange={(e) =>
                                          handleDropDown(
                                            "vehicleType",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value={0}>
                                          Select Vechile Type
                                        </option>
                                        <option value={"LCV"} key={0}>
                                          LCV
                                        </option>
                                        <option value={"Tranker"} key={1}>
                                          Tranker
                                        </option>
                                      </CFormSelect>
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeTypeDataErr.vehicleType}
                                      </span>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        From Proc Type
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>

                                      <CFormSelect
                                        size="sm"
                                        value={routeTypeData.fromProc}
                                        onChange={(e) => {
                                          handleDropDown(
                                            "fromProc",
                                            e.target.value
                                          );
                                          localStorage.setItem(
                                            "selectedOption1",
                                            e.target.value
                                          );
                                        }}
                                      >
                                        <option value={0}>
                                          Select From Proc Type
                                        </option>
                                        {fromDropDownData?.length &&
                                          fromDropDownData?.map(
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
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeTypeDataErr.fromProc}
                                      </span>
                                    </CCol>
                                    <CCol lg={6}>
                                      <CFormLabel htmlFor="nf-email">
                                        To Proc Type
                                        <span style={{ color: "red" }}>*</span>
                                      </CFormLabel>

                                      <CFormSelect
                                        size="sm"
                                        value={routeTypeData.toProc}
                                        onChange={(e) => {
                                          handleDropDown(
                                            "toProc",
                                            e.target.value
                                          );
                                          localStorage.setItem(
                                            "selectedOption",
                                            e.target.value
                                          );
                                        }}
                                      >
                                        <option value={0}>
                                          Select To Proc Type
                                        </option>
                                        {toDropDownData?.length &&
                                          toDropDownData?.map(
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
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "x-small",
                                        }}
                                      >
                                        {routeTypeDataErr.toProc}
                                      </span>
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
                                      onClick={handleRouteType}
                                    >
                                      {isEditRoutesType ? "Update" : "Save"}
                                    </CButton>
                                    <CButton
                                      target="_blank"
                                      style={{
                                        border: 0,
                                        backgroundColor: "lightslategrey",
                                      }}
                                      onClick={handleCancelRouteType}
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
                        <div className="routes__table">
                          <div className="routes__table__header">
                            <div className="routes__table__header__section">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={searchTermType}
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
                                    e.target.value[
                                    e.target.value.length - 1
                                    ] === " "
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <button
                                onClick={handleCreateRouteType}
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
                                Add Route Type
                              </button>
                            </div>
                          </div>
                          <div
                            className="routes__table__body"
                            style={{ height: "50vh", overflowY: "scroll" }}
                          >
                            {isLoading ? (
                              <Loader />
                            ) : (
                              <CTable
                                columns={routeType}
                                items={items2}
                                hover
                                className="striped-table"
                              />
                            )}
                          </div>
                          {/* <div
                            style={{
                              marginTop: "0.8vw",
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
                  </TabPanel>

                </Tabs>
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
              {showConfirmModal2 && (
                <Confirm
                  buttonText={"OK"}
                  isCancelRequired={true}
                  confirmTitle={"Are you sure ?"}
                  onConfirm={() => {
                    handleOkMaster();
                  }}
                  onCancel={() => {
                    setShowConfirmModal2(false);
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

export default RoutesList;
