/* eslint-disable */
import Browser from './browser';
import { cleanUp } from './functions';

const Print = {
  send: (params, printFrame, printFrameDOM) => {
    // 将iframe元素附加到文档正文
    if (params.type === 'pdf') {
      const printBtnGroupStyle =
        'position:fixed;bottom:15%;left:50%;transform: translateX(-50%);-ms-transform: translateX(-50%);-moz-transform: translateX(-50%);-o-transition: translateX(-50%);-webkit-transform: translateX(-50%);font-size: 16px;cursor: pointer;border-radius: 5px;color:#fff;z-index: 99999;';
      const btnCommonStyle =
        'padding: 5px 10px; cursor: pointer;border-radius: 5px;display: inline-block;text-align: center;';

      const printBtnGroup = document.createElement('div');
      printBtnGroup.setAttribute('style', `${printBtnGroupStyle}`);
      printBtnGroup.setAttribute('id', 'wePrintBtnGroup');

      const printButton = document.createElement('div');
      printButton.setAttribute('class', 'wePrintButton');
      printButton.setAttribute('id', 'wePrintButton');
      printButton.setAttribute('style', `${btnCommonStyle}background:#4F61CA;`);
      printButton.innerText = '确认打印';

      let printCloseButton = document.createElement('div');
      printCloseButton.setAttribute('class', 'wePrintPreviewClose');
      printCloseButton.setAttribute('id', 'wePrintPreviewClose');
      printCloseButton.setAttribute(
        'style',
        `${btnCommonStyle}background:#e6a23c;margin-left: 20px;`,
      );
      printCloseButton.innerText = '关闭';
      printBtnGroup.appendChild(printButton);
      printBtnGroup.appendChild(printCloseButton);

      document.getElementsByTagName('body')[0].appendChild(printBtnGroup);
      document.getElementsByTagName('body')[0].appendChild(printFrame);
    } else if (params.type === 'cloud') {
      previewAddDOM();
      // 可以展示pdf文件的展示PDF
      if (Browser.isChrome() || Browser.isFirefox()) {
        document.getElementById('iframeDiv').appendChild(printFrameDOM);
      } else {
        document.getElementById('iframeDiv').appendChild(printFrame);
      }
    } else {
      previewAddDOM();
      document.getElementById('iframeDiv').appendChild(printFrame);
    }

    // 获取iframe文档
    const iframeElement = document.getElementById(params.frameId);
    // 云打印获取打印iframe
    const printIframeElement = document.getElementById('printFrameDOM');

    if (params.type === 'cloud') {
      printIframeElement.onload = () => {
        printIframeContent(printIframeElement, params);
      };
      if (iframeElement) {
        iframeElement.onload = () => {
          let printDocument =
            iframeElement.contentWindow || iframeElement.contentDocument;
          if (printDocument.document) printDocument = printDocument.document;
          if (typeof params.htmlData === 'object') {
            printDocument.body.appendChild(params.htmlData);
          } else {
            printDocument.body.innerHTML = params.htmlData;
          }
        };
      }
    } else {
      // iframe载入完成
      iframeElement.onload = () => {
        // 获取iframe的文档流
        printIframeContent(iframeElement, params);
      };
    }
  },
};

function previewAddDOM() {
  let wePrintPreviewStyle = `font-family: sans-serif;
    display: table;
    text-align: center;
    font-weight: 300;
    font-size: 30px;
    left: 0;
    top: 10%;
    position: fixed;
    z-index: 9990;
    width: 960px;
    height: 80%;
    background-color: #fff;
    left: 50%;
    overflow: auto;
    box-shadow: 1px 1px 50px rgba(0,0,0,.3);
    transform: translateX(-480px);
     -ms-transform: translateX(-480px);
    -moz-transform: translateX(-480px);
     -o-transition: translateX(-480px);
    -webkit-transform: translateX(-480px);`;
  let modalCss = `position: fixed;
  z-index: 9999;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.3);
    bottom: 0;`;

  let previewStyle =
    '.wePrintPreviewClose{position:absolute;right:30px;top:10px;width:50px;height:50px;}.wePrintPreviewClose:before{content:"\\00D7";font-family:"Helvetica Neue",sans-serif;font-weight:100;line-height:1px;padding-top:.5em;display:block;font-size:41px;text-indent:1px;overflow:hidden;height:50px;width:1.25em;text-align:center;cursor:pointer;color:#fff}.wePrintButton{position:absolute;bottom:10px;padding: 5px 10px;left:50%; transform: translateX(-50%);-ms-transform: translateX(-50%);-moz-transform: translateX(-50%);-o-transition: translateX(-50%);-webkit-transform: translateX(-50%);font-size: 16px;cursor: pointer;border-radius: 5px;background:#4F61CA;color:#fff;}';

  let modal = document.createElement('div');
  modal.setAttribute('style', modalCss);
  modal.setAttribute('id', 'wePrint-Modal');

  let previewModal = document.createElement('div');
  previewModal.setAttribute('style', wePrintPreviewStyle);
  previewModal.setAttribute('id', 'wePrint-Preview');

  let contentDiv = document.createElement('div');
  contentDiv.setAttribute(
    'style',
    'display:table-cell; vertical-align:middle;height: 100%;',
  );

  const style = document.createElement('style');
  style.innerHTML = previewStyle;
  contentDiv.appendChild(style);

  let iframeDiv = document.createElement('div');
  iframeDiv.setAttribute('id', 'iframeDiv');
  iframeDiv.setAttribute('style', 'height:100%;background: #525659;');
  contentDiv.appendChild(iframeDiv);

  let closeButton = document.createElement('div');
  closeButton.setAttribute('class', 'wePrintPreviewClose');
  closeButton.setAttribute('id', 'wePrintPreviewClose');
  contentDiv.appendChild(closeButton);

  if (!Browser.isFirefox()) {
    let printButton = document.createElement('div');
    printButton.setAttribute('class', 'wePrintButton');
    printButton.setAttribute('id', 'wePrintButton');
    printButton.innerText = '确认打印';
    contentDiv.appendChild(printButton);
  }

  previewModal.appendChild(contentDiv);
  modal.appendChild(previewModal);

  document.getElementsByTagName('body')[0].appendChild(modal);
}
function previewRemoveDOM() {
  const printFrame = document.getElementById('wePrint-Modal');

  if (printFrame) {
    printFrame.parentNode.removeChild(printFrame);
  } else {
    const wePrintIframe = document.getElementById('wePrintIframe');
    const wePrintBtnGroup = document.getElementById('wePrintBtnGroup');
    wePrintBtnGroup.parentNode.removeChild(wePrintBtnGroup);
    wePrintIframe.parentNode.removeChild(wePrintIframe);
  }
}

function performPrint(iframeElement, params) {
  try {
    iframeElement.focus();
    // document.getElementById('printData').innerHTML = iframeElement.contentWindow.document.documentElement.innerHTML
    // previewAddDOM(iframeElement.contentWindow.document.documentElement.innerHTML)
    // Modal.show('123')

    // Edge或IE, 用execcommand执行打印命令
    if (Browser.isEdge() || Browser.isIE()) {
      try {
        iframeElement.contentWindow.document.execCommand('print', false, null);
      } catch (e) {
        iframeElement.contentWindow.print();
      }
    } else {
      // 其他浏览器直接打印
      iframeElement.contentWindow.print();
    }
  } catch (error) {
    params.onError(error);
  } finally {
    cleanUp(params);
  }
}

function loadIframeImages(images) {
  const promises = [];

  for (let image of images) {
    promises.push(loadIframeImage(image));
  }

  return Promise.all(promises);
}

function loadIframeImage(image) {
  return new Promise(resolve => {
    const pollImage = () => {
      !image ||
      typeof image.naturalWidth === 'undefined' ||
      image.naturalWidth === 0 ||
      !image.complete
        ? setTimeout(pollImage, 500)
        : resolve();
    };
    pollImage();
  });
}

// 打印iframe
function printIframeContent(iframeElement, params) {
  document
    .getElementById('wePrintPreviewClose')
    .addEventListener('click', function() {
      previewRemoveDOM();
    });
  if (!Browser.isFirefox()) {
    let printDocument =
      iframeElement.contentWindow || iframeElement.contentDocument;
    if (printDocument.document) printDocument = printDocument.document;

    document
      .getElementById('wePrintButton')
      .addEventListener('click', function() {
        // 如果正在打印图像，请等待它们加载到iframe中
        const images = printDocument.getElementsByTagName('img');

        if (images.length > 0) {
          loadIframeImages(images).then(() =>
            performPrint(iframeElement, params),
          );
        } else {
          performPrint(iframeElement, params);
        }
      });

    if (params.type === 'pdf' || params.type === 'cloud') {
      return;
    }

    // 添加自定义样式
    if (params.type !== 'pdf' && params.style !== null) {
      const style = document.createElement('style');
      style.innerHTML = params.style;
      printDocument.head.appendChild(style);
    }

    // 将可打印的HTML插入iframe正文
    if (typeof params.htmlData === 'object') {
      printDocument.body.appendChild(params.htmlData);
    } else {
      printDocument.body.innerHTML = params.htmlData;
    }
  }
}

export default Print;
