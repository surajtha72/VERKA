import React, { useEffect, useRef, useState } from "react";
import "./PaymentCheckList.scss";
import { GetPaymentChecklist } from "../../../utils/apiCalls";
import html2pdf from "html2pdf.js";
import Download from "../../../../assets/images/icons/download.png";
import { IconButton, Paper } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import moment from 'moment';
import Loader from "../../../components/loader";
import * as XLSX from "xlsx";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons';

const PayoutCheckList = () => {
  const token = localStorage.getItem("token");
  const [billDetails, setBillDetails] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleCycle = () => {
    navigate("/payment-checklist-cycle-list");
  };

  let startEndDate = localStorage.getItem("start-end-date");
  const dateParts = startEndDate.split(" - ");
  let startDt = moment(dateParts[0]).format("DD/MM/YYYY");
  let endDt = moment(dateParts[1]).format("DD/MM/YYYY");


  const generatePDF = () => {
    const invoiceElements = document.querySelectorAll(".payment");
    const htmlContents = [];
    invoiceElements?.forEach((content) => {
      htmlContents.push(content.innerHTML);
    });

    const combinedHTML = htmlContents.join("<div style='page-break-before:always'></div>");

    const html2pdfOptions = {
      margin: 10,
      filename: "payout checklist",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "mm", format: "a3", orientation: "portrait" },
    };

    html2pdf().from(combinedHTML).set(html2pdfOptions).save();
  };

  useEffect(() => {
    getBill();
  }, []);

  const payoutRef = useRef();
  const Print = () => {
    const printContents = payoutRef.current?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    } else {
      // console.error('Element with ref "payoutRef" not found.');
    }
  };

  const getBill = () => {
    const dateRange = localStorage.getItem("start-end-date");
    const dateParts = dateRange?.split(" - ");
    const payload = {
      startDate: dateParts[0],
      endDate: dateParts[1],
      bmcId: localStorage.getItem("BMCId"),
    };
    GetPaymentChecklist((res) => {
      setIsLoading(true); // Show the loading spinner
      let { status, data } = res;
      if (status === 200) {
        setBillDetails(data);
        // console.log("payment checklist--> ", data)
        setIsLoading(false); // Hide the loading spinner
      }
    }, payload);
  };

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${localStorage.getItem("start-end-date")} ${billDetails[0]?.bmcName} Payout CheckList.xlsx`);
  };
  const excelitem = [];
  billDetails[0]?.org?.map((billDetail, ind) => {
    // console.log("detail : ", billDetail)
    excelitem.push({
      'SlNo': ind + 1,
      "Agent Code": billDetail.agentCode ?? ' ',
      "Agent Name": billDetail.agentName ?? ' ',
      "Route Name": billDetail.routeName ?? ' ',
      "Total Quantity": billDetail.totalQuantity ?? ' ',
      "Total Amount.": billDetail.totalAmount ?? ' ',
      'Earning': billDetail.earning ?? ' ',
      "Deduction": billDetail.deduction ?? ' ',
      "Settlement Amount": billDetail.settlementAmount ?? ' ',
      "Total Payment": Math.round(billDetail.earning + billDetail.totalAmount - billDetail.deduction) ?? ' '
    })
  })

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
            <div><img
              onClick={generatePDF}
              src={Download}
              alt="Pdf Download"
              className="download"
            />
              <CButton className="export" onClick={handleExportToExcel}>Export To Excel</CButton>
              <FontAwesomeIcon className="print" onClick={Print} icon={faPrint} />
            </div>
          ) : (
            ""
          )}

          {isLoading ? (
            <Loader />
          ) : billDetails ? (
            <div ref={payoutRef}>
              <div className="payment">
                <div className="payment__header">
                  <div className="payment__header__heading">
                    <p>Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                  </div>

                </div>


                {billDetails?.map((val, ind) => {

                  let grandTotalQuantity = 0;
                  let grandTotalAmount = 0;
                  let grandEarning = 0;
                  let grandPayment = 0;
                  let grandDeduction = 0;
                  let grandTotalPayment = 0;
                  let grandRnd = 0;
                  let grandNetPayable = 0;
                  let totalSettlementAmount = 0;

                  return (
                    <>
                      <div className="payment__header__bottomheading">
                        <p>{val.bmcName}&nbsp;&nbsp;Payout Check List &nbsp;
                          From&nbsp;&nbsp;{startDt}
                          &nbsp;&nbsp;To&nbsp;&nbsp;{endDt} &nbsp;&nbsp;</p>
                        <p>Cycle No. &nbsp;&nbsp; </p>
                        {/* <p>Page No. 1</p> */}
                      </div>
                      <div className="payment__table__header">
                        <p style={{ width: "10%" }}>Sr. No.</p>
                        <p style={{ width: "58%" }}>Agent Code and Name</p>
                        <p>Route Name</p>
                        <p>Total Qty</p>
                        <p>Total Amt</p>
                        <p>Earning</p>
                        <p>Payment</p>
                        <p>Deduction</p>
                        <p>Prev. Settlement</p>
                        <p>Total Payment</p>
                        <p>Rnd</p>
                        <p>Net Payable</p>
                      </div>
                      {
                        billDetails[ind].org?.map((val, ind) => {
                          let payment = 0;
                          let totalPayment = 0;
                          let netPayable = 0;
                          let rnd = 0;

                          payment = ((val.totalAmount) + (val.earning)) ?? 0.00;
                          totalPayment = (payment - (val.deduction) + val?.settlementAmount) ?? 0.00;
                          netPayable = Math.round(totalPayment);
                          rnd = netPayable - totalPayment;

                          grandTotalQuantity += val.totalQuantity;
                          grandTotalAmount += val.totalAmount;
                          grandEarning += val.earning;
                          grandPayment += payment;
                          grandDeduction += val.deduction;
                          totalSettlementAmount += val.settlementAmount;
                          if (totalPayment > 0) {
                            grandRnd += rnd;
                            grandNetPayable += netPayable;
                            grandTotalPayment += totalPayment;
                          }

                          return (
                            <div className="payment__table__content" key={ind}>
                              <p style={{ width: "10%" }}>{ind + 1}</p>
                              <p style={{ width: "58%", fontSize: '.8em' }}>{val.agentCode}&nbsp;&nbsp;{val.agentName}</p>
                              <p>{val.routeName}</p>
                              <p>{val.totalQuantity ? val.totalQuantity.toFixed(2) : "0.00"}</p>
                              <p>{val.totalAmount ? val.totalAmount.toFixed(2) : "0.00"}</p>
                              <p>{val.earning ? val.earning.toFixed(2) : "0.00"}</p>
                              <p>{payment ? payment.toFixed(2) : "0.00"}</p>
                              <p>{val.deduction ? val.deduction.toFixed(2) : "0.00"}</p>
                              <p>{val.settlementAmount ? val.settlementAmount.toFixed(2) : "0.00"}</p>
                              <p>{totalPayment ? totalPayment.toFixed(2) : "0.00"}</p>
                              <p>{totalPayment ? (Math.round(totalPayment) - totalPayment.toFixed(2)).toFixed(2) : "0.00"}</p>
                              <p>{netPayable}</p>
                            </div>
                          )
                        })
                      }

                      <div className="payment__table__belowcontent" key={ind}>
                        <p style={{ width: "10%" }}></p>
                        <p style={{ width: "58%" }}>Grand Total: </p>
                        <p></p>
                        <p>{grandTotalQuantity.toFixed(2)}</p>
                        <p>{grandTotalAmount.toFixed(2)}</p>
                        <p>{grandEarning.toFixed(2)}</p>
                        <p>{grandPayment.toFixed(2)}</p>
                        <p>{grandDeduction.toFixed(2)}</p>
                        <p></p>
                        <p>{grandTotalPayment.toFixed(2)}</p>
                        <p>{grandRnd.toFixed(2)}</p>
                        <p>{grandNetPayable.toFixed(2)}</p>
                      </div>

                    </>
                  )
                })}

              </div>

            </div>
            // })
          ) : (
            <div className="empty_data">
              <Paper elevation={3}>
                <h1>No Data Available</h1>
                <h3>For This Record.</h3>
              </Paper>
            </div>
          )}
        </div >
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default PayoutCheckList;
