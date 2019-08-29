/* eslint-disable */
import Print from './print';
import pdf from './pdf';

export default {
  print: (params, printFrame) => {
    // 创建iframe打印pdf
    let newPrintFrame = printFrame.cloneNode(true);
    const printFrameEmpty = document.createElement('iframe');
    let printFrameDOM = pdf.print(params, printFrameEmpty, true);
    Print.send(params, newPrintFrame, printFrameDOM);
  },
};
