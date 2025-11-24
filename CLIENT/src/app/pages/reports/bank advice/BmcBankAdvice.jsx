import React, { useEffect, useRef, useState } from "react";
import "./BmcBankAdvice.scss";
import {
  GetBmcBankAdvice
} from "../../../utils/apiCalls";
import html2pdf from "html2pdf.js";
import Download from "../../../../assets/images/icons/download.png";
import { IconButton, Paper } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import moment from "moment";
import Loader from "../../../components/loader";
import * as XLSX from "xlsx";
import { CButton } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const BmcBankAdvice = () => {
  const token = localStorage.getItem("token");
  const [billDetails, setBillDetails] = useState([]);
  const navigate = useNavigate();
  const [soldProducts, setSoldProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCycle = () => {
    navigate("/bmc-cycle-list-bank-advice");
  };

  let startDate = localStorage.getItem("start-end-date");
  let endDate = localStorage.getItem("endDateCycle");

  let startEndDate = localStorage.getItem("start-end-date");
  const dateParts = startEndDate?.split(" - ");
  let startDt = moment(dateParts[0]).format("DD/MM/YYYY");
  let endDt = moment(dateParts[1]).format("DD/MM/YYYY");
  let cycleStartDate = dateParts[0];
  let cycleEndDate = dateParts[1];
  // console.log(cycleStartDate, cycleEndDate);

  const generatePDF = () => {
    const invoiceElements = document.querySelectorAll(".advice");
    const htmlContents = [];

    invoiceElements?.forEach((content) => {
      htmlContents.push(content.innerHTML);
    });

    const combinedHTML = htmlContents.join(
      "<div style='page-break-before:always'></div>"
    );

    const html2pdfOptions = {
      margin: 10,
      filename: "bank advice",
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
    };
    GetBmcBankAdvice((res) => {
      setIsLoading(true); // Show the loading spinner
      let { status, data } = res;
      if (status === 200) {
        setBillDetails(data);
        // console.log("bank advice--> ", data)
        setIsLoading(false); // Hide the loading spinner
      }
    }, payload);
  };

  var a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  var b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  let n;
  function inWords(num) {
    if ((num = num.toString()).length > 9) return "overflow";
    n = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = "";
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore "
        : "";
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh "
        : "";
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand "
        : "";
    str +=
      n[4] != 0
        ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred "
        : "";
    str +=
      n[5] != 0
        ? (str != "" ? "and " : "") +
          (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
          " And Zero Paise Only "
        : "";
    return str;
  }

  const handleExportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelitem);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `Bank Advice.xlsx`);
  };
  const excelitem = [];
  billDetails?.map((billDetail, ind) => {
    console.log("detail : ", billDetail.organization);
    if (
      billDetail.amount > 1000 &&
      billDetail.organization.ifscCode == null &&
      billDetail.organization.accNumber != null
    ) {
      excelitem.push({
        SlNo: ind + 1,
        "Account Holder's Name": billDetail.organization?.accHolderName ?? " ",
        "A/C No.": billDetail.organization.accNumber ?? " ",
        Amount: parseFloat(billDetail.amount.toFixed(0)) ?? " ",
      });
    }
  });

  const bankAdviceRef = useRef();
  const Print = () => {
    const printContents = bankAdviceRef.current?.innerHTML;
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

  let branchTotal = 0;
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
              <img
                onClick={generatePDF}
                src={Download}
                alt="Pdf Download"
                className="download"
              />
              <CButton className="export" onClick={handleExportToExcel}>
                Export To Excel
              </CButton>
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
            <div ref={bankAdviceRef}>
              <div className="advice">
                <div className="advice__header">
                  <div className="advice__header__heading">
                    <p>Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                  </div>
                  <div className="advice__header__bottomheading">
                    <p>
                      Bank Advice &nbsp; From&nbsp;&nbsp;{startDt}
                      &nbsp;&nbsp;To&nbsp;&nbsp;{endDt} &nbsp;&nbsp;
                    </p>
                    <p>Cycle No. &nbsp;&nbsp; </p>
                    {/* <p>  Page No. 1</p> */}
                  </div>
                  <div className="advice__header__secondbottomheading">
                    <p>1 State Bank of India</p>
                    <p>
                      P.Date:&nbsp;&nbsp;
                      {moment(new Date()).format("YYYY/MM/DD")}
                    </p>
                  </div>
                </div>
                <div className="advice__table__header">
                  <p style={{ width: "10%" }}>Sr. No.</p>
                  <p>Account Holder's Name</p>
                  <p>A/C No.</p>
                  <p>Amount</p>
                </div>

                {billDetails
                  .filter(
                    (val) =>
                      val.organization?.ifscCode == null &&
                      val.organization.accNumber != null &&
                      val.amount >= 1000
                  )
                  ?.map((val, ind) => {
                    if (val.amount > 1000) {
                      branchTotal += parseFloat(val.amount.toFixed(0));
                      return (
                        <div className="advice__table__content" key={ind}>
                          {/* {console.log("val-->", val)} */}
                          <p style={{ width: "10%" }}>{ind + 1}</p>
                          <p>{val.organization?.accHolderName}</p>
                          <p>{val.organization?.accNumber}</p>
                          <p>{parseFloat(val.amount).toFixed(0)}</p>
                        </div>
                      );
                    }
                  })}
                <div className="advice__table__footer">
                  <p>Branch Total : </p>

                  <p style={{ fontWeight: 550 }}>{branchTotal.toFixed(0)}</p>
                </div>
                <div style={{ alignItems: "flex-end" }}>
                  <p style={{ fontWeight: 550, alignItems: "end" }}>
                    {inWords(parseFloat(branchTotal.toFixed(0)))} And Zero Paise
                    Only
                  </p>
                  <br />
                </div>
                <div className="advice__footer">
                  <p>
                    FOR, GANGA DAIRY LIMITED
                    <br />
                    <br />
                    <br />
                    Authorized Signatory
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

export default BmcBankAdvice;
