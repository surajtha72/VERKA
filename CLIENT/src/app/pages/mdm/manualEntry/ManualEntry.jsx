import { CModal, CModalBody, CModalHeader, CModalTitle, CTable } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetManualEntry, UpdateManualEntry } from "../../../utils/apiCalls";
import Confirm from "../../../components/confirmModal/confirm";
import Header from "../../../components/header/Header";
import Loader from "../../../components/loader";
import moment from "moment";
import Button from "../../../components/button";

const columns = [
   {
      key: "SlNo",
      label: "#",
      _props: { scope: "col" },
   },
   {
      key: "heading_1",
      label: "Requested By",
      _props: { scope: "col" },
   },
   {
      key: "heading_2",
      label: "Requested For",
      _props: { scope: "col" }
   },
   {
      key: "heading_3",
      label: "Status",
      _props: { scope: "col" }
   },
   {
      key: "heading_4",
      label: "Requested At",
      _props: { scope: "col" }
   },
   {
      key: "heading_5",
      label: "Action",
      _props: { scope: "col" }
   }
];

const initialState = {
   id: null,
   organizationUnit: null,
   status: true,
   requestFor: "",
}

const ManualEntry = () => {
   const token = localStorage.getItem("token");
   const userAuthData = JSON.parse(localStorage.getItem("userData"));
   const [permission, setPermission] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredData, setFilteredData] = useState([]);
   const [isCreateManualEntry, setIsCreateManualEntry] = useState(false);
   const [bankTableData, setBankTableData] = useState([]);
   const [manualEntryData, setManualEntryData] = useState(initialState);
   const [isId, setIsId] = useState();
   const [showConfirmModal, setShowConfirmModal] = useState(false);
   const [showConfirmModal1, setShowConfirmModal1] = useState(false);
   const [alertText, setAlertText] = useState("");
   const [showPassModal, setShowPassModal] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [sessionOk, setSessionOk] = useState(false);
   const [generatedPassword, setGeneratedPassword] = useState('');

   useEffect(() => {
      if (userAuthData) {
         const ManualEntryPermission = userAuthData?.permissions?.find(
            (val) => val?.MilkCollection
         );
         setPermission(ManualEntryPermission?.MilkCollection);
      }
   }, []);

   const hasPermission = (perm) => {
      return permission?.includes(perm);
   };

   const navigate = useNavigate();

   useEffect(() => {
      getManualEntry();
   }, [])

   const getManualEntry = () => {
      setIsLoading(true); // Show the loading spinner
      GetManualEntry((res) => {
         let { status, data, message } = res;
         if (status === 200) {
            setManualEntryData(data);
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
      })
   }

   // useEffect(() => {
   //     filterTableData();
   // }, [searchTerm]);

   // const filterTableData = () => {
   //     if (searchTerm === "") {
   //         setFilteredData(manualEntryData);
   //     } else {
   //         const filteredData = manualEntryData.filter((item) =>
   //             Object.values(item).some(
   //                 (value) =>
   //                     value !== null &&
   //                     value.toString().toLowerCase().includes(searchTerm.toLowerCase())
   //             )
   //         );
   //         setFilteredData(filteredData);
   //     }
   // };

   const items = [];

   filteredData.map((val, ind) => {
      items.push({
         SlNo: ind + 1,
         id: val?.id,
         heading_1: val?.organizationUnitId?.Name ?? " ",
         heading_2: val?.requestFor ?? " ",
         heading_3: val?.status ?? " ",
         heading_4: moment(val?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
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
                  // disabled={!hasPermission("Update")}
                  title={!hasPermission("Update") ? "No permission to Update" : ""}
                  className={hasPermission("Update") ? "" : "disabled-button"}
                  style={{
                     color: "green",
                     cursor: "pointer",
                     border: "none",
                     background: "none",
                  }}
                  onClick={() => {
                     handleApprove(val?.id)
                  }}
               >
                  Approve
               </button>
               <button
                  // disabled={!hasPermission("Delete")}
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
                     handleReject(val?.id);
                     // console.log(val.id)
                  }}
               >
                  Reject
               </button>
            </div>
         ),
      });
   });


   const handleOk = () => {
      const payload = {
         id: isId,
      };
      //   if (isId != null) {
      //     DeleteBank((res) => {
      //       let { status, message, data } = res;
      //       if (status === 200) {
      //         getBanks();
      //         setIsId(null);
      //         setShowConfirmModal(false);
      //         setAlertText(message);
      //         setShowConfirmModal1(true);
      //       } else if (status === 403) {
      //         setShowConfirmModal(false);
      //         setAlertText("You don't have access to perform this operation");
      //         setShowConfirmModal1(true);
      //         setIsLoading(false);
      //       } else if (status === 500) {
      //         setShowConfirmModal(false);
      //         setAlertText("Something wrong happened in API");
      //         setShowConfirmModal1(true);
      //         setIsLoading(false);
      //       } else if (message.includes("Invalid access token")) {
      //         setAlertText("User Session has Expired");
      //         setShowConfirmModal1(true);
      //         setSessionOk(true);
      //       }
      //     }, payload);
      //   }
   };
   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   const handleConfirm = () => {
      setShowConfirmModal1(false);
      if (sessionOk) {
         localStorage.clear();
         navigate("/");
      }
   };

   const handleApprove = (isId) => {
      const payload = {
         status: "Approved"
      };
      if (isId) {
         payload.id = isId;
         UpdateManualEntry(
            (res) => {
               let { status, message } = res;
               if (status === 200) {
                  getManualEntry();
                  setIsId(null);
                  setAlertText(res.message);
                  setIsCreateManualEntry(!isCreateManualEntry);
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

   const handleReject = (isId) => {
      const payload = {
         status: "Rejected"
      };
      // console.log(payload);
      if (isId) {
         payload.id = isId;
         UpdateManualEntry(
            (res) => {
               let { status, message } = res;
               if (status === 200) {
                  getManualEntry();
                  setIsId(null);
                  setAlertText("Rejected ");
                  setIsCreateManualEntry(!isCreateManualEntry);
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

   //  allow the enteredPassword hour part >1 of the generated passowrd hour part. as it can be a case where the user generates a password at 59 minute and tries to authenticate in the next hour.

   const generatePassowrd = () => {
      const today = new Date();
      const currDate = Number(moment(today).format('DD')) + 27;
      const currHour = Number(moment(today).format('HH')) + 67;
      const currMin = Math.ceil((Number(moment(today).format('mm'))) / 15) + 19;

      const password = currDate + '' + currHour + '' + currMin;
      return password;
   }

   useEffect(() => {
      const pass = generatePassowrd();
      setGeneratedPassword(pass);
   }, [showPassModal])
   return (
      <>
         {console.log(showPassModal)}
         <CModal
            alignment="center"
            visible={showPassModal}
            onClose={() => setShowPassModal(false)}
         >
            <CModalHeader>
               <CModalTitle>Generated Manual Entry Password</CModalTitle>
            </CModalHeader>

            <CModalBody style={{ display: 'flex', justifyContent: 'center' }}>
               <span style={{
                  textAlign: "center",
                  fontSize: "50px",
                  fontWeight: "bold",
               }}>
                  {generatedPassword}
               </span>
            </CModalBody>
         </CModal>
         <div className="bank">
            <div className="bank__container">
               <div className="bank__header">
                  <div className="bank__header__section">
                     <div className="bank__header__section__main">
                        <h5>Company: Verka</h5>
                        <h4>{`MDM - Manual Entry`}</h4>
                     </div>
                     <div className="bank__header__section__bottom">
                        <Header />
                     </div>
                  </div>
               </div>

               <div className="bank__table">
                  <div className="bank__table__header">
                     <div className="bank__table__header__section">
                        <input
                           type="text"
                           className="form-control"
                           placeholder="Search"
                           value={searchTerm}
                           onChange={handleSearch}
                        />
                        <button onClick={() => { setShowPassModal(true); }}>
                           Generate Password
                        </button>
                     </div>
                  </div>

                  <div
                     className="bank__table__body"
                     style={{ height: "60vh", overflowY: "scroll" }}
                  >
                     {isLoading ? (
                        <Loader />
                     ) : (
                        <CTable
                           columns={columns}
                           items={items}
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
      </>
   );
};

export default ManualEntry;