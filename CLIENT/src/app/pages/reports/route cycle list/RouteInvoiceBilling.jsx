import React, { useEffect, useRef, useState } from "react";
import "./RouteInvoiceBilling.scss";
import {
  GetBill,
  GetBillBmcRoute,
  GetCurrentIncentiveMaster,
  GetIncentiveSlab,
  GetPreviousMilkData,
  GetProductSalesToAgent,
} from "../../../utils/apiCalls";
import html2pdf from "html2pdf.js";
import Download from "../../../../assets/images/icons/download.png";
import { IconButton, Paper } from "@mui/material";
import images from "../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { PDFDocument } from "pdf-lib";

const RouteInvoiceBilling = () => {
  const token = localStorage.getItem("token");
  const [billDetails, setBillDetails] = useState([]);
  const navigate = useNavigate();
  const [soldProducts, setSoldProducts] = useState([]);
  let milkData = [];

  const handleCycle = () => {
    navigate("/route-cycle-list");
  };

  let startEndDate = localStorage.getItem("start-end-date");
  const dateParts = startEndDate?.split(" - ");
  let startDt = moment(dateParts[0]).format("DD/MM/YYYY");
  let endDt = moment(dateParts[1]).format("DD/MM/YYYY");
  let cycleStartDate = dateParts[0];
  let cycleEndDate = dateParts[1];

  const generatePDF = async () => {
    const invoiceElements = document.querySelectorAll(".invoice");
    const orgName = localStorage.getItem("orgName");

    const html2pdfOptions = {
      margin: 10,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 0.7 },
      jsPDF: { unit: "mm", format: "a3", orientation: "portrait" },
    };

    const chunkSize = 10; // Process 10 invoices at a time
    const pdfChunks = [];
    let currentIndex = 0;

    // Generate PDFs for each chunk
    const generateChunkPDF = async () => {
      while (currentIndex < invoiceElements.length) {
        const chunk = Array.from(invoiceElements).slice(
          currentIndex,
          currentIndex + chunkSize
        );
        const combinedHTML = chunk
          .map((content) => content.innerHTML)
          .join("<div style='page-break-before:always'></div>");

        const pdfBlob = await html2pdf()
          .from(combinedHTML)
          .set(html2pdfOptions)
          .output("blob"); // Get each chunk as a Blob

        pdfChunks.push(pdfBlob);
        currentIndex += chunkSize;
      }
    };

    await generateChunkPDF();

    // Merge PDFs using pdf-lib
    const mergedPDF = await PDFDocument.create();

    for (const pdfBlob of pdfChunks) {
      const pdfBytes = await pdfBlob.arrayBuffer(); // Convert Blob to ArrayBuffer
      const chunkPDF = await PDFDocument.load(pdfBytes); // Load the chunk into pdf-lib
      const copiedPages = await mergedPDF.copyPages(
        chunkPDF,
        chunkPDF.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPDF.addPage(page));
    }

    // Save the merged PDF
    const mergedPDFBytes = await mergedPDF.save();
    const blob = new Blob([mergedPDFBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${startDt} To ${endDt} Milk Bill-${orgName}.pdf`;
    link.click();
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
      routeId: localStorage.getItem("RouteId"),
    };
    GetBillBmcRoute((res) => {
      setBillDetails(res.data);
    }, payload);
  };

  const convertAmountToWords = (amount) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
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

    const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

    if (amount === 0) return "zero";

    const num = parseFloat(amount);
    const paise = Math.floor((num - Math.floor(num)) * 100);
    let integerPart = Math.floor(num);

    let scaleIndex = 0;
    let words = "";

    while (integerPart > 0) {
      const chunk = integerPart % 1000;
      if (chunk !== 0) {
        const chunkWords = chunkToWords(chunk, ones, tens);
        words =
          chunkWords +
          (scaleIndex === 0 ? "" : " " + scales[scaleIndex]) +
          " " +
          words;
      }
      scaleIndex++;
      integerPart = Math.floor(integerPart / 1000);
    }

    words = words.trim();

    if (paise > 0) {
      const paiseWords = chunkToWords(paise, ones, tens);
      words += " and " + paiseWords + (paise === 1 ? " paisa" : " paise");
    }

    return words;
  };

  const chunkToWords = (num, ones, tens) => {
    if (num === 0) return "";
    if (num < 20) {
      return ones[num];
    } else if (num < 100) {
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + ones[num % 10] : "")
      );
    } else {
      return (
        ones[Math.floor(num / 100)] +
        " hundred" +
        (num % 100 !== 0 ? " " + chunkToWords(num % 100, ones, tens) : "")
      );
    }
  };

  const amountInWords = convertAmountToWords("9875.98");

  let inputArray = [];

  {
    billDetails &&
      billDetails?.map((val) => {
        val?.collectionDetails?.map((val) => {
          inputArray.push(val.MilkType);
        });
      });
  }

  let MilkType = [];

  for (let milk of inputArray) {
    if (!MilkType.includes(milk)) {
      MilkType.push(milk);
    }
  }

  const summedData =
    billDetails &&
    billDetails?.map((bill) => {
      const morningSum = {
        fat: 0,
        snf: 0,
        clr: 0,
        weight: 0,
        canCount: 0,
        value: 0,
      };

      const eveningSum = {
        fat: 0,
        snf: 0,
        clr: 0,
        weight: 0,
        canCount: 0,
        value: 0,
      };

      bill?.collectionDetails?.forEach((collection) => {
        const isCowOrBuffalo =
          collection.MilkType === "cow" || collection.MilkType === "buffalo";
        const isMorningOrEvening =
          collection.shift === "morning" || collection.shift === "evening";

        if (isCowOrBuffalo && isMorningOrEvening) {
          const shiftSum =
            collection.shift === "morning" ? morningSum : eveningSum;

          shiftSum.fat += collection.Fat;
          shiftSum.snf += collection.Snf;
          shiftSum.clr += collection.Clr;
          shiftSum.weight += collection.Weight;
          shiftSum.canCount += collection.CanCount;
          shiftSum.value += collection.value;
        }
      });
      return {
        ...bill,
        morningSum,
        eveningSum,
      };
    });

  const [agentBalance, setAgentBalance] = useState([]);
  useEffect(() => {
    getProductSalesToAgent();
  }, [cycleStartDate, cycleEndDate]);
  useEffect(() => {
    // console.log("agent balance: ", agentBalance);
  }, [agentBalance]);
  const getProductSalesToAgent = () => {
    GetProductSalesToAgent(
      (res) => {
        setSoldProducts(res.data);
        const balance = res.data?.map((item) => {
          // console.log("item : ", item)
          return {
            soldToAgent: item.soldToAgent.Id,
            balance: item.balance,
          };
        });
        setAgentBalance(balance);
      },
      cycleStartDate,
      cycleEndDate
    );
  };

  const [currentIncentive, setCurrentIcentive] = useState([]);
  const [previousMilkData, setPreviousMilkData] = useState([]);
  const [incentiveSlab, setIncentiveSlab] = useState([]);
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  useEffect(() => {
    getCurrentIncentive();
  }, [currentDate]);
  const getCurrentIncentive = () => {
    GetCurrentIncentiveMaster((res) => {
      setCurrentIcentive(res.data);
    }, currentDate);
  };
  const startIncentiveDate = moment(
    currentIncentive[0]?.billingCycleRef?.StartDate
  ).format("YYYY-MM-DD");
  const endIncentiveDate = moment(
    currentIncentive[0]?.billingCycleRef?.EndDate
  ).format("YYYY-MM-DD");
  const minFatLimit = currentIncentive[0]?.minFatLimit;
  const minSnftLimit = currentIncentive[0]?.minSnftLimit;
  useEffect(() => {
    getPreviousMilkData();
  }, [startIncentiveDate, endIncentiveDate, minFatLimit, minSnftLimit]);
  const getPreviousMilkData = () => {
    GetPreviousMilkData(
      (res) => {
        setPreviousMilkData(res.data);
      },
      startIncentiveDate,
      endIncentiveDate,
      minFatLimit,
      minSnftLimit
    );
  };
  const incentiveId = currentIncentive[0]?.id;
  useEffect(() => {
    getIncentiveSlab();
  }, [incentiveId]);
  const getIncentiveSlab = () => {
    GetIncentiveSlab((res) => {
      setIncentiveSlab(res.data);
    }, incentiveId);
  };

  const formatBillDetails = (billDetails) => {
    const formattedData = [];

    billDetails?.forEach((entry) => {
      const organizationId = entry.organization.id;
      const organizationName = entry.organization.name;
      const routeId = entry.organization.routeId;
      const routeName = entry.organization.routeName;
      const headload = entry.organization.headload;
      const commision = entry.organization.commision;
      let balSum = 0;
      const settlementAmount = entry.settlementAmount;

      // Calculate balanceSum
      agentBalance?.forEach((bal) => {
        if (bal.soldToAgent === entry.organization.id) {
          balSum += bal.balance;
        }
      });

      const cowMilkCollectionDetails = entry.collectionDetails
        .filter((collection) => collection.MilkType === "cow")
        .sort((a, b) => new Date(a.CollectedAt) - new Date(b.CollectedAt));

      const buffaloMilkCollectionDetails = entry.collectionDetails
        .filter((collection) => collection.MilkType === "buffalo")
        .sort((a, b) => new Date(a.CollectedAt) - new Date(b.CollectedAt));

      // Group cow milk details by date
      const groupedCowMilkDetails = groupByDateAndShift(
        cowMilkCollectionDetails
      );

      // Group buffalo milk details by date
      const groupedBuffaloMilkDetails = groupByDateAndShift(
        buffaloMilkCollectionDetails
      );

      const formattedEntry = {
        organization: {
          id: organizationId,
          name: organizationName,
          routeId: routeId,
          routeName: routeName,
          headload: headload,
          commision: commision,
          balanceSum: balSum,
        },
        settlementAmount: settlementAmount,
        collectionDetails: {
          cowMilkCollectionDetails: groupedCowMilkDetails,
          buffaloMilkCollectionDetails: groupedBuffaloMilkDetails,
        },
      };

      formattedData.push(formattedEntry);
    });

    return formattedData;
  };

  // Function to group milk details by date and shift
  const groupByDateAndShift = (milkDetails) => {
    const groupedDetails = [];

    milkDetails.forEach((detail) => {
      const existingGroup = groupedDetails.find(
        (group) => group.date === moment(detail.CollectedAt).format("DD-MM")
      );

      if (existingGroup) {
        // If group exists, add detail to the existing group
        existingGroup[detail.shift] = detail;
      } else {
        // If group doesn't exist, create a new group with morning or evening based on the shift
        const newGroup = {
          date: moment(detail.CollectedAt).format("DD-MM"),
          [detail.shift]: detail,
        };
        groupedDetails.push(newGroup);
      }
    });

    return groupedDetails;
  };

  const formattedBillDetails = formatBillDetails(billDetails);
  // console.log("formaed bill details : ", formattedBillDetails)

  const invoiceRefs = useRef([]);
  const Print = () => {
    const allInvoiceContents = formattedBillDetails
      .map((val, ind) => invoiceRefs.current[ind]?.innerHTML)
      .filter((content) => content); // Remove undefined values

    if (allInvoiceContents.length > 0) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = allInvoiceContents.join(
        '<div style="page-break-before: always;"></div>'
      );
      window.print();
      document.body.innerHTML = originalContents;
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
          {billDetails ? (
            <>
              <img
                onClick={generatePDF}
                src={Download}
                alt="Pdf Download"
                className="download"
              />
              <FontAwesomeIcon
                style={{
                  width: "2vw",
                  height: "2vw",
                  position: "absolute",
                  right: "4vw",
                  top: "1vw",
                }}
                onClick={Print}
                icon={faPrint}
              />
            </>
          ) : (
            ""
          )}

          {billDetails ? (
            formattedBillDetails?.map((val, ind) => {
              let morningQtySum = 0;
              let morningKgFatSum = 0;
              let morningKgSnfSum = 0;
              let morningValueSum = 0;
              let eveningQtySum = 0;
              let eveningKgFatSum = 0;
              let eveningKgSnfSum = 0;
              let eveningValueSum = 0;
              let cowMilkquantity = 0;
              let bufFMilkQuantity = 0;
              let cowMilkValue = 0;
              let buffMilkValue = 0;
              let previousMilkQty = 0;
              let currentMilkQty = 0;
              let collectionPercent = 0;
              let achivementDiffPercent = 0;
              let inKgs = 0;
              let adjustmentAmount = 0;
              let totalAmount = 0;
              let billDate = [];
              let uniqueBillDates = [];
              let prevSettlementCr = 0;
              let prevSettlementDr = 0;
              if (val.settlementAmount > 0) {
                prevSettlementCr = val.settlementAmount;
              } else {
                prevSettlementDr = val.settlementAmount;
              }

              previousMilkData?.forEach((data) => {
                if (data.organizationUnitId === val.organization.id) {
                  previousMilkQty += data.weight;
                }
              });

              if (incentiveSlab[0]?.slabType == 2) {
                collectionPercent = (currentMilkQty / previousMilkQty) * 100;
                if (incentiveSlab[0]?.slabTo !== null) {
                  if (
                    collectionPercent >= incentiveSlab[0]?.slabFrom &&
                    collectionPercent <= incentiveSlab[0]?.slabTo
                  ) {
                    achivementDiffPercent =
                      collectionPercent - incentiveSlab[0]?.slabFrom;
                    inKgs = (currentMilkQty * achivementDiffPercent) / 100;
                    adjustmentAmount = inKgs * (totalAmount / currentMilkQty);
                  }
                }
              } else {
                if (collectionPercent >= incentiveSlab[0]?.slabFrom) {
                  achivementDiffPercent =
                    collectionPercent - incentiveSlab[0]?.slabFrom;
                  inKgs = (currentMilkQty * achivementDiffPercent) / 100;
                  adjustmentAmount =
                    inKgs *
                    (totalAmount / currentMilkQty) *
                    incentiveSlab[0]?.incentivePerKg;
                }
              }
              milkData = val;
              milkData.collectionDetails.cowMilkCollectionDetails.forEach(
                (detail) => {
                  billDate.push(moment(detail.CollectedAt).format("DD-MM"));
                }
              );
              billDate.forEach((date) => {
                if (!uniqueBillDates.includes(date)) {
                  uniqueBillDates.push(date);
                }
              });
              return (
                <div ref={(ref) => (invoiceRefs.current[ind] = ref)}>
                  <div className="invoice">
                    <div className="invoice__header">
                      <div className="invoice__header__heading">
                        <p>Verka - Punjab Milk Producers Federation & Cooperative Society</p>
                      </div>
                      <div className="invoice__header__address">
                        <p>Mirpur Kalan-Bhagwanpur Hinhna Rd</p>
                        <p>FACTORY - AMRITSAR, VERKA, PUNJAB</p>
                      </div>
                      <div className="invoice__header__telephone">
                        <p>
                          Tel.No. 06243-259113, E-mail :
                          customercare@verka.coop
                        </p>
                      </div>
                      <div className="invoice__header__tollfree">
                        <p>Toll Free No : 18003456172 , Fax. 06248-259181</p>
                      </div>
                    </div>
                    <div className="invoice__date">
                      <div className="invoice__date__leftside">
                        <div className="invoice__date__leftside__milk">
                          <p style={{ fontWeight: 550 }}>Milk Bill</p>
                          <p>
                            Col.Date From&nbsp;&nbsp;{startDt}
                            &nbsp;&nbsp;&nbsp;&nbsp;To&nbsp;&nbsp;{endDt}
                          </p>
                        </div>

                        <div className="invoice__date__leftside__agent">
                          <p>Agent Code & Name :&nbsp;&nbsp;</p>
                          <p style={{ fontWeight: 550 }}>
                            {val?.organization?.id}
                            &nbsp;&nbsp;&nbsp;&nbsp; {val.organization?.name}
                          </p>
                        </div>
                      </div>
                      <div className="invoice__date__rightside">
                        <div className="invoice__date__rightside__print">
                          <p>
                            Print Date :{" "}
                            {moment(new Date()).format("YYYY/MM/DD")}
                          </p>
                          <p>Page No : {ind + 1}</p>
                        </div>
                        <div className="invoice__date__rightside__route">
                          <p>Route : {val?.organization?.routeId} </p>
                          <p style={{ fontWeight: 550 }}>
                            {val?.organization?.routeName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="invoice__table">
                      <div className="invoice__table__content">
                        <div className="invoice__table__content__header">
                          <p>
                            Cow Fat Rate = 0, Cow SNF Rate = 0 , Buff Fat Rate =
                            0, Buff SNF Rate = 0
                          </p>
                        </div>

                        <div className="invoice__table__content__shift">
                          <div className="invoice__table__content__shift__leftside">
                            <p>MORNING</p>
                          </div>
                          <div className="invoice__table__content__shift__rightside">
                            <p>EVENING</p>
                          </div>
                        </div>
                        <div className="invoice__table__content__shiftheader">
                          <div className="invoice__table__content__shiftheader__leftside__header">
                            <p>Date</p>
                            <p>QTY</p>
                            <p>Fat%</p>
                            <p>Kg.Fat</p>
                            <p>SNF%</p>
                            <p>Kg.SNF</p>
                            <p>Value Rs.</p>
                          </div>
                          <div className="invoice__table__content__shiftheader__rightside__header">
                            {/* <p>Date</p> */}
                            <p>QTY</p>
                            <p>Fat%</p>
                            <p>Kg.Fat</p>
                            <p>SNF%</p>
                            <p>Kg.SNF</p>
                            <p>Value Rs.</p>
                          </div>
                        </div>
                        <div className="invoice__table__content__shiftcontent">
                          <div className="invoice__table__content__shiftcontent__buffalo">
                            {milkData.collectionDetails
                              ?.buffaloMilkCollectionDetails.length !== 0 && (
                              <p style={{ fontWeight: 550 }}>Buffalo Milk</p>
                            )}
                            {milkData.collectionDetails &&
                              milkData.collectionDetails?.buffaloMilkCollectionDetails?.map(
                                (buffMilkDetail, buffIndex) => {
                                  if (buffMilkDetail.morning) {
                                    if (
                                      buffMilkDetail?.morning.Fat <
                                        minFatLimit &&
                                      buffMilkDetail?.morning.Snf < minSnftLimit
                                    ) {
                                      currentMilkQty +=
                                        buffMilkDetail?.morning.Weight;
                                    }
                                    morningQtySum +=
                                      buffMilkDetail?.morning.Weight;
                                    morningKgFatSum +=
                                      buffMilkDetail?.morning.KGFat;
                                    morningKgSnfSum += parseFloat(
                                      buffMilkDetail?.morning.KGSnf
                                    );
                                    morningValueSum += parseFloat(
                                      buffMilkDetail?.morning.value
                                    );
                                    bufFMilkQuantity += parseFloat(
                                      buffMilkDetail?.morning.Weight
                                    );
                                    buffMilkValue += parseFloat(
                                      buffMilkDetail?.morning.value
                                    );
                                    totalAmount += parseFloat(
                                      buffMilkDetail?.morning.value.toFixed(2)
                                    );
                                  }
                                  if (buffMilkDetail.evening) {
                                    if (
                                      buffMilkDetail?.evening.Fat <
                                        minFatLimit &&
                                      buffMilkDetail?.evening.Snf < minSnftLimit
                                    ) {
                                      currentMilkQty +=
                                        buffMilkDetail?.evening.Weight;
                                    }
                                    eveningQtySum += parseFloat(
                                      buffMilkDetail?.evening?.Weight
                                    );
                                    eveningKgFatSum += parseFloat(
                                      buffMilkDetail?.evening?.KGFat
                                    );
                                    eveningKgSnfSum += parseFloat(
                                      buffMilkDetail?.evening.KGSnf
                                    );
                                    eveningValueSum += parseFloat(
                                      buffMilkDetail?.evening.value
                                    );
                                    bufFMilkQuantity += parseFloat(
                                      buffMilkDetail?.evening.Weight
                                    );
                                    buffMilkValue += parseFloat(
                                      buffMilkDetail?.evening.value
                                    );
                                    totalAmount += parseFloat(
                                      buffMilkDetail?.evening.value.toFixed(2)
                                    );
                                  }
                                  return (
                                    <div
                                      className="invoice__table__content__shiftcontent__buffalo__content"
                                      key={buffIndex}
                                    >
                                      <div
                                        className="invoice__table__content__shiftcontent__buffalo__content__leftside"
                                        key={buffIndex}
                                      >
                                        <p style={{ fontWeight: 550 }}>
                                          {buffMilkDetail?.date}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.morning?.Weight.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.morning?.Fat.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.morning?.KGFat.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.morning?.Snf.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.morning?.KGSnf.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.morning?.value > 0
                                            ? buffMilkDetail?.morning?.value.toFixed(
                                                2
                                              )
                                            : " " || " "}
                                        </p>
                                      </div>
                                      <div className="invoice__table__content__shiftcontent__buffalo__content__centerside"></div>
                                      <div
                                        className="invoice__table__content__shiftcontent__buffalo__content__rightside"
                                        key={buffIndex}
                                      >
                                        <p>
                                          {buffMilkDetail?.evening?.Weight.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.evening?.Fat.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.evening?.KGFat.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.evening?.Snf.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.evening?.KGSnf.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                        <p>
                                          {buffMilkDetail?.evening?.value > 0
                                            ? buffMilkDetail?.evening?.value.toFixed(
                                                2
                                              )
                                            : " " || " "}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                          <div className="invoice__table__content__shiftcontent__cow">
                            {milkData.collectionDetails
                              ?.cowMilkCollectionDetails.length !== 0 && (
                              <p style={{ fontWeight: 550 }}>Cow Milk</p>
                            )}
                            {milkData.collectionDetails &&
                              milkData.collectionDetails?.cowMilkCollectionDetails?.map(
                                (cowMilkDetail, buffIndex) => {
                                  if (cowMilkDetail.morning) {
                                    if (
                                      cowMilkDetail.morning.Fat < minFatLimit &&
                                      cowMilkDetail.morning.Snf < minSnftLimit
                                    ) {
                                      currentMilkQty +=
                                        cowMilkDetail.morning.Weight;
                                    }
                                    morningQtySum +=
                                      cowMilkDetail.morning.Weight;
                                    morningKgFatSum +=
                                      cowMilkDetail.morning.KGFat;
                                    morningKgSnfSum += parseFloat(
                                      cowMilkDetail.morning.KGSnf
                                    );
                                    morningValueSum += parseFloat(
                                      cowMilkDetail.morning.value
                                    );
                                    cowMilkquantity += parseFloat(
                                      cowMilkDetail.morning.Weight
                                    );
                                    cowMilkValue += parseFloat(
                                      cowMilkDetail.morning.value
                                    );
                                    totalAmount += parseFloat(
                                      cowMilkDetail.morning.value.toFixed(2)
                                    );
                                  }
                                  if (cowMilkDetail.evening) {
                                    if (
                                      cowMilkDetail.evening.Fat < minFatLimit &&
                                      cowMilkDetail.evening.Snf < minSnftLimit
                                    ) {
                                      currentMilkQty +=
                                        cowMilkDetail.evening.Weight;
                                    }
                                    eveningQtySum += parseFloat(
                                      cowMilkDetail?.evening?.Weight
                                    );
                                    eveningKgFatSum += parseFloat(
                                      cowMilkDetail?.evening?.KGFat
                                    );
                                    eveningKgSnfSum += parseFloat(
                                      cowMilkDetail?.evening.KGSnf
                                    );
                                    eveningValueSum += parseFloat(
                                      cowMilkDetail?.evening.value
                                    );
                                    cowMilkquantity += parseFloat(
                                      cowMilkDetail?.evening.Weight
                                    );
                                    cowMilkValue += parseFloat(
                                      cowMilkDetail?.evening.value
                                    );
                                    totalAmount += parseFloat(
                                      cowMilkDetail?.evening.value.toFixed(2)
                                    );
                                  }
                                  return (
                                    <div
                                      className="invoice__table__content__shiftcontent__buffalo__content"
                                      key={buffIndex}
                                    >
                                      <div
                                        className="invoice__table__content__shiftcontent__buffalo__content__leftside"
                                        key={buffIndex}
                                      >
                                        {
                                          <p style={{ fontWeight: 550 }}>
                                            {cowMilkDetail?.date}
                                          </p>
                                        }
                                        <p>
                                          {cowMilkDetail?.morning?.Weight?.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.morning?.Fat?.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.morning?.KGFat?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.morning?.Snf?.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.morning?.KGSnf?.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.morning?.value > 0
                                            ? cowMilkDetail?.morning?.value?.toFixed(
                                                2
                                              )
                                            : " " || " "}
                                        </p>
                                      </div>
                                      <div className="invoice__table__content__shiftcontent__buffalo__content__centerside"></div>
                                      <div
                                        className="invoice__table__content__shiftcontent__buffalo__content__rightside"
                                        key={buffIndex}
                                      >
                                        <p>
                                          {cowMilkDetail?.evening?.Weight.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.evening?.Fat.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.evening?.KGFat.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.evening?.Snf.toFixed(
                                            1
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.evening?.KGSnf.toFixed(
                                            2
                                          ) || " "}
                                        </p>
                                        <p>
                                          {cowMilkDetail?.evening?.value > 0
                                            ? cowMilkDetail?.evening?.value.toFixed(
                                                2
                                              )
                                            : " " || " "}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </div>
                        <div className="invoice__table__content__footer">
                          <div className="invoice__table__content__footer__content">
                            <div className="invoice__table__content__footer__content__leftside">
                              <p style={{ marginRight: 15 }}>Total</p>
                              <p>{morningQtySum.toFixed(1)}</p>
                              <p></p>
                              <p>{morningKgFatSum.toFixed(2)}</p>
                              <p></p>
                              <p>{morningKgSnfSum.toFixed(2)}</p>
                              <p>{morningValueSum.toFixed(2)}</p>
                            </div>
                            <div className="invoice__table__content__footer__content__rightside">
                              <p>{eveningQtySum.toFixed(2)}</p>
                              <p></p>
                              <p>{eveningKgFatSum.toFixed(2)}</p>
                              <p></p>
                              <p>{eveningKgSnfSum.toFixed(2)}</p>
                              <p>{eveningValueSum.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="invoice__footer">
                      <div className="invoice__footer__container">
                        <div className="invoice__footer__container__leftside">
                          <div className="invoice__footer__container__leftside__table">
                            <div className="invoice__footer__container__leftside__table__header">
                              <p></p>
                              <p>G Qty</p>
                              <p>S Qty</p>
                              <p>AI Qty</p>
                              <p>TOT.Qty</p>
                              <p>Milk Value</p>
                            </div>
                            <div>
                              <div className="invoice__footer__container__leftside__table__content">
                                <p>Cow</p>
                                <p>{cowMilkquantity}</p>
                                <p></p>
                                <p></p>
                                <p>{cowMilkquantity.toFixed(1)}</p>
                                <p>{cowMilkValue.toFixed(2)}</p>
                              </div>
                              <div className="invoice__footer__container__leftside__table__content">
                                <p>Buff</p>
                                <p>{bufFMilkQuantity}</p>
                                <p></p>
                                <p></p>
                                <p>{bufFMilkQuantity.toFixed(1)}</p>
                                <p>{buffMilkValue.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="invoice__footer__container__leftside__table__content">
                            <p>All</p>
                            <p>{cowMilkquantity + bufFMilkQuantity}</p>
                            <p></p>
                            <p></p>
                            <p>
                              {(cowMilkquantity + bufFMilkQuantity).toFixed(1)}
                            </p>
                            <p>{(cowMilkValue + buffMilkValue).toFixed(2)}</p>
                          </div>
                          <div className="invoice__footer__container__leftside__tabledesc">
                            <div className="invoice__footer__container__leftside__tabledesc__header">
                              <p>ED Desc</p>
                              <p>Qty</p>
                              <p>Rate</p>
                              <p>Cr.Amount</p>
                              <p>Dr.Amount</p>
                            </div>
                            <div>
                              <div className="invoice__footer__container__leftside__tabledesc__content">
                                <p>Head Load</p>
                                <p>
                                  {(
                                    ((morningKgFatSum +
                                      eveningKgFatSum +
                                      morningKgSnfSum +
                                      eveningKgSnfSum) /
                                      12) *
                                    100
                                  ).toFixed(2)}
                                </p>
                                <p>{val.organization.headload}</p>
                                <p>
                                  {parseInt(
                                    ((morningKgFatSum +
                                      eveningKgFatSum +
                                      morningKgSnfSum +
                                      eveningKgSnfSum) /
                                      12) *
                                      100 *
                                      val.organization.headload
                                  ).toFixed(2)}
                                </p>
                                <p></p>
                              </div>
                              <div className="invoice__footer__container__leftside__tabledesc__content">
                                <p>Handling charge</p>
                                <p>
                                  {(
                                    ((morningKgFatSum +
                                      eveningKgFatSum +
                                      morningKgSnfSum +
                                      eveningKgSnfSum) /
                                      12) *
                                    100
                                  ).toFixed(2)}
                                </p>
                                <p>{val.organization.commision}</p>
                                <p>
                                  {parseInt(
                                    ((morningKgFatSum +
                                      eveningKgFatSum +
                                      morningKgSnfSum +
                                      eveningKgSnfSum) /
                                      12) *
                                      100 *
                                      val.organization.commision
                                  )}
                                </p>
                                <p></p>
                              </div>
                              <div className="invoice__footer__container__leftside__tabledesc__content">
                                {val.organization.balanceSum > 0 && (
                                  <p>Krishi Bazar</p>
                                )}
                                <p></p>
                                <p></p>
                                <p></p>
                                {val.organization.balanceSum > 0 && (
                                  <p>
                                    {val.organization.balanceSum.toFixed(2)}
                                  </p>
                                )}
                              </div>
                              <div className="invoice__footer__container__leftside__tabledesc__content">
                                {adjustmentAmount > 0 && <p>Lean Deduction</p>}
                                <p></p>
                                <p></p>
                                <p></p>
                                {adjustmentAmount > 0 && (
                                  <p>{adjustmentAmount.toFixed(2)}</p>
                                )}
                              </div>
                              {val.settlementAmount !== 0 && (
                                <div className="invoice__footer__container__leftside__tabledesc__content">
                                  <p>Prev Settlement</p>
                                  <p></p>
                                  <p></p>
                                  {prevSettlementCr ? (
                                    <p>{prevSettlementCr.toFixed(0)}</p>
                                  ) : (
                                    <p></p>
                                  )}
                                  {prevSettlementDr < 0 ? (
                                    <p>
                                      {Math.abs(prevSettlementDr).toFixed(0)}
                                    </p>
                                  ) : (
                                    <p></p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="invoice__footer__container__leftside__tabledesc__content1">
                            <p>Total : </p>
                            <p></p>
                            <p></p>
                            <p>
                              {parseInt(
                                ((morningKgFatSum +
                                  eveningKgFatSum +
                                  morningKgSnfSum +
                                  eveningKgSnfSum) /
                                  12) *
                                  100 *
                                  val.organization.headload
                              ) +
                                parseInt(
                                  ((morningKgFatSum +
                                    eveningKgFatSum +
                                    morningKgSnfSum +
                                    eveningKgSnfSum) /
                                    12) *
                                    100 *
                                    val.organization.commision
                                )}{" "}
                            </p>
                            <p>
                              {(
                                val.organization.balanceSum + adjustmentAmount
                              ).toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <div className="invoice__footer__container__rightside">
                          <div className="invoice__footer__container__rightside__table">
                            <div className="invoice__footer__container__rightside__table__dataone">
                              <div className="invoice__footer__container__rightside__table__dataone__top">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Total Milk Value Rs. : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>{totalAmount.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="invoice__footer__container__rightside__table__dataone__bottom">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Total Earning Amount Rs. : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>
                                    {parseInt(
                                      ((morningKgFatSum +
                                        eveningKgFatSum +
                                        morningKgSnfSum +
                                        eveningKgSnfSum) /
                                        12) *
                                        100 *
                                        val.organization.headload
                                    ) +
                                      parseInt(
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.commision
                                      )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="invoice__footer__container__rightside__table__dataone">
                              <div className="invoice__footer__container__rightside__table__dataone__top">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Gross Total Amount Rs. : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>
                                    {(
                                      parseInt(
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.headload
                                      ) +
                                      parseInt(
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.commision
                                      ) +
                                      totalAmount
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="invoice__footer__container__rightside__table__dataone__bottom">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Total Deducation Amt Rs:</p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>
                                    {(
                                      val.organization.balanceSum +
                                      Math.abs(prevSettlementDr) +
                                      adjustmentAmount
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="invoice__footer__container__rightside__table__dataone">
                              <div className="invoice__footer__container__rightside__table__dataone__top">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Net Total Amount Rs. : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>
                                    {(
                                      parseInt(
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.headload
                                      ) +
                                      parseInt(
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.commision
                                      ) +
                                      totalAmount +
                                      prevSettlementCr +
                                      prevSettlementDr -
                                      (val.organization.balanceSum +
                                        adjustmentAmount)
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="invoice__footer__container__rightside__table__dataone__bottom">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Rounded Amount : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>
                                    {(
                                      Math.floor(
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.headload +
                                          ((morningKgFatSum +
                                            eveningKgFatSum +
                                            morningKgSnfSum +
                                            eveningKgSnfSum) /
                                            12) *
                                            100 *
                                            val.organization.commision +
                                          totalAmount -
                                          (val.organization.balanceSum +
                                            adjustmentAmount +
                                            prevSettlementCr +
                                            prevSettlementDr)
                                      ) -
                                      (
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.headload +
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.commision +
                                        totalAmount -
                                        (val.organization.balanceSum +
                                          adjustmentAmount +
                                          prevSettlementCr +
                                          prevSettlementDr)
                                      ).toFixed(2)
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="invoice__footer__container__rightside__table__dataone__top">
                              <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                <p>Net Payable Amount Rs. : </p>
                              </div>
                              <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                <p style={{ fontWeight: 550 }}>
                                  {" "}
                                  {Math.round(
                                    parseInt(
                                      ((morningKgFatSum +
                                        eveningKgFatSum +
                                        morningKgSnfSum +
                                        eveningKgSnfSum) /
                                        12) *
                                        100 *
                                        val.organization.headload +
                                        parseInt(
                                          ((morningKgFatSum +
                                            eveningKgFatSum +
                                            morningKgSnfSum +
                                            eveningKgSnfSum) /
                                            12) *
                                            100 *
                                            val.organization.commision
                                        )
                                    ) +
                                      totalAmount +
                                      prevSettlementCr +
                                      prevSettlementDr -
                                      (val.organization.balanceSum +
                                        adjustmentAmount)
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="invoice__footer__container__rightside__table__dataone__bottom">
                              <p>
                                <p style={{ fontWeight: 550 }}>
                                  {convertAmountToWords(
                                    Math.floor(
                                      ((morningKgFatSum +
                                        eveningKgFatSum +
                                        morningKgSnfSum +
                                        eveningKgSnfSum) /
                                        12) *
                                        100 *
                                        val.organization.headload +
                                        ((morningKgFatSum +
                                          eveningKgFatSum +
                                          morningKgSnfSum +
                                          eveningKgSnfSum) /
                                          12) *
                                          100 *
                                          val.organization.commision +
                                        totalAmount +
                                        prevSettlementCr +
                                        prevSettlementDr -
                                        (val.organization.balanceSum +
                                          adjustmentAmount)
                                    ).toFixed(2)
                                  )}{" "}
                                  And Zero Paise Only
                                </p>
                              </p>
                            </div>
                          </div>
                          <div className="invoice__footer__container__rightside__tabledesc"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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

export default RouteInvoiceBilling;
