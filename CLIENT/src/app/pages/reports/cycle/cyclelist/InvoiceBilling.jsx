import React, { useEffect, useState } from "react";
import "./InvoiceBilling.scss";
import { GetBill } from "../../../../utils/apiCalls";
import html2pdf from "html2pdf.js";
import Download from "../../../../../assets/images/icons/download.png";
import { IconButton, Paper } from "@mui/material";
import images from "../../../../../assets/images/log_out.png";
import { Navigate, useNavigate } from "react-router-dom";

const InvoiceBilling = () => {
  const token = localStorage.getItem("token");
  const [billDeatils, setBillDeatils] = useState([]);
  const navigate = useNavigate();

  const handleCycle = () => {
    navigate("/cycle-list");
  };

  let startDate = localStorage.getItem("startDateCycle");
  let endDate = localStorage.getItem("endDateCycle");
  const todaysDate = new Date().toISOString().split("T")[0];

  const generatePDF = () => {
    const content = document.querySelector(".invoice");
    const opt = {
      margin: 10,
      filename: "invoice_bill.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(content).set(opt).save();
  };

  useEffect(() => {
    getBill();
  }, []);

  const getBill = () => {
    const payload = {
      startDate: localStorage.getItem("startDateCycle"),
      endDate: localStorage.getItem("endDateCycle"),
    };
    GetBill((res) => {
      // const cowData = res.data.filter(() =>)
      // console.log(res.data);
      setBillDeatils(res.data);
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
    billDeatils &&
      billDeatils?.map((val) => {
        val?.collectionDetails.map((val) => {
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
    billDeatils &&
    billDeatils.map((bill) => {
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

  const groupedData = [];
  const groupedDataBuffalo = [];
  const groupedDataCow = [];

  billDeatils &&
    billDeatils?.forEach((val) => {
      val.collectionDetails?.forEach((entry) => {
        const date = new Date(entry.CollectedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        let currentGroupedData = null;
        if (entry.MilkType === "cow") {
          currentGroupedData = groupedDataCow;
        } else if (entry.MilkType === "buffalo") {
          currentGroupedData = groupedDataBuffalo;
        }

        let groupEntry = currentGroupedData.find(
          (group) => group.date === date
        );
        if (!groupEntry) {
          groupEntry = {
            date: date,
            morning: null,
            evening: null,
          };
          currentGroupedData.push(groupEntry);
        }

        if (entry.shift === "morning") {
          groupEntry.morning = entry;
        } else if (entry.shift === "evening") {
          groupEntry.evening = entry;
        }

        if (!groupedData.find((group) => group.date === date)) {
          groupedData.push({
            date: date,
            morning: entry.shift === "morning" ? entry : null,
            evening: entry.shift === "evening" ? entry : null,
          });
        }
      });
    });

  let headload =
    summedData &&
    summedData?.map((val) => val?.morningSum.weight + val?.eveningSum.weight);

  let commission =
    summedData &&
    summedData?.map((val) => val?.morningSum.weight + val?.eveningSum.weight);

  let totalHeadLoad =
    summedData &&
    summedData?.map(
      (val) =>
        (val?.morningSum.weight + val?.eveningSum.weight) *
        val?.organization?.headload
    );

  let totalHandlingCharge =
    summedData &&
    summedData?.map(
      (val) =>
        (val?.morningSum.weight + val?.eveningSum.weight) *
        val.organization.commision
    );

  let totalMilkMoney =
    summedData &&
    summedData?.map((val) => val?.morningSum.value + val?.eveningSum.value);

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
          {billDeatils ? (
            <img
              onClick={generatePDF}
              src={Download}
              alt="Pdf Download"
              className="download"
            />
          ) : (
            ""
          )}

          {billDeatils ? (
            billDeatils?.map((val, ind) => {
              return (
                <div>
                  <div className="invoice">
                    <div className="invoice__header">
                      <div className="invoice__header__heading">
                        <p>{val?.organization?.name}</p>
                      </div>
                      <div className="invoice__header__address">
                        <p>Mirpur Kalan-Bhagwanpur Hinhna Rd</p>
                        <p>FACTORY - AMRITSAR, VERKA, PUNJAB</p>
                      </div>
                      <div className="invoice__header__telephone">
                        <p>
                          Tel.No. 06243-259113, E-mail : gangadairybgd@gmail.com
                         
                        </p>
                      </div>
                      <div className="invoice__header__tollfree">
                        <p>Toll Free No : 18003456172 , Fax. 06248-259181</p>
                      </div>
                    </div>
                    <div className="invoice__date">
                      <div className="invoice__date__leftside">
                        <div className="invoice__date__leftside__milk">
                          <p>Milk Bill</p>
                          <p>
                            Col.Date From&nbsp;&nbsp;{startDate}
                            &nbsp;&nbsp;&nbsp;&nbsp;To&nbsp;&nbsp;{endDate}
                          </p>
                        </div>

                        <div className="invoice__date__leftside__agent">
                          <p>
                            Agent Code & Name :&nbsp;&nbsp;
                            {
                              billDeatils[0]?.collectionDetails[0]
                                ?.organizationId
                            }
                            &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                            {
                              billDeatils[0]?.collectionDetails[0]
                                ?.organizationName
                            }
                          </p>
                        </div>
                      </div>
                      <div className="invoice__date__rightside">
                        <div className="invoice__date__rightside__print">
                          <p>Print Date : {todaysDate}</p>
                          {/* <p>Page No : 1</p> */}
                        </div>
                        <div className="invoice__date__rightside__route">
                          <p>
                            Route : {val?.organization?.routeId}{" "}
                            {val?.organization?.routeName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="invoice__table">
                      <div className="invoice__table__content">
                        <div className="invoice__table__content__header">
                          <p>
                            Cow Fat Rate=0, Cow SNF Rate=0 , Buff Fat Rate=0,
                            Buff SNF Rate=0
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
                            <p>Kg.Fat SNF</p>
                            <p>Value Rs.</p>
                          </div>
                          <div className="invoice__table__content__shiftheader__rightside__header">
                            <p>QTY</p>
                            <p>Fat%</p>
                            <p>Kg.Fat</p>
                            <p>SNF%</p>
                            <p>Kg.Fat SNF</p>
                            <p>Value Rs.</p>
                          </div>
                        </div>
                        <div className="invoice__table__content__shiftcontent">
                          <div className="invoice__table__content__shiftcontent__cow">
                            <p>Cow Milk</p>{" "}
                            {groupedDataCow &&
                              groupedDataCow?.map((val, ind) => {
                                return (
                                  <div
                                    className="invoice__table__content__shiftcontent__cow__content"
                                    key={ind}
                                  >
                                    <div className="invoice__table__content__shiftcontent__cow__content__leftside">
                                      <p>
                                        {new Date(val?.morning?.CollectedAt)
                                          .toLocaleDateString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                          })
                                          .replace(/\//g, "-")}
                                      </p>
                                      <p>{val?.morning?.Weight || "--"}</p>
                                      <p>{val?.morning?.Fat || "--"}</p>
                                      <p>{val?.morning?.KGFat || "--"}</p>
                                      <p>{val?.morning?.Snf || "--"}</p>
                                      <p>{val?.morning?.KGSnf || "--"}</p>
                                      <p>
                                        {val?.morning?.value.toFixed(2) || "--"}
                                      </p>
                                    </div>
                                    <div className="invoice__table__content__shiftcontent__cow__content__centerside"></div>
                                    <div className="invoice__table__content__shiftcontent__cow__content__rightside">
                                      <p>{val?.evening?.Weight || "--"}</p>
                                      <p>{val?.evening?.Fat || "--"}</p>
                                      <p>{val?.evening?.KGFat || "--"}</p>
                                      <p>{val?.evening?.Snf || "--"}</p>
                                      <p>{val?.evening?.KGSnf || "--"}</p>
                                      <p>
                                        {val?.evening?.value.toFixed(2) || "--"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div className="invoice__table__content__shiftcontent__buffalo">
                            <p>Buffalo Milk</p>
                            {groupedDataBuffalo &&
                              groupedDataBuffalo?.map((val, ind) => {
                                return (
                                  <div
                                    className="invoice__table__content__shiftcontent__buffalo__content"
                                    key={ind}
                                  >
                                    <div className="invoice__table__content__shiftcontent__buffalo__content__leftside">
                                      <p>
                                        {new Date(val?.morning?.CollectedAt)
                                          .toLocaleDateString("en-US", {
                                            month: "2-digit",
                                            day: "2-digit",
                                          })
                                          .replace(/\//g, "-")}
                                      </p>
                                      <p>{val?.morning?.Weight || "--"}</p>
                                      <p>{val?.morning?.Fat || "--"}</p>
                                      <p>{val?.morning?.Fat || "--"}</p>
                                      <p>{val?.morning?.Snf || "--"}</p>
                                      <p>{val?.morning?.Snf || "--"}</p>
                                      <p>
                                        {val?.morning?.value.toFixed(2) || "--"}
                                      </p>
                                    </div>
                                    <div className="invoice__table__content__shiftcontent__buffalo__content__centerside"></div>
                                    <div className="invoice__table__content__shiftcontent__buffalo__content__rightside">
                                      <p>{val?.evening?.Weight || "--"}</p>
                                      <p>{val?.evening?.Fat || "--"}</p>
                                      <p>{val?.evening?.Fat || "--"}</p>
                                      <p>{val?.evening?.Snf || "--"}</p>
                                      <p>{val?.evening?.Snf || "--"}</p>
                                      <p>
                                        {val?.evening?.value.toFixed(2) || "--"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        <div className="invoice__table__content__footer">
                          <div className="invoice__table__content__footer__content">
                            <div className="invoice__table__content__footer__content__leftside">
                              <p>Total</p>
                              {summedData &&
                                summedData?.map((val, ind) => {
                                  return (
                                    <>
                                      <p>{val.morningSum.weight.toFixed(2)}</p>
                                      <p>{val.morningSum.fat.toFixed(2)}</p>
                                      <p>{val.morningSum.fat.toFixed(2)}</p>
                                      <p>{val.morningSum.snf.toFixed(2)}</p>
                                      <p>{val.morningSum.snf.toFixed(2)}</p>
                                      <p>{val.morningSum.value.toFixed(2)}</p>
                                    </>
                                  );
                                })}
                            </div>
                            <div className="invoice__table__content__footer__content__rightside">
                              {summedData &&
                                summedData?.map((val, ind) => {
                                  return (
                                    <>
                                      <p>{val.eveningSum.weight.toFixed(2)}</p>
                                      <p>{val.eveningSum.fat.toFixed(2)}</p>
                                      <p>{val.eveningSum.fat.toFixed(2)}</p>
                                      <p>{val.eveningSum.snf.toFixed(2)}</p>
                                      <p>{val.eveningSum.snf.toFixed(2)}</p>
                                      <p>{val.eveningSum.value.toFixed(2)}</p>
                                    </>
                                  );
                                })}
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
                                {summedData &&
                                  summedData?.map((val, ind) => {
                                    return (
                                      <>
                                        <p>Cow</p>
                                        <p>
                                          {val.morningSum.weight.toFixed(2)}
                                        </p>
                                        <p></p>
                                        <p></p>
                                        <p>
                                          {val.morningSum.weight.toFixed(2)}
                                        </p>
                                        <p>{val.morningSum.value.toFixed(2)}</p>
                                      </>
                                    );
                                  })}
                              </div>
                              <div className="invoice__footer__container__leftside__table__content">
                                {summedData &&
                                  summedData?.map((val, ind) => {
                                    return (
                                      <>
                                        <p>Buff</p>
                                        <p>
                                          {val.eveningSum.weight.toFixed(2)}
                                        </p>
                                        <p></p>
                                        <p></p>
                                        <p>
                                          {val.eveningSum.weight.toFixed(2)}
                                        </p>
                                        <p>{val.eveningSum.value.toFixed(2)}</p>
                                      </>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                          <div className="invoice__footer__container__leftside__table__content">
                            <p>All</p>
                            <p>{headload}</p>
                            <p></p>
                            <p></p>
                            <p>{headload}</p>
                            <p>{totalMilkMoney}</p>
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
                                <p>{headload || "--"} </p>
                                <p>{val.organization.headload}</p>
                                <p>{totalHeadLoad}</p>
                                <p></p>
                              </div>
                              <div className="invoice__footer__container__leftside__tabledesc__content">
                                <p>Hadling charge</p>
                                <p>{commission || "--"}</p>
                                <p>{val.organization.commision}</p>
                                <p>{totalHandlingCharge}</p>
                                <p></p>
                              </div>
                            </div>
                          </div>
                          <div className="invoice__footer__container__leftside__tabledesc__content1">
                            <p>Total : </p>
                            <p></p>
                            <p></p>
                            <p>
                              {headload * val.organization.headload +
                                commission * val.organization.commision}
                            </p>
                            <p></p>
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
                                  <p>5885.05</p>
                                </div>
                              </div>
                              <div className="invoice__footer__container__rightside__table__dataone__bottom">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Total Earning Amt Rs. : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>
                                    {headload * val.organization.headload +
                                      commission * val.organization.commision}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="invoice__footer__container__rightside__table__dataone">
                              <div className="invoice__footer__container__rightside__table__dataone__top">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Gross Total Amt Rs. : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>6127.08</p>
                                </div>
                              </div>
                              <div className="invoice__footer__container__rightside__table__dataone__bottom">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Total Deducated Amt Rs:</p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p></p>
                                </div>
                              </div>
                            </div>
                            <div className="invoice__footer__container__rightside__table__dataone">
                              <div className="invoice__footer__container__rightside__table__dataone__top">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Net Total Amt Rs. : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>6127.08</p>
                                </div>
                              </div>
                              <div className="invoice__footer__container__rightside__table__dataone__bottom">
                                <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                  <p>Rounded Amt : </p>
                                </div>
                                <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                  <p>-0.08</p>
                                </div>
                              </div>
                            </div>
                            <div className="invoice__footer__container__rightside__table__dataone__top">
                              <div className="invoice__footer__container__rightside__table__dataone__top__left">
                                <p>Net Payable Amt Rs. : </p>
                              </div>
                              <div className="invoice__footer__container__rightside__table__dataone__top__right">
                                <p>6127.00</p>
                              </div>
                            </div>
                            <div className="invoice__footer__container__rightside__table__dataone__bottom">
                              <p>
                                <p>{amountInWords}</p>
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

export default InvoiceBilling;