// import { useEffect, useRef, useCallback } from "react";
// import { ReactTabulator } from "react-tabulator";
// import "react-tabulator/lib/styles.css";
// import "react-tabulator/lib/css/tabulator_simple.min.css";
// import PropTypes from "prop-types";
// import { Button } from "react-bootstrap";
// import { SiMicrosoftexcel } from "react-icons/si";
// import { FaFileCsv } from "react-icons/fa";
// import { IoMdPrint } from "react-icons/io";
// import "./DataTable.css";

// const DataTable = ({
//   columns,
//   dataUrl,
//   jsondata,
//   options,
//   printHeader,
//   printFooter,
//   height = 500, // Default height set to 400px
//   printable = true,
// }) => {
//   const tableRef = useRef(null);

//   const ajaxRequestFunc = useCallback(
//     async (url, config, params) => {
//       return fetch(url, {
//         ...config,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           ...jsondata,
//           page: params.page,
//           size: params.size,
//           sort: params.sort,
//           filters: params.filter,
//         }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.status !== "OK") {
//             throw new Error(data.message);
//           }
//           return {
//             data: data.data,
//             last_page: Math.ceil(data.total / data.size),
//             total: data.total,
//           };
//         });
//     },
//     [jsondata]
//   );

//   const calculateFooterValue = (columnField) => {
//     const tableData = tableRef.current.getData("active");
//     if (!tableData || !tableData.length) return 0;
//     return tableData.reduce(
//       (sum, item) => sum + (parseFloat(item[columnField]) || 0),
//       0
//     );
//   };

//   const formattedColumns = columns.map((col) => {
//     const formattedCol = {
//       ...col,
//       formatter: (cell) => {
//         const value = cell.getValue();
//         if (isNumeric(value)) {
//           cell.getElement().classList.add("numeric-align");

//           const numValue = parseFloat(value);
//           const hasDecimal = value.includes(".");

//           if (hasDecimal) {
//             return numValue.toLocaleString(undefined, {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             });
//           } else {
//             return numValue;
//           }
//         } else {
//           cell.getElement().classList.remove("numeric-align");
//         }
//         return value;
//       },
//     };

//     if (col.footerValue) {
//       formattedCol.bottomCalc = () =>
//         calculateFooterValue(col.field).toLocaleString(undefined, {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         });
//       formattedCol.bottomCalcFormatter = "money";
//       formattedCol.bottomCalcFormatterParams = { precision: 2 };
//       formattedCol.bottomCalcFormatter = (cell) => {
//         cell.getElement().style.textAlign = "right";
//         return cell.getValue() || "0.00";
//       };
//     } else {
//       formattedCol.bottomCalc = () => "";
//     }
//     return formattedCol;
//   });

//   const defaultOptions = {
//     layout: "fitColumns",
//     responsiveLayout: "hide",
//     tooltips: true,
//     addRowPos: "top",
//     history: true,
//     movableColumns: true,
//     resizableRows: true,
//     sortMode: "remote",
//     filterMode: "remote",
//     columnHeaderSortMulti: true,
//     pagination: true,
//     paginationMode: "remote",
//     paginationInitialPage: 1,
//     paginationSize: 10,
//     paginationButtonCount: 3,
//     ajaxRequestFunc: ajaxRequestFunc,
//     ajaxURL: dataUrl,
//     ajaxConfig: "POST",
//     ajaxContentType: "json",
//     printAsHtml: true,
//     printHeader: `<h5 style="color:blue;text-align:center;margin-bottom:10px;">${printHeader}</h5>`,
//     printFooter: `<h6 style="text-align:center;margin-top:10px;">${printFooter}</h6>`,
//     headerSortElement: '<i class="fa fa-solid fa-caret-up"></i>',
//     maxHeight: `${height}px`,
//     ...options,
//   };

//   const handlePrint = () => {
//     tableRef.current.print(false, true);
//   };

//   const handleCSV = () => {
//     tableRef.current.download("csv", `${printFooter}.csv`);
//   };

//   const handleExcel = () => {
//     tableRef.current.download("xlsx", `${printFooter}data.xlsx`, {
//       documentProcessing: function (workbook) {
//         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//         console.log("🚀 ~ handleExcel ~ worksheet:", worksheet);

//         // Get the current range
//         const range = XLSX.utils.decode_range(worksheet["!ref"]);
//         console.log("🚀 ~ handleExcel ~ XLSX:", XLSX);

//         // Shift all cells down by one row
//         for (let R = range.e.r; R >= range.s.r; --R) {
//           for (let C = range.s.c; C <= range.e.c; ++C) {
//             const oldAddress = XLSX.utils.encode_cell({ r: R, c: C });
//             const newAddress = XLSX.utils.encode_cell({ r: R + 1, c: C });
//             if (worksheet[oldAddress]) {
//               worksheet[newAddress] = worksheet[oldAddress];
//               if (R === range.s.r) delete worksheet[oldAddress];
//             }
//           }
//         }

//         // Add custom text to the first row
//         const customText = "Custom Header";
//         worksheet["A1"] = {
//           v: customText,
//           t: "s",
//           s: {
//             font: {
//               name: "Arial",
//               sz: 40,
//               italic: true,
//               bold: true,
//               color: { rgb: "FF0000" },
//             },
//             fill: {
//               fgColor: {
//                 rgb: "FF0000",
//               },
//             },
//             alignment: { horizontal: "center", vertical: "center" },
//           },
//         };

//         // Merge cells for the custom header
//         worksheet["!merges"] = worksheet["!merges"] || [];
//         worksheet["!merges"].push({
//           s: { r: 0, c: 0 },
//           e: { r: 0, c: range.e.c },
//         });

//         // Adjust column widths
//         worksheet["!cols"] = formattedColumns.map(() => ({ wpx: 100 }));

//         // Style the header row (now in row 2)
//         for (let C = range.s.c; C <= range.e.c; ++C) {
//           const address = XLSX.utils.encode_cell({ r: 1, c: C });
//           if (worksheet[address]) {
//             worksheet[address].s = {
//               fill: { fgColor: { rgb: "0000FF" } },
//               font: {
//                 name: "Arial",
//                 color: { rgb: "FFFFFF" },
//                 bold: true,
//               },
//               alignment: { horizontal: "center", vertical: "center" },
//             };
//           }
//         }

//         // Adjust the worksheet range to include the new row
//         worksheet["!ref"] = XLSX.utils.encode_range({
//           s: { r: 0, c: 0 },
//           e: { r: range.e.r + 1, c: range.e.c },
//         });

//         return workbook;
//       },
//     });
//   };
//   useEffect(() => {
//     if (tableRef.current) {
//       tableRef.current.setData();
//     }
//   }, [jsondata]);

//   function isNumeric(value) {
//     return !isNaN(parseFloat(value)) && isFinite(value);
//   }

//   return (
//     <div className="px-3">
//       {printable && (
//         <div className="mb-3">
//           <Button
//             className="me-1"
//             onClick={handlePrint}
//             style={{ backgroundColor: "#58585a", border: "none" }}
//           >
//             <IoMdPrint size={20} color="#FFFFFF" />
//           </Button>
//           <Button
//             variant="success"
//             className="mx-1"
//             onClick={handleCSV}
//             style={{ backgroundColor: "#58585a", border: "none" }}
//           >
//             <FaFileCsv size={20} color="#FFFFFF" />
//           </Button>
//           <Button
//             variant="info"
//             className="mx-1"
//             onClick={handleExcel}
//             style={{ backgroundColor: "#58585a", border: "none" }}
//           >
//             <SiMicrosoftexcel size={20} color="#FFFFFF" />
//           </Button>
//         </div>
//       )}
//       <ReactTabulator
//         key={JSON.stringify(columns)}
//         onRef={(ref) => (tableRef.current = ref.current)}
//         columns={formattedColumns}
//         options={defaultOptions}
//         className="data-table"
//       />
//     </div>
//   );
// };

// DataTable.propTypes = {
//   columns: PropTypes.arrayOf(
//     PropTypes.shape({
//       title: PropTypes.string.isRequired,
//       field: PropTypes.string.isRequired,
//       footerValue: PropTypes.bool,
//     })
//   ).isRequired,
//   dataUrl: PropTypes.string.isRequired,
//   jsondata: PropTypes.array.isRequired,
//   options: PropTypes.object,
//   printHeader: PropTypes.string,
//   printFooter: PropTypes.string,
//   height: PropTypes.number,
//   printable: PropTypes.bool,
// };

// export default DataTable;
