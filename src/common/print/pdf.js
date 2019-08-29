/* eslint-disable */
import Print from './print';
import { cleanUp } from './functions';

export default {
  print: (params, printFrame, isCloud) => {
    // 如果是base64的pdf数据
    if (params.base64) {
      const bytesArray = Uint8Array.from(atob(params.printData), c =>
        c.charCodeAt(0),
      );
      return createBlobAndPrint(params, printFrame, bytesArray, isCloud);
    }

    // 格式PDF URL
    params.printData = /^(blob|http)/i.test(params.printData)
      ? params.printData
      : window.location.origin +
        (params.printData.charAt(0) !== '/'
          ? '/' + params.printData
          : params.printData);

    // 通过HTTP请求获取文件（预加载）
    let req = new window.XMLHttpRequest();
    req.responseType = 'arraybuffer';

    req.addEventListener('load', () => {
      if ([200, 201].indexOf(req.status) === -1) {
        cleanUp(params);
        params.onError(req.statusText);

        // 由于我们没有可用的PDF文档，我们将停止打印作业
        return;
      }

      // 打印请求的文档
      createBlobAndPrint(params, printFrame, req.response, isCloud);
    });

    req.open('GET', params.printData, true);
    req.send();
  },
};

function createBlobAndPrint(params, printFrame, data, isCloud) {
  // 将响应或base64数据传递到blob并创建本地对象URL
  let localPdf = new window.Blob([data], { type: 'application/pdf' });
  localPdf = window.URL.createObjectURL(localPdf);

  // 使用PDF文档URL设置iframe-src
  printFrame.setAttribute('src', localPdf);

  // 云打印
  if (isCloud) {
    // if (Browser.isFirefox()) {
    //   printFrame.setAttribute('style', 'display: none;');
    // }
    // 设置iframe样式
    const pdfIframeStyle =
      'padding: 5% 10%;height: 100%;width: 100%;border: none;background: rgba(0,0,0,0.5);';
    printFrame.setAttribute('style', pdfIframeStyle);
    printFrame.setAttribute('id', 'printFrameDOM');
    return printFrame;
  } else {
    const pdfIframeStyle =
      'position: fixed;top: 0;z-index: 9999;padding: 5% 10%;height: 100%;width: 100%;border: none;background: rgba(0,0,0,0.5);';
    printFrame.setAttribute('style', pdfIframeStyle);
    Print.send(params, printFrame);
  }
}
