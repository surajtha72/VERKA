import React, { useEffect, useRef, useState } from "react";
import "./AgentWiseReconcillationReport.scss";
import { GetAgentReconcillation } from "../../../utils/apiCalls";
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

const ReconcillationReport = () => {
  const token = localStorage.getItem("token");
  const [billDetails, setBillDetails] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleCycle = () => {
    navigate("/agent-cycle-list-reconcillation");
  };

  let startEndDate = localStorage.getItem("start-end-date");
  let shift = localStorage.getItem("shift");
  const dateParts = startEndDate.split(" - ");
  let startDt = moment(dateParts[0]).format("DD/MM/YYYY");
  let endDt = moment(dateParts[1]).format("DD/MM/YYYY");

  const generatePDF = () => {
    const invoiceElements = document.querySelectorAll(".reconcillationReport");
    const htmlContents = [];

    invoiceElements?.forEach((content) => {
      htmlContents.push(content.innerHTML);
    });

    const combinedHTML = htmlContents.join(
      "<div style='page-break-before:always'></div>"
    );

    const html2pdfOptions = {
      margin: 10,
      filename: "agent-wise reconcillation report",
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
    GetAgentReconcillation((res) => {
      setIsLoading(true); // Show the loading spinner
      let { status, data } = res;
      if (status === 200) {
        setBillDetails(data);
        setIsLoading(false); // Hide the loading spinner
        // console.log("bank advice--> ", data)
      }
    }, payload);
  };

  const agentReconRef = useRef();
  const Print = () => {
    const printContents = agentReconRef.current?.innerHTML;
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
      const headerElement = document.querySelector(".reconcillationReport__table__header");
      const footerElement = document.querySelector(".reconcillationReport__table__footer");
  
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reconciliation Report");
  
      // Export the Excel file
      XLSX.writeFile(workbook, "AgentReconciliationReport.xlsx");
    };

  // console.log('bmc reconcillation bill: ', billDetails);

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
            <div ref={agentReconRef}>
              <div className="reconcillationReport">
                <div className="reconcillationReport__header">
                  <div className="reconcillationReport__header__heading">
                    <p>Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                  </div>
                  <div className="reconcillationReport__header__bottomheading">
                    <p>
                      Fat, SNF Agent-Wise Reconcillation Sheet &nbsp;
                      From&nbsp;&nbsp;{startDt}
                      &nbsp;&nbsp;To&nbsp;&nbsp;{endDt} &nbsp;&nbsp;
                    </p>
                    {/* <p>Page No. 1</p> */}
                  </div>
                </div>
                <div className="reconcillationReport__table__header">
                  <p style={{ width: "15%" }}>Sr. No.</p>
                  <p>Date</p>
                  <p>Shift</p>
                  <p>C Qty.</p>
                  <p>B Qty.</p>
                  <p>C Fat</p>
                  <p>B Fat</p>
                  <p>C Snf</p>
                  <p>B Snf</p>
                  <p>C Kg.FAT</p>
                  <p>B Kg.FAT</p>
                  <p>C Kg.SNF</p>
                  <p>B Kg.SNF</p>
                </div>
                {/* {console.log('billDetails: ', billDetails)} */}

                {billDetails.map((val, ind) => {
                  //MAIN ARRAY

                  let CQtyAgentTotal = 0;
                  let BQtyAgentTotal = 0;
                  let CFatAgentTotal = 0;
                  let BFatAgentTotal = 0;
                  let CSnfAgentTotal = 0;
                  let BSnfAgentTotal = 0;
                  let CkgFatAgentTotal = 0;
                  let BkgFatAgentTotal = 0;
                  let CkgSnfAgentTotal = 0;
                  let BkgSnfAgentTotal = 0;

                  let BMCMQtyTotal = 0;
                  let BMCMKgFatTotal = 0;
                  let BMCMKgSnfTotal = 0;

                  return (
                    <>
                      <div className="reconcillationReport__table__bottomheader">
                        <p>{val?.parentOuName}</p>
                      </div>
                      <>
                        {billDetails[ind].details?.map((val, ind) => {
                          //DETAILS ARRAY

                          let CQtyTotal = 0;
                          let BQtyTotal = 0;
                          let CFatTotal = 0;
                          let BFatTotal = 0;
                          let CSnftotal = 0;
                          let BSnfTotal = 0;
                          let CKgFatTotal = 0;
                          let BKgFatTotal = 0;
                          let CkgSnfTotal = 0;
                          let BKgSnfTotal = 0;

                          return (
                            <>
                              {/* {console.log('details arr: ', val[0])} */}
                              <div className="reconcillationReport__table__bottomheader2">
                                <p>SO. Code</p>
                                <p>
                                  {val.agentId?.agentId.toString().substr(-3)}
                                </p>
                                <p>{val.agentId?.agentName}</p>
                              </div>
                              {val.milkDetailArr?.map((innerVal, ind) => {
                                CQtyTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails
                                      ?.totalCowMilkWeight ?? 0.0
                                  : innerVal.eveningMilkDetails
                                      ?.totalCowMilkWeight ?? 0.0;
                                BQtyTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails
                                      ?.totalBuffMilkWeight ?? 0.0
                                  : innerVal.eveningMilkDetails
                                      ?.totalBuffMilkWeight ?? 0.0;
                                CFatTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.avgCowFat ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.avgCowFat ??
                                    0.0;
                                BFatTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.avgBuffFat ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.avgBuffFat ??
                                    0.0;
                                CSnftotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.avgCowSnf ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.avgCowSnf ??
                                    0.0;
                                BSnfTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.avgBuffSnf ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.avgBuffSnf ??
                                    0.0;
                                CKgFatTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.kgFatCow ?? 0.0
                                  : innerVal.eveningMilkDetails?.kgFatCow ??
                                    0.0;
                                BKgFatTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.kgFatBuff ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.kgFatBuff ??
                                    0.0;
                                CkgSnfTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.kgSnfCow ?? 0.0
                                  : innerVal.eveningMilkDetails?.kgSnfCow ??
                                    0.0;
                                BKgSnfTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.kgSnfBuff ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.kgSnfBuff ??
                                    0.0;

                                CQtyAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails
                                      ?.totalCowMilkWeight ?? 0.0
                                  : innerVal.eveningMilkDetails
                                      ?.totalCowMilkWeight ?? 0.0;
                                BQtyAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails
                                      ?.totalBuffMilkWeight ?? 0.0
                                  : innerVal.eveningMilkDetails
                                      ?.totalBuffMilkWeight ?? 0.0;
                                CFatAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.avgCowFat ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.avgCowFat ??
                                    0.0;
                                BFatAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.avgBuffFat ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.avgBuffFat ??
                                    0.0;
                                CSnfAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.avgCowSnf ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.avgCowSnf ??
                                    0.0;
                                BSnfAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.avgBuffSnf ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.avgBuffSnf ??
                                    0.0;
                                CkgFatAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.kgFatCow ?? 0.0
                                  : innerVal.eveningMilkDetails?.kgFatCow ??
                                    0.0;
                                BkgFatAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.kgFatBuff ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.kgFatBuff ??
                                    0.0;
                                CkgSnfAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.kgSnfCow ?? 0.0
                                  : innerVal.eveningMilkDetails?.kgSnfCow ??
                                    0.0;
                                BkgSnfAgentTotal += innerVal.morningMilkDetails
                                  ? innerVal.morningMilkDetails?.kgSnfBuff ??
                                    0.0
                                  : innerVal.eveningMilkDetails?.kgSnfBuff ??
                                    0.0;

                                BMCMQtyTotal +=
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails
                                        ?.totalCowMilkWeight ?? 0.0
                                    : innerVal.eveningMilkDetails
                                        ?.totalCowMilkWeight ?? 0.0) +
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails
                                        ?.totalBuffMilkWeight ?? 0.0
                                    : innerVal.eveningMilkDetails
                                        ?.totalBuffMilkWeight ?? 0.0);
                                BMCMKgFatTotal +=
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails?.kgFatCow ??
                                      0.0
                                    : innerVal.eveningMilkDetails?.kgFatCow ??
                                      0.0) +
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails?.kgFatBuff ??
                                      0.0
                                    : innerVal.eveningMilkDetails?.kgFatBuff ??
                                      0.0);
                                BMCMKgSnfTotal +=
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails?.kgSnfCow ??
                                      0.0
                                    : innerVal.eveningMilkDetails?.kgSnfCow ??
                                      0.0) +
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails?.kgSnfBuff ??
                                      0.0
                                    : innerVal.eveningMilkDetails?.kgSnfBuff ??
                                      0.0);

                                grandQtyTotal +=
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails
                                        ?.totalCowMilkWeight ?? 0.0
                                    : innerVal.eveningMilkDetails
                                        ?.totalCowMilkWeight ?? 0.0) +
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails
                                        ?.totalBuffMilkWeight ?? 0.0
                                    : innerVal.eveningMilkDetails
                                        ?.totalBuffMilkWeight ?? 0.0);
                                grandKgFatTotal +=
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails?.kgFatCow ??
                                      0.0
                                    : innerVal.eveningMilkDetails?.kgFatCow ??
                                      0.0) +
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails?.kgFatBuff ??
                                      0.0
                                    : innerVal.eveningMilkDetails?.kgFatBuff ??
                                      0.0);
                                grandKgSnfTotal +=
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails?.kgSnfCow ??
                                      0.0
                                    : innerVal.eveningMilkDetails?.kgSnfCow ??
                                      0.0) +
                                  (innerVal.morningMilkDetails
                                    ? innerVal.morningMilkDetails?.kgSnfBuff ??
                                      0.0
                                    : innerVal.eveningMilkDetails?.kgSnfBuff ??
                                      0.0);

                                return (
                                  <>
                                    <div
                                      className="reconcillationReport__table__content1"
                                      key={ind}
                                    >
                                      <p style={{ width: "15%" }}>{ind + 1}</p>
                                      {innerVal.morningMilkDetails ? (
                                        <p>{innerVal?.collectedAt}</p>
                                      ) : (
                                        <p>{innerVal?.collectedAt}</p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>M</p>
                                      ) : (
                                        <p>E</p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.totalCowMilkWeight?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.totalCowMilkWeight?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.totalBuffMilkWeight?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.totalBuffMilkWeight?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.avgCowFat?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.avgCowFat?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.avgBuffFat?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.avgBuffFat?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.avgCowSnf?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.avgCowSnf?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.avgBuffSnf?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.avgBuffSnf?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.kgFatCow?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.kgFatCow?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.kgFatBuff?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.kgFatBuff?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.kgSnfCow?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.kgSnfCow?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                      {innerVal.morningMilkDetails ? (
                                        <p>
                                          {innerVal.morningMilkDetails?.kgSnfBuff?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      ) : (
                                        <p>
                                          {innerVal.eveningMilkDetails?.kgSnfBuff?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                      )}
                                    </div>
                                  </>
                                );
                              })}

                              <div
                                className="reconcillationReport__table__totalAgent"
                                key={ind}
                              >
                                <p>Total:</p>
                                <p style={{ width: "15%" }}></p>
                                <p></p>
                                <p>{CQtyTotal.toFixed(2)}</p>
                                <p>{BQtyTotal.toFixed(2)}</p>
                                <p>{CFatTotal.toFixed(2)}</p>
                                <p>{BFatTotal.toFixed(2)}</p>
                                <p>{CSnftotal.toFixed(2)}</p>
                                <p>{BSnfTotal.toFixed(2)}</p>
                                <p>{CKgFatTotal.toFixed(2)}</p>
                                <p>{BKgFatTotal.toFixed(2)}</p>
                                <p>{CkgSnfTotal.toFixed(2)}</p>
                                <p>{BKgSnfTotal.toFixed(2)}</p>
                              </div>
                            </>
                          );
                        })}
                      </>

                      <div className="reconcillationReport__table__belowcontent1">
                        <p style={{ width: "15%" }}>
                          <b>{val?.parentOuName}</b>
                        </p>
                        <p style={{width:"10%"}}></p>
                        <p></p>
                        <p>{CQtyAgentTotal?.toFixed(2)}</p>
                        <p>{BQtyAgentTotal?.toFixed(2)}</p>
                        <p>{CFatAgentTotal?.toFixed(2)}</p>
                        <p>{BFatAgentTotal?.toFixed(2)}</p>
                        <p>{CSnfAgentTotal?.toFixed(2)}</p>
                        <p>{BSnfAgentTotal?.toFixed(2)}</p>
                        <p>{CkgFatAgentTotal?.toFixed(2)}</p>
                        <p>{BkgFatAgentTotal?.toFixed(2)}</p>
                        <p>{CkgSnfAgentTotal?.toFixed(2)}</p>
                        <p>{BkgSnfAgentTotal?.toFixed(2)}</p>
                      </div>

                      <div className="reconcillationReport__table__belowcontent3">
                        <p style={{ width: "10%" }}></p>
                        <p>Total: BM + CM</p>
                        <p style={{ width: "55%" }}></p>
                        <p>{BMCMQtyTotal?.toFixed(2)}</p>
                        <p style={{ width: "50%" }}></p>
                        <p>{BMCMKgFatTotal?.toFixed(2)}</p>
                        <p>{BMCMKgSnfTotal?.toFixed(2)}</p>
                      </div>
                    </>
                  );
                })}

                <div className="reconcillationReport__table__footer">
                  <p style={{ width: "10%" }}></p>
                  <p>Grand Total : </p>
                  <p style={{ width: "55%" }}></p>
                  <p>{grandQtyTotal.toFixed(2)}</p>
                  <p style={{ width: "50%" }}></p>
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

export default ReconcillationReport;
