import React, { useEffect, useRef, useState } from "react";
import "./DateWiseReconcillationReport.scss";
import { GetDateWiseReconcillation } from "../../../utils/apiCalls";
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
    navigate("/datewise-cycle-list-reconcillation");
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
      filename: "reconcillation report",
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
      shift: shift,
    };
    GetDateWiseReconcillation((res) => {
      setIsLoading(true); // Show the loading spinner
      let { status, data } = res;
      if (status === 200) {
        setBillDetails(data);
        setIsLoading(false); // Hide the loading spinner
        console.log("bank advice--> ", data);
      }
    }, payload);
  };

  // console.log('bmc reconcillation bill: ', billDetails);

  const currentDate = moment(new Date()).format("YYYY-MM-DD");

  let grandWeightTotal = 0;
  let grandKgFatTotal = 0;
  let grandKgSnfTotal = 0;

  let CAvgFatcounter = 0;
  let BAvgFatcounter = 0;
  let CAvgSnfcounter = 0;
  let BAvgSnfcounter = 0;

  const excelitem = [];
  billDetails?.map((billDetail, ind) => {
    // console.log("detail : ", billDetail)
    if (billDetail.amount > 1000 && billDetail.organization.ifscCode == null) {
      excelitem.push({
        SlNo: ind + 1,
        "Account Holder's Name": billDetail.organization.accHolderNamec ?? " ",
        "IFSC Code": billDetail.ifscCode ?? " ",
        "A/C No.": billDetail.accNumber ?? " ",
        Amount: parseFloat(billDetail.amount.toFixed(2)) ?? " ",
      });
    }
  });

  const dateReconRef = useRef();
  const Print = () => {
    const printContents = dateReconRef.current?.innerHTML;
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
    const headerElement = document.querySelector(
      ".reconcillationReport__table__header"
    );
    const footerElement = document.querySelector(
      ".reconcillationReport__table__footer"
    );

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
    XLSX.writeFile(workbook, "DateReconciliationReport.xlsx");
  };

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
            <div ref={dateReconRef}>
              <div className="reconcillationReport">
                <div className="reconcillationReport__header">
                  <div className="reconcillationReport__header__heading">
                    <p>Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                  </div>
                  <div className="reconcillationReport__header__bottomheading">
                    <p>
                      Fat, SNF Reconcillation Sheet &nbsp; From&nbsp;&nbsp;
                      {startDt}
                      &nbsp;&nbsp;To&nbsp;&nbsp;{endDt} &nbsp;&nbsp;
                    </p>
                    <p>Page No. 1</p>
                  </div>
                </div>
                <div className="reconcillationReport__table__header">
                  <p style={{ width: "15%" }}>Sr. No.</p>
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
                  let CWeightAgentTotal = 0;
                  let BWeightAgentTotal = 0;
                  let CAvgFatAgentTotal = 0;
                  let BAvgFatAgentTotal = 0;
                  let CAvgSnfAgentTotal = 0;
                  let BAvgSnfAgentTotal = 0;
                  let CkgFatAgentTotal = 0;
                  let BkgFatAgentTotal = 0;
                  let CkgSnfAgentTotal = 0;
                  let BkgSnfAgentTotal = 0;

                  let BMCMWeightTotal = 0;
                  let BMCMKgFatTotal = 0;
                  let BMCMKgSnfTotal = 0;

                  // { console.log('BMCMWeightTotal', BMCMWeightTotal) };

                  return (
                    <>
                      <div className="reconcillationReport__table__bottomheader">
                        <p>{val?.parentOuName}</p>
                      </div>
                      <>
                        {billDetails[ind].details?.map((val, ind) => {
                          if (val.cowMilkDetail?.avgFat != null) {
                            CAvgFatcounter++;
                          }
                          if (val.buffMilkDetail?.avgFat != null) {
                            BAvgFatcounter++;
                          }
                          if (val.cowMilkDetail?.avgSnf != null) {
                            CAvgSnfcounter++;
                          }
                          if (val.buffMilkDetail?.avgSnf != null) {
                            BAvgSnfcounter++;
                          }

                          let CWeightTotal = 0;
                          let BWeightTotal = 0;
                          let CAvgFatTotal = 0;
                          let BAvgFatTotal = 0;
                          let CAvgSnfTotal = 0;
                          let BAvgSnfTotal = 0;
                          let CkgFatTotal = 0;
                          let BkgFatTotal = 0;
                          let CkgSnfTotal = 0;
                          let BkgSnfTotal = 0;

                          // CWeightTotal +=
                          //   val.cowMilkDetail?.totalWeight ??
                          //   0 + val.cowMilkDetail?.totalWeight ??
                          //   0;
                          // BWeightTotal +=
                          //   val.buffMilkDetail?.totalWeight ??
                          //   0 + val.buffMilkDetail?.totalWeight ??
                          //   0;
                          // CAvgFatTotal +=
                          //   val.cowMilkDetail?.avgFat ??
                          //   0 + val.cowMilkDetail?.avgFat ??
                          //   0;
                          // BAvgFatTotal +=
                          //   val.buffMilkDetail?.avgFat ??
                          //   0 + val.buffMilkDetail?.avgFat ??
                          //   0;
                          // CAvgSnfTotal +=
                          //   val.cowMilkDetail?.avgSnf ??
                          //   0 + val.cowMilkDetail?.avgSnf ??
                          //   0;
                          // BAvgSnfTotal +=
                          //   val.buffMilkDetail?.avgSnf ??
                          //   0 + val.buffMilkDetail?.avgSnf ??
                          //   0;
                          // CkgFatTotal +=
                          //   val.cowMilkDetail?.kgFat ??
                          //   0 + val.cowMilkDetail?.kgFat ??
                          //   0;
                          // BkgFatTotal +=
                          //   val.buffMilkDetail?.kgFat ??
                          //   0 + val.buffMilkDetail?.kgFat ??
                          //   0;
                          // CkgSnfTotal +=
                          //   val.cowMilkDetail?.kgSnf ??
                          //   0 + val.cowMilkDetail?.kgSnf ??
                          //   0;
                          // BkgSnfTotal +=
                          //   val.buffMilkDetail?.kgSnf ??
                          //   0 + val.buffMilkDetail?.kgSnf ??
                          //   0;

                          CWeightTotal += (val.cowMilkDetail?.totalWeight ?? 0);
                          BWeightTotal += (val.buffMilkDetail?.totalWeight ?? 0);
                          CAvgFatTotal += (val.cowMilkDetail?.avgFat ?? 0);
                          BAvgFatTotal += (val.buffMilkDetail?.avgFat ?? 0);
                          CAvgSnfTotal += (val.cowMilkDetail?.avgSnf ?? 0);
                          BAvgSnfTotal += (val.buffMilkDetail?.avgSnf ?? 0);
                          CkgFatTotal += (val.cowMilkDetail?.kgFat ?? 0);
                          BkgFatTotal += (val.buffMilkDetail?.kgFat ?? 0);
                          CkgSnfTotal += (val.cowMilkDetail?.kgSnf ?? 0);
                          BkgSnfTotal += (val.buffMilkDetail?.kgSnf ?? 0);

                          // CWeightAgentTotal +=
                          //   val.cowMilkDetail?.totalWeight ??
                          //   0 + val.cowMilkDetail?.totalWeight ??
                          //   0;
                          // BWeightAgentTotal +=
                          //   val.buffMilkDetail?.totalWeight ??
                          //   0 + val.buffMilkDetail?.totalWeight ??
                          //   0;
                          // CAvgFatAgentTotal +=
                          //   val.cowMilkDetail?.avgFat ??
                          //   0 + val.cowMilkDetail?.avgFat ??
                          //   0;
                          // BAvgFatAgentTotal +=
                          //   val.buffMilkDetail?.avgFat ??
                          //   0 + val.buffMilkDetail?.avgFat ??
                          //   0;
                          // CAvgSnfAgentTotal +=
                          //   val.cowMilkDetail?.avgSnf ??
                          //   0 + val.cowMilkDetail?.avgSnf ??
                          //   0;
                          // BAvgSnfAgentTotal +=
                          //   val.buffMilkDetail?.avgSnf ??
                          //   0 + val.buffMilkDetail?.avgSnf ??
                          //   0;
                          // CkgFatAgentTotal +=
                          //   val.cowMilkDetail?.kgFat ??
                          //   0 + val.cowMilkDetail?.kgFat ??
                          //   0;
                          // BkgFatAgentTotal +=
                          //   val.buffMilkDetail?.kgFat ??
                          //   0 + val.buffMilkDetail?.kgFat ??
                          //   0;
                          // CkgSnfAgentTotal +=
                          //   val.cowMilkDetail?.kgSnf ??
                          //   0 + val.cowMilkDetail?.kgSnf ??
                          //   0;
                          // BkgSnfAgentTotal +=
                          //   val.buffMilkDetail?.kgSnf ??
                          //   0 + val.buffMilkDetail?.kgSnf ??
                          //   0;

                          CWeightAgentTotal += val.cowMilkDetail?.totalWeight ?? 0;
                          BWeightAgentTotal += val.buffMilkDetail?.totalWeight ?? 0;
                          CAvgFatAgentTotal += val.cowMilkDetail?.avgFat ?? 0;
                          BAvgFatAgentTotal += val.buffMilkDetail?.avgFat ?? 0;
                          CAvgSnfAgentTotal += val.cowMilkDetail?.avgSnf ?? 0;
                          BAvgSnfAgentTotal += val.buffMilkDetail?.avgSnf ?? 0;
                          CkgFatAgentTotal += val.cowMilkDetail?.kgFat ?? 0;
                          BkgFatAgentTotal += val.buffMilkDetail?.kgFat ?? 0;
                          CkgSnfAgentTotal += val.cowMilkDetail?.kgSnf ?? 0;
                          BkgSnfAgentTotal += val.buffMilkDetail?.kgSnf ?? 0;

                          // BMCMWeightTotal +=
                          //   (val.cowMilkDetail?.totalWeight ??
                          //     0 + val.cowMilkDetail?.totalWeight ??
                          //     0) +
                          //   (val.buffMilkDetail?.totalWeight ??
                          //     0 + val.buffMilkDetail?.totalWeight ??
                          //     0);
                          // BMCMKgFatTotal +=
                          //   (val.cowMilkDetail?.kgFat ??
                          //     0 + val.cowMilkDetail?.kgFat ??
                          //     0) +
                          //   (val.buffMilkDetail?.kgFat ??
                          //     0 + val.buffMilkDetail?.kgFat ??
                          //     0);
                          // BMCMKgSnfTotal +=
                          //   (val.cowMilkDetail?.kgSnf ??
                          //     0 + val.cowMilkDetail?.kgSnf ??
                          //     0) +
                          //   (val.buffMilkDetail?.kgSnf ??
                          //     0 + val.buffMilkDetail?.kgSnf ??
                          //     0);

                          BMCMWeightTotal += 
                            (val.cowMilkDetail?.totalWeight ?? 0) +
                            (val.buffMilkDetail?.totalWeight ?? 0);

                          BMCMKgFatTotal += 
                            (val.cowMilkDetail?.kgFat ?? 0) +
                            (val.buffMilkDetail?.kgFat ?? 0);

                          BMCMKgSnfTotal += 
                            (val.cowMilkDetail?.kgSnf ?? 0) +
                            (val.buffMilkDetail?.kgSnf ?? 0);

                          // grandWeightTotal +=
                          //   (val.cowMilkDetail?.totalWeight ??
                          //     0 + val.cowMilkDetail?.totalWeight ??
                          //     0) +
                          //   (val.buffMilkDetail?.totalWeight ??
                          //     0 + val.buffMilkDetail?.totalWeight ??
                          //     0);
                          // grandKgFatTotal +=
                          //   (val.cowMilkDetail?.kgFat ??
                          //     0 + val.cowMilkDetail?.kgFat ??
                          //     0) +
                          //   (val.buffMilkDetail?.kgFat ??
                          //     0 + val.buffMilkDetail?.kgFat ??
                          //     0);
                          // grandKgSnfTotal +=
                          //   (val.cowMilkDetail?.kgSnf ??
                          //     0 + val.cowMilkDetail?.kgSnf ??
                          //     0) +
                          //   (val.buffMilkDetail?.kgSnf ??
                          //     0 + val.buffMilkDetail?.kgSnf ??
                          //     0);

                          grandWeightTotal +=
                            (val.cowMilkDetail?.totalWeight ?? 0) +
                            (val.buffMilkDetail?.totalWeight ?? 0);

                          grandKgFatTotal +=
                            (val.cowMilkDetail?.kgFat ?? 0) +
                            (val.buffMilkDetail?.kgFat ?? 0);

                          grandKgSnfTotal +=
                            (val.cowMilkDetail?.kgSnf ?? 0) +
                            (val.buffMilkDetail?.kgSnf ?? 0);

                          return (
                            <>
                              <div
                                className="reconcillationReport__table__content1"
                                key={ind}
                              >
                                {/* {console.log("val-->", val)} */}
                                <p style={{ width: "15%" }}>{ind + 1}</p>
                                <p>{val.collectedAt}</p>
                                <p>CM</p>
                                {val.cowMilkDetail ? (
                                  <p>
                                    {val.cowMilkDetail?.totalWeight?.toFixed(2) ?? 0}
                                  </p>
                                ) : (
                                  <p></p>
                                )}
                                {val.cowMilkDetail ? (
                                  <p>{val.cowMilkDetail?.avgFat?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                                {val.cowMilkDetail ? (
                                  <p>{val.cowMilkDetail?.avgSnf?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                                {val.cowMilkDetail ? (
                                  <p>{val.cowMilkDetail?.kgFat?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                                {val.cowMilkDetail ? (
                                  <p>{val.cowMilkDetail?.kgSnf?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                              </div>
                              <div
                                className="reconcillationReport__table__content2"
                                key={ind}
                              >
                                <p style={{ width: "15%" }}></p>
                                <p></p>
                                <p>BM</p>
                                {val.buffMilkDetail ? (
                                  <p>{val.buffMilkDetail?.totalWeight?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                                {val.buffMilkDetail ? (
                                  <p>{val.buffMilkDetail?.avgFat?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                                {val.buffMilkDetail ? (
                                  <p>{val.buffMilkDetail?.avgSnf?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                                {val.buffMilkDetail ? (
                                  <p>{val.buffMilkDetail?.kgFat?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                                {val.buffMilkDetail ? (
                                  <p>{val.buffMilkDetail?.kgSnf?.toFixed(2) ?? 0}</p>
                                ) : (
                                  <p></p>
                                )}
                              </div>
                            </>
                          );
                        })}
                      </>

                      <div className="reconcillationReport__table__belowcontent1">
                        <p>
                          <b>{val?.parentOuName}</b>
                        </p>
                        <p style={{ width: "15%" }}></p>
                        <p>CM</p>
                        <p>{CWeightAgentTotal?.toFixed(2) ?? 0}</p>
                        <p>{(CAvgFatAgentTotal / CAvgFatcounter)?.toFixed(2) ?? 0}</p>
                        <p>{(CAvgSnfAgentTotal / CAvgSnfcounter)?.toFixed(2) ?? 0}</p>
                        <p>{CkgFatAgentTotal?.toFixed(2) ?? 0}</p>
                        <p>{CkgSnfAgentTotal?.toFixed(2) ?? 0}</p>
                      </div>
                      <div className="reconcillationReport__table__belowcontent2">
                        <p style={{ width: "15%" }}></p>
                        <p></p>
                        <p>BM</p>
                        <p>{BWeightAgentTotal?.toFixed(2)}</p>
                        <p>{(BAvgFatAgentTotal / BAvgFatcounter)?.toFixed(2) ?? 0}</p>
                        <p>{(BAvgSnfAgentTotal / BAvgSnfcounter)?.toFixed(2) ?? 0}</p>
                        <p>{BkgFatAgentTotal?.toFixed(2) ?? 0}</p>
                        <p>{BkgSnfAgentTotal?.toFixed(2) ?? 0}</p>
                      </div>

                      <div className="reconcillationReport__table__belowcontent3">
                        <p style={{ width: "10%" }}></p>
                        <p>Total: BM + CM</p>
                        <p style={{ width: "29%" }}></p>
                        <p>{BMCMWeightTotal?.toFixed(2)}</p>
                        <p style={{ width: "25%" }}></p>
                        <p></p>
                        <p>{BMCMKgFatTotal?.toFixed(2)}</p>
                        <p>{BMCMKgSnfTotal?.toFixed(2)}</p>
                      </div>
                    </>
                  );
                })}

                <div className="reconcillationReport__table__footer">
                  <p style={{ width: "10%" }}></p>
                  <p>Grand Total : </p>
                  <p style={{ width: "29%" }}></p>
                  <p>{grandWeightTotal.toFixed(2)}</p>
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

export default ReconcillationReport;
