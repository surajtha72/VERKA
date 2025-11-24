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
import "./RateList.scss";
import React, { useEffect, useState } from "react";
import {
  CreateRateMaster,
  DeleteRateMaster,
  GetRateMaster,
  GetShiftApplicable,
  UpdateRateMaster,
} from "../../utils/apiCalls";
import Confirm from "../../components/confirmModal/confirm";
import { Paper } from "@mui/material";
import Header from "../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import moment from "moment";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const initialRate = {
  effectiveFrom: "",
  cowRate: "",
  cowSnf: "",
  buffaloRate: "",
  buffaloSnf: "",
  shifts: "",
  shortDesc: "",
  cowMinFat: "",
  cowMinSnf: "",
  buffMinFat: "",
  buffMinSnf: "",
  fatRangeMin: "",
  fatRangeMax: "",
  snfRangeMin: "",
  snfRangeMax: "",
  seqNo: "",
}

const columns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Description",
    _props: { scope: "col" },
  },
  {
    key: "seq_no",
    label: "Sequence number",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Effective From",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Cow Fat Rate/Kg",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Cow SNF Rate",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Buffalo Fat Rate/Kg",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Buffalo SNF Rate",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Shifts Applicable",
    _props: { scope: "col" },
  },
  {
    key: "heading_9",
    label: "Fat Range Min",
    _props: { scope: "col" },
  },
  {
    key: "heading_10",
    label: "Fat Range Max",
    _props: { scope: "col" },
  },
  {
    key: "heading_11",
    label: "Cow Min FAT",
    _props: { scope: "col" },
  },
  {
    key: "heading_12",
    label: "Cow Min SNF",
    _props: { scope: "col" },
  },
  {
    key: "heading_13",
    label: "Buff Min FAT",
    _props: { scope: "col" },
  },
  {
    key: "heading_14",
    label: "Buff Min SNF",
    _props: { scope: "col" },
  },
  {
    key: "heading_15",
    label: "SNF Range Min",
    _props: { scope: "col" },
  },
  {
    key: "heading_16",
    label: "SNF Range Max",
    _props: { scope: "col" },
  },
  {
    key: "heading_8",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const RateChart = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateRate, setIsCreateRate] = useState(false);
  const [isEditRate, setIsEditRate] = useState(false);
  const [rateChartTableData, setRateChartTableData] = useState([]);
  const [shiftsData, setShiftsData] = useState([]);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [isId, setIsId] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [rateChartData, setRateChartData] = useState(initialRate);
  const [rateChartDataErr, setRateChartDataErr] = useState(initialRate);
  const items = [];

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const RatePermissions = userAuthData?.permissions?.find(
        (val) => val?.RateMaster
      );
      setPermission(RatePermissions?.RateMaster);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const clearData = () => {
    setRateChartData(initialRate);
  };

  const clearDataErr = () => {
    setRateChartDataErr(initialRate);
  };

  useEffect(() => {
    getRateChartData();
    getDropDownShifts();
  }, []);

  const getRateChartData = () => {
    setIsLoading(true); // Show the loading spinner
    GetRateMaster((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setRateChartTableData(data);
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

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(rateChartTableData);
    } else {
      const filteredData = rateChartTableData.filter((item) =>
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
        id: val?.id,
        SlNo: ind + 1,
        heading_1: val?.shortDesc ?? " ",
        seq_no: val?.seqNo ?? " ",
        heading_2: moment(val?.effectiveFrom).format("YYYY-MM-DD") ?? " ",
        heading_3: val?.cowFatRate != null ? val.cowFatRate != 0 ? val.cowFatRate : '0' : '0',
        heading_4: val?.cowSnfRate != null ? val.cowSnfRate != 0 ? val.cowSnfRate : '0' : '0',
        heading_5: val?.buffFatRate != null ? val.buffFatRate != 0 ? val.buffFatRate : '0' : '0',
        heading_6: val?.buffSnfRate != null ? val.buffSnfRate != 0 ? val.buffSnfRate : '0' : '0',
        heading_7: val?.shiftsApplicable ?? '  ',
        heading_9: val?.fatRangeMin ?? '  ',
        heading_10: val?.fatRangeMax ?? '  ',
        heading_11: val?.cowMinFat ?? '  ',
        heading_12: val?.cowMinSnf ?? '  ',
        heading_13: val?.buffMinFat ?? '  ',
        heading_14: val?.buffMinSnf ?? '  ',
        heading_15: val?.snfRangeMin ?? '  ',
        heading_16: val?.snfRangeMax ?? '  ',
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
              onClick={() => handleEdit(val)}
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
      DeleteRateMaster((res) => {
        let { status, message } = res;
        if (status === 200) {
          getRateChartData();
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

  const getDropDownShifts = () => {
    GetShiftApplicable((res) => {
      setShiftsData(res.data);
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleConfirm = () => {
    setShowConfirmModal1(false);
    setIsCreateRate(isCreateRate);
    setIsEditRate(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const handleCreateRoute = () => {
    setIsCreateRate(!isCreateRate);
    setIsEditRate(false);
  };

  const handleCancelRoute = () => {
    setIsCreateRate(!isCreateRate);
    setIsEditRate(false);
    clearData();
    clearDataErr();
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRateChartData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRateChartDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDropDown = (name, value) => {
    setRateChartData((prev) => ({ ...prev, [name]: value }));
    setRateChartDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    let errObj = { ...initialRate };

    if (!rateChartData.effectiveFrom) {
      errObj.effectiveFrom = "This field is required";
    } else {
      errObj.effectiveFrom = "";
    }
    if (!rateChartData.cowRate) {
      errObj.cowRate = "This field is required";
    } else {
      errObj.cowRate = "";
    }
    if (!rateChartData.cowSnf) {
      errObj.cowSnf = "This field is required";
    } else {
      errObj.cowSnf = "";
    }
    if (!rateChartData.buffaloRate) {
      errObj.buffaloRate = "This field is required";
    } else {
      errObj.buffaloRate = "";
    }
    if (!rateChartData.buffaloSnf) {
      errObj.buffaloSnf = "This field is required";
    } else {
      errObj.buffaloSnf = "";
    }
    if (!rateChartData.shifts) {
      errObj.shifts = "This field is required";
    } else if (rateChartData.shifts == 0) {
      errObj.shifts = "This field is required";
    } else {
      errObj.shifts = "";
    }
    if (!rateChartData.shortDesc) {
      errObj.shortDesc = "This field is required";
    } else {
      errObj.shortDesc = "";
    }
    if (!rateChartData.cowMinFat) {
      errObj.cowMinFat = "This field is required";
    } else {
      errObj.cowMinFat = "";
    }
    if (!rateChartData.cowMinSnf) {
      errObj.cowMinSnf = "This field is required";
    } else {
      errObj.cowMinSnf = "";
    }
    if (!rateChartData.buffMinFat) {
      errObj.buffMinFat = "This field is required";
    } else {
      errObj.buffMinFat = "";
    }
    if (!rateChartData.buffMinSnf) {
      errObj.buffMinSnf = "This field is required";
    } else {
      errObj.buffMinSnf = "";
    }
    if (!rateChartData.fatRangeMin) {
      errObj.fatRangeMin = "This field is required";
    } else {
      errObj.fatRangeMin = "";
    }
    if (!rateChartData.fatRangeMax) {
      errObj.fatRangeMax = "This field is required";
    } else {
      errObj.fatRangeMax = "";
    }
    if (!rateChartData.snfRangeMin) {
      errObj.snfRangeMin = "This field is required";
    } else {
      errObj.snfRangeMin = "";
    }
    if (!rateChartData.snfRangeMax) {
      errObj.snfRangeMax = "This field is required";
    } else {
      errObj.snfRangeMax = "";
    }
    if (!rateChartData.seqNo) {
      errObj.snfRangeMax = "This field is required";
    } else {
      errObj.snfRangeMax = "";
    }
    setRateChartDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const handleSubmit = () => {
    console.log(validateFields());
    if (validateFields()) {
      const payload = {
        effectiveFrom: rateChartData?.effectiveFrom,
        cowFatRate: Number(rateChartData.cowRate),
        cowSnfRate: Number(rateChartData.cowSnf),
        buffFatRate: Number(rateChartData.buffaloRate),
        buffSnfRate: Number(rateChartData.buffaloSnf),
        shiftsApplicable: rateChartData.shifts,
        shortDesc: rateChartData?.shortDesc,
        fatRangeMax: rateChartData?.fatRangeMax,
        fatRangeMin: rateChartData?.fatRangeMin,
        snfRangeMin: rateChartData?.snfRangeMin,
        snfRangeMax: rateChartData?.snfRangeMax,
        cowMinFat: rateChartData?.cowMinFat,
        cowMinSnf: rateChartData?.cowMinSnf,
        buffMinFat: rateChartData?.buffMinFat,
        buffMinSnf: rateChartData?.buffMinSnf,
        seqNo: Number(rateChartData?.seqNo)
      };
      console.log('payload - ', payload)
      if (isId) {
        payload.id = isId;
        // console.log(payload.id === isId);
        UpdateRateMaster((res) => {
          clearData();
          let { status, message } = res;
          if (status === 200) {
            getRateChartData();
            setIsId(null);
            setIsCreateRate(!isCreateRate);
            setIsEditRate(false);
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
        CreateRateMaster((res) => {
          let { status, message } = res;
          if (status === 200) {
            clearData();
            getRateChartData();
            setIsId(null);
            setIsCreateRate(!isCreateRate);
            setIsEditRate(false);
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

  const handleEdit = (rateData) => {
    setIsCreateRate(!isCreateRate);
    setIsEditRate(true);
    console.log(rateData);
    const payload = {
      id: rateData.id,
    };
    setRateChartData(
      {
        id: rateData.id,
        effectiveFrom: rateData?.effectiveFrom?.split("T")[0],
        cowRate: rateData?.cowFatRate,
        cowSnf: rateData?.cowSnfRate,
        buffaloRate: rateData?.buffFatRate,
        buffaloSnf: rateData?.buffSnfRate,
        shifts: rateData?.shiftsApplicableId,
        shortDesc: rateData?.shortDesc,
        fatRangeMax: rateData?.fatRangeMax,
        fatRangeMin: rateData?.fatRangeMin,
        snfRangeMin: rateData?.snfRangeMin,
        snfRangeMax: rateData?.snfRangeMax,
        cowMinFat: rateData?.cowMinFat,
        cowMinSnf: rateData?.cowMinSnf,
        buffMinFat: rateData?.buffMinFat,
        buffMinSnf: rateData?.buffMinSnf,
        seqNo: rateData?.seqNo
      },
      payload
    );
    setIsId(payload?.id);
  };

  return (
    <>
      {token ? (
        <div className="ratelist">
          <div className="ratelist__container">
            <div className="ratelist__header">
              <div className="ratelist__header__section">
                <div className="ratelist__header__section__main">
                  <h5>Company: Verka</h5>
                  <h4>{`${!isCreateRate
                    ? "Rate List"
                    : isEditRate
                      ? "Edit Rate"
                      : "Create Rate"
                    }`}</h4>
                </div>
                <div className="ratelist__header__section__bottom">
                  <Header />
                </div>
              </div>
            </div>
            {isCreateRate ? (
              <>
                <div className="Cbody">
                  <Paper elevation={3}>
                    <div className="container">
                      <br></br>
                      <div>
                        <CForm method="post">
                          <CRow>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Effective From{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="date"
                                name="effectiveFrom"
                                value={rateChartData.effectiveFrom}
                                onChange={handleInput}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.effectiveFrom}
                              </span>
                            </CCol>

                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Shifts{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormSelect
                                size="sm"
                                value={rateChartData.shifts}
                                onChange={(e) =>
                                  handleDropDown("shifts", e.target.value)
                                }
                              >
                                <option value={0}>Select Shifts</option>
                                {shiftsData?.length &&
                                  shiftsData?.map((option, index) => {
                                    return (
                                      <option key={index} value={option.id}>
                                        {option.name}
                                      </option>
                                    );
                                  })}
                              </CFormSelect>
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.shifts}
                              </span>
                            </CCol>

                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Cow Milk - FAT KG Rate{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                name="cowRate"
                                value={rateChartData.cowRate}
                                onChange={handleInput}
                                placeholder="Enter Fat KG Rate.."
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.cowRate}
                              </span>
                            </CCol>

                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Cow Milk - SNF KG Rate{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                name="cowSnf"
                                value={rateChartData.cowSnf}
                                onChange={handleInput}
                                placeholder="Enter SNF KG Rate.."
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.cowSnf}
                              </span>
                            </CCol>

                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Buffalo Milk - FAT KG Rate{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                name="buffaloRate"
                                value={rateChartData.buffaloRate}
                                onChange={handleInput}
                                placeholder="Enter Fat KG Rate.."
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.buffaloRate}
                              </span>
                            </CCol>

                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Buffalo Milk - SNF KG Rate{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter SNF KG Rate.."
                                name="buffaloSnf"
                                onChange={handleInput}
                                value={rateChartData.buffaloSnf}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.buffaloSnf}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Minimum Fat Range{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Minimum Fat Range"
                                name="fatRangeMin"
                                onChange={handleInput}
                                value={rateChartData.fatRangeMin}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.fatRangeMin}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Maximum Fat Range{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Maximum Fat Range"
                                name="fatRangeMax"
                                onChange={handleInput}
                                value={rateChartData.fatRangeMax}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.fatRangeMax}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Minimum Snf Range{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Minimum Snf Range"
                                name="snfRangeMin"
                                onChange={handleInput}
                                value={rateChartData.snfRangeMin}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.snfRangeMin}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Maximum Snf Range{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Maximum Snf Range"
                                name="snfRangeMax"
                                onChange={handleInput}
                                value={rateChartData.snfRangeMax}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.snfRangeMax}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Minimun Cow Fat{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Minimum  Cow Fat"
                                name="cowMinFat"
                                onChange={handleInput}
                                value={rateChartData.cowMinFat}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.cowMinFat}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Minimum Buffalo Fat{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Minimum  Buffalo Fat"
                                name="buffMinFat"
                                onChange={handleInput}
                                value={rateChartData.buffMinFat}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.buffMinFat}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Minimum Cow Snf{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Minimum  Cow Snf"
                                name="cowMinSnf"
                                onChange={handleInput}
                                value={rateChartData.cowMinSnf}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.cowMinSnf}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Minimun Buffalo Snf{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Minimum  Buffalo Snf"
                                name="buffMinSnf"
                                onChange={handleInput}
                                value={rateChartData.buffMinSnf}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.buffMinSnf}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Short Description{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                type="Name"
                                placeholder="Enter Short Description"
                                name="shortDesc"
                                onChange={handleInput}
                                value={rateChartData.shortDesc}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.shortDesc}
                              </span>
                            </CCol>
                            <CCol lg={4}>
                              <CFormLabel htmlFor="nf-email">
                                Sequence Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </CFormLabel>
                              <CFormInput
                                size="sm"
                                placeholder="Enter Sequence Number"
                                name="seqNo"
                                onChange={handleInput}
                                value={rateChartData.seqNo}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(
                                    /[^0-9.-]/g,
                                    ""
                                  );
                                }}
                              />
                              <span style={{ color: "red", fontSize: "x-small", }}>
                                {rateChartDataErr.seqNo}
                              </span>
                            </CCol>
                          </CRow>
                          <br></br>
                          <div>
                            <CButton
                              style={{
                                marginRight: "15px",
                                backgroundColor: "#0e419d",
                              }}
                              target="_blank"
                              onClick={handleSubmit}
                            >
                              {isEditRate ? "Update" : "Save"}
                            </CButton>
                            <CButton
                              color="primary mr-3"
                              target="_blank"
                              style={{
                                backgroundColor: "gray",
                              }}
                              onClick={handleCancelRoute}
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
                <div className="ratelist__table">
                  <div className="ratelist__table__header">
                    <div className="ratelist__table__header__section">
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
                        onClick={handleCreateRoute}
                      >
                        Add Rate
                      </button>
                    </div>
                  </div>
                  <div
                    className="ratelist__table__body"
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

export default RateChart;
