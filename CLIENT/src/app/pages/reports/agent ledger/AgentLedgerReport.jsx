import React, { useEffect, useRef, useState } from "react";
import "./AgentLedgerReport.scss";
import { GetAgentLedger } from "../../../utils/apiCalls";
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

const AgentLedger = () => {
  const token = localStorage.getItem("token");
  const [billDetails, setBillDetails] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleCycle = () => {
    navigate("/agent-ledger-cycle-list");
  };

  let startEndDate = localStorage.getItem("start-end-date");
  const dateParts = startEndDate.split(" - ");
  let startDt = moment(dateParts[0]).format("DD/MM/YYYY");
  let endDt = moment(dateParts[1]).format("DD/MM/YYYY");

  const generatePDF = () => {
    const invoiceElements = document.querySelectorAll(".ledger");
    const htmlContents = [];

    invoiceElements?.forEach((content) => {
      htmlContents.push(content.innerHTML);
    });

    const combinedHTML = htmlContents.join(
      "<div style='page-break-before:always'></div>"
    );

    const html2pdfOptions = {
      margin: 10,
      filename: "agent ledger",
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
      agentId: localStorage.getItem("agentId"),
    };
    GetAgentLedger((res) => {
      setIsLoading(true); // Show the loading spinner
      let { status, data } = res;
      if (status === 200) {
        setBillDetails(data);
        // console.log("agent ledger--> ", data)
        setIsLoading(false); // Hide the loading spinner
      }
    }, payload);
  };

  const agentLedgerRef = useRef();
  const Print = () => {
    const printContents = agentLedgerRef.current?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      console.error('Element with ref "bankLetterRef" not found.');
    }
  };

  const handleExportToExcel = () => {
        // Get the header and footer sections
        const headerElement = document.querySelector(".ledger__table__header");
        const footerElement = document.querySelector(".ledger__table__belowcontent");
    
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Agent Ledger Report");
    
        // Export the Excel file
        XLSX.writeFile(workbook, "AgentLedgerReport.xlsx");
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
            <div ref={agentLedgerRef}>
              <div className="ledger">
                <div className="ledger__header">
                  <div className="ledger__header__heading">
                    <p>Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                  </div>
                </div>

                <div className="ledger__header__bottomheading">
                  <p>
                    AGENT LEDGER &nbsp; From&nbsp;&nbsp;{startDt}
                    &nbsp;&nbsp;To&nbsp;&nbsp;{endDt} &nbsp;&nbsp;
                  </p>
                </div>

                <div className="ledger__table__header">
                  {/* <p>Cycle No.</p> */}
                  <p></p>
                  <p>Agent Name</p>
                  <p>{billDetails[0].agentCode?.toString().substr(-4)}</p>
                  <p>{billDetails[0].agentName}</p>
                  <p></p>
                </div>

                <div className="ledger__table__bottomheader">
                  <p>Date</p>
                  <p></p>
                  <p></p>
                  <p>Earning</p>
                  <p>Ded. Amt</p>
                  <p>Rnd.</p>
                  <p>Paid Amt</p>
                </div>

                <div className="ledger__table__content">
                  <p>{endDt}</p>
                  <p>Milk Value</p>
                  <p></p>
                  <p>{billDetails[0].milkValue.toFixed(2)}</p>
                  <p></p>
                  <p></p>
                  <p></p>
                </div>

                <div className="ledger__table__content">
                  <p>{endDt}</p>
                  <p>Krishi Bazaar</p>
                  <p></p>
                  <p></p>
                  <p>{billDetails[0].deduction.toFixed(2)}</p>
                  <p></p>
                  <p></p>
                </div>

                <div className="ledger__table__content">
                  <p>{endDt}</p>
                  <p>Head Load</p>
                  <p></p>
                  <p>{billDetails[0].headLoad.toFixed(2)}</p>
                  <p></p>
                  <p></p>
                  <p></p>
                </div>

                <div className="ledger__table__content">
                  <p>{endDt}</p>
                  <p>Handling Charge</p>
                  <p></p>
                  <p>{billDetails[0].handlingCharge.toFixed(2)}</p>
                  <p></p>
                  <p></p>
                  <p></p>
                </div>

                <div className="ledger__table__belowcontent">
                  <p>Total: </p>
                  <p></p>
                  <p></p>
                  <p>
                    {(
                      billDetails[0].milkValue +
                      billDetails[0].headLoad +
                      billDetails[0].handlingCharge
                    ).toFixed(2)}
                  </p>
                  <p>{billDetails[0].deduction.toFixed(2)}</p>
                  <p>
                    {(
                      Math.ceil(
                        billDetails[0].milkValue - billDetails[0].deduction
                      ) -
                      (billDetails[0].milkValue - billDetails[0].deduction)
                    ).toFixed(2)}
                  </p>
                  <p>
                    {(
                      billDetails[0].milkValue - billDetails[0].deduction
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // })
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

export default AgentLedger;
