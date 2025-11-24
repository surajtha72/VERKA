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
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import "./Product.scss";
import { CPagination, CPaginationItem } from "@coreui/react";
import {
  GetUser,
  GetProductMaster,
  GetApprovedProductSupplyIndent,
  UpdateProductSupply,
  GetProductSupplyDispatch,
  GetDropDownOrganization,
  GetIndentProducts,
  GetProductSupply,
  UpdateIndentProducts,
  GetProductSupplyIndent,
  UpdateProductStock
} from "../../../utils/apiCalls";
import "react-tabs/style/react-tabs.css";
import { Paper } from "@mui/material";
import moment from "moment";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Loader from "../../../components/loader";
import Confirm from "../../../components/confirmModal/confirm";

const productSupplyColumn = [
  // {
  //   key: "SlNo",
  //   label: "#",
  //   _props: { scope: "col" },
  // },
  {
    key: "heading_1",
    label: "Indent Raised For",
    _props: { scope: "col" },
  },
  {
    key: "heading_2",
    label: "Indent Raised On",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Requested By",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Status",
    _props: { scope: "col" },
  },
];

const indentedProducts = [
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
    label: "Available Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_3",
    label: "Rate",
    _props: { scope: "col" },
  },
  {
    key: "heading_4",
    label: "Requested Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_5",
    label: "Approved Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_6",
    label: "Dispatched Quantity",
    _props: { scope: "col" },
  },
  {
    key: "heading_7",
    label: "Action",
    _props: { scope: "col" },
  },
];


const initialProductSupply = {
  id: "",
  approvedOnDate: "",
  approvedQuantity: "",
  dispatchQuantity: "",
  rejectReason: "",
  indentApprovedBy: "",
  indentRejectedBy: "",
  dcNumber: "",
};

const initialProductSupplyErr = {
  id: "",
  dcNumber: "",
}

const IndentDispatch = () => {

  const token = localStorage.getItem("token");
  const userAuthData = JSON.parse(localStorage.getItem("userData"));
  const productSupplyIndentItems = [];
  const dispatchedProducts = [];
  const [searchTermProductSupply, setSearchTermProductSupply] = useState("");
  const [isCreateProductSupply, setIsCreateProductSupply] = useState(false);
  const [isEditProductSupply, setIsEditProductSupply] = useState(false);
  const [dispatchedQuantities, setDispatchedQuantities] = useState();
  const [productSupplyData, setProductSupplyData] = useState(initialProductSupply);
  const [productSupplyDataErr, setProductSupplyDataErr] = useState(initialProductSupplyErr);
  const [alertText, setAlertText] = useState("");
  const [showOkModalSupply, setShowOkModalSupply] = useState(false);
  const [showConfirmModalDispatch, setShowConfirmModalDispatch] = useState(false);
  const [isId, setIsId] = useState();
  const [filteredProductSupplyIndent, setFilteredProductSupplyIndent] = useState([]);
  const [filteredProductToDispatch, setFilteredProductToDispatch] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [selectedIndentId, setSelectedIndentId] = useState(null);
  const [dispatchedQuantitiesArray, setDispatchedQuantitiesArray] = useState([]);
  const [displayTable, setDisplayTable] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [dispatchQty, setDispatchQty] = useState("");


  useEffect(() => {
    getProductSupplyIndent();
  }, []);
  const getProductSupplyIndent = () => {
    setIsLoading(true); // Show the loading spinner
    GetProductSupplyIndent((res) => {
      let { status, data, message } = res;
      if (status === 200) {
        setFilteredProductSupplyIndent(data);
        setIsLoading(false); // Hide the loading spinner
      } else if (status === 403) {
        setShowOkModalSupply(false);
        setAlertText("You don't have access to perform this operation");
        setShowConfirmModalDispatch(true);
        setIsLoading(false);
      } else if (status === 500) {
        setShowOkModalSupply(false);
        setAlertText("Something wrong happened in API");
        setShowConfirmModalDispatch(true);
        setIsLoading(false);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setShowConfirmModalDispatch(true);
        setSessionOk(true);
      }
    });
  };

  const handleInputProductDispatch = (e, index) => {
    const { value } = e.target;
    const updatedQuantities = [...dispatchedQuantitiesArray];
    updatedQuantities[index] = value;
    setDispatchedQuantitiesArray(updatedQuantities);
  };


  {
    filteredProductSupplyIndent?.map((val, ind) => {
      const indentStatusMapping = {
        1: 'Indent Placed',
        2: 'Approved',
        3: 'Rejected',
        4: 'Dispatched',
        5: 'Received'
      };

      productSupplyIndentItems.push({
        heading_1: val?.indentRaisedFor ? val?.indentRaisedFor?.Name : "--",
        heading_2: moment(val?.indentRaisedOnDate).format("YYYY-MM-DD") ?? "--",
        heading_3: val?.indentRaisedBy ? val?.indentRaisedBy.Name : "--",
        heading_4: indentStatusMapping[val?.indentStatus] || "--",
      });
    });
  }

  useEffect(() => {
    // Initialize approvedQuantitiesArray with default values
    const initialQuantities = Array(filteredProductToDispatch.length).fill("");
    setDispatchedQuantitiesArray(initialQuantities);
  }, [filteredProductToDispatch]);

  {
    filteredProductToDispatch?.map((val, ind) => {
      // console.log(filteredProductToDispatch)
      dispatchedProducts.push({
        SlNo: ind + 1,
        id: val?.id,
        heading_1: val?.productId ? val?.productId.ProductName : " ",
        heading_2: val?.availableQty ? val?.availableQty : " ",
        heading_3: val?.rate ? val?.rate : " ",
        heading_4: val?.requestedQty ? val?.requestedQty : " ",
        heading_5: val?.approvedQty ? val?.approvedQty : " ",
        heading_6: (
          <CFormInput
            size="sm"
            type="name"
            value={dispatchedQuantities}
            onChange={(e) => handleInputProductDispatch(e, ind)}
            name="dispatchQuantity"
            placeholder="Enter Dispatch Qty.."
            onInput={(e) => {
              e.target.value = e.target.value.replace(
                /[^0-9.-]/g,
                ""
              );
            }}
          />
        ),
        heading_7: (
          <CButton
            style={{
              border: 0,
              backgroundColor: "#0e419d",
              "marginRight": "15px",
            }}
            target="_blank"
            disabled={savedItems.includes(val.id)}
            onClick={() => {
              indentProductSubmit(val?.id, ind)
              setSavedItems([...savedItems, val.id]);
              // console.log(val.id)
            }}
          >
            Save
          </CButton>
        )
      });
    });
  }


  const handleSearchProductSupply = (event) => {
    setSearchTermProductSupply(event.target.value);
  };

  const handleCancleProductSupply = () => {
    setIsCreateProductSupply(!isCreateProductSupply);
    clearProductSupply();
    setIsEditProductSupply(false);
    setDisplayTable(false);
    setSelectedIndentId(null);
    setProductSupplyDataErr(initialProductSupplyErr);
  };

  const handleDropDownIndent = (name, value) => {
    setProductSupplyData((prev) => ({ ...prev, [name]: value }));
    setProductSupplyDataErr((prev) => ({ ...prev, [name]: "" }));
    setSelectedIndentId(value);
    setSelectedIndentId(value);
  };

  useEffect(() => {
    getIndentProductsToApprove();
  }, [selectedIndentId]);
  // console.log('selectedIndentId: ', selectedIndentId);

  const [indentProductsTableData, setIndentProductsTableData] = useState([]);
  // console.log('indent data ', indentProductsTableData);

  const getIndentProductsToApprove = () => {
    GetIndentProducts((res) => {
      let { status, data, message } = res;
      // console.log('res: ', res);
      if (data?.length !== 0) {
        setDisplayTable(true);
      }
      if (status === 200) {
        setIndentProductsTableData(data);
        setFilteredProductToDispatch(data);
      } else if (status === 403) {
        setAlertText("You don't have access to perform this operation");
      } else if (status === 500) {
        setAlertText("Something wrong happened in API");
        setIsLoading(false);
      } else if (message.includes("Invalid access token")) {
        setAlertText("User Session has Expired");
        setSessionOk(true);
      }
    }, selectedIndentId);
  };


  const clearProductSupply = () => {
    setProductSupplyData(initialProductSupply);
    setIsId(null);
  };

  const validateProductSupply = () => {
    let errObj = { ...initialProductSupplyErr };

    if (!productSupplyData.id) {
      errObj.id = "This field is required";
    } else if (productSupplyData.id == 0) {
      errObj.id = "This field is required";
    } else {
      errObj.id = "";
    }

    if (!productSupplyData.dcNumber) {
      errObj.dcNumber = "This field is required";
    } else if (productSupplyData.dcNumber == 0) {
      errObj.dcNumber = "DC Number can not be zero";
    } else {
      errObj.dcNumber = "";
    }

    // console.log(errObj);

    setProductSupplyDataErr((prev) => ({ ...prev, ...errObj }));
    return Object.values(errObj).every((x) => x === "");
  };


  const submitProductSupply = () => {
    // const selectedIndentId = localStorage.getItem("selectedProductSupply");

    const payload = {
      id: productSupplyData.id,
      indentStatus: 4,
      dispatchByEmployee: userAuthData.userDetails.id,
      dcNumber: productSupplyData.dcNumber
    };
    payload.id = payload.id;

    const updateProductStock = {
      dispatchQty: parseInt(dispatchQty),
      indentId: productSupplyData.id,
      id: productSupplyData.id
    }
    if (validateProductSupply()) {
      UpdateProductSupply((res) => {
        let { status, message } = res;
        if (status === 200) {
          getProductSupplyIndent();
          setIsId(null);
          getIndentList();
          setIsCreateProductSupply(!isCreateProductSupply);
          setAlertText("Indent Dispatched Successfully");
          setProductSupplyData(initialProductSupply);
          setProductSupplyDataErr(initialProductSupply);
          setShowConfirmModalDispatch(true);
          setIsEditProductSupply(false);
        } else if (status === 403) {
          setShowOkModalSupply(false);
          setAlertText("You don't have access to perform this operation");
          setShowConfirmModalDispatch(true);
          setIsLoading(false);
        } else if (status === 500) {
          setShowOkModalSupply(false);
          setAlertText("Something wrong happened in API");
          setShowConfirmModalDispatch(true);
          setIsLoading(false);
        } else if (message.includes("Invalid access token")) {
          setAlertText("User Session has Expired");
          setShowConfirmModalDispatch(true);
          setSessionOk(true);
        }
      }, payload);
      // console.log(payload);
      setDisplayTable(false);
    }
    UpdateProductStock((res) => {
      let { status } = res;
      if (status === 200) {
        getProductSupplyIndent();
        setIsId(null);
      }
    }, updateProductStock)
  };


  const indentProductSubmit = (id, index) => {
    const payload = {
      dispatchQty: dispatchedQuantitiesArray[index],
    };
    payload.id = id;
    UpdateIndentProducts((res) => {
      let { status } = res;
      if (status === 200) {
        getProductSupplyIndent();
        setIsId(null);
      } else if (status === 500) {
        setShowOkModalSupply(false);
        setAlertText("Something wrong happened in API");
        setIsLoading(false);
      }
    }, payload);
    setDispatchQty(dispatchedQuantitiesArray[index]);
  };

  let indentStatus = 2;
  useEffect(() => {
    getIndentList();
  }, [])

  const [indentList, setIndentList] = useState([])
  const getIndentList = () => {
    GetApprovedProductSupplyIndent((res) => {
      setIndentList(res.data);
    }, indentStatus)
  }

  return (
    // <>{isCreateProductSupply ? (
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
                      Indent Product
                      <span style={{ color: "red" }}>*</span>
                    </CFormLabel>

                    <CFormSelect
                      size="sm"
                      name="indentProductId"
                      value={productSupplyData.id}
                      onChange={(e) => {
                        handleDropDownIndent(
                          "id",
                          e.target.value
                        );
                      }}
                    >
                      <option value={0}>
                        Select Product Indent
                      </option>
                      {indentList?.length &&
                        indentList?.map(
                          (option, index) => {
                            return (
                              <option
                                key={index}
                                value={option.id}
                              >
                                {`Indent Raised by ${option.indentRaisedBy.Name
                                  } on ${moment(
                                    option.indentRaisedOnDate
                                  ).format("YYYY-MM-DD")}`}
                              </option>
                            );
                          }
                        )}
                    </CFormSelect>
                    <span style={{ color: "red", fontSize: "x-small" }}>
                      {productSupplyDataErr.id}
                    </span>
                  </CCol>
                  <CCol>
                    <CFormLabel htmlFor="nf-email">
                      DC Number
                      <span style={{ color: "red" }}>*</span>
                    </CFormLabel>
                    <CFormInput
                      size="sm"
                      type="name"
                      value={productSupplyData.dcNumber}
                      onChange={(e) => {
                        setProductSupplyData((prev) => ({ ...prev, 'dcNumber': e.target.value }));
                      }}
                      name="dcNumber"
                      placeholder="Enter DC Number"
                    />
                    <span style={{ color: "red", fontSize: "x-small" }}>
                      {productSupplyDataErr.dcNumber}
                    </span>
                  </CCol>
                </CRow>
                <br />
                {displayTable && <CTable
                  columns={indentedProducts}
                  items={dispatchedProducts}
                  hover
                  className="striped-table"
                />}
                <div style={{ marginTop: "1vw" }}>
                  <CButton
                    style={{
                      border: 0,
                      backgroundColor: "#0e419d",
                      "margin-right": "15px",
                    }}
                    target="_blank"
                    onClick={submitProductSupply}
                  >
                    {isEditProductSupply ? "Update" : "Dispatch"}
                  </CButton>
                  <CButton
                    target="_blank"
                    style={{
                      border: 0,
                      backgroundColor: "lightslategrey",
                    }}
                    onClick={handleCancleProductSupply}
                  >
                    Cancel
                  </CButton>
                </div>
              </CForm>
            </div>
          </div>
        </Paper>
      </div>
      {/* </>
        // ) : (
          <> */}
      <div className="product__table">
        <div className="product__table__header">
          <div className="product__table__header__section">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchTermProductSupply}
              onChange={handleSearchProductSupply}
            />
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
              columns={productSupplyColumn}
              items={productSupplyIndentItems}
              hover
              className="striped-table"
            />
          )}

          {showConfirmModalDispatch && (
            <Confirm
              buttonText={"OK"}
              isCancelRequired={false}
              confirmTitle={alertText}
              onConfirm={() => {
                setShowConfirmModalDispatch(false);
              }}
              onCancel={() => {
                setShowConfirmModalDispatch(false);
              }}
            />
          )}

        </div>
      </div>
    </>
    // )}</>
  )
}

export default IndentDispatch