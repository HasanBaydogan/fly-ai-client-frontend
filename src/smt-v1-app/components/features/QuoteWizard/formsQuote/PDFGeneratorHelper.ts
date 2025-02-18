import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { QuotePartRow, QuoteWizardSetting } from '../QuoteWizard';

export const generatePDF = (
  settings: QuoteWizardSetting,
  selectedDate: Date,
  quoteNumber: string,
  currency: string,
  quotePartRows: QuotePartRow[],
  subTotalValues,
  checkedStates,
  clientLocation: string,
  shipTo: string,
  requisitioner: string,
  shipVia: string,
  CPT: string,
  shippingTerms: string
): jsPDF | void => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;

    // Logo
    pdf.addImage(settings.logo, 'JPEG', 10, 10, 60, 30);

    pdf.setFontSize(10);

    // Address (split into rows)
    const maxWidth = 60;
    const row1Lines = pdf.splitTextToSize(settings.addressRow1, maxWidth);
    const row2Lines = pdf.splitTextToSize(settings.addressRow2, maxWidth);
    const row3Lines = pdf.splitTextToSize(settings.mobilePhone, maxWidth);
    let currentY = 45;
    row1Lines.forEach(line => {
      pdf.text(line, 10, currentY);
      currentY += 5;
    });
    row2Lines.forEach(line => {
      pdf.text(line, 10, currentY);
      currentY += 5;
    });
    row3Lines.forEach(line => {
      pdf.text(line, 10, currentY);
      currentY += 5;
    });

    // Quote header and details
    pdf.setFontSize(25);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 102, 204);
    pdf.text('QUOTE', pageWidth - 60, 20);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text(`Date: ${selectedDate?.toLocaleDateString()}`, pageWidth - 60, 30);
    pdf.text(`Quote Number: ${quoteNumber}`, pageWidth - 60, 35);

    // Client info table
    autoTable(pdf, {
      startY: 65,
      head: [['CLIENT LOCATION', 'SHIP TO']],
      body: [[clientLocation, shipTo]],
      theme: 'grid',
      headStyles: { fillColor: [51, 102, 204], textColor: 255 },
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 143 },
        1: { cellWidth: 53 }
      },
      margin: { left: 7 }
    });

    // Shipping details table
    autoTable(pdf, {
      startY: (pdf as any).lastAutoTable?.finalY + 5 || 70,
      head: [['REQUISITIONER', 'SHIP VIA', 'CPT', 'SHIPPING TERMS']],
      body: [[requisitioner, shipVia, CPT, shippingTerms]],
      theme: 'grid',
      headStyles: { fillColor: [51, 102, 204], textColor: 255 },
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 48.5 },
        1: { cellWidth: 48.5 },
        2: { cellWidth: 49.5 },
        3: { cellWidth: 49.5 }
      },
      margin: { left: 7 }
    });

    // Main product table
    const tableBody = quotePartRows.map(row => [
      row.partNumber,
      row.alternativeTo || '-',
      row.description,
      row.reqCondition,
      row.fndCondition,
      `${row.leadTime} Days`,
      row.quantity,
      row.unitPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: currency.replace(/[^A-Z]/g, '')
      }),
      (row.quantity * row.unitPrice).toLocaleString('en-US', {
        style: 'currency',
        currency: currency.replace(/[^A-Z]/g, '')
      })
    ]);
    autoTable(pdf, {
      startY: (pdf as any).lastAutoTable?.finalY + 5 || 70,
      head: [
        [
          'PART NUMBER',
          'ALTERNATIVE TO',
          'DESCRIPTION',
          'REQ CND',
          'FND CND',
          'LEAD TIME',
          'QTY',
          'UNIT PRICE',
          'TOTAL'
        ]
      ],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [51, 102, 204], textColor: 255 },
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: {
        0: { cellWidth: 29 },
        1: { cellWidth: 28 },
        2: { cellWidth: 35 },
        3: { cellWidth: 11 },
        4: { cellWidth: 11 },
        5: { cellWidth: 20 },
        6: { cellWidth: 12 },
        7: { cellWidth: 24 },
        8: { cellWidth: 26 }
      },
      margin: { left: 7 }
    });

    // Calculate totals
    const subTotal = quotePartRows.reduce(
      (acc, row) => acc + row.quantity * row.unitPrice,
      0
    );
    const total =
      quotePartRows.reduce(
        (acc, row) => acc + row.quantity * row.unitPrice,
        0
      ) +
      subTotalValues.reduce(
        (sum, val, index) => sum + (checkedStates[index] ? val : 0),
        0
      );

    // Use the Y position after the main product table
    const startYPosition = (pdf as any).lastAutoTable?.finalY + 5 || 70;

    // --- Revised Layout ---

    // 1. Sub-total section (occupies 40% of the page width, aligned to the right)
    const subTotalWidth = pageWidth * 0.4; // Sub-total table width (40% of the page)
    const leftMarginForSubTotal = pageWidth - subTotalWidth - 10; // 40% of page width
    autoTable(pdf, {
      startY: startYPosition,
      // Set the left margin so that the table occupies the right 40%
      margin: { left: leftMarginForSubTotal },
      body: [
        [
          'Sub-Total',
          'Include',
          {
            content: subTotal.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            }),
            styles: { fontStyle: 'bold' }
          }
        ],
        [
          settings.otherQuoteValues[0],
          checkedStates[0] ? 'Yes' : 'No',
          subTotalValues[0]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          settings.otherQuoteValues[1],
          checkedStates[1] ? 'Yes' : 'No',
          subTotalValues[1]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          settings.otherQuoteValues[2],
          checkedStates[2] ? 'Yes' : 'No',
          subTotalValues[2]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          settings.otherQuoteValues[3],
          checkedStates[3] ? 'Yes' : 'No',
          subTotalValues[3]?.toLocaleString('en-US', {
            style: 'currency',
            currency: currency.replace(/[^A-Z]/g, '')
          })
        ],
        [
          'Total',
          '',
          {
            content: total.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            }),
            styles: { fontStyle: 'bold' }
          }
        ]
      ],
      theme: 'grid',
      styles: { halign: 'center', valign: 'middle', fontSize: 9 },
      // Adjust the column widths to fill the sub-total area
      columnStyles: {
        0: { cellWidth: subTotalWidth * 0.51 },
        1: { cellWidth: subTotalWidth * 0.17 },
        2: { cellWidth: subTotalWidth * 0.35 }
      }
    });

    // 2. Comments section (full width, placed below the Sub-total block)
    autoTable(pdf, {
      startY: (pdf as any).lastAutoTable?.finalY + 5,
      margin: { left: 7 },
      body: [
        [
          {
            content: 'Comments or Special Instructions',
            styles: { halign: 'center', fontStyle: 'bold' }
          }
        ],
        [settings.commentsSpecialInstruction]
      ],
      theme: 'grid',
      styles: { halign: 'left', valign: 'middle' },
      // Make sure the table uses the full available width (pageWidth minus left/right margins)
      columnStyles: { 0: { cellWidth: pageWidth - 15 } }
    });

    // (Optional) Additional sections such as centered contact info can follow…
    const tableWidth = 195;
    const leftMargin = (pageWidth - tableWidth) / 2;
    autoTable(pdf, {
      startY: (pdf as any).lastAutoTable?.finalY + 5,
      body: [[settings.contactInfo + '\n' + settings.phone]],
      theme: 'grid',
      styles: { halign: 'center', valign: 'middle' },
      columnStyles: { 0: { cellWidth: tableWidth } },
      margin: { left: leftMargin }
    });
    // Save the PDF
    return pdf;
  } catch (error) {
    console.error('PDF oluşturma sırasında bir hata oluştu:', error);
  }
};

export const downloadPDF = (
  settings: QuoteWizardSetting,
  selectedDate: Date,
  quoteNumber: string,
  currency: string,
  quotePartRows: QuotePartRow[],
  subTotalValues,
  checkedStates,
  clientLocation: string,
  shipTo: string,
  requisitioner: string,
  shipVia: string,
  CPT: string,
  shippingTerms: string
) => {
  try {
    const pdf = generatePDF(
      settings,
      selectedDate,
      quoteNumber,
      currency,
      quotePartRows,
      subTotalValues,
      checkedStates,
      clientLocation,
      shipTo,
      requisitioner,
      shipVia,
      CPT,
      shippingTerms
    );
    if (pdf) {
      pdf.save('quote-' + quoteNumber + '.pdf');
    }
  } catch (e) {
    console.log(e);
  }
};

export const returnPdfAsBase64String = async (
  settings: QuoteWizardSetting,
  selectedDate: Date,
  quoteNumber: string,
  currency: string,
  quotePartRows: QuotePartRow[],
  subTotalValues,
  checkedStates,
  clientLocation: string,
  shipTo: string,
  requisitioner: string,
  shipVia: string,
  CPT: string,
  shippingTerms: string
): Promise<string | undefined> => {
  try {
    const pdf = generatePDF(
      settings,
      selectedDate,
      quoteNumber,
      currency,
      quotePartRows,
      subTotalValues,
      checkedStates,
      clientLocation,
      shipTo,
      requisitioner,
      shipVia,
      CPT,
      shippingTerms
    );
    if (pdf) {
      const pdfBlob = pdf.output('blob');
      const base64String = await convertBlobToBase64(pdfBlob);
      return base64String as string;
    }
  } catch (e) {
    console.error(e);
  }
  return undefined;
};

const convertBlobToBase64 = blob =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result will be something like: "data:application/pdf;base64,JVBERi0xLjcKJYGBgYEK..."
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(blob); // This reads the blob and converts it to a base64 encoded string
  });
