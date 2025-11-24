import React, { useEffect, useRef, useState } from "react";
import "./RouteWiseCollectionReport.scss";
import { GetRouteWiseCollection } from "../../../utils/apiCalls";
import html2pdf from "html2pdf.js";
import Download from "../../../../assets/images/icons/download.png";
import { IconButton, Paper } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import moment from "moment";
import Loader from "../../../components/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import { CButton } from "@coreui/react";

const RouteCollectionReport = () => {
  const token = localStorage.getItem("token");
  const [billDetails, setBillDetails] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleCycle = () => {
    navigate("/route-collection-cycle-list");
  };

  let startEndDate = localStorage.getItem("start-end-date");
  let shift = localStorage.getItem("shift");
  const dateParts = startEndDate?.split(" - ");
  let startDt = moment(dateParts[0]).format("DD/MM/YYYY");
  let endDt = moment(dateParts[1]).format("DD/MM/YYYY");

  const generatePDF = () => {
    const invoiceElements = document.querySelectorAll(".routeCollection");
    const htmlContents = [];

    invoiceElements?.forEach((content) => {
      htmlContents.push(content.innerHTML);
    });

    const combinedHTML = htmlContents.join(
      "<div style='page-break-before:always'></div>"
    );

    const html2pdfOptions = {
      margin: 10,
      filename: "route-wise collection report",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "mm", format: "a3", orientation: "portrait" },
    };
    html2pdf().from(combinedHTML).set(html2pdfOptions).save();
  };

  useEffect(() => {
    getBill();
  }, []);

  const getBill = () => {
    const dateRange = localStorage.getItem("start-end-date");
    const dateParts = dateRange?.split(" - ");
    const payload = {
      startDate: dateParts[0],
      endDate: dateParts[1],
      bmcId: localStorage.getItem("BMCId"),
      shift: shift,
    };
    GetRouteWiseCollection((res) => {
      setIsLoading(true); // Show the loading spinner
      let { status, data } = res;
      if (status === 200) {
        setBillDetails(data);
        setIsLoading(false); // Hide the loading spinner
        // console.log("bank advice--> ", data)
      }
    }, payload);
  };

  // console.log('bmc reconcillation bill: ', billDetails);

  const routeCollRef = useRef();
  const Print = () => {
    const printContents = routeCollRef.current?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      // console.error('Element with ref "bankLetterRef" not found.');
    }
  };

  const handleExportToExcel = () => {
        // Get the header and footer sections
        const headerElement = document.querySelector(".routeCollection__table__header");
        const footerElement = document.querySelector(".routeCollection__table__footer");
    
        // Array to store all rows
        const rows = [];
    
        // Function to extract text content from a div and its child elements
        const extractTextFromElement = (element) => {
          const row = [];
          element.querySelectorAll("p").forEach((child) => {
            // Add text content only if it's not blank
            if (child.innerText && child.innerText.trim() !== "") {
              row.push(child.innerText.trim());
            } else {
              // Add an empty cell for blank <p> elements
              row.push("");
            }
          });
          return row;
        };
    
        // Add header content
        if (headerElement) {
          rows.push(extractTextFromElement(headerElement));
        }
    
        // Traverse and extract all content between the header and footer
        let currentElement = headerElement.nextElementSibling;
        while (currentElement && currentElement !== footerElement) {
          rows.push(extractTextFromElement(currentElement));
          currentElement = currentElement.nextElementSibling;
        }
    
        // Add footer content
        if (footerElement) {
          rows.push(extractTextFromElement(footerElement));
        }
    
        // Create a worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "MilkCollection Report");
    
        // Export the Excel file
        XLSX.writeFile(workbook, "RouteMilkCollectionReport.xlsx");
      };

  const currentDate = moment(new Date()).format("YYYY-MM-DD");

  let grandQtyTotal = 0;
  let grandKgFatTotal = 0;
  let grandKgSnfTotal = 0;

  return (
    <>
      {token ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
            position: "relative",
            width: "calc(100% - 18vw)",
          }}
        >
          <div className="back">
            <IconButton onClick={handleCycle}>
              <img src={images} alt="back" />
            </IconButton>
          </div>
          {billDetails ? (
            <div>
              <CButton className="export" onClick={handleExportToExcel}>Export To Excel</CButton>
              <img
                onClick={generatePDF}
                src={Download}
                alt="Pdf Download"
                className="download"
              />
              <div
                style={{
                  width: "2vw",
                  height: "2vw",
                  position: "absolute",
                  right: "1.2vw",
                  top: "4vw",
                }}
              >
                <IconButton onClick={Print}>
                  <FontAwesomeIcon
                    style={{ height: "2vw", width: "2vw", color: "black" }}
                    icon={faPrint}
                  />
                </IconButton>
              </div>
            </div>
          ) : (
            ""
          )}

          {isLoading ? (
            <Loader />
          ) : billDetails ? (
            <div ref={routeCollRef}>
              <div className="routeCollection">
                <div className="routeCollection__header">
                  <div className="routeCollection__header__heading">
                    <p>Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                  </div>
                  <div className="routeCollection__header__bottomheading">
                    <p>
                      Fat, SNF Route Wise Milk Collection Sheet &nbsp;
                      From&nbsp;&nbsp;{startDt}
                      &nbsp;&nbsp;To&nbsp;&nbsp;{endDt} &nbsp;&nbsp;
                    </p>
                    {/* <p>Page No. 1</p> */}
                  </div>
                </div>
                <div className="routeCollection__table__header">
                  <p>Date</p>
                  <p>Milk Type</p>
                  <p>Qty in Kg.</p>
                  <p>Avg Fat</p>
                  <p>Avg SNF</p>
                  <p>Kg.FAT</p>
                  <p>Kg.SNF</p>
                </div>
                {/* {console.log('billDetails: ', billDetails)} */}

                {billDetails.map((val, ind) => {
                  //MAIN ARRAY

                  let BMC_CQtyTotal = 0;
                  let BMC_BQtyTotal = 0;
                  let BMC_CKgFatTotal = 0;
                  let BMC_BKgFatTotal = 0;
                  let BMC_CKgSnfTotal = 0;
                  let BMC_BKgSnfTotal = 0;

                  let BMCMQtyTotal = 0;
                  let BMCMKgFatTotal = 0;
                  let BMCMKgSnfTotal = 0;

                  return (
                    <>
                      <div className="routeCollection__table__bottomheader">
                        <p>{val?.parentOuName}</p>
                      </div>
                      <>
                        {billDetails[ind].details?.map((val, ind) => {
                          //DETAIL ARRAY

                          let CQtyTotal = 0;
                          let BQtyTotal = 0;
                          let CKgFatTotal = 0;
                          let BKgFatTotal = 0;
                          let CkgSnfTotal = 0;
                          let BKgSnfTotal = 0;

                          return (
                            <>
                              <div className="routeCollection__table__bottomheader2">
                                <p>Route Name:</p>
                                <p>{val.routeName}</p>
                              </div>

                              {val.milkDetailArr?.map((innerVal, ind) => {
                                CQtyTotal +=
                                  innerVal.cowMilkDetail?.totalWeight ?? 0.0;
                                BQtyTotal +=
                                  innerVal.buffMilkDetail?.totalWeight ?? 0.0;
                                CKgFatTotal +=
                                  innerVal.cowMilkDetail?.kgFat ?? 0.0;
                                BKgFatTotal +=
                                  innerVal.buffMilkDetail?.kgFat ?? 0.0;
                                CkgSnfTotal +=
                                  innerVal.cowMilkDetail?.kgSnf ?? 0.0;
                                BKgSnfTotal +=
                                  innerVal.buffMilkDetail?.kgSnf ?? 0.0;

                                BMC_CQtyTotal +=
                                  innerVal.cowMilkDetail?.totalWeight ?? 0.0;
                                BMC_BQtyTotal +=
                                  innerVal.buffMilkDetail?.totalWeight ?? 0.0;
                                BMC_CKgFatTotal +=
                                  innerVal.cowMilkDetail?.kgFat ?? 0.0;
                                BMC_BKgFatTotal +=
                                  innerVal.buffMilkDetail?.kgFat ?? 0.0;
                                BMC_CKgSnfTotal +=
                                  innerVal.cowMilkDetail?.kgSnf ?? 0.0;
                                BMC_BKgSnfTotal +=
                                  innerVal.buffMilkDetail?.kgSnf ?? 0.0;

                                BMCMQtyTotal +=
                                  (innerVal.cowMilkDetail?.totalWeight ?? 0.0) +
                                  (innerVal.buffMilkDetail?.totalWeight ?? 0.0);
                                BMCMKgFatTotal +=
                                  (innerVal.cowMilkDetail?.kgFat ?? 0.0) +
                                  (innerVal.buffMilkDetail?.kgFat ?? 0.0);
                                BMCMKgSnfTotal +=
                                  (innerVal.cowMilkDetail?.kgSnf ?? 0.0) +
                                  (innerVal.buffMilkDetail?.kgSnf ?? 0.0);

                                grandQtyTotal +=
                                  (innerVal.cowMilkDetail?.totalWeight ?? 0.0) +
                                  (innerVal.buffMilkDetail?.totalWeight ?? 0.0);
                                grandKgFatTotal +=
                                  (innerVal.cowMilkDetail?.kgFat ?? 0.0) +
                                  (innerVal.buffMilkDetail?.kgFat ?? 0.0);
                                grandKgSnfTotal +=
                                  (innerVal.cowMilkDetail?.kgSnf ?? 0.0) +
                                  (innerVal.buffMilkDetail?.kgSnf ?? 0.0);

                                return (
                                  <>
                                    <div
                                      className="routeCollection__table__content1"
                                      key={ind}
                                    >
                                      {/* {console.log("val-->", innerVal)} */}
                                      <p>{innerVal.collectedAt}</p>
                                      <p>CM</p>
                                      {innerVal.cowMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.cowMilkDetail
                                              ?.totalWeight ?? 0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {innerVal.cowMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.cowMilkDetail?.avgFat ??
                                            0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {innerVal.cowMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.cowMilkDetail?.avgSnf ??
                                            0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {innerVal.cowMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.cowMilkDetail?.kgFat ?? 0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {innerVal.cowMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.cowMilkDetail?.kgSnf ?? 0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                    </div>
                                    <div
                                      className="routeCollection__table__content2"
                                      key={ind}
                                    >
                                      <p></p>
                                      <p>BM</p>
                                      {innerVal.buffMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.buffMilkDetail
                                              ?.totalWeight ?? 0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {innerVal.buffMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.buffMilkDetail?.avgFat ??
                                            0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {innerVal.buffMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.buffMilkDetail?.avgSnf ??
                                            0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {innerVal.buffMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.buffMilkDetail?.kgFat ??
                                            0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                      {innerVal.buffMilkDetail ? (
                                        <p>
                                          {(
                                            innerVal.buffMilkDetail?.kgSnf ??
                                            0.0
                                          ).toFixed(2)}
                                        </p>
                                      ) : (
                                        <p></p>
                                      )}
                                    </div>
                                    <div
                                      className="routeCollection__table__content3"
                                      key={ind}
                                    >
                                      <p>Total:</p>
                                      <p></p>
                                      <p>
                                        {(
                                          (innerVal.cowMilkDetail
                                            ?.totalWeight ?? 0.0) +
                                          (innerVal.buffMilkDetail
                                            ?.totalWeight ?? 0.0)
                                        ).toFixed(2)}
                                      </p>
                                      <p></p> <p></p>
                                      <p>
                                        {(
                                          (innerVal.cowMilkDetail?.kgFat ??
                                            0.0) +
                                          (innerVal.buffMilkDetail?.kgFat ??
                                            0.0)
                                        ).toFixed(2)}
                                      </p>
                                      <p>
                                        {(
                                          (innerVal.cowMilkDetail?.kgSnf ??
                                            0.0) +
                                          (innerVal.buffMilkDetail?.kgSnf ??
                                            0.0)
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                              <div className="routeCollection__table__belowcontent1">
                                <p style={{ width: "25%" }}>
                                  <b>Total:</b>
                                </p>
                                <p>CM</p>
                                <p>{CQtyTotal.toFixed(2)}</p>
                                <p></p> <p></p>
                                <p>{CKgFatTotal.toFixed(2)}</p>
                                <p>{CkgSnfTotal.toFixed(2)}</p>
                              </div>
                              <div className="routeCollection__table__belowcontent2">
                                <p style={{ width: "25%" }}>
                                  <b>{val.routeName}</b>
                                </p>
                                <p>BM</p>
                                <p>{BQtyTotal.toFixed(2)}</p>
                                <p></p> <p></p>
                                <p>{BKgFatTotal.toFixed(2)}</p>
                                <p>{BKgSnfTotal.toFixed(2)}</p>
                              </div>
                              <div className="routeCollection__table__belowcontent3">
                                <p style={{ width: "25%" }}></p>
                                <p></p>
                                <p>{(CQtyTotal + BQtyTotal).toFixed(2)}</p>
                                <p></p> <p></p>
                                <p>{(CKgFatTotal + BKgFatTotal).toFixed(2)}</p>
                                <p>{(CkgSnfTotal + BKgSnfTotal).toFixed(2)}</p>
                              </div>
                            </>
                          );
                        })}
                      </>

                      <div className="routeCollection__table__belowcontent4">
                        <p>{val.parentOuName}</p>
                        <p>CM</p>
                        <p>{BMC_CQtyTotal?.toFixed(2)}</p>
                        <p style={{ width: "50%" }}></p>
                        <p>{BMC_CKgFatTotal?.toFixed(2)}</p>
                        <p>{BMC_CKgSnfTotal?.toFixed(2)}</p>
                      </div>

                      <div className="routeCollection__table__belowcontent3">
                        <p style={{ width: "25%" }}></p>
                        <p>BM</p>
                        <p>{BMC_BQtyTotal?.toFixed(2)}</p>
                        <p style={{ width: "50%" }}></p>
                        <p>{BMC_BKgFatTotal?.toFixed(2)}</p>
                        <p>{BMC_BKgSnfTotal?.toFixed(2)}</p>
                      </div>

                      {/* <div className="routeCollection__table__belowcontent3">
                        <p style={{ width: "10%" }}></p>
                        <p>Total: BM + CM</p>
                        <p style={{ width: "14%" }}></p>
                        <p>{(BMC_CQtyTotal + BMC_BQtyTotal).toFixed(2)}</p>
                        <p style={{ width: "25%" }}></p>
                        <p></p>
                        <p>{(BMC_CKgFatTotal + BMC_BKgFatTotal)?.toFixed(2)}</p>
                        <p>{(BMC_CKgSnfTotal + BMC_BKgSnfTotal)?.toFixed(2)}</p>
                      </div> */}
                    </>
                  );
                })}

                <div className="routeCollection__table__footer">
                  <p style={{ width: "10%" }}></p>
                  <p>Grand Total : </p>
                  <p style={{ width: "14%" }}></p>
                  <p>{grandQtyTotal.toFixed(2)}</p>
                  <p style={{ width: "25%" }}></p>
                  <p></p>
                  <p>{grandKgFatTotal.toFixed(2)}</p>
                  <p>{grandKgSnfTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty_data">
              <Paper elevation={3}>
                <h1>No Data Available</h1>
                <h3>For This Record.</h3>
              </Paper>
            </div>
          )}
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default RouteCollectionReport;
