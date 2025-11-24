import React, { useState, useEffect } from "react";
import {
  CModal,
  CModalHeader,
  CButton,
  CModalTitle,
  CRow,
  CModalBody,
  CFormInput,
  CFormLabel,
  CTable,
  CCol,
  CForm,
  CFormSelect,
} from "@coreui/react";
import {
  CreateDistrict,
  CreateState,
  CreateTalukas,
  DeleteDistrict,
  DeleteStates,
  DeleteTalukas,
  GetDropDownDistrict,
  GetDropDownState,
  GetTalukas,
  UpdateDistrict,
  UpdateStates,
  UpdateTalukas,
  GetDistricts,
} from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import "./States.scss";
import { Paper } from "@mui/material";
import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import Header from "../../../components/header/Header";
import Loader from "../../../components/loader";
import { useNavigate } from "react-router-dom";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const stateColumns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "State",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "State Code",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const districtColumns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },

  {
    key: "heading_1",
    label: "State",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "District",
    _props: { scope: "col" },
  },

  {
    key: "heading_3",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const talukaColumns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "District",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Taluka",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialState = {
  stateName: "",
  stateCode: "",
};

const initialDistrict = {
  stateId: null,
  name: "",
};

const initialTaluka = {
  districtId: null,
  name: "",
  pinCode: "",
};

const State = () => {
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  // console.log(userAuthData);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [showStateModal, setShowStateModal] = useState(false);
  const [stateTableData, setStateTableData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [showConfirmModal2, setShowConfirmModal2] = useState(false);
  const [showConfirmModal3, setShowConfirmModal3] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [districtTableData, setDistrictTableData] = useState([]);
  const [districtStateData, setDistrictStateData] = useState([]);
  const [showTalukaModal, setShowTalukaModal] = useState(false);
  const [talukaTableData, setTalukaTableData] = useState([]);
  const [talukaDistrictData, setTalukaDistrictData] = useState([]);
  const [isId, setIsId] = useState();
  const stateItems = [];
  const districtItems = [];
  const [stateData, setStateData] = useState(initialState);
  const [districtData, setDistrictData] = useState(initialDistrict);
  const [talukaData, setTalukaData] = useState(initialTaluka);
  const [stateDataErr, setStateDataErr] = useState(initialState);
  const [districtDataErr, setDistrictDataErr] = useState(initialDistrict);
  const [talukaDataErr, setTalukaDataErr] = useState(initialTaluka);
  const [isCreateState, setIsCreateState] = useState();
  const [isCreateDistrict, setIsCreateDistrict] = useState();
  const [isCreateTaluka, setIsCreateTaluka] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const StatePermissions = userAuthData?.permissions?.find(
        (val) => val?.States
      );
      setPermission(StatePermissions?.States);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  //STATES
  const clearDataErrState = () => {
    setStateDataErr(initialState);
  };

  const clearData = () => {
    setStateData({
      stateName: "",
      stateCode: "",
    });
  };

  const clearData1 = () => {
    setDistrictData({
      stateId: "",
      name: "",
    });
  };

  const clearData2 = () => {
    setTalukaData({
      districtId: "",
      name: "",
      pinCode: "",
    });
  };

  useEffect(() => {
    getStates();
  }, []);

  const getStates = () => {
    setIsLoading(true); // Show the loading spinner
    GetDropDownState((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setStateTableData(data);
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
    });
  };

  {
    filteredData?.map((val, ind) => {
      stateItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.name ?? "--",
        heading_2: val?.stateCode ?? "--",
        heading_3: (
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
      DeleteStates((res) => {
        let { status, message, data } = res;
        if (status === 200) {
          getStates();
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

  const handleInput = (e) => {
    const { name, value } = e.target;
    setStateData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setStateDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));

    setDistrictData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setDistrictDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));

    setTalukaData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setTalukaDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleInput1 = (e) => {
    const { name, value } = e.target;
    setTalukaData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setTalukaDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleStateSubmit = () => {
    if (validateFieldsState()) {
      const payload = {
        name: stateData.stateName,
        stateCode: stateData.stateCode,
      };
      if (isId) {
        payload.id = isId;
        UpdateStates((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData();
            getStates();
            setIsId(null);
            setShowStateModal(false);
            setAlertText(res.message);
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
        CreateState((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData();
            getStates();
            setShowStateModal(false);
            setIsId(null);
            setAlertText(res.message);
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

  const handleEdit = (id) => {
    setIsCreateState(!isCreateState);
    const payload = {
      id: stateTableData.find((role) => role.id === id)?.id,
    };
    setStateData(
      {
        stateName: stateTableData.find((role) => role.id === id)?.name,
        stateCode: stateTableData.find((role) => role.id === id)?.stateCode,
      },
      payload
    );

    setIsId(payload?.id);
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setShowStateModal(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleStateCancle = () => {
    setIsCreateState(false);
    clearData();
    clearDataErrState();
  };

  const stateModalClose = () => {
    setShowStateModal(false);
    clearDataErrState();
  };

  const validateFieldsState = () => {
    let errObj = { ...initialState };

    if (!stateData.stateName) {
      errObj.stateName = "This field is required";
    } else {
      errObj.stateName = "";
    }
    if (!stateData.stateCode) {
      errObj.stateCode = "This field is required";
    } else {
      errObj.stateCode = "";
    }
    setStateDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  //DISTRICTS
  const clearDataErrDistrict = () => {
    setDistrictDataErr(initialDistrict);
  };

  useEffect(() => {
    getDistricts();
  }, []);

  useEffect(() => {
    getDistrictStates();
  }, []);


  const getDistricts = () => {
    setIsLoading(true); // Show the loading spinner
    GetDistricts((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setDistrictTableData(data);
        setFilteredData1(data);
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

  const getDistrictStates = () => {
    GetDropDownState((res) => {
      const districtStates = res.data;
      setDistrictStateData(districtStates);
    });
  };

  {
    filteredData1?.map((val, ind) => {
      districtItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.stateName ?? "--",
        heading_2: val?.name ?? "--",
        heading_3: (
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
                handleEditDistrict(val?.id);
              }}
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
                handleDeleteDistrict(val?.id);
              }}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
      });
    });
  }

  const handleDropDown = (name, value) => {
    setDistrictData((prev) => ({ ...prev, [name]: value }));
    setDistrictDataErr((prev) => ({ ...prev, [name]: "" }));
    setTalukaData((prev) => ({ ...prev, [name]: value }));
    setTalukaDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDistrictCancle = () => {
    setIsCreateDistrict(false);
    clearData1();
    setShowDistrictModal(false);
    clearDataErrDistrict();
  };

  const handleDistrictSubmit = () => {
    if (validateFieldsDistrict()) {
      const payload = {
        stateId: districtData.stateId,
        name: districtData.name,
      };

      if (isId) {
        payload.id = isId;
        UpdateDistrict((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData1();
            getDistricts();
            setShowDistrictModal(false);
            setIsId(null);
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
      } else {
        CreateDistrict((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData1();
            getDistricts();
            setShowDistrictModal(false);
            setIsId(null);
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
    }
  };

  const handleDeleteDistrict = (id) => {
    setShowConfirmModal2(true);
    setIsId(id);
  };

  const handleConfirm1 = () => {
    setShowConfirmModal1(false);
    setShowDistrictModal(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleOk1 = () => {
    const payload = {
      id: isId,
    };

    if (isId != null) {
      DeleteDistrict((res) => {
        let { status, message, data } = res;
        if (status === 200) {
          getDistricts();
          setIsId(null);
          setShowConfirmModal2(false);
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

  const handleEditDistrict = (id) => {
    // console.log(districtStateData);
    setIsCreateDistrict(!isCreateDistrict);
    setShowDistrictModal(!showDistrictModal);
    const selectedDistrict = districtTableData.find(
      (district) => district.id === id
    );

    const payload = {
      id: selectedDistrict?.id,
    };

    setDistrictData((prevData) => ({
      ...prevData,
      name: selectedDistrict?.name,
      stateId: selectedDistrict?.stateId,
    }));
    setIsId(payload?.id);
  };

  const validateFieldsDistrict = () => {
    let errObj = { ...initialDistrict };

    if (!districtData.stateId) {
      errObj.stateId = "This field is required";
    } else if (districtData.stateId == 0) {
      errObj.stateId = "This field is required";
    } else {
      errObj.stateId = "";
    }
    if (!districtData.name) {
      errObj.name = "This field is required";
    } else {
      errObj.name = "";
    }
    setDistrictDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const districtModalClose = () => {
    setShowDistrictModal(false);
    clearDataErrDistrict();
  };

  //TALUKA

  const clearDataErrTaluka = () => {
    setTalukaDataErr(initialTaluka);
  };

  useEffect(() => {
    getTalukasData();
    getTaluksDistrictData();
  }, []);

  const getTalukasData = () => {
    setIsLoading(true); // Show the loading spinner
    GetTalukas((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setTalukaTableData(data);
        setFilteredData2(data);
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

  const talukaItems = [];
  {
    filteredData2?.map((val, ind) => {
      talukaItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.districtName ?? "--",
        heading_2: val?.name ?? "--",
        heading_3: (
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
                handleEditTalukas(val?.id);
              }}
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
                handleDeleteTalukas(val?.id);
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
    filterTableData();
  }, [searchTerm]);

  useEffect(() => {
    filterTableData1();
  }, [searchTerm1]);

  useEffect(() => {
    filterTableData2();
  }, [searchTerm2]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(stateTableData);
    } else {
      const filteredData = stateTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filteredData);
    }
  };

  const filterTableData1 = () => {
    if (searchTerm1 === "") {
      setFilteredData1(districtTableData);
    } else {
      const filteredData1 = districtTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm1.toLowerCase())
        )
      );
      setFilteredData1(filteredData1);
    }
  };

  const filterTableData2 = () => {
    if (searchTerm2 === "") {
      setFilteredData2(talukaTableData);
    } else {
      const filteredData2 = talukaTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm2.toLowerCase())
        )
      );
      setFilteredData2(filteredData2);
    }
  };

  const handleDeleteTalukas = (id) => {
    setShowConfirmModal3(true);
    setIsId(id);
  };

  const handleConfirm2 = () => {
    setShowConfirmModal1(false);
    setShowTalukaModal(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleOk2 = () => {
    const payload = {
      id: isId,
    };

    if (isId != null) {
      DeleteTalukas((res) => {
        let { status, message } = res;
        if (status === 200) {
          getTalukasData();
          setIsId(null);
          setShowConfirmModal3(false);
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

  const getTaluksDistrictData = () => {
    GetDistricts((res) => {
      setTalukaDistrictData(res.data);
    });
  };

  const handleTalukaSubmit = () => {
    if (validateFieldsTaluka()) {
      const payload = {
        districtId: talukaData.districtId,
        name: talukaData.name,
        pincode: talukaData.pinCode,
      };

      if (isId) {
        payload.id = isId;
        UpdateTalukas((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData2();
            getTalukasData();
            setShowTalukaModal(!showTalukaModal);
            setIsId(null);
            setAlertText(res.message);
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
        CreateTalukas((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData2();
            getTalukasData();
            setShowTalukaModal(!showTalukaModal);
            setIsId(null);
            setAlertText(res.message);
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

  const handleEditTalukas = (id) => {
    setIsCreateTaluka(!isCreateTaluka);
    setShowTalukaModal(!showTalukaModal);
    const selectedTalukas = talukaTableData.find(
      (talukas) => talukas.id === id
    );
    const payload = {
      id: selectedTalukas?.id,
    };

    // console.log(selectedTalukas);
    setTalukaData((prevData) => ({
      ...prevData,
      name: selectedTalukas?.name,
      districtId: selectedTalukas?.districtId,
      pinCode: selectedTalukas?.pincode,
    }));
    setIsId(payload?.id);
  };

  const handleTalukaCancle = () => {
    setIsCreateTaluka(false);
    clearData2();
    setShowTalukaModal(!showTalukaModal);
  };

  const validateFieldsTaluka = () => {
    let errObj = { ...initialTaluka };

    if (!talukaData.districtId) {
      errObj.districtId = "This field is required";
    } else if (talukaData.districtId == 0) {
      errObj.districtId = "This field is required";
    } else {
      errObj.districtId = "";
    }
    if (!talukaData.name) {
      errObj.name = "This field is required";
    } else {
      errObj.name = "";
    }
    if (!talukaData.pinCode) {
      errObj.pinCode = "This field is required";
    } else {
      errObj.pinCode = "";
    }
    var pinvalid = /^(\d{4}|\d{6})$/;
    if (!pinvalid.test(talukaData.pinCode)) {
      errObj.pinCode = "Pincode should be digits only";
    }
    setTalukaDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const talukaModalClose = () => {
    setShowTalukaModal(false);
    clearDataErrTaluka();
  };




  return (
    // <div style={{ width: "100%", overflowY: "scroll" }}>
    <div className="states">
      <div className="states__container">
        <div className="states__header">
          <div className="states__header__section">
            <div className="states__header__section__main">
              <h5>Company: Verka</h5>
              <h4>{`MDM - State Master`}</h4>
            </div>

            <div className="states__header__section__bottom">
              <Header />
            </div>
          </div>
        </div>
        <br />
        <Tabs>
          <TabList>
            <Tab>States</Tab>
            <Tab>District</Tab>
            <Tab>Talukas</Tab>
          </TabList>

          <TabPanel >
            <>

              {isCreateState ? (
                <>

                  <Paper elevation={3} >

                    <CForm method="post">
                      <CRow>
                        <CCol lg={12}>
                          <CFormLabel htmlFor="nf-email">
                            Enter State Name{" "}
                            <span style={{ color: "red" }}>*</span>
                          </CFormLabel>

                          <CFormInput
                            size="sm"
                            type="text"
                            name="stateName"
                            placeholder="Enter New State Name"
                            maxLength={30}
                            value={stateData.stateName}
                            onChange={handleInput}
                          />

                          <p style={{ color: "red", fontSize: "x-small" }}>
                            {stateDataErr.stateName}
                          </p>
                        </CCol>

                        <CCol lg={12}>
                          <CFormLabel htmlFor="nf-email">
                            Enter State Code{" "}
                            <span style={{ color: "red" }}>*</span>
                          </CFormLabel>

                          <CFormInput
                            size="sm"
                            type="text"
                            name="stateCode"
                            maxLength={2}
                            placeholder="Enter State Code "
                            value={stateData.stateCode}
                            onChange={handleInput}
                          />

                          <p style={{ color: "red", fontSize: "x-small" }}>
                            {stateDataErr.stateCode}
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
                          onClick={handleStateSubmit}
                        >
                          {isCreateState ? "Save" : "Update"}
                        </CButton>

                        <CButton
                          target="_blank"
                          style={{
                            border: 0,
                            backgroundColor: "lightslategrey",
                          }}
                          onClick={handleStateCancle}
                        >
                          Cancel
                        </CButton>
                      </div>
                    </CForm>

                  </Paper>

                </>
              ) : (
                <div className="states__table">
                  <div className="states__table__header">
                    <div className="states__table__header__section">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        onClick={() => {
                          clearData();
                          setShowStateModal(!showStateModal);
                          setIsCreateState(true);
                        }}
                      >
                        Add State
                      </button>
                    </div>
                  </div>

                  <CTable
                    columns={stateColumns}
                    items={stateItems}
                    hover
                    className="striped-table"
                  />
                </div>
              )
              }

            </>
          </TabPanel>

          <TabPanel>

            {isCreateDistrict ? (
              <>

                <Paper elevation={3} >
                  <CForm method="post" onSubmit="">
                    <CRow>
                      <CCol lg={12}>
                        <CFormLabel htmlFor="nf-email">
                          State <span style={{ color: "red" }}>*</span>
                        </CFormLabel>

                        <CFormSelect
                          size="sm"
                          value={districtData?.stateId}
                          onChange={(e) =>
                            handleDropDown("stateId", e.target.value)
                          }
                        >
                          <option value={0}>Select State</option>

                          {districtStateData?.length &&
                            districtStateData?.map((data, ind) => {
                              return (
                                <option key={ind} value={data?.id}>
                                  {data?.name}
                                </option>
                              );
                            })}
                        </CFormSelect>

                        <p style={{ color: "red", fontSize: "x-small" }}>
                          {districtDataErr.stateId}
                        </p>
                      </CCol>

                      <CCol lg={12}>
                        <CFormLabel htmlFor="nf-email">
                          District Name <span style={{ color: "red" }}>*</span>
                        </CFormLabel>

                        <CFormInput
                          size="sm"
                          type="text"
                          id="mobile"
                          name="name"
                          maxLength={30}
                          placeholder="Enter New District Name"
                          value={districtData.name}
                          onChange={handleInput}
                        />

                        <p style={{ color: "red", fontSize: "x-small" }}>
                          {districtDataErr.name}
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
                        onClick={handleDistrictSubmit}
                      >
                        {isCreateDistrict ? "Save" : "Update"}
                      </CButton>

                      <CButton
                        target="_blank"
                        style={{
                          border: 0,
                          backgroundColor: "lightslategrey",
                        }}
                        onClick={handleDistrictCancle}
                      >
                        Cancel
                      </CButton>
                    </div>
                  </CForm>
                </Paper>

              </>
            ) : (
              <div className="states__table">
                <div className="states__table__header">
                  <div className="states__table__header__section">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchTerm1}
                      onChange={(e) => setSearchTerm1(e.target.value)}
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
                      onClick={() => {
                        getDistrictStates();
                        clearData1();
                        setShowDistrictModal(!showDistrictModal);
                        setIsCreateDistrict(true);
                      }}
                    >
                      Add District
                    </button>
                  </div>
                </div>

                <div
                  className="states__table__body"
                  style={{ height: "50vh", overflowY: "scroll" }}
                >
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <CTable
                      columns={districtColumns}
                      items={districtItems}
                      hover
                      className="striped-table"
                    />
                  )}
                </div>
              </div>
            )
            }

          </TabPanel>

          <TabPanel>

            {isCreateTaluka ? (
              <Paper elevation={3} >
                <CForm method="post" onSubmit="">
                  <CRow>
                    <CCol lg={12}>
                      <CFormLabel htmlFor="nf-email">
                        District <span style={{ color: "red" }}>*</span>
                      </CFormLabel>

                      <CFormSelect
                        size="sm"
                        value={talukaData?.districtId}
                        onChange={(e) =>
                          handleDropDown("districtId", e.target.value)
                        }
                      >
                        <option value={0}>Select District</option>

                        {talukaDistrictData?.length &&
                          talukaDistrictData?.map((data, ind) => {
                            return (
                              <option key={ind} value={data?.id}>
                                {data?.name}
                              </option>
                            );
                          })}
                      </CFormSelect>

                      <p style={{ color: "red", fontSize: "x-small" }}>
                        {talukaDataErr.districtId}
                      </p>
                    </CCol>

                    <CCol lg={12}>
                      <CFormLabel htmlFor="nf-email">
                        Taluka Name <span style={{ color: "red" }}>*</span>
                      </CFormLabel>

                      <CFormInput
                        size="sm"
                        type="text"
                        id="name"
                        name="name"
                        maxLength={30}
                        placeholder="Enter New Taluka Name"
                        value={talukaData.name}
                        onChange={handleInput1}
                      />

                      <p style={{ color: "red", fontSize: "x-small" }}>
                        {talukaDataErr.name}
                      </p>
                    </CCol>

                    <CCol lg={12}>
                      <CFormLabel htmlFor="nf-email">
                        Pin Code <span style={{ color: "red" }}>*</span>
                      </CFormLabel>

                      <CFormInput
                        size="sm"
                        type="text"
                        id="pinCode"
                        name="pinCode"
                        maxLength={6}
                        placeholder="Enter Pin Code"
                        value={talukaData.pinCode}
                        onChange={handleInput1}
                      />

                      <p style={{ color: "red", fontSize: "x-small" }}>
                        {talukaDataErr.pinCode}
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
                      onClick={handleTalukaSubmit}
                    >
                      {isCreateTaluka ? "Save" : "Update"}
                    </CButton>

                    <CButton
                      target="_blank"
                      style={{
                        border: 0,

                        backgroundColor: "lightslategrey",
                      }}
                      onClick={handleTalukaCancle}
                    >
                      Cancel
                    </CButton>
                  </div>
                </CForm>
              </Paper>

            ) : (
              <div className="states__table">
                <div className="states__table__header">
                  <div className="states__table__header__section">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchTerm2}
                      onChange={(e) => setSearchTerm2(e.target.value)}
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
                      onClick={() => {
                        getTaluksDistrictData();
                        clearData2();
                        setIsId(null);
                        setShowTalukaModal(!showTalukaModal);
                        setIsCreateTaluka(true);
                      }}
                    >
                      Add Taluka
                    </button>
                  </div>
                </div>

                <div
                  className="states__table__body"
                  style={{ height: "50vh", overflowY: "scroll" }}
                >
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <CTable
                      columns={talukaColumns}
                      items={talukaItems}
                      hover
                      className="striped-table"
                    />
                  )}
                </div>
              </div>

            )
            }
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
            handleOk1();
          }}
          onCancel={() => {
            setShowConfirmModal2(false);
          }}
        />
      )}

      {showConfirmModal3 && (
        <Confirm
          buttonText={"OK"}
          isCancelRequired={true}
          confirmTitle={"Are you sure ?"}
          onConfirm={() => {
            handleOk2();
          }}
          onCancel={() => {
            setShowConfirmModal3(false);
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

            handleConfirm1();

            handleConfirm2();
          }}
          onCancel={() => {
            setShowConfirmModal1(false);
            setSessionOk(true);
          }}
        />
      )}
    </div>

    // </div>
  );
};

export default State;