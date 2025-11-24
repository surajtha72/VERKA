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
import "./Product.scss";
import {
  CreateProductCategory,
  GetProductCategory,
  DeleteProductCategory,
  UpdateProductCategory,
  GetProductMaster,
  CreateProductMaster,
  UpdateProductMaster,
  DeleteProductMaster,
  GetProductPurchase,
  CreateProductPurchase,
  UpdateProductPurchase,
  DeleteProductPurchase,
} from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Paper } from "@mui/material";
import moment from "moment";
import Header from "../../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../../../components/loader";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const productCategoryColumn = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Category Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Short Description",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const productMasterColumn = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Product Category",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Product Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Description",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Supplier",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Batch No.",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "MFG Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Expiry Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_8",
    label: "Recorder Level",
    _props: { scope: "col" },
  },
  {
    key: "heading_9",
    label: "Lead Time(day)",
    _props: { scope: "col" },
  },
  {
    key: "heading_10",
    label: "Opening Balance Qty.",
    _props: { scope: "col" },
  },
  {
    key: "heading_11",
    label: "Opening Balance Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_12",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const productPurchaseColumn = [
  {
    key: "SlNo",
    label: "#",
    _props: { scope: "col" },
  },
  {
    key: "heading_1",
    label: "Product Name",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Purchase Date",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Invoice",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Actions",
    _props: { scope: "col" },
  },
];

const initialProductCategory = {
  categoryName: "",
  shortDescription: "",
};

const initialProductMaster = {
  productCategId: "",
  productName: "",
  description: "",
  supplierMake: "",
  batchNo: "",
  mfgDate: "",
  expDate: "",
  recorderLevel: "",
  leadTimeInDelay: "",
  unitQtyUomId: "",
  unitQtyPurchasePrice: "",
  unitQtySupplyPrice: "",
  taxOnSupply: "",
  unitQtyIncentiveAmount: "",
  openingBalanceQty: "",
  openingBalanceDate: "",
};

const initialProductPurchase = {
  productId: "",
  purchaseDate: "",
  invoiceNo: "",
  quantity: "",
};

const Product = () => {
  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const [permission, setPermission] = useState([]);
  const productCategoryItems = [];
  const productMasterItems = [];
  const productPurchaseItems = [];

  const [searchTermProductCategory, setSearchTermProductCategory] =
    useState("");
  const [searchTermProductMaster, setSearchTermProductMaster] = useState("");
  const [searchTermProductPurchase, setSearchTermProductPurchase] =
    useState("");

  const [isCreateProductCategory, setIsCreateProductCategory] = useState(false);
  const [isCreateProductMaster, setIsCreateProductMaster] = useState(false);
  const [isCreateProductPurchase, setIsCreateProductPurchase] = useState(false);

  const [isEditProductCategory, setIsEditProductCategory] = useState(false);
  const [isEditProductMaster, setIsEditProductMaster] = useState(false);
  const [isEditProductPurchase, setIsEditProductPurchase] = useState(false);

  const [productCategoryData, setProductCategoryData] = useState(
    initialProductCategory
  );
  const [productCategoryDataErr, setProductCategoryDataErr] = useState(
    initialProductCategory
  );
  const [productMasterData, setProductMasterData] =
    useState(initialProductMaster);
  const [productMasterDataErr, setProductMasterDataErr] =
    useState(initialProductMaster);
  const [productPurchaseData, setProductPurchaseData] = useState(
    initialProductPurchase
  );
  const [productPurchaseDataErr, setProductPurchaseDataErr] = useState(
    initialProductPurchase
  );

  const [alertText, setAlertText] = useState("");
  const [showOkModalCat, setShowOkModalCat] = useState(false);
  const [showConfirmModalCat, setShowConfirmModalCat] = useState(false);
  const [showOkModalMaster, setShowOkModalMaster] = useState(false);
  const [showConfirmModalMaster, setShowConfirmModalMaster] = useState(false);
  const [showOkModalPurchase, setShowOkModalPurchase] = useState(false);
  const [showConfirmModalPurchase, setShowConfirmModalPurchase] =
    useState(false);
  const [isId, setIsId] = useState();

  const [productCategoryTableData, setProductCategoryTableData] = useState([]);
  const [productMasterTableData, setProductMasterTableData] = useState([]);
  const [productPurchaseTableData, setProductPurchaseTableData] = useState([]);

  const [filteredProductCategory, setFilteredProductCategory] = useState([]);
  const [filteredProductMaster, setFilteredProductMaster] = useState([]);
  const [filteredProductPurchase, setFilteredProductPurchase] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthData) {
      const ProductPermissions = userAuthData?.permissions?.find(
        (val) => val?.Products
      );
      setPermission(ProductPermissions?.Products);
    }
  }, []);

  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  useEffect(() => {
    getProductCategory();
    getProductMaster();
    getProductPurchase();
  }, []);

  const getProductCategory = () => {
    setIsLoading(true); // Show the loading spinner
    GetProductCategory((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setProductCategoryTableData(data);
        setFilteredProductCategory(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowOkModalCat(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModalCat(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowOkModalCat(false);
        setAlertText("Something wrong happened in API");
        setShowConfirmModalCat(true);
        setIsLoading(false);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModalCat(true);
        setSessionOk(true);
      }
    });
  };

  const getProductMaster = () => {
    setIsLoading(true); // Show the loading spinner
    GetProductMaster((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setProductMasterTableData(data);
        setFilteredProductMaster(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowOkModalMaster(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModalMaster(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowOkModalMaster(false);
        setAlertText("Something wrong happened in API");
        setShowConfirmModalMaster(true);
        setIsLoading(false);
      }
      // else if (message.includes("Invalid access token")) {
      //   setAlertText("User Session has Expired");
      //   setShowConfirmModalMaster(true);
      //   setSessionOk(true);
      // }
    });
  };

  const getProductPurchase = () => {
    setIsLoading(true); // Show the loading spinner
    GetProductPurchase((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setProductPurchaseTableData(data);
        setFilteredProductPurchase(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowOkModalPurchase(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModalPurchase(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowOkModalPurchase(false);
        setAlertText("Something wrong happened in API");
        setShowConfirmModalPurchase(true);
        setIsLoading(false);
      }
      // else if (message.includes("Invalid access token")) {
      //   setAlertText("User Session has Expired");
      //   setShowConfirmModalPurchase(true);
      //   setSessionOk(true);
      // }
    });
  };

  useEffect(() => {
    filterProductCategoryData();
  }, [searchTermProductCategory]);

  useEffect(() => {
    filterProductMasterData();
  }, [searchTermProductMaster]);

  useEffect(() => {
    filterProductPurchaseData();
  }, [searchTermProductPurchase]);

  const filterProductCategoryData = () => {
    if (searchTermProductCategory === "") {
      setFilteredProductCategory(productCategoryTableData);
    } else {
      const filteredProductCategory = productCategoryTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTermProductCategory.toLowerCase())
        )
      );
      setFilteredProductCategory(filteredProductCategory);
    }
  };

  const filterProductMasterData = () => {
    if (searchTermProductMaster === "") {
      setFilteredProductMaster(productMasterTableData);
    } else {
      const filteredProductMaster = productMasterTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTermProductMaster.toLowerCase())
        )
      );
      setFilteredProductMaster(filteredProductMaster);
    }
  };

  const filterProductPurchaseData = () => {
    if (searchTermProductPurchase === "") {
      setFilteredProductPurchase(productPurchaseTableData);
    } else {
      const filteredProductPurchase = productPurchaseTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value !== null &&
            value
              .toString()
              .toLowerCase()
              .includes(searchTermProductPurchase.toLowerCase())
        )
      );
      setFilteredProductCategory(filteredProductPurchase);
    }
  };

  {
    filteredProductCategory?.map((val, ind) => {
      productCategoryItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.categoryName ? val?.categoryName : "--",
        heading_2: val?.shortDescription ? val?.shortDescription : "--",
        heading_3: (
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
              onClick={() => handleEditProductCategory(val?.id)}
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
                handleDeleteProductCategory(val?.id);
              }}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
      });
    });
  }

  {
    filteredProductMaster?.map((val, ind) => {
      productMasterItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.productCategId.CategoryName
          ? val?.productCategId.CategoryName
          : "--",
        heading_2: val?.productName ? val?.productName : "--",
        heading_3: val?.description ? val?.description : "--",
        heading_4: val?.supplierMake ? val?.supplierMake : "--",
        heading_5: val?.batchNo ? val?.batchNo : "--",
        heading_6: moment(val?.mfgDate).format("YYYY-MM-DD") ?? "--",
        heading_7: moment(val?.expDate).format("YYYY-MM-DD") ?? "--",
        heading_8: val?.recorderLevel ? val?.recorderLevel : "--",
        heading_9: val?.leadTimeInDelay ? val?.leadTimeInDelay : "--",
        heading_10: val?.openingBalanceQty ? val?.openingBalanceQty : "--",
        heading_11:
          moment(val?.openingBalanceDate).format("YYYY-MM-DD") ?? "--",
        heading_12: (
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
              onClick={() => handleEditProductMaster(val?.id)}
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
                handleDeleteProductMaster(val?.id);
              }}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
      });
    });
  }

  {
    filteredProductPurchase?.map((val, ind) => {
      productPurchaseItems.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.productId.ProductName
          ? val?.productId.ProductName
          : "--",
        heading_2: moment(val?.purchaseDate).format("YYYY-MM-DD") ?? "--",
        heading_3: val?.invoiceNo ? val?.invoiceNo : "--",
        heading_4: val?.quantity ? val?.quantity : "--",
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
              onClick={() => handleEditProductPurchase(val?.id)}
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
              onClick={() => handleDeleteProductPurchase(val?.id)}
            >
              <DeleteOutlinedIcon />
            </button>
          </div>
        ),
      });
    });
  }

  const handleSearchProductCategory = (event) => {
    setSearchTermProductCategory(event.target.value);
  };
  const handleSearchProductMaster = (event) => {
    setSearchTermProductMaster(event.target.value);
  };
  const handleSearchProductPurchase = (event) => {
    setSearchTermProductPurchase(event.target.value);
  };

  const handleCreateProductCategory = () => {
    setIsCreateProductCategory(!isCreateProductCategory);
    setIsEditProductCategory(false);
  };
  const handleCreateProductMaster = () => {
    setIsCreateProductMaster(!isCreateProductMaster);
    getProductCategory();
    setIsEditProductMaster(false);
  };
  const handleCreateProductPurchase = () => {
    setIsCreateProductPurchase(!isCreateProductPurchase);
    getProductMaster();
    setIsEditProductPurchase(false);
  };

  const handleCancleProductCategory = () => {
    setIsCreateProductCategory(!isCreateProductCategory);
    clearProductCategory();
    setIsEditProductCategory(false);
  };
  const handleCancleProductMaster = () => {
    setIsCreateProductMaster(!isCreateProductMaster);
    clearProductMaster();
    setIsEditProductMaster(false);
  };
  const handleCancleProductPurchase = () => {
    setIsCreateProductPurchase(!isCreateProductPurchase);
    clearProductPurchase();
    setIsEditProductPurchase(false);
  };

  const handleInputProductCategory = (e) => {
    const { name, value } = e.target;
    setProductCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProductCategoryDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleInputProductMaster = (e) => {
    const { name, value } = e.target;
    setProductMasterData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProductMasterDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleInputProductPurchase = (e) => {
    const { name, value } = e.target;
    setProductPurchaseData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProductPurchaseDataErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleDropDownCategory = (name, value) => {
    setProductMasterData((prev) => ({ ...prev, [name]: value }));
    setProductMasterDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDropDownMaster = (name, value) => {
    setProductPurchaseData((prev) => ({ ...prev, [name]: value }));
    setProductPurchaseDataErr((prev) => ({ ...prev, [name]: "" }));
  };

  const clearProductCategory = () => {
    setProductCategoryData(initialProductCategory);
    setIsId(null);
  };
  const clearProductMaster = () => {
    setProductMasterData(initialProductMaster);
    setIsId(null);
  };
  const clearProductPurchase = () => {
    setProductPurchaseData(initialProductPurchase);
    setIsId(null);
  };

  const handleConfirm = () => {
    setShowConfirmModalCat(false);
    setIsCreateProductCategory(isCreateProductCategory);
    setIsEditProductCategory(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };
  const handleConfirmProductMaster = () => {
    setShowConfirmModalMaster(false);
    setIsCreateProductMaster(isCreateProductMaster);
    setIsEditProductMaster(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };
  const handleConfirmProductPurchase = () => {
    setShowConfirmModalPurchase(false);
    setIsCreateProductPurchase(isCreateProductPurchase);
    setIsEditProductPurchase(false);
    if (sessionOk) {
      localStorage.clear();
      navigate("/");
    }
  };

  const validateProductCategory = () => {
    let errObj = { ...initialProductCategory };

    if (!productCategoryData.categoryName) {
      errObj.categoryName = "This field is required";
    } else {
      errObj.categoryName = "";
    }
    if (!productCategoryData.shortDescription) {
      errObj.shortDescription = "This field is required";
    } else {
      errObj.shortDescription = "";
    }

    setProductCategoryDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const validateProductMaster = () => {
    let errObj = { ...initialProductMaster };

    if (!productMasterData.productCategId) {
      errObj.productCategId = "This field is required";
    } else if (productMasterData.productCategId == 0) {
      errObj.productCategId = "This field is required";
    } else {
      errObj.productCategId = "";
    }
    if (!productMasterData.productName) {
      errObj.productName = "This field is required";
    } else {
      errObj.productName = "";
    }
    if (!productMasterData.description) {
      errObj.description = "This field is required";
    } else {
      errObj.description = "";
    }
    if (!productMasterData.supplierMake) {
      errObj.supplierMake = "This field is required";
    } else {
      errObj.supplierMake = "";
    }
    if (!productMasterData.batchNo) {
      errObj.batchNo = "This field is required";
    } else {
      errObj.batchNo = "";
    }
    if (!productMasterData.mfgDate) {
      errObj.mfgDate = "This field is required";
    } else {
      errObj.mfgDate = "";
    }
    if (!productMasterData.expDate) {
      errObj.expDate = "This field is required";
    } else {
      errObj.expDate = "";
    }
    if (!productMasterData.recorderLevel) {
      errObj.recorderLevel = "This field is required";
    } else {
      errObj.recorderLevel = "";
    }
    if (!productMasterData.leadTimeInDelay) {
      errObj.leadTimeInDelay = "This field is required";
    } else {
      errObj.leadTimeInDelay = "";
    }
    if (!productMasterData.unitQtyUomId) {
      errObj.unitQtyUomId = "This field is required";
    } else {
      errObj.unitQtyUomId = "";
    }
    if (!productMasterData.unitQtyPurchasePrice) {
      errObj.unitQtyPurchasePrice = "This field is required";
    } else {
      errObj.unitQtyPurchasePrice = "";
    }
    if (!productMasterData.unitQtySupplyPrice) {
      errObj.unitQtySupplyPrice = "This field is required";
    } else {
      errObj.unitQtySupplyPrice = "";
    }
    if (!productMasterData.taxOnSupply) {
      errObj.taxOnSupply = "This field is required";
    } else {
      errObj.taxOnSupply = "";
    }
    if (!productMasterData.unitQtyIncentiveAmount) {
      errObj.unitQtyIncentiveAmount = "This field is required";
    } else {
      errObj.unitQtyIncentiveAmount = "";
    }
    if (!productMasterData.openingBalanceQty) {
      errObj.openingBalanceQty = "This field is required";
    } else {
      errObj.openingBalanceQty = "";
    }
    if (!productMasterData.openingBalanceDate) {
      errObj.openingBalanceDate = "This field is required";
    } else {
      errObj.openingBalanceDate = "";
    }

    setProductMasterDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const validateProductPurchase = () => {
    let errObj = { ...initialProductPurchase };

    if (!productPurchaseData.productId) {
      errObj.productId = "This field is required";
    } else if (productPurchaseData.productId == 0) {
      errObj.productId = "This field is required";
    } else {
      errObj.productId = "";
    }
    if (!productPurchaseData.purchaseDate) {
      errObj.purchaseDate = "This field is required";
    } else {
      errObj.purchaseDate = "";
    }
    if (!productPurchaseData.invoiceNo) {
      errObj.invoiceNo = "This field is required";
    } else {
      errObj.invoiceNo = "";
    }
    if (!productPurchaseData.quantity) {
      errObj.quantity = "This field is required";
    } else {
      errObj.quantity = "";
    }

    setProductPurchaseDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };

  const submitProductCategory = () => {
    if (validateProductCategory()) {
      const payload = {
        categoryName: productCategoryData.categoryName,
        shortDescription: productCategoryData.shortDescription,
      };
      if (isId) {
        payload.id = isId;
        UpdateProductCategory((res) => {
          const { status, message } = res;
          if (status === 200) {
            getProductCategory();
            setIsId(null);
            setIsCreateProductCategory(!isCreateProductCategory);
            setAlertText(message);
            setProductCategoryData(initialProductCategory);
            setProductCategoryDataErr(initialProductCategory);
            setShowConfirmModalCat(true);
            setIsEditProductCategory(false);
          } else if (status === 403) {
            setShowOkModalCat(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModalCat(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowOkModalCat(false);
            setAlertText("Something wrong happened in API");
            setShowConfirmModalCat(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModalCat(true);
            setSessionOk(true);
          }
        }, payload);
      } else {
        CreateProductCategory((res) => {
          const { status, message } = res;
          if (status === 200) {
            clearProductCategory();
            getProductCategory();
            setIsId(null);
            setIsCreateProductCategory(!isCreateProductCategory);
            setAlertText(message);
            setProductCategoryData(initialProductCategory);
            setProductCategoryDataErr(initialProductCategory);
            setShowConfirmModalCat(true);
            setIsEditProductCategory(false);
          } else if (status === 403) {
            setShowOkModalCat(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModalCat(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowOkModalCat(false);
            setAlertText("Something wrong happened in API");
            setShowConfirmModalCat(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModalCat(true);
            setSessionOk(true);
          }
        }, payload);
      }
    }
  };

  const submitProductMaster = () => {
    // console.log(validateProductMaster());
    if (validateProductMaster()) {
      const payload = {
        productCategId: productMasterData.productCategId,
        productName: productMasterData.productName,
        description: productMasterData.description,
        supplierMake: productMasterData.supplierMake,
        batchNo: productMasterData.batchNo,
        mfgDate: productMasterData.mfgDate,
        expDate: productMasterData.expDate,
        recorderLevel: productMasterData.recorderLevel,
        leadTimeInDelay: productMasterData.leadTimeInDelay,
        unitQtyUomId: productMasterData.unitQtyUomId,
        unitQtyPurchasePrice: productMasterData.unitQtyPurchasePrice,
        unitQtySupplyPrice: productMasterData.unitQtySupplyPrice,
        taxOnSupply: productMasterData.taxOnSupply,
        unitQtyIncentiveAmount: productMasterData.unitQtyIncentiveAmount,
        openingBalanceQty: productMasterData.openingBalanceQty,
        openingBalanceDate: productMasterData.openingBalanceDate,
      };
      if (isId) {
        payload.id = isId;
        UpdateProductMaster((res) => {
          const { status, message } = res;
          if (status === 200) {
            getProductMaster();
            setIsId(null);
            setIsCreateProductMaster(!isCreateProductMaster);
            setAlertText(message);
            setProductMasterData(initialProductMaster);
            setProductMasterDataErr(initialProductMaster);
            setShowConfirmModalMaster(true);
            setIsEditProductMaster(false);
          } else if (status === 403) {
            setShowOkModalMaster(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModalMaster(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowOkModalMaster(false);
            setAlertText("Something wrong happened in API");
            setShowConfirmModalMaster(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModalMaster(true);
            setSessionOk(true);
          }
        }, payload);
      } else {
        CreateProductMaster((res) => {
          const { status, message } = res;
          if (status === 200) {
            clearProductMaster();
            getProductMaster();
            setIsId(null);
            setIsCreateProductMaster(!isCreateProductMaster);
            setAlertText(message);
            setProductMasterData(initialProductMaster);
            setProductMasterDataErr(initialProductMaster);
            setShowConfirmModalMaster(true);
            setIsEditProductMaster(false);
          } else if (status === 403) {
            setShowOkModalMaster(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModalMaster(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowOkModalMaster(false);
            setAlertText("Something wrong happened in API");
            setShowConfirmModalMaster(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModalMaster(true);
            setSessionOk(true);
          }
        }, payload);
      }
    }
  };

  const submitProductPurchase = () => {
    // console.log(validateProductPurchase());
    // console.log(productPurchaseData);
    if (validateProductPurchase()) {
      const payload = {
        productId: productPurchaseData.productId,
        purchaseDate: productPurchaseData.purchaseDate,
        invoiceNo: productPurchaseData.invoiceNo,
        quantity: productPurchaseData.quantity,
      };
      // console.log("payload", payload);
      if (isId) {
        payload.id = isId;
        UpdateProductPurchase((res) => {
          const { status, message } = res;
          if (status === 200) {
            getProductPurchase();
            setIsId(null);
            setShowConfirmModalPurchase(!isCreateProductPurchase);
            setAlertText(message);
            setProductPurchaseData(initialProductPurchase);
            setProductPurchaseDataErr(initialProductPurchase);
            setShowConfirmModalPurchase(true);
            setIsEditProductPurchase(false);
          } else if (status === 403) {
            setShowOkModalPurchase(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModalPurchase(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowOkModalPurchase(false);
            setAlertText("Something wrong happened in API");
            setShowConfirmModalPurchase(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModalPurchase(true);
            setSessionOk(true);
          }
        }, payload);
      } else {
        CreateProductPurchase((res) => {
          const { status, message } = res;
          if (status === 200) {
            clearProductPurchase();
            getProductPurchase();
            setIsId(null);
            setIsCreateProductPurchase(!isCreateProductPurchase);
            setAlertText(message);
            setProductPurchaseData(initialProductPurchase);
            setProductPurchaseDataErr(initialProductPurchase);
            setShowConfirmModalPurchase(true);
            setIsEditProductPurchase(false);
          } else if (status === 403) {
            setShowOkModalPurchase(false);
            setAlertText("You don't have access to perform this operation");
            setShowConfirmModalPurchase(true);
            setIsLoading(false);
          } else if (status === 500) {
            setShowOkModalPurchase(false);
            setAlertText("Something wrong happened in API");
            setShowConfirmModalPurchase(true);
            setIsLoading(false);
          } else if (message.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModalPurchase(true);
            setSessionOk(true);
          }
        }, payload);
      }
    }
  };

  const handleEditProductCategory = (id) => {
    setIsCreateProductCategory(!isCreateProductCategory);
    setIsEditProductCategory(true);
    const payload = {
      id: productCategoryTableData.find((role) => role.id === id)?.id,
    };
    // console.log(productCategoryTableData)
    setProductCategoryData(
      {
        categoryName: productCategoryTableData.find((role) => role.id === id)
          ?.categoryName,
        shortDescription: productCategoryTableData.find(
          (role) => role.id === id
        )?.shortDescription,
      },
      payload
    );
    setIsId(productCategoryTableData.find((role) => role.id === id)?.id);
  };

  const handleEditProductMaster = (id) => {
    setIsCreateProductMaster(!isCreateProductMaster);
    setIsEditProductMaster(true);
    const payload = {
      id: productMasterTableData.find((role) => role.id === id)?.id,
    };
    // console.log('Payload: ', payload);
    // console.log('Table data: ', productMasterTableData)

    setProductMasterData(
      {
        productCategId: productMasterTableData.find((role) => role.id === id)
          ?.productCategId.Id,
        productName: productMasterTableData.find((role) => role.id === id)
          ?.productName,
        description: productMasterTableData.find((role) => role.id === id)
          ?.description,
        supplierMake: productMasterTableData.find((role) => role.id === id)
          ?.supplierMake,
        batchNo: productMasterTableData.find((role) => role.id === id)?.batchNo,
        mfgDate:
          moment(
            productMasterTableData.find((role) => role.id === id)?.mfgDate
          ).format("YYYY-MM-DD") || "",
        expDate:
          moment(
            productMasterTableData.find((role) => role.id === id)?.expDate
          ).format("YYYY-MM-DD") || "",
        recorderLevel: productMasterTableData.find((role) => role.id === id)
          ?.recorderLevel,
        leadTimeInDelay: productMasterTableData.find((role) => role.id === id)
          ?.leadTimeInDelay,
        unitQtyUomId: productMasterTableData.find((role) => role.id === id)
          ?.unitQtyUomId,
        unitQtyPurchasePrice: productMasterTableData.find(
          (role) => role.id === id
        )?.unitQtyPurchasePrice,
        unitQtySupplyPrice: productMasterTableData.find(
          (role) => role.id === id
        )?.unitQtySupplyPrice,
        taxOnSupply: productMasterTableData.find((role) => role.id === id)
          ?.taxOnSupply,
        unitQtyIncentiveAmount: productMasterTableData.find(
          (role) => role.id === id
        )?.unitQtyIncentiveAmount,
        openingBalanceQty: productMasterTableData.find((role) => role.id === id)
          ?.openingBalanceQty,
        openingBalanceDate:
          moment(
            productMasterTableData.find((role) => role.id === id)
              ?.openingBalanceDate
          ).format("YYYY-MM-DD") || "",
      },
      payload
    );
    setIsId(productMasterTableData.find((role) => role.id === id)?.id);
  };

  const handleEditProductPurchase = (id) => {
    setIsCreateProductPurchase(!isCreateProductPurchase);
    setIsEditProductPurchase(true);
    const payload = {
      id: productPurchaseTableData.find((role) => role.id === id)?.id,
    };

    setProductPurchaseData(
      {
        productId: productPurchaseTableData.find((role) => role.id === id)
          ?.productId.Id,
        purchaseDate:
          moment(
            productPurchaseTableData.find((role) => role.id === id)
              ?.purchaseDate
          ).format("YYYY-MM-DD") || "",
        invoiceNo: productPurchaseTableData.find((role) => role.id === id)
          ?.invoiceNo,
        quantity: productPurchaseTableData.find((role) => role.id === id)
          ?.quantity,
      },
      payload
    );
    setIsId(productPurchaseTableData.find((role) => role.id === id)?.id);
  };

  const handleDeleteProductCategory = (id) => {
    setShowOkModalCat(true);
    setIsId(id);
  };

  const handleDeleteProductMaster = (id) => {
    setShowOkModalMaster(true);
    setIsId(id);
  };

  const handleDeleteProductPurchase = (id) => {
    setShowOkModalPurchase(true);
    setIsId(id);
  };

  const handleOk = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteProductCategory((res) => {
        const { status, message } = res;
        if (status === 200) {
          getProductCategory();
          setIsId(null);
          //setShowOkModalCat(false);
          setAlertText(message);
          setShowConfirmModalCat(true);
        } else if (status === 403) {
          setShowOkModalCat(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModalCat(true);
          setIsLoading(false);
        } else if (status === 500) {
          setShowOkModalCat(false);
          setAlertText("Something wrong happened in API");
          setShowConfirmModalCat(true);
          setIsLoading(false);
        } else if (message.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModalCat(true);
          setSessionOk(true);
        }
      }, payload);
    }
  };

  const handleOkProductMaster = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteProductMaster((res) => {
        const { status, message } = res;
        if (status === 200) {
          getProductMaster();
          setIsId(null);
          //setShowOkModalMaster(false);
          setAlertText(message);
          setShowConfirmModalMaster(true);
        } else if (status === 403) {
          setShowOkModalMaster(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModalMaster(true);
          setIsLoading(false);
        } else if (status === 500) {
          setShowOkModalMaster(false);
          setAlertText("Something wrong happened in API");
          setShowConfirmModalMaster(true);
          setIsLoading(false);
        } else if (message.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModalMaster(true);
          setSessionOk(true);
        }
      }, payload);
    }
  };

  const handleOkProductPurchase = () => {
    const payload = {
      id: isId,
    };
    if (isId != null) {
      DeleteProductPurchase((res) => {
        const { status, message } = res;
        if (status === 200) {
          getProductPurchase();
          setIsId(null);
          //setShowOkModalPurchase(false);
          setAlertText(message);
          setShowConfirmModalPurchase(true);
        } else if (status === 403) {
          setShowOkModalPurchase(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModalPurchase(true);
          setIsLoading(false);
        } else if (status === 500) {
          setShowOkModalPurchase(false);
          setAlertText("Something wrong happened in API");
          setShowConfirmModalPurchase(true);
          setIsLoading(false);
        } else if (message.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModalPurchase(true);
          setSessionOk(true);
        }
      }, payload);
    }
  };

  return (
    <>
      {token ? (
        <>
          <div className="product">
            <div className="product__container">
              <div className="product__header">
                <div className="product__header__section">
                  <div className="product__header__section__main">
                    <h5>Company: Verka</h5>
                    <h4>{`Product`}</h4>
                  </div>
                  <div className="product__header__section__bottom">
                    <Header />
                  </div>
                </div>
              </div>
              <Tabs>
                <TabList>
                  {/* {!isCreateRoutesType && !isCreateRoutesMaster ? (
                  <> */}
                  <Tab>Product Category</Tab>
                  <Tab>Product Master</Tab>
                  <Tab>Product Purchase Quantity</Tab>
                  {/* </>
                ) : (
                  <></>
                )} */}
                </TabList>
                <TabPanel>
                  {isCreateProductCategory ? (
                    <>
                      <div className="Cbody">
                        <Paper elevation={3}>
                          <div className="container">
                            <br></br>
                            <div>
                              <CForm method="post">
                                <CRow>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Category Name
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="Name"
                                      value={productCategoryData.categoryName}
                                      onChange={handleInputProductCategory}
                                      name="categoryName"
                                      placeholder="Enter Category Name.."
                                    />

                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productCategoryDataErr.categoryName}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Short Description
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="Name"
                                      value={
                                        productCategoryData.shortDescription
                                      }
                                      onChange={handleInputProductCategory}
                                      name="shortDescription"
                                      placeholder="Enter Short Description.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productCategoryDataErr.shortDescription}
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
                                    onClick={submitProductCategory}
                                  >
                                    {isEditProductCategory ? "Update" : "Save"}
                                  </CButton>
                                  <CButton
                                    target="_blank"
                                    style={{
                                      border: 0,
                                      backgroundColor: "lightslategrey",
                                    }}
                                    onClick={handleCancleProductCategory}
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
                      <div className="product__table">
                        <div className="product__table__header">
                          <div className="product__table__header__section">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search"
                              value={searchTermProductCategory}
                              onChange={handleSearchProductCategory}
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
                              onClick={handleCreateProductCategory}
                            >
                              Add Product Category
                            </button>
                          </div>
                        </div>
                        <div
                          className="product__table__body"
                          style={{ height: "50vh", overflowY: "scroll" }}
                        >
                          {isLoading ? (
                            <Loader />
                          ) : (
                            <CTable
                              columns={productCategoryColumn}
                              items={productCategoryItems}
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
                  {isCreateProductMaster ? (
                    <>
                      <div className="Cbody">
                        <Paper elevation={3}>
                          <div className="container">
                            <br></br>
                            <div>
                              <CForm method="post">
                                <CRow>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Product Category
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormSelect
                                      size="sm"
                                      name="productCategId"
                                      value={productMasterData.productCategId}
                                      onChange={(e) => {
                                        handleDropDownCategory(
                                          "productCategId",
                                          e.target.value
                                        );
                                      }}
                                    >
                                      <option value={0}>
                                        Select Product Category
                                      </option>
                                      {productCategoryTableData?.length &&
                                        productCategoryTableData?.map(
                                          (option, index) => {
                                            return (
                                              <option
                                                key={index}
                                                value={option.id}
                                              >
                                                {option.categoryName}
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
                                      {productMasterDataErr.productCategId}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Product Name
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="Name"
                                      value={productMasterData.productName}
                                      onChange={handleInputProductMaster}
                                      name="productName"
                                      placeholder="Enter Product Name.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.productName}
                                    </span>
                                  </CCol>

                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Description
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="Name"
                                      value={productMasterData.description}
                                      onChange={handleInputProductMaster}
                                      name="description"
                                      placeholder="Enter Description.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.description}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Supplier
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="Name"
                                      value={productMasterData.supplierMake}
                                      onChange={handleInputProductMaster}
                                      name="supplierMake"
                                      placeholder="Enter Supplier.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.supplierMake}
                                    </span>
                                  </CCol>

                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Batch Number
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="Name"
                                      value={productMasterData.batchNo}
                                      onChange={handleInputProductMaster}
                                      name="batchNo"
                                      placeholder="Enter Batch No.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.batchNo}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Mfg Date
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="date"
                                      value={productMasterData.mfgDate}
                                      onChange={handleInputProductMaster}
                                      name="mfgDate"
                                    // placeholder="Enter Batch No.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.mfgDate}
                                    </span>
                                  </CCol>

                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Expiry Date
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="date"
                                      value={productMasterData.expDate}
                                      onChange={handleInputProductMaster}
                                      name="expDate"
                                    // placeholder="Enter Batch No.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.expDate}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Recorder Level
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={productMasterData.recorderLevel}
                                      onChange={handleInputProductMaster}
                                      name="recorderLevel"
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
                                          ""
                                        );
                                      }}
                                      placeholder="Enter Recorder Level.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.recorderLevel}
                                    </span>
                                  </CCol>

                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Lead Time in Delay
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={productMasterData.leadTimeInDelay}
                                      onChange={handleInputProductMaster}
                                      name="leadTimeInDelay"
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
                                          ""
                                        );
                                      }}
                                      placeholder="Enter Lead Time.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.leadTimeInDelay}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Unit Quantity
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={productMasterData.unitQtyUomId}
                                      onChange={handleInputProductMaster}
                                      name="unitQtyUomId"
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
                                          ""
                                        );
                                      }}
                                      placeholder="Enter Unit Quantity.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.unitQtyUomId}
                                    </span>
                                  </CCol>

                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Unit Quantity Purchase Price
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={
                                        productMasterData.unitQtyPurchasePrice
                                      }
                                      onChange={handleInputProductMaster}
                                      name="unitQtyPurchasePrice"
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
                                          ""
                                        );
                                      }}
                                      placeholder="Enter Unit Qty Purchase price.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {
                                        productMasterDataErr.unitQtyPurchasePrice
                                      }
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Unit Quantity Supply Price
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={
                                        productMasterData.unitQtySupplyPrice
                                      }
                                      onChange={handleInputProductMaster}
                                      name="unitQtySupplyPrice"
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
                                          ""
                                        );
                                      }}
                                      placeholder="Enter Unit Qty Supply price.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.unitQtySupplyPrice}
                                    </span>
                                  </CCol>

                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Tax On Supply
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={productMasterData.taxOnSupply}
                                      onChange={handleInputProductMaster}
                                      name="taxOnSupply"
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
                                          ""
                                        );
                                      }}
                                      placeholder="Enter Tax.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.taxOnSupply}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Unit Quantity Incentive Amount
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={
                                        productMasterData.unitQtyIncentiveAmount
                                      }
                                      onChange={handleInputProductMaster}
                                      name="unitQtyIncentiveAmount"
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
                                          ""
                                        );
                                      }}
                                      placeholder="Enter Incentive Amount.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {
                                        productMasterDataErr.unitQtyIncentiveAmount
                                      }
                                    </span>
                                  </CCol>

                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Opening Balance Quantity
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={
                                        productMasterData.openingBalanceQty
                                      }
                                      onChange={handleInputProductMaster}
                                      name="openingBalanceQty"
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
                                          ""
                                        );
                                      }}
                                      placeholder="Enter Opening Balance.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.openingBalanceQty}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Opening Balance Date
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="date"
                                      value={
                                        productMasterData.openingBalanceDate
                                      }
                                      onChange={handleInputProductMaster}
                                      name="openingBalanceDate"
                                    // placeholder="Enter Batch No.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productMasterDataErr.openingBalanceDate}
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
                                    onClick={submitProductMaster}
                                  >
                                    {isEditProductMaster ? "Update" : "Save"}
                                  </CButton>
                                  <CButton
                                    target="_blank"
                                    style={{
                                      border: 0,
                                      backgroundColor: "lightslategrey",
                                    }}
                                    onClick={handleCancleProductMaster}
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
                      <div className="product__table">
                        <div className="product__table__header">
                          <div className="product__table__header__section">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search"
                              value={searchTermProductCategory}
                              onChange={handleSearchProductMaster}
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
                              onClick={handleCreateProductMaster}
                            >
                              Add Product Master
                            </button>
                          </div>
                        </div>
                        <div
                          className="product__table__body"
                          style={{ height: "50vh", overflowY: "scroll" }}
                        >
                          {isLoading ? (
                            <Loader />
                          ) : (
                            <CTable
                              columns={productMasterColumn}
                              items={productMasterItems}
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
                  {isCreateProductPurchase ? (
                    <>
                      <div className="Cbody">
                        <Paper elevation={3}>
                          <div className="container">
                            <br></br>
                            <div>
                              <CForm method="post">
                                <CRow>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Product
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormSelect
                                      size="sm"
                                      name="productId"
                                      value={productPurchaseData.productId}
                                      onChange={(e) => {
                                        handleDropDownMaster(
                                          "productId",
                                          e.target.value
                                        );
                                      }}
                                    >
                                      <option value={0}>Select Product</option>
                                      {productMasterTableData?.length &&
                                        productMasterTableData?.map(
                                          (option, index) => {
                                            return (
                                              <option
                                                key={index}
                                                value={option.id}
                                              >
                                                {option.productName}
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
                                      {productPurchaseDataErr.productId}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Purchase Date
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="date"
                                      value={productPurchaseData.purchaseDate}
                                      onChange={handleInputProductPurchase}
                                      name="purchaseDate"
                                    // placeholder="Enter P Description.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productPurchaseDataErr.purchaseDate}
                                    </span>
                                  </CCol>

                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Invoice No
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={productPurchaseData.invoiceNo}
                                      onChange={handleInputProductPurchase}
                                      name="invoiceNo"
                                      placeholder="Enter Invoice.."
                                    />
                                    <span
                                      style={{
                                        color: "red",
                                        fontSize: "x-small",
                                      }}
                                    >
                                      {productPurchaseDataErr.invoiceNo}
                                    </span>
                                  </CCol>
                                  <CCol lg={6}>
                                    <CFormLabel htmlFor="nf-email">
                                      Quantity
                                      <span style={{ color: "red" }}>*</span>
                                    </CFormLabel>

                                    <CFormInput
                                      size="sm"
                                      type="name"
                                      value={productPurchaseData.quantity}
                                      onChange={handleInputProductPurchase}
                                      name="quantity"
                                      placeholder="Enter Quantity.."
                                      onInput={(e) => {
                                        e.target.value = e.target.value.replace(
                                          /[^0-9.-]/g,
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
                                      {productPurchaseDataErr.quantity}
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
                                    onClick={submitProductPurchase}
                                  >
                                    {isEditProductPurchase ? "Update" : "Save"}
                                  </CButton>
                                  <CButton
                                    target="_blank"
                                    style={{
                                      border: 0,
                                      backgroundColor: "lightslategrey",
                                    }}
                                    onClick={handleCancleProductPurchase}
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
                      <div className="product__table">
                        <div className="product__table__header">
                          <div className="product__table__header__section">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search"
                              value={searchTermProductPurchase}
                              onChange={handleSearchProductPurchase}
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
                              onClick={handleCreateProductPurchase}
                            >
                              Add Product Purchase
                            </button>
                          </div>
                        </div>
                        <div
                          className="product__table__body"
                          style={{ height: "50vh", overflowY: "scroll" }}
                        >
                          {isLoading ? (
                            <Loader />
                          ) : (
                            <CTable
                              columns={productPurchaseColumn}
                              items={productPurchaseItems}
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
              </Tabs>
            </div>
            {showOkModalCat && (
              <Confirm
                buttonText={"OK"}
                isCancelRequired={true}
                confirmTitle={"Are you sure ?"}
                onConfirm={() => {
                  handleOk();
                }}
                onCancel={() => {
                  setShowOkModalCat(false);
                }}
              />
            )}
            {showConfirmModalCat && (
              <Confirm
                buttonText={"OK"}
                isCancelRequired={false}
                confirmTitle={alertText}
                onConfirm={() => {
                  handleConfirm();
                }}
                onCancel={() => {
                  setShowConfirmModalCat(false);
                  setSessionOk(true);
                }}
              />
            )}

            {showOkModalMaster && (
              <Confirm
                buttonText={"OK"}
                isCancelRequired={true}
                confirmTitle={"Are you sure ?"}
                onConfirm={() => {
                  handleOkProductMaster();
                }}
                onCancel={() => {
                  setShowOkModalMaster(false);
                }}
              />
            )}
            {showConfirmModalMaster && (
              <Confirm
                buttonText={"OK"}
                isCancelRequired={false}
                confirmTitle={alertText}
                onConfirm={() => {
                  handleConfirmProductMaster();
                }}
                onCancel={() => {
                  setShowConfirmModalMaster(false);
                  setSessionOk(true);
                }}
              />
            )}

            {showOkModalPurchase && (
              <Confirm
                buttonText={"OK"}
                isCancelRequired={true}
                confirmTitle={"Are you sure ?"}
                onConfirm={() => {
                  handleOkProductPurchase();
                }}
                onCancel={() => {
                  setShowOkModalPurchase(false);
                }}
              />
            )}
            {showConfirmModalPurchase && (
              <Confirm
                buttonText={"OK"}
                isCancelRequired={false}
                confirmTitle={alertText}
                onConfirm={() => {
                  handleConfirmProductPurchase();
                }}
                onCancel={() => {
                  setShowConfirmModalPurchase(false);
                  setSessionOk(true);
                }}
              />
            )}
          </div>
        </>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default Product;
