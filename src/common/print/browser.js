/* eslint-disable */

// 判断浏览器版本支持pdf
const Browser = {
  isFirefox: () => {
    return typeof InstallTrigger !== 'undefined'
  },
  isIE: () => {
    return navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode
  },
  isEdge: () => {
    return !Browser.isIE() && !!window.StyleMedia
  },
  isChrome: (context = window) => {
    return !!context.chrome
  },
  isSafari: () => {
    return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
        navigator.userAgent.toLowerCase().indexOf('safari') !== -1
  }
}

export default Browser
