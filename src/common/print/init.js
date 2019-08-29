/* eslint-disable */
'use strict';

import Browser from './browser';
import Modal from './modal';
import Pdf from './pdf';
import Html from './html';
import RawHtml from './raw-html';
import Image from './image';
import Json from './json';
import dom from './dom';
import cloud from './cloud';

const printTypes = ['pdf', 'id', 'image', 'json', 'raw-html', 'dom', 'cloud'];

export default {
  init() {
    let params = {
      // pdf或图像url，html元素id或json数据对象
      printData: null,
      // 打印pdf时，如果浏览器不兼容（检查浏览器兼容性表），库将在新选项卡中打开pdf。这允许您传递要打开的不同pdf文档，而不是传递给`printData`的原始文档。如果您在备用pdf文件中注入javascript，这可能很有用。
      fallbackPrintable: null,
      // 可打印类型。可用的打印选项包括：pdf，html，image，json和raw-html。
      type: 'dom',
      // 用于HTML，Image或JSON打印的可选标头。它将放在页面顶部。此属性将接受文本或原始HTML。
      header: null,
      // 要应用于标题文本的可选标题样式。
      headerStyle: 'font-weight: 300;',
      // 最大文档宽度（像素）。根据需要更改此项。在打印HTML，图像或JSON时使用。
      maxWidth: 800,
      // 打印HTML或JSON时使用的字体。
      font: 'TimesNewRoman',
      // 打印HTML或JSON时使用的字体大小。
      font_size: '12pt',
      // 这用于保留或删除正在打印的元素的填充和边距。有时这些样式设置在屏幕上很棒，但在打印时看起来很糟糕。您可以通过将其设置为false来删除它。
      honorMarginPadding: true,
      // 要以彩色打印文本，请将此属性设置为true。默认情况下，所有文本都将以黑色打印。
      honorColor: false,
      // 在打印JSON时使用。这些是对象属性名称。
      properties: null,
      // 打印JSON数据时网格标题的可选样式。
      gridHeaderStyle:
        'font-weight: bold; padding: 5px; border: 1px solid #dddddd;',
      // 打印JSON数据时网格行的可选样式。
      gridStyle: 'border: 1px solid lightgray; margin-bottom: -1px;',
      // 启用此选项可在检索或处理大型PDF文件时显示用户反馈。
      showModal: false,
      // 发生错误时要执行的回调函数。
      onError: error => {
        throw error;
      },
      // 加载PDF时要执行的功能
      onLoadingStart: null,
      // 加载PDF后要执行的功能
      onLoadingEnd: null,
      // 关闭浏览器打印对话框后执行回调功能。
      onPrintDialogClose: null,
      // 打印pdf时，如果浏览器不兼容（检查浏览器兼容性表），库将在新选项卡中打开pdf。可以在此处传递回调函数，这将在发生这种情况时执行。在您想要处理打印流程，更新用户界面等的某些情况下，它可能很有用。
      onPdfOpen: null,
      onBrowserIncompatible: () => true,
      // 当向用户显示的消息showModal被设定为true
      modalMessage: '正在检索文件...',
      // iframe的id
      frameId: 'wePrintIframe',
      // 插入到打印页面的String DOM
      htmlData: '',
      // iframe的标题
      documentTitle: 'Document',
      // 默认情况下，在打印HTML元素时，库仅处理某些样式。此选项允许您传递要处理的样式数组['padding-top'，'border-bottom']
      targetStyle: [
        'clear',
        'display',
        'width',
        'min-width',
        'height',
        'min-height',
        'max-height',
      ],
      // 但是，与`targetStyle`相同，这将处理任何一系列样式。例如：['border'，'padding']，将包括'border-bottom'，'border-top'，'border-left'，'border-right'，'padding-top'等。
      targetStyles: ['border', 'box', 'break', 'text-decoration'],
      // 接受打印父html元素时应忽略的html id数组。
      ignoreElements: [],
      // 打印图像时使用。接受包含要应用于每个图像的自定义样式的字符串
      imageStyle: 'width:100%;',
      // 在打印JSON数据时使用。设置为时false，数据表标题仅显示在第一页中。
      repeatTableHeader: true,
      // 这允许我们传递一个或多个应该应用于正在打印的html的css文件URL。值可以是包含单个URL的字符串，也可以是包含多个URL的数组。
      css: null,
      // 这允许我们传递一个字符串，该字符串应该应用于正在打印的html。
      style: null,
      // 设置为false时，库不会处理应用于正在打印的html的样式。使用css参数时很有用。
      scanStyles: true,
      // 在打印作为base64数据传递的PDF文档时使用。
      base64: false,
    };

    // 检查是否提供了可打印文档或对象
    let args = arguments[0];
    if (args === undefined)
      throw new Error('wePrint expects at least 1 attribute.');

    // 处理参数
    switch (typeof args) {
      case 'string':
        // 传入的是URL地址
        params.printData = encodeURI(args);
        params.fallbackPrintable = params.printData;
        // 定义打印类型
        params.type = arguments[1] || params.type;
        break;
      case 'object':
        params.printData = args.printData;
        params.fallbackPrintable =
          typeof args.fallbackPrintable !== 'undefined'
            ? args.fallbackPrintable
            : params.printData;
        params.base64 = typeof args.base64 !== 'undefined';
        for (var k in params) {
          if (k === 'printData' || k === 'fallbackPrintable' || k === 'base64')
            continue;

          params[k] = typeof args[k] !== 'undefined' ? args[k] : params[k];
        }
        break;
      default:
        throw new Error(
          'Unexpected argument type! Expected "string" or "object", got ' +
            typeof args,
        );
    }

    // 需要打印的内容非空判断
    if (!params.printData) throw new Error('Missing printData information.');

    // 规定的打印类型
    if (
      !params.type ||
      typeof params.type !== 'string' ||
      printTypes.indexOf(params.type.toLowerCase()) === -1
    ) {
      throw new Error(
        'Invalid print type. Available types are: pdf, id, image, dom and json.',
      );
    }

    // 是否打开弹框
    if (params.showModal) Modal.show(params);

    // 打印前自定义执行函数
    if (params.onLoadingStart) params.onLoadingStart();

    // 移除上次的打印内容
    let usedFrame = document.getElementById(params.frameId);
    if (usedFrame) usedFrame.parentNode.removeChild(usedFrame);

    // 创建新的iframe或嵌入元素（即如果使用iframe，则打印空白的pdf）
    let printFrame;
    printFrame = document.createElement('iframe');
    // 隐藏iframe
    // printFrame.setAttribute('style', 'visibility: hidden; height: 0; width: 0; position: absolute;')
    // 设置iframeID
    printFrame.setAttribute('id', params.frameId);
    printFrame.setAttribute(
      'style',
      'height: 90%;width:100%;border:none;padding: 20px 20px 0;',
    );
    // 对于非PDF打印，将HTML文档字符串传递给srcdoc（强制onload回调）
    if (params.type !== 'pdf') {
      printFrame.srcdoc =
        '<html style="overflow: auto;text-align: center;"><head><title>' +
        params.documentTitle +
        '</title><style>@media print {@page {margin: 0;}body {margin: 2cm;}} body{text-align: center;}</style>';
      if (params.type === 'id') {
        printFrame.srcdoc += document.getElementsByTagName('head')[0].innerHTML;
      }

      // 加上传入的css链接
      if (params.css !== null) {
        if (!Array.isArray(params.css)) params.css = [params.css];
        params.css.forEach(file => {
          printFrame.srcdoc += '<link rel="stylesheet" href="' + file + '">';
        });
      }
      printFrame.srcdoc += '</head><body></body></html>';
    }

    // 如果是pdf的打印
    switch (params.type) {
      case 'pdf':
        // 判断浏览器是否支持pdf
        if (Browser.isFirefox() || Browser.isEdge() || Browser.isIE()) {
          try {
            console.info(
              "wePrint currently doesn't support PDF printing in Firefox, Internet Explorer and Edge.",
            );
            if (params.onBrowserIncompatible() === true) {
              let win = window.open(params.fallbackPrintable, '_blank');
              win.focus();
              if (params.onPdfOpen) params.onPdfOpen();
            }
          } catch (e) {
            params.onError(e);
          } finally {
            if (params.showModal) Modal.close();
            if (params.onLoadingEnd) params.onLoadingEnd();
          }
        } else {
          Pdf.print(params, printFrame);
        }
        break;
      case 'image':
        Image.print(params, printFrame);
        break;
      case 'id':
        Html.print(params, printFrame);
        break;
      case 'raw-html':
        RawHtml.print(params, printFrame);
        break;
      case 'json':
        Json.print(params, printFrame);
        break;
      case 'dom':
        dom.print(params, printFrame);
        break;
      case 'cloud':
        cloud.print(params, printFrame);
        break;
    }
  },
};
