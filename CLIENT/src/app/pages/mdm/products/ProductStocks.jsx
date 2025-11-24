import {
   CTable,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import "./ProductStocks.scss";
import {
   GetProductStock,
} from "../../../utils/apiCalls";
import moment from "moment";
import Header from "../../../components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "../../../components/loader";

const initialFinyear = {
   startDate: "",
   endDate: "",
};

const FinancialYear = () => {
   const userAuthData = JSON.parse(localStorage.getItem("userData"));

   const columns = [
      {
         key: "SlNo",
         label: "#",
         _props: { scope: "col" },
      },
      {
         key: "heading_1",
         label: "Indent Raised For",
         _props: { scope: "col" },
      },
      {
         key: "heading_2",
         label: "Product",
         _props: { scope: "col" },
      },
      {
         key: "heading_3",
         label: "Available Qty",
         _props: { scope: "col" },
      },
      {
         key: "heading_4",
         label: "Dispatched Qty",
         _props: { scope: "col" },
      },
      {
         key: "heading_5",
         label: "Total Qty",
         _props: { scope: "col" },
      },
   ];
   const items = [];
   const token = localStorage.getItem("token");
   const [productstockTableData, setproductstockTableData] = useState([]);
   const [filteredData, setFilteredData] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);

   const navigate = useNavigate();

   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };


   useEffect(() => {
      getProductStocks();
   }, []);

   const getProductStocks = () => {
      setIsLoading(true); // Show the loading spinner
      GetProductStock(
         (res) => {
            let { status, data } = res;
            if (status === 200) {
               // console.log(data, "data");
               setproductstockTableData(data);
               setFilteredData(data);
               setIsLoading(false); // Hide the loading spinner
            }
         }
      );
   };

   {
      filteredData?.map((val, ind) => {
         items.push({
            SlNo: ind + 1,
            id: val?.id,
            heading_1: val?.organizationUnit.Name,
            heading_2: val?.productMaster.ProductName,
            heading_3: val?.availableQty,
            heading_4: val?.dispatchQty,
            heading_5: val?.totalQty,
         });
      });
   }

   useEffect(() => {
      filterTableData();
   }, [searchTerm]);

   const filterTableData = () => {
      if (searchTerm === "") {
         setFilteredData(productstockTableData);
      } else {
         const filteredData = productstockTableData.filter((item) => {
            const flatItem = {
               ...item,
               organizationUnitName: item.organizationUnit?.Name,
               productMasterName: item.productMaster?.ProductName,
            };
            return Object.values(flatItem).some(
               (value) =>
                  value !== null &&
                  value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
         });
         // console.log("filteredData", filteredData);
         setFilteredData(filteredData);
      }
   };

   return (
      <>
         {token ? (
            <div className="productstocks">
               <div className="productstocks__container">
                  <div className="productstocks__header">
                     <div className="productstocks__header__section">
                        <div className="productstocks__header__section__main">
                           <h5>Company: Verka</h5>
                           <h4>Product Stocks</h4>
                        </div>
                        <div className="roles__header__section__bottom">
                           <Header />
                        </div>
                     </div>
                  </div>
                  <div className="productstocks__table">
                     <div className="productstocks__table__header">
                        <div className="productstocks__table__header__section">
                           <input
                              type="text"
                              className="form-control"
                              placeholder="Search"
                              value={searchTerm}
                              onChange={handleSearch}
                           />
                        </div>
                     </div>
                     <div
                        className="finyear__table__body"
                        style={{ height: "380px", overflowY: "scroll" }}
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
               </div>
            </div>
         ) : (
            <Navigate to={"/"} />
         )}
      </>
   );
};

export default FinancialYear;
