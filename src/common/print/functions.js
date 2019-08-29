/* eslint-disable */
import Modal from './modal'
import Browser from './browser'

export function addWrapper (htmlData, params) {
  let bodyStyle = 'font-family:' + params.font + ' !important; font-size: ' + params.font_size + ' !important; width:100%;'
  return '<div style="' + bodyStyle + '">' + htmlData + '</div>'
}

export function capitalizePrint (obj) {
  return obj.charAt(0).toUpperCase() + obj.slice(1)
}

export function collectStyles (element, params) {
  // document.defaultView只读属性
  let win = document.defaultView || window

  // 用于保存每个元素样式的字符串变量
  let elementStyle = ''

  // 循环计算样式
  let styles = win.getComputedStyle(element, '')

  Object.keys(styles).map(key => {
    // 检查是否应处理样式
    if (params.targetStyles.indexOf('*') !== -1 || params.targetStyle.indexOf(styles[key]) !== -1 || targetStylesMatch(params.targetStyles, styles[key])) {
      if (styles.getPropertyValue(styles[key])) elementStyle += styles[key] + ':' + styles.getPropertyValue(styles[key]) + ';'
    }
  })

  // 打印默认值
  elementStyle += 'max-width: ' + params.maxWidth + 'px !important;font-size:' + params.font_size + ' !important;'

  return elementStyle
}

function targetStylesMatch (styles, value) {
  for (let i = 0; i < styles.length; i++) {
    if (typeof value === 'object' && value.indexOf(styles[i]) !== -1) return true
  }
  return false
}

export function loopNodesCollectStyles (elements, params) {
  for (let n = 0; n < elements.length; n++) {
    let currentElement = elements[n]

    // Check if we are skiping this element
    if (params.ignoreElements.indexOf(currentElement.getAttribute('id')) !== -1) {
      currentElement.parentNode.removeChild(currentElement)
      continue
    }

    // Form Printing - check if is element Input
    let tag = currentElement.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      // Save style to variable
      let textStyle = collectStyles(currentElement, params)

      // Remove INPUT element and insert a text node
      let parent = currentElement.parentNode

      // Get text value
      let textNode = tag === 'SELECT'
        ? document.createTextNode(currentElement.options[currentElement.selectedIndex].text)
        : document.createTextNode(currentElement.value)

      // Create text element
      let textElement = document.createElement('div')
      textElement.appendChild(textNode)

      // Add style to text
      textElement.setAttribute('style', textStyle)

      // Add text
      parent.appendChild(textElement)

      // Remove input
      parent.removeChild(currentElement)
    } else {
      // Get all styling for print element
      currentElement.setAttribute('style', collectStyles(currentElement, params))
    }

    // Check if more elements in tree
    let children = currentElement.children

    if (children && children.length) {
      loopNodesCollectStyles(children, params)
    }
  }
}

export function addHeader (printElement, header, headerStyle) {
  // Create header element
  let headerElement = document.createElement('h1')

  // Create header text node
  let headerNode = document.createTextNode(header)

  // Build and style
  headerElement.appendChild(headerNode)
  headerElement.setAttribute('style', headerStyle)

  printElement.insertBefore(headerElement, printElement.childNodes[0])
}

export function cleanUp (params) {
  // If we are showing a feedback message to user, remove it
  if (params.showModal) Modal.close()

  // Check for a finished loading hook function
  if (params.onLoadingEnd) params.onLoadingEnd()

  // If preloading pdf files, clean blob url
  if (params.showModal || params.onLoadingStart) window.URL.revokeObjectURL(params.printData)

  // If a onPrintDialogClose callback is given, execute it
  if (params.onPrintDialogClose) {
    let event = 'mouseover'

    if (Browser.isChrome() || Browser.isFirefox()) {
      // Ps.: Firefox will require an extra click in the document to fire the focus event.
      event = 'focus'
    }
    const handler = () => {
      // Make sure the event only happens once.
      window.removeEventListener(event, handler)

      params.onPrintDialogClose()
    }

    window.addEventListener(event, handler)
  }
}

export function isRawHTML (raw) {
  let regexHtml = new RegExp('<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)</\\1>')
  return regexHtml.test(raw)
}
