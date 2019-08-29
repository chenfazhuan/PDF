/* eslint-disable */
import { collectStyles, loopNodesCollectStyles, addWrapper, addHeader } from './functions'
import Print from './print'

export default {
  print: (params, printFrame) => {
    // 获取需要打印的ID
    let printElement = document.getElementById(params.printData)

    // 检查dom是否存在
    if (!printElement) {
      window.console.error('Invalid HTML element id: ' + params.printData)
      return false
    }

    // 复制printElement以防止DOM更改
    let printDataElement = document.createElement('div')
    printDataElement.appendChild(printElement.cloneNode(true))

    // 将克隆的元素添加到dom，以使dom元素方法可用。
    printDataElement.setAttribute('style', 'height:0; overflow:hidden;')
    printDataElement.setAttribute('id', 'wePrint-html')
    printElement.parentNode.appendChild(printDataElement)

    // 用新创建的dom元素更新printDataelement变量
    printDataElement = document.getElementById('wePrint-html')

    // 设置为false时，库不会处理应用于正在打印的html的样式。使用css参数时很有用
    if (params.scanStyles === true) {

      if (params.honorMarginPadding) params.targetStyles.push('margin', 'padding')

      if (params.honorColor) params.targetStyles.push('color')

      // 获取主要元素样式
      printDataElement.setAttribute('style', collectStyles(printDataElement, params) + 'margin:0 !important;')

      // 获取元素的子元素
      let elements = printDataElement.children

      // 获取所有子元素的样式
      loopNodesCollectStyles(elements, params)
    }

    // 加入标题
    if (params.header) {
      addHeader(printDataElement, params.header, params.headerStyle)
    }

    // 删除增加的DOM printDataElement
    printDataElement.parentNode.removeChild(printDataElement)

    // 存储HTML数据
    params.htmlData = addWrapper(printDataElement.innerHTML, params)

    Print.send(params, printFrame)
  }
}
