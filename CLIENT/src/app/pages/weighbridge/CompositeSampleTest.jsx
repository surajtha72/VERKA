import {
  CButton,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CFormSelect,
  CFormCheck,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  GetSample,
  CreateSample,
  UpdateSample,
  DeleteSample,
  GetRouteMaster,
  GetProductCategory,
  GetDropDownProduct,
  GetVehicles,
  GetWeighBridge,
  GetWeighbridgeReportData,
  GetWeighBridgeData,
  GetCSTVehicleDropdown,
  GetManualEntryPermission,
  GetWaitingVehicle,
  GetWaitingVehicles,
  GetWBVehicleDropdown,
  GetWeighbridgeLabData,
} from "../../utils/apiCalls";
import Confirm from "../../components/confirmModal/confirm";
import "./Weighbridge.scss";
import { Paper } from "@mui/material";
import moment from "moment";
import Header from "../../components/header/Header";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const columns = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Vehicle",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Product Category",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Product Name",
    _props: { scope: "col" },
  },

  {
    key: "heading_5",
    label: "Test Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "FAT",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "SNF",
    _props: { scope: "col" },
  },
  {
    key: "heading_8",
    label: "CLR",
    _props: { scope: "col" },
  },
  {
    key: "heading_9",
    label: "Protein",
    _props: { scope: "col" },
  },
  {
    key: "heading_10",
    label: "Lactose",
    _props: { scope: "col" },
  },
  {
    key: "heading_11",
    label: "Salt",
    _props: { scope: "col" },
  },
  {
    key: "heading_12",
    label: "Water",
    _props: { scope: "col" },
  },
  {
    key: "heading_13",
    label: "Temperature",
    _props: { scope: "col" },
  },
  {
    key: "heading_15",
    label: "Analyst",
    _props: { scope: "col" },
  },
  {
    key: "heading_16",
    label: "Status",
    _props: { scope: "col" },
  },
  {
    key: "heading_17",
    label: "Remarks",
    _props: { scope: "col" },
  },

  {
    key: "heading_19",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialSample = {
  vehicleNo: "",
  productCategory: "",
  productName: "",
  // routeId: null,
  testDate: "",
  fat: "",
  snf: "",
  acidity: "",
  clr: "",
  protein: "",
  lactose: "",
  salt: "",
  water: "",
  temperature: "",
  analyst: "",
  status: "",
  remarks: "",
  declaredTemp: "",
  declaredFat: "",
  declaredSnf: "",
  declaredAcidity: "",
};

const initialWeigh = {
  weighbridgeNo: "",
  vehicleNo: "",
  // contractorCode: "",
  contractorName: "",
  challanNo: "",
  // driverName: "",
  // contactPerson: "",
  destination: "",
  purpose: "",
  supplierName: "",
  routeId: "",
  productCategory: "",
  productName: "",
  weightMode: "",
  tareWeight: "",
  tareDate: "",
  grossWeight: "",
  grossDate: "",
  netWeightKg: "",
  supplyQty: "",
  remarks: "",
};
const CompositeSampleTest = () => {
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  let userId = userAuthData?.userDetails.id;
  const items = [];
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateSample, setIsCreateSample] = useState(false);
  const [isEditSample, setIsEditSample] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal1, setShowConfirmModal1] = useState(false);
  const [isId, setIsId] = useState();

  const [sampleData, setSampleData] = useState(initialSample);
  const [sampleDataErr, setSampleDataErr] = useState(initialSample);
  const [sampleTableData, setSampleTableData] = useState([]);

  const [routeMasterData, setRouteMasterData] = useState([]);
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  const [dateTimeValue, setDateTimeValue] = useState("");

  const [isSampleInputDisable, setSampleInputDisable] = useState(true);
  const [accCount, setAccCount] = useState(null);
  const [rejCount, setRejCount] = useState(null);
  const [vehicleCount, setVehicleCount] = useState(null);

  const [weighData, setWeighData] = useState(initialWeigh);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [isAutoInputDisabled, setIsAutoInputDisabled] = useState(true);
  const [connectionError, setConnectionError] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const WeighPermissions = userAuthData?.permissions?.find(
        (val) => val?.WeighBridge
      );
      setPermission(WeighPermissions?.WeighBridge);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  const clearDataErr = () => {
    setSampleDataErr(initialSample);
  };

  const clearData = () => {
    setSampleData(initialSample);
  };

  useEffect(() => {
    filterTableData();
  }, [searchTerm]);

  const filterTableData = () => {
    if (searchTerm === "") {
      setFilteredData(sampleTableData);
    } else {
      const filteredData = sampleTableData.filter((item) =>
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
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.vehicleNo ? val?.vehicleNo.registrationNumber : " ",
        heading_2: val?.productCategory
          ? val?.productCategory.CategoryName
          : " ",
        heading_3: val?.productName ? val?.productName : " ",
        heading_4: val?.routeId ? val?.routeId.RouteName : " ",
        heading_5: moment(val?.testDate).format("YYYY-MM-DD HH:mm:ss") ?? " ",
        heading_6: val?.fat ? val?.fat : " ",
        heading_7: val?.snf ? val?.snf : " ",
        heading_8: val?.clr ? val?.clr : " ",
        heading_9: val?.protein ? val?.protein : " ",
        heading_10: val?.lactose ? val?.lactose : " ",
        heading_11: val?.salt ? val?.salt : " ",
        heading_12: val?.water ? val?.water : " ",
        heading_13: val?.temperature ? val?.temperature : " ",
        heading_15: val?.analyst ? val?.analyst : " ",
        heading_16: val?.status ? val?.status : " ",
        heading_17: val?.remarks ? val?.remarks : " ",
        // heading_18: val?.sampledBy ? val?.sampledBy : " ",
        heading_19: (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              background: "none",
              alignItems: "flex-start",
            }}
          >
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

    const handleDelete = (id) => {
      setShowConfirmModal(true);
      setIsId(id);
    };

    const handleOk = () => {
      const payload = {
        id: isId,
      };
      if (isId != null) {
        DeleteSample((res) => {
          let { status, message } = res;
          if (status === 200) {
            getSample();
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

    useEffect(() => {
      getSample();
      getProductCategory();
      getVehicles();
    }, []);

    const getSample = () => {
      setIsLoading(true); // Show the loading spinner
      GetSample((res) => {
        let { status, data, message } = res;
        if (status === 200) {
          setSampleTableData(data);
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

    const testDate = moment(new Date()).format("YYYY-MM-DD");
    useEffect(() => {
      getStatisticsData();
    }, [testDate]);
    const getStatisticsData = () => {
      setIsLoading(true); // Show the loading spinner
      GetWeighbridgeReportData((res) => {
        let { status, data, message } = res;
        if (status === 200) {
          let rejectionCount = 0;
          let acceptanceCount = 0;
          let vehicleCount = 0;

          data.forEach((item) => {
            if (item.vehicleNo !== null) {
              vehicleCount++;
            }
            if (item.status === "Rejected") {
              rejectionCount++;
            } else if (item.status === "Accepted") {
              acceptanceCount++;
            }
          });

          setAccCount(acceptanceCount);
          setRejCount(rejectionCount);
          setVehicleCount(vehicleCount);
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
      }, testDate);
    };

    const getProductCategory = () => {
      GetProductCategory((res) => {
        let { status, data, message } = res;
        if (status === 200) {
          setProductCategoryData(data);
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

    const getVehicles = () => {
      GetVehicles((res) => {
        let { status, data, message } = res;
        if (res.status === 200) {
          setVehicleData(data);
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

    const [vehicles, setVehicles] = useState([]);
    useEffect(() => {
      getWeighBridge();
    }, []);
    const getWeighBridge = () => {
      GetWeighBridge((res) => {
        let { status, data, message } = res;
        if (status === 200) {
          setWeighData(data);
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

    const getWeighbridgeLabData = () => {
      GetWeighbridgeLabData((res) => {
        setSampleData((prev) => ({
          ...prev,
          fat: res?.data.fat,
          snf: res?.data.snf,
          clr: res?.data.clr,
          protein: res?.data.protein,
          lactose: res?.data.lactose,
          salt: res?.data.salt,
          water: res?.data.water,
          temperature: res?.data.temperature,
        }));
      });
    };

    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    const handleCreateSample = () => {
      setIsCreateSample(!isCreateSample);
      setIsEditSample(false);

      setSampleInputDisable(true);

      const currentDate = new Date();
      const formattedDate = moment(currentDate).format("YYYY-MM-DDTHH:mm");
      setDateTimeValue(formattedDate);
    };

    const handleCancleSample = () => {
      setIsCreateSample(!isCreateSample);
      setIsEditSample(false);
      clearData();
      clearDataErr();
    };

    const handleConfirm = () => {
      setShowConfirmModal1(false);
      setIsCreateSample(isCreateSample);
      setIsEditSample(false);
      if (sessionOk) {
        localStorage.clear();
        navigate("/");
      }
    };

    const handleInput = (e) => {
      setSampleData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));

      setSampleDataErr((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));

      const currentDate = new Date();
      const formattedDate = moment(currentDate).format("YYYY-MM-DDTHH:mm");
      setDateTimeValue(formattedDate);
    };

    const handleDropDownBridgeNo = (name, value) => {
      setSampleData((prev) => ({ ...prev, [name]: value }));
      setSampleDataErr((prev) => ({ ...prev, [name]: "" }));
    };

    const handleRouteDropDown = (name, value) => {
      setSampleData((prev) => ({ ...prev, [name]: value }));
      setSampleDataErr((prev) => ({ ...prev, [name]: "" }));
    };

    const handleProductCatDropDown = (name, value) => {
      setSampleData((prev) => ({ ...prev, [name]: value }));
      setSampleDataErr((prev) => ({ ...prev, [name]: "" }));
      setSelectedCategoryId(value);
    };

    const handleProductNameDropDown = (name, value) => {
      setSampleData((prev) => ({ ...prev, [name]: value }));
      setSampleDataErr((prev) => ({ ...prev, [name]: "" }));
    };

    const handleVehicleDropDown = (name, value) => {
      setSampleData((prev) => ({ ...prev, [name]: value }));
      setSampleDataErr((prev) => ({ ...prev, [name]: "" }));
    };

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    useEffect(() => {
      getProduct();
    }, [selectedCategoryId]);

    const [selectProductData, setSelectProductData] = useState([]);
    const getProduct = () => {
      GetDropDownProduct((res) => {
        setSelectProductData(res.data);
      }, selectedCategoryId);
    };

    const validateFields = () => {
      let errObj = { ...initialSample };

      if (!sampleData.vehicleNo) {
        errObj.vehicleNo = "This field is required";
      } else {
        errObj.vehicleNo = "";
      }
      if (!sampleData.productCategory) {
        errObj.productCategory = "This field is required";
      } else if (sampleData.productCategory == 0) {
        errObj.productCategory = "This field is required";
      } else {
        errObj.productCategory = "";
      }
      if (!sampleData.productName) {
        errObj.productName = "This field is required";
      } else if (sampleData.productName == 0) {
        errObj.productName = "This field is required";
      } else {
        errObj.productName = "";
      }
      if (!sampleData.fat) {
        errObj.fat = "This field is required";
      } else {
        errObj.fat = "";
      }
      if (!sampleData.snf) {
        errObj.snf = "This field is required";
      } else {
        errObj.snf = "";
      }
      if (!sampleData.clr) {
        errObj.clr = "This field is required";
      } else {
        errObj.clr = "";
      }
      if (!sampleData.analyst) {
        errObj.analyst = "This field is required";
      } else {
        errObj.analyst = "";
      }
      if (!sampleData.status) {
        errObj.status = "This field is required";
      } else if (sampleData.status == 0) {
        errObj.status = "This field is required";
      } else {
        errObj.status = "";
      }

      console.log(errObj);
      setSampleDataErr((prev) => ({ ...prev, ...errObj }));

      const currentDate = new Date();
      const formattedDate = moment(currentDate).format("YYYY-MM-DDTHH:mm");
      setDateTimeValue(formattedDate);

      return Object.values(errObj).every((x) => x === "");
    };
    useEffect(() => {}, [selectedVehicleId]);
    const handleSubmit = () => {
      if (validateFields()) {
        const payload = {
          vehicleNo: selectedVehicleId,
          productCategory: sampleData.productCategory,
          productName: sampleData.productName,
          routeId: sampleData.routeId,
          testDate: dateTimeValue,
          temperature: sampleData.temperature,
          fat: sampleData.fat,
          snf: sampleData.snf,
          clr: sampleData.clr,
          protein: sampleData.protein,
          lactose: sampleData.lactose,
          salt: sampleData.salt,
          water: sampleData.water,
          analyst: sampleData.analyst,
          sampledBy: sampleData.sampledBy,
          status: sampleData.status,
          remarks: sampleData.remarks,
        };
        if (isId) {
          payload.id = isId;
          UpdateSample((res) => {
            let { status, message } = res;
            if (status === 200) {
              clearData();
              getSample();
              setIsId(null);
              setAlertText(message);
              setIsCreateSample(!isCreateSample);
              setShowConfirmModal1(true);
              setIsEditSample(false);
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
          CreateSample((res) => {
            let { status, message } = res;
            if (status === 200) {
              getSample();
              setIsId(null);
              setAlertText(message);
              setIsCreateSample(!isCreateSample);
              setIsEditSample(false);
              clearData();
              clearDataErr();
              setShowConfirmModal1(true);
              setIsEditSample(false);
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
      setIsCreateSample(!isCreateSample);
      setIsEditSample(true);

      // setSampleInputDisable(true);
      setIsAutoInputDisabled(false);

      const currentDate = new Date();
      const formattedDate = moment(currentDate).format("YYYY-MM-DDTHH:mm");
      setDateTimeValue(formattedDate);

      const payload = {
        id: sampleTableData.find((role) => role.id === id)?.id,
      };
      const productCategId = sampleTableData.find((role) => role.id === id)
        ?.productCategory.Id;
      setSelectedCategoryId(productCategId);

      setSampleData(
        {
          vehicleNo:
            sampleTableData.find((sample) => sample.id === id)?.vehicleNo.Id ||
            "",
          productCategory:
            sampleTableData.find((sample) => sample.id === id)?.productCategory
              .Id || "",
          productName:
            sampleTableData.find((sample) => sample.id === id)?.productName ||
            "",
          // routeId: sampleTableData.find((sample) => sample.id === id)?.routeId.Id || "",
          temperature:
            sampleTableData.find((sample) => sample.id === id)?.temperature ||
            "",
          fat: sampleTableData.find((sample) => sample.id === id)?.fat || "",
          snf: sampleTableData.find((sample) => sample.id === id)?.snf || "",
          clr: sampleTableData.find((sample) => sample.id === id)?.clr || "",
          protein:
            sampleTableData.find((sample) => sample.id === id)?.protein || "",
          lactose:
            sampleTableData.find((sample) => sample.id === id)?.lactose || "",
          salt: sampleTableData.find((sample) => sample.id === id)?.salt || "",
          water:
            sampleTableData.find((sample) => sample.id === id)?.water || "",
          analyst:
            sampleTableData.find((sample) => sample.id === id)?.analyst || "",
          status:
            sampleTableData.find((sample) => sample.id === id)?.status || "",
          remarks:
            sampleTableData.find((sample) => sample.id === id)?.remarks || "",
          sampledBy:
            sampleTableData.find((sample) => sample.id === id)?.sampledBy || "",
        },
        payload
      );
      setIsId(sampleTableData.find((sample) => sample.id === id)?.id);
    };

    const handleDateTimeChange = (e) => {
      setDateTimeValue(e.target.value);
    };

    const [automaticAcidoChecked, setAutomaticAcidoChecked] = useState(true);
    const [automaticMilkoChecked, setAutomaticMilkoChecked] = useState(true);

    useEffect(() => {
      if (selectedVehicleId) {
        handleDeclaredValues(selectedVehicleId);
      }
    }, [selectedVehicleId]);

    const handleDeclaredValues = (vehicleId) => {
      const vId = vehicleId || selectedVehicleId;
      if (!vId) return;

      GetCSTVehicleDropdown((res) => {
        if (res.status === 200 && res.data?.[0]) {
          const d = res.data[0];
          setSampleData((prev) => ({
            ...prev,
            vehicleNo: vId, // keep id
            declaredFat: d.endFat ?? null,
            declaredSnf: d.endSnf != null ? d.endSnf.toFixed(1) : null,
            declaredClr: d.endClr ?? null,
          }));
        }
      }, vId);

      GetWBVehicleDropdown((result) => {
        if (result.status === 200 && result.data?.[0]) {
          const d = result.data[0];
          setSampleData((prev) => ({
            ...prev,
            productCategory: d.productCategory?.Id ?? null,
            productName: d.productName ?? "",
          }));
          setSelectedCategoryId(d.productCategory?.Id ?? null);
        }
      }, vId);
    };

    //MANUAL ENTRY
    const [automaticChecked, setAutomaticChecked] = useState(true);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const handleCheckAutomatic = () => {
      const checkBox = document.getElementById("automatic");
      setAutomaticChecked(!automaticChecked);
      setIsAutoInputDisabled(true);
      setAllowManualEntry(true);
    };

    const handleCheckManual = () => {
      // console.log("handle check manual called");
      const checkBox = document.getElementById("manual");
      setIsAutoInputDisabled(false);
      setAutomaticChecked(false);
      setShowPermissionModal(true);
      // setShowModal(true);
      // console.log(showModal);
    };

    const autoMilkData = () => {
      GetWeighBridgeData((result) => {
        const data = result.data;
        setWeighData((prev) => ({ ...prev, ["tareWeight"]: data }));
        const regex =
          /\$?\s*LE\d*\.?\d*\|A\|CH\d*\.?\d*\|F(?<FAT>\d*\.?\d*)\|S(?<SNF>\d*\.?\d*)\|C(?<CLR>\d*\.?\d*)\|P(?<PROTEIN>\d*\.?\d*)\|L(?<LACTOSE>\d*\.?\d*)\|s(?<SALT>\d*\.?\d*)\|W(?<WATER>\d*\.?\d*)\|T(?<TEMPERATURE>\d*\.?\d*)?\s*\&/;
        const extractValues = data?.match(regex);
        setSampleData((prev) => ({ ...prev, fat: extractValues?.groups.FAT }));
        setSampleData((prev) => ({ ...prev, snf: extractValues?.groups.SNF }));
        setSampleData((prev) => ({ ...prev, clr: extractValues?.groups.CLR }));
        setSampleData((prev) => ({
          ...prev,
          protein: extractValues?.groups.PROTEIN,
        }));
        setSampleData((prev) => ({
          ...prev,
          lactose: extractValues?.groups.LACTOSE,
        }));
        setSampleData((prev) => ({
          ...prev,
          salt: extractValues?.groups.SALT,
        }));
        setSampleData((prev) => ({
          ...prev,
          salt: extractValues?.groups.WATER,
        }));
        setSampleData((prev) => ({
          ...prev,
          temperature: extractValues?.groups.TEMPERATURE,
        }));
        if (result.status == 500) {
          setConnectionError("Couldn't connect");
        } else {
          setConnectionError("");
        }
      });
    };

    // MANUAL ENTRY
    const [allowManualEntry, setAllowManualEntry] = useState(true);
    let aadhaarNo;
    const [manualEntryFlag, setManualEntryFlag] = useState(false);
    const [errMessage, setErrorMessage] = useState("");
    const getManualEntryPermission = (userId, aadhaarNo) => {
      GetManualEntryPermission(
        (res) => {
          if (res.status === 200) {
            setAllowManualEntry(!allowManualEntry);
            setShowPermissionModal(!showPermissionModal);
            setManualEntryFlag(true);
          } else {
            setErrorMessage("Please enter a valid code.");
          }
        },
        userId,
        aadhaarNo
      );
    };

    const handleInputChange = (e) => {
      aadhaarNo = e.target.value;
    };

    if (allowManualEntry) {
      weighData.weightMode = "Automatic";
    } else {
      weighData.weightMode = "Manual";
    }

    useEffect(() => {
      getWaitingVehicles();
    }, [testDate]);
    const [waitingVehiclesCount, setWaitingVehiclesCount] = useState(0);
    const [waitingVehiclesData, setWaitingVehiclesData] = useState([]);

    const getWaitingVehicles = () => {
      GetWaitingVehicles((res) => {
        const { status, data, message } = res;
        if (status === 200) {
          // keep only vehicles whose tareWeight is null
          const pendingVehicles =
            data
              ?.filter((item) => item.tareWeight === null)
              .map((item) => item.vehicleNo) // just the vehicle object
              .filter(Boolean) || [];

          setWaitingVehiclesData(pendingVehicles);
          setWaitingVehiclesCount(pendingVehicles.length);
        } else {
          setWaitingVehiclesData([]);
          setWaitingVehiclesCount(0);
          // (your existing 403/500/token handling here if you want)
        }
      }, testDate);
    };

    return (
      <div className="weighbridge">
        <div className="weighbridge__container">
          <div className="weighbridge__header">
            <div className="weighbridge__header__section">
              <div className="weighbridge__header__section__main">
                <h5>Company: Verka</h5>
                <h4>{`${
                  !isCreateSample
                    ? "Composite Sample List"
                    : isEditSample
                    ? "Edit Composite Sample"
                    : "Create Composite Sample"
                }`}</h4>
              </div>
              <div className="weighbridge__header__section__bottom">
                <Header />
              </div>
            </div>
          </div>
          {isCreateSample ? (
            <>
              <CModal
                alignment="center"
                visible={showPermissionModal}
                onClose={() => {
                  setShowPermissionModal(false);
                  setErrorMessage("");
                  if (manualEntryFlag !== true) {
                    setAutomaticChecked(true);
                  }
                }}
              >
                <CModalHeader>
                  <CModalTitle>Enter Manager Password</CModalTitle>
                </CModalHeader>

                <CModalBody>
                  <CForm method="post" onSubmit="">
                    <CRow>
                      <CCol lg={12}>
                        <CFormLabel>Manager Authorization Required!</CFormLabel>
                        <CFormInput
                          size="sm"
                          type="password"
                          name="password"
                          id="password"
                          onChange={handleInputChange}
                          placeholder="Enter The Varification Code"
                        />
                      </CCol>
                    </CRow>
                    <span style={{ color: "red" }}>{errMessage}</span>
                    <br></br>
                    <div style={{ display: "flex" }}>
                      <CButton
                        //color="primary"
                        style={{
                          backgroundColor: "#0060f1",
                          marginRight: "15px",
                        }}
                        target="_blank"
                        onClick={() =>
                          getManualEntryPermission(userId, aadhaarNo)
                        }
                      >
                        Submit
                      </CButton>
                      <CButton
                        color="primary"
                        target="_blank"
                        style={{
                          backgroundColor: "gray",
                        }}
                        onClick={() => {
                          setShowPermissionModal(false);
                          setErrorMessage("");
                        }}
                      >
                        Cancel
                      </CButton>
                    </div>
                  </CForm>
                </CModalBody>
              </CModal>
              <div className="Cbody">
                <Paper elevation={3}>
                  <div className="container">
                    <div>
                      <CForm method="post" onSubmit="">
                        <CRow>
                          <CCol lg={12}>
                            <p style={{ fontWeight: "bold" }}>Statistics :</p>
                          </CCol>
                          <CCol lg={3}>
                            <CFormLabel htmlFor="nf-email">
                              Accepted : {accCount}
                            </CFormLabel>
                          </CCol>
                          <CCol lg={3}>
                            <CFormLabel htmlFor="nf-email">
                              Rejected : {rejCount}
                            </CFormLabel>
                          </CCol>
                          <CCol lg={3}>
                            <CFormLabel htmlFor="nf-email">
                              Vehicles Count for Day : {vehicleCount}
                            </CFormLabel>
                          </CCol>
                          <CCol lg={3}>
                            <CFormLabel htmlFor="nf-email">
                              Vehicles Test Pending : {waitingVehiclesCount}
                            </CFormLabel>
                          </CCol>
                        </CRow>
                        <br />
                        <CRow>
                          <hr />
                          <CCol lg={12}>
                            <p style={{ fontWeight: "bold" }}>
                              Vehicle Details :
                            </p>
                          </CCol>
                          <CCol lg={4}>
                            <CFormLabel htmlFor="nf-email">
                              Vehicle No.{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={selectedVehicleId || 0}
                              name="vehicleNo"
                              onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                setSelectedVehicleId(value || null);
                                handleVehicleDropDown("vehicleNo", value);

                                setSampleData((prev) => ({
                                  ...prev,
                                  vehicleNo: value || "",
                                }));
                              }}
                            >
                              <option value={0}>Select Vehicle No.</option>

                              {vehicleData.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.registrationNumber}
                                </option>
                              ))}
                            </CFormSelect>

                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.vehicleNo}
                            </p>
                          </CCol>
                          <CCol lg={4}>
                            <CFormLabel htmlFor="nf-email">
                              Product Group{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={selectedCategoryId}
                              name="productCategory"
                              onChange={(e) => {
                                handleProductCatDropDown(
                                  "productCategory",
                                  e.target.value
                                );
                              }}
                            >
                              <option value={0}>Select Product Group</option>
                              {productCategoryData?.length &&
                                productCategoryData?.map((option, index) => {
                                  return (
                                    <option key={index} value={option.id}>
                                      {option.categoryName}
                                    </option>
                                  );
                                })}
                            </CFormSelect>
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.productCategory}
                            </p>
                          </CCol>
                          <CCol lg={4}>
                            <CFormLabel htmlFor="nf-email">
                              Product Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={sampleData.productName}
                              name="productName"
                              onChange={(e) =>
                                handleProductNameDropDown(
                                  "productName",
                                  e.target.value
                                )
                              }
                            >
                              <option value={0}>Select Product</option>
                              {selectProductData?.length &&
                                selectProductData?.map((option, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={option.productName}
                                    >
                                      {option.productName}
                                    </option>
                                  );
                                })}
                            </CFormSelect>
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.productName}
                            </p>
                          </CCol>

                          <CCol lg={4}>
                            <CFormLabel htmlFor="nf-email">
                              Test Date <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <input
                              type="datetime-local"
                              className="time-control"
                              id="datetimeInput"
                              value={dateTimeValue}
                              disabled={true}
                              onChange={handleDateTimeChange}
                            />
                          </CCol>
                        </CRow>{" "}
                        <br />
                        <CRow>
                          <hr />

                          <CCol lg={2}>Milk Analyzer :</CCol>
                          <CCol lg={2}>
                            <CFormCheck
                              id="automatic"
                              label="Aautomatic"
                              onClick={handleCheckAutomatic}
                              defaultChecked={automaticChecked}
                            />
                          </CCol>
                          <CCol lg={2}>
                            <CFormCheck
                              id="manual"
                              label="Manual"
                              onClick={handleCheckManual}
                              defaultChecked={!automaticChecked}
                            />
                          </CCol>
                          <CCol lg={6}>
                            <CButton
                              style={{
                                border: 0,
                                backgroundColor: "#0e419d",
                                "margin-right": "15px",
                                "font-size": "0.8rem",
                              }}
                              onClick={getWeighbridgeLabData}
                            >
                              Read Values
                            </CButton>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol lg={2}>
                            <p style={{ fontWeight: "bold" }}>Parameter: </p>
                          </CCol>
                          <CCol lg={4}>Declared Values: </CCol>
                          <CCol lg={6}>
                            Measured Values:{" "}
                            <span style={{ color: "red" }}>*</span>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol lg={2}>
                            Fat% <span style={{ color: "red" }}>*</span>
                          </CCol>
                          <CCol lg={4}>
                            <CFormInput
                              size="sm"
                              type="Name"
                              name="declaredFat"
                              value={sampleData.declaredFat}
                              onChange={handleInput}
                              placeholder="Enter Fat%.."
                              aria-label="default input example"
                              disabled={true}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9.-]/g,
                                  ""
                                );
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.declaredFat}
                            </p>
                          </CCol>
                          <CCol lg={4}>
                            <CFormInput
                              size="sm"
                              type="Name"
                              name="fat"
                              value={sampleData.fat}
                              onChange={handleInput}
                              placeholder="Enter Fat%"
                              disabled={allowManualEntry}
                              aria-label="default input example"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9.-]/g,
                                  ""
                                );
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.fat}
                            </p>
                          </CCol>
                        </CRow>
                        <br />
                        <CRow>
                          <CCol lg={2}>
                            Snf%<span style={{ color: "red" }}>*</span>
                          </CCol>
                          <CCol lg={4}>
                            <CFormInput
                              size="sm"
                              type="Name"
                              name="declaredSnf"
                              value={sampleData.declaredSnf}
                              onChange={handleInput}
                              placeholder="Enter Snf%"
                              aria-label="default input example"
                              disabled={true}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9.-]/g,
                                  ""
                                );
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.declaredSnf}
                            </p>
                          </CCol>
                          <CCol lg={4}>
                            <CFormInput
                              size="sm"
                              type="Name"
                              name="snf"
                              value={sampleData.snf}
                              onChange={handleInput}
                              placeholder="Enter Snf%"
                              disabled={allowManualEntry}
                              aria-label="default input example"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9.-]/g,
                                  ""
                                );
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.snf}
                            </p>
                          </CCol>
                        </CRow>
                        <br />
                        <CRow>
                          <CCol lg={2}>
                            CLR<span style={{ color: "red" }}>*</span>
                          </CCol>
                          <CCol lg={4}>
                            <CFormInput
                              size="sm"
                              type="Name"
                              name="declaredClr"
                              value={sampleData.declaredClr}
                              onChange={handleInput}
                              placeholder="Enter CLR"
                              aria-label="default input example"
                              disabled={true}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9.-]/g,
                                  ""
                                );
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.declaredAcidity}
                            </p>
                          </CCol>
                          <CCol lg={4}>
                            <CFormInput
                              size="sm"
                              type="Name"
                              name="clr"
                              value={sampleData.clr}
                              onChange={handleInput}
                              placeholder="Enter CLR"
                              disabled={allowManualEntry}
                              aria-label="default input example"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9.-]/g,
                                  ""
                                );
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.clr}
                            </p>
                          </CCol>
                        </CRow>
                        <br />
                        <CRow>
                          <hr />
                          <CCol lg={4}>
                            <CFormLabel htmlFor="nf-email">
                              Analyst <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormInput
                              size="sm"
                              type="Name"
                              name="analyst"
                              value={sampleData.analyst}
                              onChange={handleInput}
                              placeholder="Enter Analyst"
                              aria-label="default input example"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^a-zA-Z\s]/g,
                                  ""
                                );
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.analyst}
                            </p>
                          </CCol>

                          <CCol lg={4}>
                            <CFormLabel htmlFor="nf-email">
                              Status <span style={{ color: "red" }}>*</span>
                            </CFormLabel>
                            <CFormSelect
                              size="sm"
                              value={sampleData.status}
                              name="status"
                              onChange={(e) => {
                                handleDropDownBridgeNo(
                                  "status",
                                  e.target.value
                                );
                              }}
                            >
                              <option value={0}>Select Value</option>
                              <option value={"Accepted"}>Accepted</option>
                              <option value={"Rejected"}>Rejected</option>
                            </CFormSelect>
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.status}
                            </p>
                          </CCol>
                          <CCol lg={4}>
                            <CFormLabel htmlFor="nf-email">Remarks</CFormLabel>
                            <CFormInput
                              size="sm"
                              type="Name"
                              name="remarks"
                              value={sampleData.remarks}
                              onChange={handleInput}
                              placeholder="Enter Remarks"
                              aria-label="default input example"
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^a-zA-Z\s]/g,
                                  ""
                                );
                              }}
                            />
                            <p style={{ color: "red", fontSize: "x-small" }}>
                              {sampleDataErr.remarks}
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
                            {isEditSample ? "Update" : "Save"}
                          </CButton>
                          <CButton
                            target="_blank"
                            style={{
                              border: 0,
                              backgroundColor: "lightslategrey",
                            }}
                            onClick={handleCancleSample}
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
              <div className="weighbridge__table">
                <div className="weighbridge__table__header">
                  <div className="weighbridge__table__header__section">
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
                      onClick={handleCreateSample}
                    >
                      Add Composite Sample
                    </button>
                  </div>
                </div>
                <div
                  className="weighbridge__table__body"
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
    );
  }
};

export default CompositeSampleTest;
