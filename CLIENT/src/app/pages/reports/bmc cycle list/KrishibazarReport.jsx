import React, { useEffect, useState } from 'react'
import "./KrishibazarReport.scss";
import { GetKrishibazarReport } from '../../../utils/apiCalls';
import moment from 'moment';
import Download from "../../../../assets/images/icons/download.png";
import { IconButton, Paper } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import Loader from "../../../components/loader";
import * as XLSX from "xlsx";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint } from '@fortawesome/free-solid-svg-icons';

const KrishibazaReport = () => {
  const token = localStorage.getItem("token");
  const [krishibazarReport, setKrishibazarReport] = useState([]);
  let startEndDate = localStorage.getItem("start-end-date");
  const dateParts = startEndDate?.split(" - ");
  let startDt = moment(dateParts[0]).format("DD/MM/YYYY");
  let endDt = moment(dateParts[1]).format("DD/MM/YYYY");
  let cycleStartDate = dateParts[0];
  let cycleEndDate = dateParts[1];
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleCycle = () => {
    navigate("/bmc-cycle-list");
  };

  const generatePDF = () => {
    const invoiceElements = document.querySelectorAll(".krishi");
    const htmlContents = [];

    invoiceElements?.forEach((content) => {
      htmlContents.push(content.innerHTML);
    });

    const combinedHTML = htmlContents.join("<div style='page-break-before:always'></div>");

    const html2pdfOptions = {
      margin: 10,
      filename: "krishi bazaar",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "mm", format: "a3", orientation: "portrait" },
    };

    html2pdf().from(combinedHTML).set(html2pdfOptions).save();
  };

  useEffect(() => {
    getKrishibazarReport();
  }, []);

  const getKrishibazarReport = () => {
    const dateRange = localStorage.getItem("start-end-date");
    const dateParts = dateRange?.split(" - ");
    const payload = {
      startDate: dateParts[0],
      endDate: dateParts[1],
      bmcId: localStorage.getItem("BMCId"),
    };
    GetKrishibazarReport((res) => {
      setIsLoading(true); // Show the loading spinner
      let { status, data } = res;
      if (status === 200) {
        setKrishibazarReport(data);
        setIsLoading(false); // Hide the loading spinner
      }
    }, payload);
  };

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `Krishi Bazaar.xlsx`);
  };
  const excelitem = [];

  const krishiBazarRef = React.useRef([])
  const Print = () => {
    const allKrishibazarContents = krishibazarReport
      .map((val, ind) => krishiBazarRef.current[ind]?.innerHTML)
      .filter(content => content); // removes undefined values

    if (allKrishibazarContents.length > 0) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = allKrishibazarContents.join('<div style="page-break-before: always;"></div>');
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      // console.error('No invoices found to print.');
    }
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
          <div style={{ width: '2vw', height: '2vw', position: 'absolute', right: '5vw', top: '.5vw' }}>
            <IconButton onClick={Print}>
              <FontAwesomeIcon style={{ height: '2vw', width: '2vw', color: 'black' }} icon={faPrint} />
            </IconButton>
          </div>
          {krishibazarReport ? (
            <div><img
              onClick={generatePDF}
              src={Download}
              alt="Pdf Download"
              className="download"
            /></div>
          ) : (
            ""
          )}

          {isLoading ? (
            <Loader />
          ) : krishibazarReport ? (
            <div>
              <div className="krishi">

                {krishibazarReport?.map((val, ind) => {
                  let quantityTotal = 0;
                  let rateTotal = 0;
                  let tAmountTotal = 0;
                  let paidAmountTotal = 0;
                  let creditAmountTotal = 0;
                  return (
                    <div ref={(ref) => (krishiBazarRef.current[ind] = ref)}>
                      <div className="krishi__header">
                        <div className="krishi__header__heading">
                          <p>Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                        </div>
                      </div>
                      <div className="krishi__table__content" key={ind}>
                        {/* {console.log("val-->", val)} */}
                        <p style={{ width: "10%" }}>Agent Id:</p>
                        <p>{val?.agentDetail?.Id}</p>
                        <p style={{ width: "10%" }}>Agent Name:</p>
                        <p style={{ width: "25%" }}>{val?.agentDetail?.Name}</p>
                        <p>Date:&nbsp;&nbsp;{moment(new Date()).format("DD/MM/YYYY")}</p>
                      </div>
                      <>
                        {krishibazarReport[ind].saleDetail?.map((val, ind) => {

                          quantityTotal += val.soldQuantity;
                          rateTotal += val.rate;
                          tAmountTotal += val.totalAmount;
                          paidAmountTotal += val.paidAmount;
                          creditAmountTotal += (val.totalAmount) - (val.paidAmount)

                          return (
                            <>
                              <div className="krishi__table__content1" key={ind}>
                                <p>Sold On</p>
                                <p>Product Category</p>
                                <p>Product Name</p>
                                <p>Quantity</p>
                                <p>Rate</p>
                                <p>Total Amount</p>
                                <p>Payment Mode</p>
                              </div>
                              <div className="krishi__table__content2" key={ind}>
                                <p>{moment(val?.soldOn).format('DD/MM/YYYY')}</p>
                                <p>{val.productCat}</p>
                                <p>{val.productName}</p>
                                <p>{val.soldQuantity}</p>
                                <p>{val.rate}</p>
                                <p>{val.totalAmount}</p>
                                <p>{val.paymentMode}</p>
                              </div>
                            </>
                          );
                        })}
                      </>
                      <div className="krishi__table__total" key={ind}>
                        <p></p>
                        <p>Total:</p>
                        <p></p>
                        <p>{quantityTotal}</p>
                        <p>{rateTotal}</p>
                        <p>{tAmountTotal}</p>
                        <p></p>
                      </div>
                    </div>
                  )
                })}
              </div >
            </div>
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
  )
}

export default KrishibazaReport