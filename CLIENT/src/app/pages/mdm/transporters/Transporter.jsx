import React, { useState, useEffect } from "react";
import {
  CButton,
  CRow,
  CFormInput,
  CFormLabel,
  CCol,
  CTable,
  CForm,
  CFormSelect,
} from "@coreui/react";
import Confirm from "../../../components/confirmModal/confirm";
import {
  GetVehicles,
  DeleteVehicles,
  CreateVehicles,
  UpdateVehicles,
  UpdateContracts,
  CreateContracts,
  DeleteContracts,
  GetRouteMaster,
  GetTransporterContracts,
  GetTransporterVehicles
} from "../../../utils/apiCalls";
import "./Transporter1.scss";
import { IconButton } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import Header from "../../../components/header/Header";
import Select from "react-select";
import Loader from "../../../components/loader";
import moment from "moment";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const contractColumns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "route",
    label: "Route",
    _props: { scope: "col" },
  },
  {
    key: "vehicle",
    label: "Vehicle",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Start Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "End Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Payment Terms",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Payment Amount",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Add. Charge Type",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Add. Charge Amount",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const vehicleColumns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Registration No.",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Vehicle Type",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Capacity",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Model",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "FSSAI No.",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "FSSAI Exp.",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Insurance Exp",
    _props: { scope: "col" },
  },
  {
    key: "heading_8",
    label: "Food Transfer Vehicle",
    _props: { scope: "col" },
  },
  {
    key: "heading_9",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialContract = {
  routeId: "",
  vehicleId: "",
  startDate: "",
  endDate: "",
  payTerms: "",
  payAmount: "",
  addlChargeType: "",
  addlChargeAmount: "",
  isActive: "",
}

const initialVehicle = {
  make: "",
  registrationNumber: "",
  vehicleType: "",
  model: "",
  capacity: "",
  FSSAILicNo: "",
  FSSAILicExpiryDate: "",
  insurance: "",
  insuranceExpiryDate: "",
  isFoodTransferVehicle: "",
  isActive: "",
}

const Transporter = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const contractItems = [];
  const vehicleItems = [];
  const navigate = useNavigate();
  const selectedTransporterId = localStorage.getItem("selectedTransporterId");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermContract, setSearchTermContract] = useState("");
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [showContractConfirmModal, setShowContractConfirmModal] = useState(false);
  const [showContractConfirmModal1, setShowContractConfirmModal1] = useState(false);
  const [contractTableData, setContractTableData] = useState([]);
  const [isContractId, setIsContractId] = useState();
  const [contractData, setContractData] = useState(initialContract);
  const [contractDataErr, setContractDataErr] = useState(initialContract);
  const [isCreateContract, setIsCreateContract] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  useEffect(() => {
    if (userAuthData) {
      const TransporterPermissions = userAuthData?.permissions?.find(
        (val) => val?.Vehicles
      );
      setPermission(TransporterPermissions?.Vehicles);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  useEffect(() => {
    getContracts();
  }, [selectedTransporterId]);

  const getContracts = () => {
    setIsLoading(true); // Show the loading spinner
    GetTransporterContracts((res) => {
      // const { status, data, message } = res;
      if (res.status === 200) {
        setContractTableData(res.data);
        setFilteredDataContract(res.data);
        setIsLoading(false); // Hide the loading spinner
      } else if (res.status === 403) {
        setShowConfirmModal(false);
        setAlertText("You don't have access to perform this operation");
        setShowContractConfirmModal1(true);
        setIsLoading(false);
      } else if (res.status === 500) {
        setShowConfirmModal(false);
        setAlertText("Something wrong happened in API");
        setShowContractConfirmModal1(true);
        setIsLoading(false);
      } else if (res.message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowContractConfirmModal1(true);
        setSessionOk(true);
      }
    }, selectedTransporterId);
  };

  const [filteredDataContract, setFilteredDataContract] = useState([]);

  useEffect(() => {
    filterTableDataContract();
  }, [searchTermContract]);

  const filterTableDataContract = () => {
    if (searchTermContract === "") {
      setFilteredData(contractTableData);
    } else {
      const filteredDataContract = contractTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTermContract.toLowerCase())
        )
      );
      setFilteredDataContract(filteredDataContract);
    }
  };

  {
    filteredDataContract?.map((val, ind) => {
      contractItems.push({
        SlNo: ind + 1,
        id: val?.id,
        route: val?.routeId.RouteName,
        vehicle: val?.vehicleId.RegistrationNo,
        heading_1: moment(val?.startDate).format("YYYY-MM-DD") ?? " ",
        heading_2: moment(val?.endDate).format("YYYY-MM-DD") ?? " ",
        heading_3: val?.payTerms ?? " ",
        heading_4: val?.payAmount ?? " ",
        heading_5: val?.addlChargeType ?? " ",
        heading_6: val?.addlChargeAmount ?? " ",
        heading_7: (
          <div
            style={{
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
              onClick={() => handleContractEdit(val?.id)}
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
                handleContractDelete(val?.id);
              }}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
      });
    });
  }
  const handleTransport = () => {
    navigate("/transporters");
  };

  const validateContractFields = () => {
    let errObj = { ...initialContract };
    if (!contractData.routeId) {
      errObj.routeId = "This field is required";
    } else if (contractData.routeId == 0) {
      errObj.routeId = "This field is required";
    } else {
      errObj.routeId = "";
    }

    if (!contractData.vehicleId) {
      errObj.vehicleId = "This field is required";
    } else if (contractData.vehicleId == 0) {
      errObj.vehicleId = "This field is required";
    } else {
      errObj.vehicleId = "";
    }

    if (!contractData.startDate) {
      errObj.startDate = "This field is required";
    } else {
      errObj.startDate = "";
    }

    if (!contractData.endDate) {
      errObj.endDate = "This field is required";
    } else {
      errObj.endDate = "";
    }

    if (!contractData.payTerms) {
      errObj.payTerms = "This field is required";
    } else if (contractData.payTerms == 0) {
      errObj.payTerms = "This field is required";
    } else {
      errObj.payTerms = "";
    }

    if (!contractData.payAmount) {
      errObj.payAmount = "This field is required";
    } else {
      errObj.payAmount = "";
    }

    if (!contractData.addlChargeType) {
      errObj.addlChargeType = "This field is required";
    } else if (contractData.addlChargeType == 0) {
      errObj.addlChargeType = "This field is required";
    } else {
      errObj.addlChargeType = "";
    }

    if (!contractData.addlChargeAmount) {
      errObj.addlChargeAmount = "This field is required";
    } else {
      errObj.addlChargeAmount = "";
    }

    // if (!contractData.isActive) {
    //   errObj.isActive = "This field is required";
    // } else if (contractData.isActive !== 1 && contractData.isActive !== 0) {
    //   errObj.isActive = "This field is required";
    // } else {
    //   errObj.isActive = "";
    // }

    setContractDataErr((prev) => ({ ...prev, ...errObj }));
    const data = Object.values(errObj).every((x) => x === "" || x === null);
    return data;
  };

  const handleContractSubmit = (e) => {
    e.preventDefault();
    // if (validateContractFields()) {
      const selectedTransporterId = localStorage.getItem("selectedTransporterId");
      const payload = {
        transporterId: contractData?.transporterId || selectedTransporterId,
        routeId: Number(contractData?.routeId),
        // routeId: 1,
        vehicleId: Number(contractData?.vehicleId),
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        payTerms: contractData.payTerms,
        payAmount: Number(contractData.payAmount),
        addlChargeType: contractData.addlChargeType,
        addlChargeAmount: Number(contractData.addlChargeAmount),
        isActive: Number(contractData.isActive) === 0 ? false : true,
      };
      if (isContractId) {
        payload.id = isContractId;

        UpdateContracts((res) => {
          let { status, message } = res;
          if (status === 200) {
            getContracts();
            clearContractData();
            setAlertText(message);
            setShowContractConfirmModal1(true);
            setIsCreateContract(!isCreateContract);
            setContractData(initialContract);
          } else if (status === 403) {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowContractConfirmModal1(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowConfirmModal(false);
            setAlertText("Something wrong happened in API");
            setShowContractConfirmModal1(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowContractConfirmModal1(true);
            setSessionOk(true);
          }
        }, payload);
      } else {
        CreateContracts((res) => {
          let { status, message } = res;
          if (status === 200) {
            getContracts();
            clearContractData();
            setAlertText(message);
            setShowContractConfirmModal1(true);
            setIsCreateContract(!isCreateContract);
            setContractData(initialContract);
          } else if (status === 403) {
            setShowConfirmModal(false);
            setAlertText("You don't have access to perform this operation");
            setShowContractConfirmModal1(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowConfirmModal(false);
            setAlertText("Something wrong happened in API");
            setShowContractConfirmModal1(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowContractConfirmModal1(true);
            setSessionOk(true);
          }
        }, payload);
      }
    // }
  };

  const handleContractEdit = (id) => {
    setIsCreateContract(!isCreateContract);

    const selectedContract = contractTableData.find(
      (contract) => contract.id === id
    );
    // console.log(selectedContract);
    if (selectedContract) {
      setContractData({
        transporterId: selectedTransporterId || "",
        routeId: selectedContract?.routeId || "",
        vehicleId:
          contractTableData.find((vehicleId) => vehicleId.id === id)
            ?.vehicleId || "",
        startDate: moment(selectedContract.startDate).format("YYYY-MM-DD") || "",
        endDate: moment(selectedContract.endDate).format("YYYY-MM-DD") || "",
        payTerms: selectedContract.payTerms || "",
        payAmount: selectedContract.payAmount || "",
        addlChargeType: selectedContract.addlChargeType || "",
        addlChargeAmount: selectedContract.addlChargeAmount || "",
        isActive: selectedContract.isActive == true ? 1 : 0
      });
    }
    setIsContractId(
      contractTableData.find((contract) => contract.id === id)?.id
    );
  };

  const clearContractData = () => {
    setContractData(initialContract);
  }

  const handleOkContract = () => {
    const payload = {
      id: isContractId,
    };
    // console.log(payload);

    if (isContractId != null) {
      DeleteContracts((res) => {
        let { status, message, data } = res;
        if (status === 200) {
          getContracts();
          setIsContractId(null);
          setShowContractConfirmModal(false);
          setAlertText(message);
          setShowContractConfirmModal1(true);
        } else if (status === 403) {
          setShowConfirmModal(false);
          setAlertText("You don't have access to perform this operation");
          setShowContractConfirmModal1(true);
          setIsLoading(false);
        } else if (status === 500) {
          setShowConfirmModal(false);
          setAlertText("Something wrong happened in API");
          setShowContractConfirmModal1(true);
          setIsLoading(false);
        } else if (message.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowContractConfirmModal1(true);
          setSessionOk(true);
        }
      }, payload);
    }
  };

  const handleContractDelete = (id) => {
    setShowContractConfirmModal(true);
    setIsContractId(id);
    // console.log(id);
  };

  const handleInputChangeContract = (e) => {
    const { name, value } = e.target;
    setContractData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getDropDownRoutes();
    getDropDownVehicles();
  }, []);
  const [routes, setRoutes] = useState([]);

  const getDropDownRoutes = () => {
    GetRouteMaster((result) => {
      setRoutes(result.data);
    });
  };
  const [vehicles, setVehicles] = useState([]);
  const getDropDownVehicles = () => {
    GetVehicles((result) => {
      setVehicles(result.data);
    });
  };

  const handleContractDropdown = (name, value) => {
    setContractData((prev) => ({ ...prev, [name]: value }));
    // setContractDataErr((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelContract = () => {
    setIsCreateContract(!isCreateContract);
    clearContractData();
    setIsContractId(null);
    setContractDataErr(initialContract);
  };

  // VEHICLES
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleTableData, setVehicleTableData] = useState([]);
  const [isCreateVehicle, setIsCreateVehicle] = useState(false);
  const [isId, setIsId] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const [vehicleData, setVehicleData] = useState(initialVehicle);
  const [vehicleDataErr, setVehicleDataErr] = useState(initialVehicle);

  useEffect(() => {
    getVehicles();
    // console.log(selectedTransporterId)
  }, [selectedTransporterId]);

  const getVehicles = () => {
    setIsLoading(true); // Show the loading spinner
    const selectedTransporterId = localStorage.getItem("selectedTransporterId");
    GetTransporterVehicles((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setVehicleTableData(data);
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
    }, selectedTransporterId);
  };

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(vehicleTableData);
    } else {
      const filteredData = vehicleTableData.filter((item) =>
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
      vehicleItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.registrationNumber ? val?.registrationNumber : " ",
        heading_2: val?.vehicleType ? val?.vehicleType : " ",
        heading_3: val?.capacity ? val?.capacity : " ",
        heading_4: val?.model ? val?.model : " ",
        heading_5: val?.FSSAILicNo ? val?.FSSAILicNo : " ",
        heading_6: moment(val?.FSSAILicExpiryDate).format("YYYY-MM-DD") ?? " ",
        heading_7: moment(val?.insuranceExpiryDate).format("YYYY-MM-DD") ?? " ",
        heading_8:
          val?.isFoodTransferVehicle === true
            ? "Yes"
            : "No"
              ? val?.isFoodTransferVehicle === false
                ? "No"
                : "Yes"
              : " ",
        heading_9: (
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
              onClick={() => handleVehicleEdit(val?.id)}
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
                handleVehicleDelete(val?.id);
              }}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
      });
    });
  }

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateVehicle(isCreateVehicle);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleConfirmContract = () => {
    setShowContractConfirmModal1(false);
    setIsCreateContract(isCreateContract);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const validateVehicleFields = () => {
    let errObj = { ...initialVehicle };

    if (!vehicleData.make) {
      errObj.make = "This field is required";
    } else {
      errObj.make = "";
    }

    if (!vehicleData.registrationNumber) {
      errObj.registrationNumber = "This field is required";
    } else {
      errObj.registrationNumber = "";
    }

    if (!vehicleData.vehicleType) {
      errObj.vehicleType = "This field is required";
    } else if (vehicleData.vehicleType == 0) {
      errObj.vehicleType = "This field is required";
    } else {
      errObj.vehicleType = "";
    }

    if (!vehicleData.model) {
      errObj.model = "This field is required";
    } else {
      errObj.model = "";
    }

    if (!vehicleData.capacity) {
      errObj.capacity = "This field is required";
    } else {
      errObj.capacity = "";
    }

    if (!vehicleData.FSSAILicNo) {
      errObj.FSSAILicNo = "This field is required";
    } else {
      errObj.FSSAILicNo = "";
    }

    if (!vehicleData.FSSAILicExpiryDate) {
      errObj.FSSAILicExpiryDate = "This field is required";
    } else {
      errObj.FSSAILicExpiryDate = "";
    }

    if (!vehicleData.insurance) {
      errObj.insurance = "This field is required";
    } else {
      errObj.insurance = "";
    }

    if (!vehicleData.insuranceExpiryDate) {
      errObj.insuranceExpiryDate = "This field is required";
    } else {
      errObj.insuranceExpiryDate = "";
    }

    if (!vehicleData.isFoodTransferVehicle) {
      errObj.isFoodTransferVehicle = "This field is required";
    } else if (vehicleData.isFoodTransferVehicle == 0) {
      errObj.isFoodTransferVehicle = "This field is required";
    } else {
      errObj.isFoodTransferVehicle = "";
    }

    // if (!vehicleData.isActive) {
    //   errObj.isActive = "This field is required";
    // } else if (vehicleData.isActive !== 1 && vehicleData.isActive !== 0) {
    //   errObj.isActive = "This field is required";
    // } else {
    //   errObj.isActive = "";
    // }

    setVehicleDataErr((prev) => ({ ...prev, ...errObj }));
    const data = Object.values(errObj).every((x) => x === "" || x === null);
    return data;
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    if (validateVehicleFields()) {
      const selectedTransporterId = localStorage.getItem("selectedTransporterId");
      const payload = {
        transporterId: vehicleData.transporterId || selectedTransporterId,
        registrationNumber: vehicleData.registrationNumber,
        vehicleType: vehicleData.vehicleType,
        capacity: Number(vehicleData.capacity),
        model: vehicleData.model,
        make: vehicleData.make,
        FSSAILicNo: vehicleData.FSSAILicNo,
        FSSAILicExpiryDate: vehicleData.FSSAILicExpiryDate,
        insurance: vehicleData.insurance,
        insuranceExpiryDate: vehicleData.insuranceExpiryDate,
        isFoodTransferVehicle: Number(vehicleData.isFoodTransferVehicle) === 0 ? false : true,
        isActive: Number(vehicleData.isActive) === 0 ? false : true,
      };
      if (isId) {
        payload.id = isId;
        UpdateVehicles((res) => {
          let { status, data, message } = res;
          if (status === 200) {
            clearData();
            getVehicles();
            setIsId(null);
            setAlertText(message);
            setShowConfirmModal1(true);
            setIsCreateVehicle(!isCreateVehicle);
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
        CreateVehicles((res) => {
          let { status, data, message } = res;
          if (status === 200) {
            clearData();
            getVehicles();
            setIsId(null);
            setAlertText(message);
            setShowConfirmModal1(true);
            setIsCreateVehicle(!isCreateVehicle);
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
      setShowVehicleModal(false);
    }
  };

  const handleVehicleEdit = (id) => {
    setIsCreateVehicle(!isCreateVehicle);
    const selectedVehicle = vehicleTableData.find(
      (vehicle) => vehicle.id === id
    );
    if (selectedVehicle) {
      setVehicleData({
        transporterId: selectedVehicle.transporterId || "",
        registrationNumber: selectedVehicle.registrationNumber || "",
        vehicleType: selectedVehicle.vehicleType || "",
        capacity: Number(selectedVehicle.capacity) || "",
        model: selectedVehicle.model || "",
        make: selectedVehicle.make || "",
        FSSAILicNo: selectedVehicle.FSSAILicNo || "",
        FSSAILicExpiryDate:
          selectedVehicle.FSSAILicExpiryDate?.split("T")[0] || "",
        insurance: selectedVehicle.insurance || "",
        insuranceExpiryDate:
          selectedVehicle.insuranceExpiryDate?.split("T")[0] || "",
        isFoodTransferVehicle:
          selectedVehicle.isFoodTransferVehicle === true ? 1 : 0,
        isActive: selectedVehicle.isActive === true ? 1 : 0,
      });
    }
    setIsId(vehicleTableData.find((vehicle) => vehicle.id === id)?.id);
  };

  const clearData = () => {
    setVehicleData(initialVehicle);
  };

  const handleOk = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteVehicles((res) => {
        let { status, message } = res;
        if (status === 200) {
          getVehicles();
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

  const handleSearchContarct = (event) => {
    setSearchTermContract(event.target.value);
  };

  const handleVehicleDelete = (id) => {
    setShowConfirmModal(true);
    setIsId(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVehicleDropDown = (name, value) => {
    setVehicleData((prev) => ({ ...prev, [name]: value }));
    // setVehicleDataErr((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelVehicle = () => {
    setIsCreateVehicle(!isCreateVehicle);
    clearData();
    setIsId();
    setVehicleDataErr(initialVehicle);
  };

  const handleCreateContract = () => {
    setIsCreateContract(!isCreateContract);
  };

  const handleCreateVehicle = () => {
    setIsCreateVehicle(!isCreateVehicle);
    clearData();
  };

  return (
    <>
      {token ? <div className="transporter1">
        <div className="transporter1__container">
          <div className="transporter1__header">
            <div className="transporter1__header__section">
              <div className="transporter1__header__section__main">
                <h5>Company: Verka</h5>
                <h4>{`MDM - ${"Transporter"}`}</h4>
              </div>
              <div className="transporter1__header__section__bottom">
                <Header />
              </div>
            </div>
          </div>
          <div className="transporter1__header__section__logo">
            <IconButton onClick={handleTransport}>
              <img src={images} alt="back" />
            </IconButton>
          </div><br />
          <Tabs>
            <TabList>
              <Tab>Contract</Tab>
              <Tab>Vehicle</Tab>
            </TabList>
            <TabPanel>
              {isCreateContract ? (
                <>
                  <div className="Cbody">

                    <Paper
                      elevation={3}
                      style={{ background: "#d2e3fc", padding: "1vw" }}
                    >
                      <CForm method="post" onSubmit="">
                        <CRow>
                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Route{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>

                            <Select
                              name="routeId"
                              options={routes}
                              value={routes?.find(
                                (option) =>
                                  option.id === contractData.routeId
                              )}
                              onChange={(selectedOption) =>
                                handleContractDropdown("routeId", selectedOption?.id)
                              }
                              getOptionLabel={(option) => option.routeName}
                              getOptionValue={(option) => option.id}
                              isSearchable
                              placeholder="Select Route"
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  height: '32px',
                                  minHeight: '32px',
                                }),
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {contractDataErr.routeId}
                            </p>
                            {/* <CFormSelect
                              size="sm"
                              value={contractData.routeId}
                              onChange={(e) =>
                                handleContractDropdown(
                                  "routeId",
                                  e.target.value
                                )
                              }
                            >
                              <option value={0}>Select Route</option>
                              {routes?.length &&
                                routes?.map((option, index) => {
                                  return (
                                    <option key={index} value={option.id}>
                                      {option.routeName}
                                    </option>
                                  );
                                })}
                            </CFormSelect> */}

                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Vehicle{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>

                            <Select
                              name="vehicleId"
                              options={vehicles}
                              value={vehicles?.find(
                                (option) =>
                                  option.id === contractData.vehicleId
                              )}
                              onChange={(selectedOption) =>
                                handleContractDropdown("vehicleId", selectedOption?.id)
                              }
                              getOptionLabel={(option) => option.registrationNumber}
                              getOptionValue={(option) => option.id}
                              isSearchable
                              placeholder="Select Vehicle"
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  height: '32px',
                                  minHeight: '32px',
                                }),
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {contractDataErr.vehicleId}
                            </p>
                            {/* <CFormSelect
                                size="sm"
                                value={contractData.vehicleId}
                                onChange={(e) =>
                                  handleContractDropdown(
                                    "vehicleId",
                                    e.target.value
                                  )
                                }
                              >
                                <option value={0}>Select Vehicle</option>
                                {vehicles?.length &&
                                  vehicles?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.registrationNumber}
                                      </option>
                                    );
                                  })}
                              </CFormSelect> */}

                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Start Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              id="startDate"
                              name="startDate"
                              value={contractData.startDate}
                              onChange={handleInputChangeContract}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {contractDataErr.startDate}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              End Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              id="endDate"
                              name="endDate"
                              value={contractData.endDate}
                              onChange={handleInputChangeContract}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {contractDataErr.endDate}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Payment Term{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={contractData.payTerms}
                              onChange={(e) =>
                                handleContractDropdown(
                                  "payTerms",
                                  e.target.value
                                )
                              }
                            >
                              <option value={0}>Select Payment Term</option>
                              <option value={"Month Wise"} key={0}>
                                Month Wise
                              </option>
                              <option value={"Day Wise"} key={1}>
                                Day Wise
                              </option>
                              <option value={"Shift Wise"} key={0}>
                                Shift Wise
                              </option>
                              <option value={"KM Wise"} key={2}>
                                KM Wise
                              </option>
                            </CFormSelect>
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {contractDataErr.payTerms}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Payment Amount{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              id="payAmount"
                              name="payAmount"
                              value={contractData.payAmount}
                              onChange={handleInputChangeContract}
                              placeholder="Enter Payment Amount"
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {contractDataErr.payAmount}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Additional Charge Type{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={contractData.addlChargeType}
                              onChange={(e) =>
                                handleContractDropdown(
                                  "addlChargeType",
                                  e.target.value
                                )
                              }
                            >
                              <option value={0}>
                                Select Additional Charge Type
                              </option>
                              <option value={"Per Extra-KM"} key={0}>
                                Per Extra-KM
                              </option>
                              <option value={"Per Extra-Hours"} key={1}>
                                Per Extra-Hours
                              </option>
                            </CFormSelect>
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {contractDataErr.addlChargeType}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Additional Charge Amount{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              id="addlChargeAmount"
                              name="addlChargeAmount"
                              value={contractData.addlChargeAmount}
                              onChange={handleInputChangeContract}
                              placeHolder="Enter Additional Charge Amount"
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {contractDataErr.addlChargeAmount}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Status{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={contractData.isActive}
                              onChange={(e) =>
                                handleContractDropdown(
                                  "isActive",
                                  e.target.value
                                )
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
                              {contractDataErr.isActive}
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
                            onClick={handleContractSubmit}
                          >
                            {isContractId ? "Update" : "Save"}
                          </CButton>
                          <CButton
                            target="_blank"
                            style={{
                              border: 0,
                              backgroundColor: "lightslategrey",
                            }}
                            onClick={handleCancelContract}
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
                  <div className="transporter1__table">
                    <div className="transporter1__table__header">
                      <div className="transporter1__table__header__section">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          value={searchTermContract}
                          onChange={handleSearchContarct}
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
                          onClick={handleCreateContract}
                        >
                          Add Contract
                        </button>
                      </div>
                    </div>
                    <div
                      className="transporter1__table__body"
                      style={{ height: "50vh", width: "102%", overflowY: "scroll" }}
                    >
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <CTable
                          columns={contractColumns}
                          items={contractItems}
                          hover
                          className="striped-table"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

            </TabPanel>
            <TabPanel>
              {isCreateVehicle ? (
                <>
                  <div className="Cbody">
                    <Paper
                      elevation={3}
                      style={{ background: "#d2e3fc", padding: "1vw" }}
                    >
                      <CForm method="post" onSubmit="">
                        <CRow>
                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Vehicle Make{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              id="make"
                              name="make"
                              value={vehicleData.make}
                              onChange={handleInputChange}
                              placeholder="Describe Vehile Make"
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.make}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Registration No.{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              id="registrationNumber"
                              name="registrationNumber"
                              value={vehicleData.registrationNumber}
                              onChange={handleInputChange}
                              placeholder="Enter Vehicle reg. no"
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.registrationNumber}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Vehicle Type{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={vehicleData.vehicleType}
                              onChange={(e) =>
                                handleVehicleDropDown(
                                  "vehicleType",
                                  e.target.value
                                )
                              }
                            >
                              <option value={0}>Select Vechile Type</option>
                              <option value={"LCV"} key={0}>
                                LCV
                              </option>
                              <option value={"Tranker"} key={1}>
                                Tranker
                              </option>
                            </CFormSelect>
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.vehicleType}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Vehicle Model{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              id="model"
                              name="model"
                              value={vehicleData.model}
                              onChange={handleInputChange}
                              placeholder="Enter Vehicle Model"
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.model}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Capacity{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              id="capacity"
                              name="capacity"
                              value={vehicleData.capacity}
                              onChange={handleInputChange}
                              placeholder="Enter Vehicle Capacity"
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.capacity}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              FSSAI Lic No.{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              id="FSSAILicNo"
                              name="FSSAILicNo"
                              value={vehicleData.FSSAILicNo}
                              onChange={handleInputChange}
                              placeholder="Enter FSSAI Lic No."
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.FSSAILicNo}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              FSSAI Expiry Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              id="FSSAILicExpiryDate"
                              name="FSSAILicExpiryDate"
                              value={vehicleData.FSSAILicExpiryDate}
                              onChange={handleInputChange}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.FSSAILicExpiryDate}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Insurance No.{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="text"
                              id="insurance"
                              name="insurance"
                              placeholder="Enter Insurance Number"
                              value={vehicleData.insurance}
                              onChange={handleInputChange}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.insurance}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Insurance Exp Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="date"
                              id="insuranceExpiryDate"
                              name="insuranceExpiryDate"
                              value={vehicleData.insuranceExpiryDate}
                              onChange={handleInputChange}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.insuranceExpiryDate}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Is Food Transfer Vehicle{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={vehicleData.isFoodTransferVehicle}
                              onChange={(e) =>
                                handleVehicleDropDown(
                                  "isFoodTransferVehicle",
                                  e.target.value
                                )
                              }
                            >
                              <option value={0} key={0}>Select Food Transport Vehicle</option>
                              <option value={1} key={1}>
                                YES
                              </option>
                              <option value={0} key={2}>
                                NO
                              </option>
                            </CFormSelect>
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {vehicleDataErr.isFoodTransferVehicle}
                            </p>
                          </CCol>

                          <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                            <CFormLabel
                              style={{ fontSize: "0.9vw", marginBottom: "0" }}
                            >
                              Status{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={vehicleData.isActive}
                              onChange={(e) =>
                                handleVehicleDropDown(
                                  "isActive",
                                  e.target.value
                                )
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
                              {vehicleDataErr.isActive}
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
                            onClick={handleVehicleSubmit}
                          >
                            {isId ? "Update" : "Save"}
                          </CButton>
                          <CButton
                            target="_blank"
                            style={{
                              border: 0,
                              backgroundColor: "lightslategrey",
                            }}
                            onClick={handleCancelVehicle}
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
                  <div className="transporter1__table">
                    <div className="transporter1__table__header">
                      <div className="transporter1__table__header__section">
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
                          disabled={!hasPermission("Create")}
                          title={
                            !hasPermission("Create")
                              ? "No permission to Create"
                              : ""
                          }
                          className={
                            hasPermission("Create") ? "" : "disabled-button"
                          }
                          onClick={handleCreateVehicle}
                        >
                          Add Vehicle
                        </button>
                      </div>
                    </div>
                    <div
                      className="transporter1__table__body"
                      style={{ height: "50vh", overflowY: "scroll" }}
                    >
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <CTable
                          columns={vehicleColumns}
                          items={vehicleItems}
                          hover
                          className="striped-table"
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabPanel>
          </Tabs>
          {showContractConfirmModal && (
            <Confirm
              buttonText={"OK"}
              isCancelRequired={true}
              confirmTitle={"Are you sure ?"}
              onConfirm={handleOkContract}
              onCancel={() => {
                setShowContractConfirmModal(false);
              }}
            />
          )}
          {showContractConfirmModal1 && (
            <Confirm
              buttonText={"OK"}
              isCancelRequired={false}
              confirmTitle={alertText}
              onConfirm={() => {
                handleConfirmContract();
              }}
              onCancel={() => {
                setShowContractConfirmModal1(false);
                setSessionOk(true);
              }}
            />
          )}

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
      </div> : <Navigate to={"/"} />}
    </>
  );
};

export default Transporter;
