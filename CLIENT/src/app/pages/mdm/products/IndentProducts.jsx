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
   CPagination,
   CPaginationItem,
} from "@coreui/react";
import Confirm from "../../../components/confirmModal/confirm";
import {
   GetIndentProducts,
   CreateIndentProducts,
   UpdateIndentProducts,
   DeleteIndentProducts,
   GetProductCategory,
   GetDropDownProduct,
   GetProductSupRate,
   CreateProductStock
} from "../../../utils/apiCalls";
import "./IndentProducts.scss";
import { IconButton } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import Header from "../../../components/header/Header";
import Select from "react-select";
import Loader from "../../../components/loader";
import moment from "moment";
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const indentProductsColumns = [
   {
      key: "SlNo",
      label: "#",
      _props: { scope: "col" },
   },
   {
      key: "heading_1",
      label: "Indent Requested By",
      _props: { scope: "col" },
   },
   {
      key: "heading_2",
      label: "Indent Raised On",
      _props: { scope: "col" },
   },
   {
      key: "heading_3",
      label: "Product Name",
      _props: { scope: "col" },
   },
   {
      key: "heading_4",
      label: "Available Quantity",
      _props: { scope: "col" },
   },
   {
      key: "heading_5",
      label: "Rate",
      _props: { scope: "col" },
   },
   {
      key: "heading_6",
      label: "Requested Quantity",
      _props: { scope: "col" },
   },
   // {
   //     key: "heading_7",
   //     label: "Available Quantity",
   //     _props: { scope: "col" },
   // },
   // {
   //    key: "heading_8",
   //    label: "Actions",
   //    _props: { scope: "col" },
   // },
];

const initialIndentProducts = {
   indentId: "",
   productCatId: "",
   productId: "",
   availableQty: "",
   rate: "",
   requestedQty: "",
   approvedQty: ""
}
const initialProductStocks = {
   productId: "",
   orgUnitId: "",
   availableQty: ""
}

const IndentProducts = () => {
   const token = localStorage.getItem("token");
   const userAuthData = JSON.parse(localStorage.getItem("userData"));
   const [permission, setPermission] = useState([]);
   const indentProductsItems = [];
   const navigate = useNavigate();
   const selectedIndentId = localStorage.getItem("selectedProductSupply");
   // console.log("indent Id - ", selectedIndentId)
   const [searchTerm, setSearchTerm] = useState("");
   const [alertText, setAlertText] = useState("");
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [showConfirmModal1, setShowConfirmModal1] = useState(false);
   const [indentProductsTableData, setIndentProductsTableData] = useState([]);
   const [isIndentProductsId, setIsIndentProductsId] = useState();
   const [indentProductsData, setIndentProductsData] = useState(initialIndentProducts);
   const [filteredDataIndentProducts, setFilteredDataIndentProducts] = useState([]);
   const [productCategoryTableData, setProductCategoryTableData] = useState([]);
   const [isEditIndentProduct, setIsEditIndentProduct] = useState(false);
   const [isCreate, setIsCreate] = useState(false);
   const [productStocksData, setProductStockData] = useState(initialProductStocks);

   const [isLoading, setIsLoading] = useState(true);
   const [sessionOk, setSessionOk] = useState(false);

   useEffect(() => {
      getIndentProducts();
   }, [selectedIndentId]);

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

   const getIndentProducts = () => {
      setIsLoading(true); // Show the loading spinner
      GetIndentProducts((res) => {
         let { status, data, message } = res;
         // console.log('res: ', res);
         if (status === 200) {
            setIndentProductsTableData(data);
            setFilteredDataIndentProducts(data);
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
         } else if (message?.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setShowConfirmModal1(true);
            setSessionOk(true);
         }
      }, selectedIndentId);
   };

   // console.log('indentProductsTableData',indentProductsTableData);

   useEffect(() => {
      filterTableData();
   }, [searchTerm]);

   const filterTableData = () => {
      if (searchTerm === "") {
         setFilteredDataIndentProducts(indentProductsTableData);
      } else {
         const filteredData = indentProductsTableData.filter((item) =>
            Object.values(item).some(
               (value) =>
                  value !== null &&
                  value
                     .toString()
                     .toLowerCase()
                     ?.includes(searchTerm.toLowerCase())
            )
         );
         setFilteredDataIndentProducts(filteredData);
      }
   };

   {
      filteredDataIndentProducts?.map((val, ind) => {
         // console.log(val?.productId.ProductName)
         indentProductsItems.push({
            SlNo: ind + 1,
            id: val?.id,
            heading_1: val?.indentId.IndentRaisedBy?.Name ? val?.indentId.IndentRaisedBy?.Name : "--",
            heading_2: moment(val?.indentId.IndentRaisedOnDate).format("YYYY-MM-DD") ?? "--",
            heading_3: val?.productId.ProductName ?? "--",
            heading_4: val?.availableQty ? val.availableQty : "--",
            heading_5: val?.rate ? val.rate : "0",
            heading_6: val?.requestedQty ? val.requestedQty : "--",
            // heading_8: (
            //    <div style={{
            //       display: "flex",
            //       flexDirection: "row",
            //       background: "none",
            //       alignItems: "flex-start",
            //    }}>
            //       <button
            //          disabled={!hasPermission("Update")}
            //          title={!hasPermission("Update") ? "No permission to Update" : ""}
            //          className={hasPermission("Update") ? "" : "disabled-button"}
            //          style={{
            //             color: "green",
            //             cursor: "pointer",
            //             border: "none",
            //             background: "none",
            //          }}
            //          onClick={() => {
            //             handleEdit(val?.id);
            //          }}                  >
            //          <EditNoteOutlinedIcon />
            //       </button>
            //       <button
            //          disabled={!hasPermission("Delete")}
            //          title={!hasPermission("Delete") ? "No permission to Delete" : ""}
            //          className={hasPermission("Delete") ? "" : "disabled-button"}
            //          style={{
            //             color: "red",
            //             cursor: "pointer",
            //             border: "none",
            //             background: "none",
            //             marginLeft: 10,
            //          }}
            //          onClick={() => {
            //             handleDelete(val?.id);
            //          }}
            //       >
            //          <DeleteOutlinedIcon />
            //       </button>
            //    </div>
            // ),
         });
      });
   }
   const handleProductSupply = () => {
      navigate("/product-supply");
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const selectedIndentId = localStorage.getItem("selectedProductSupply");
      const selectedOrgUnitId = localStorage.getItem("selectedorgUnitId");

      const payload = {
         indentId: indentProductsData?.transporterId || selectedIndentId,
         productId: indentProductsData?.productId,
         availableQty: indentProductsData?.availableQty,
         rate: indentProductsData?.rate,
         requestedQty: indentProductsData?.requestedQty,
      };

      const productStockPayload = {
         indentId: selectedIndentId,
         productMaster: indentProductsData?.productId,
         organizationUnit: selectedOrgUnitId,
         availableQty: indentProductsData?.availableQty
      };

      if (isIndentProductsId) {
         payload.id = isIndentProductsId;

         UpdateIndentProducts((res) => {
            let { status, message } = res;
            if (status === 200) {
               getIndentProducts();
               clearData();
               setAlertText(message);
               setShowConfirmModal1(true);
               setIsCreate(!isCreate);
               setIsEditIndentProduct(false);
               setIndentProductsData(initialIndentProducts);
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
         CreateIndentProducts((res) => {
            let { status, message } = res;
            if (status === 200) {
               getIndentProducts();
               clearData();
               setAlertText(message);
               setShowConfirmModal1(true);
               setIsCreate(!isCreate);
               setIsEditIndentProduct(false);
               setIndentProductsData(initialIndentProducts);
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

      CreateProductStock((res) => {
         let { status } = res;
         if (status === 200) {
            console.log('success');
            return true;
         } else {
            console.log('error')
         }
      }, productStockPayload);
   };

   const handleEdit = (id) => {
      setIsCreate(!isCreate);
      setIsEditIndentProduct(true);

      const selectedIndent = indentProductsTableData.find(
         (indent) => indent.id === id
      );
      console.log(selectedIndent);
      if (selectedIndent) {
         setIndentProductsData({
            indentId: selectedIndentId,
            productId: selectedIndent?.productId.Id,
            availableQty: selectedIndent?.availableQty,
            rate: selectedIndent?.rate,
            requestedQty: selectedIndent?.requestedQty,
            approvedQty: selectedIndent?.approvedQty,
         });
      }
      setIsIndentProductsId(
         indentProductsTableData.find((indent) => indent.id === id)?.id
      );
      setIndentProductsData((prev) => ({ ...prev, "productCatId": indentProductsData?.productCatId }));
   };

   const clearData = () => {
      setIndentProductsData(initialIndentProducts);
   }

   const handleOk = () => {
      const payload = {
         id: isIndentProductsId,
      };
      // console.log(payload);

      if (isIndentProductsId != null) {
         DeleteIndentProducts((res) => {
            let { status, message, data } = res;
            if (status === 200) {
               getIndentProducts();
               setIsIndentProductsId(null);
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
      getProductCategory();
   }, []);
   const getProductCategory = () => {
      setIsLoading(true); // Show the loading spinner
      GetProductCategory((res) => {
         let { status, data, message } = res;
         if (status === 200) {
            setProductCategoryTableData(data);
            setIsLoading(false); // Hide the loading spinner
         } else if (status === 403) {
            setAlertText("You don't have access to perform this operation");
            setIsLoading(false);
         } else if (status === 500) {
            setAlertText("Something wrong happened in API");
            setIsLoading(false);
         } else if (message?.includes("Invalid access token")) {
            setAlertText("User Session has Expired");
            setSessionOk(true);
         }
      });
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
      // console.log(selectProductData);
   };


   const getProductSupRate = (selectedProductId) => {
      GetProductSupRate((res) => {
         setIndentProductsData((prev) => ({ ...prev, "rate": res.data[0].unitQtySupplyPrice }))
         // console.log(res.data[0].unitQtySupplyPrice);
      }, selectedProductId);
      // console.log(selectProductData);
   };

   const handleDelete = (id) => {
      setShowConfirmModal(true);
      setIsIndentProductsId(id);
      // console.log(id);
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setIndentProductsData((prevState) => ({
         ...prevState,
         [name]: value,
      }));
   };

   const handleCancel = () => {
      setIsCreate(!isCreate);
      setIsEditIndentProduct(false);
      clearData();
   };



   const handleConfirm = () => {
      setShowConfirmModal1(false);
      setIsEditIndentProduct(false);
      setIsCreate(isCreate);
      if (sessionOk) {
         localStorage.clear();
         navigate("/");
      }
   };


   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   const handleCreate = () => {
      setIsCreate(!isCreate);
      setIsEditIndentProduct(false);
   };

   const handleDropDownCategory = (name, value) => {
      setIndentProductsData((prev) => ({ ...prev, [name]: value }));
      setSelectedCategoryId(value);
      // setIndentProductsData((prev) => ({ ...prev, [name]: "" }));
   };
   const handleDropDownProduct = (name, value) => {
      setIndentProductsData((prev) => ({ ...prev, [name]: value }));
      // console.log(value);
      getProductSupRate(value)
      // setIndentProductsData((prev) => ({ ...prev, [name]: "" }));
   };

   return (
      <>
         {token ? <div className="indentproduct">
            <div className="indentproduct__container">
               <div className="indentproduct__header">
                  <div className="indentproduct__header__section">
                     <div className="indentproduct__header__section__main">
                        <h5>Company: Verka</h5>
                        <h4>{`${"Indent Products"}`}</h4>
                     </div>
                     <div className="indentproduct__header__section__bottom">
                        <Header />
                     </div>
                  </div>
               </div>
               <div className="transporter1__header__section__logo" style={{ marginTop: -40 }}>
                  <IconButton onClick={handleProductSupply} style={{ top: "25px" }}>
                     <img src={images} alt="back" />
                  </IconButton>
               </div><br />
               {isCreate ? (
                  <>
                     <div className="approve-body">

                        <Paper elevation={3}>
                           <CForm method="post">
                              <CRow>
                                 <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                    <CFormLabel
                                       style={{ fontSize: "0.9vw", marginBottom: "0" }}
                                    >
                                       Select Product Category
                                    </CFormLabel>
                                    <CFormSelect
                                       size="sm"
                                       name="productCatId"
                                       value={indentProductsData.productCatId}
                                       onChange={(e) => {
                                          handleDropDownCategory(
                                             "productCatId",
                                             e.target.value
                                          );
                                       }}
                                    ><option value={0}>
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
                                          )}</CFormSelect>

                                 </CCol>

                                 <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                    <CFormLabel
                                       style={{ fontSize: "0.9vw", marginBottom: "0" }}
                                    >
                                       Product
                                    </CFormLabel>
                                    <CFormSelect
                                       size="sm"
                                       name="productId"
                                       value={indentProductsData.productId}
                                       onChange={(e) => {
                                          handleDropDownProduct(
                                             "productId",
                                             e.target.value
                                          );
                                       }}
                                    ><option value={0}>
                                          Select Product
                                       </option>
                                       {selectProductData?.length &&
                                          selectProductData?.map(
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
                                          )}</CFormSelect>
                                 </CCol>

                                 <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                    <CFormLabel
                                       style={{ fontSize: "0.9vw", marginBottom: "0" }}
                                    >
                                       Available Quantity
                                    </CFormLabel>
                                    <CFormInput
                                       size="sm"
                                       type="Name"
                                       id="availableQty"
                                       name="availableQty"
                                       value={indentProductsData.availableQty}
                                       placeholder="Enter Available Quantity"
                                       onChange={handleInputChange}
                                       onInput={(e) => {
                                          e.target.value = e.target.value.replace(
                                             /[^0-9.-]/g,
                                             ""
                                          );
                                       }}
                                    />
                                 </CCol>

                                 <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                    <CFormLabel
                                       style={{ fontSize: "0.9vw", marginBottom: "0" }}
                                    >
                                       Rate
                                    </CFormLabel>
                                    <CFormInput
                                       size="sm"
                                       type="Name"
                                       id="rate"
                                       name="rate"
                                       value={indentProductsData.rate}
                                       placeholder="Enter Rate"
                                       onChange={handleInputChange}
                                       onInput={(e) => {
                                          e.target.value = e.target.value.replace(
                                             /[^0-9.-]/g,
                                             ""
                                          );
                                       }}
                                    />
                                 </CCol>

                                 <CCol lg={6} style={{ marginBottom: "0.5vw" }}>
                                    <CFormLabel
                                       style={{ fontSize: "0.9vw", marginBottom: "0" }}
                                    >
                                       Requested Quantity
                                    </CFormLabel>
                                    <CFormInput
                                       size="sm"
                                       type="Name"
                                       id="requestedQty"
                                       name="requestedQty"
                                       value={indentProductsData.requestedQty}
                                       placeholder="Enter Requested Quantity"
                                       onChange={handleInputChange}
                                       onInput={(e) => {
                                          e.target.value = e.target.value.replace(
                                             /[^0-9.-]/g,
                                             ""
                                          );
                                       }}
                                    />
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
                                    {isEditIndentProduct ? "Update" : "Save"}
                                 </CButton>
                                 <CButton
                                    target="_blank"
                                    style={{
                                       border: 0,
                                       backgroundColor: "lightslategrey",
                                    }}
                                    onClick={handleCancel}
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
                     <div className="indentproduct__table">
                        <div className="indentproduct__table__header">
                           <div className="indentproduct__table__header__section">
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
                                 onClick={handleCreate}
                              >
                                 Add Products
                              </button>
                           </div>
                        </div>
                        <div
                           className="indentproduct__table__body"
                           style={{ height: "50vh", overflowY: "scroll" }}
                        >
                           {isLoading ? (
                              <Loader />
                           ) : (
                              <CTable
                                 columns={indentProductsColumns}
                                 items={indentProductsItems}
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

               {showConfirmModal && (
                  <Confirm
                     buttonText={"OK"}
                     isCancelRequired={true}
                     confirmTitle={"Are you sure ?"}
                     onConfirm={handleOk}
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

export default IndentProducts;