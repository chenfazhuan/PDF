/* eslint-disable */
import { addHeader } from './functions'
import Print from './print'

export default {
  print: (params, printFrame) => {
    // 传入的图片为数组,单张转数组
    if (params.printData.constructor !== Array) {
      params.printData = [params.printData]
    }

    // 创建可打印元素（容器）
    let printDataElement = document.createElement('div')
    printDataElement.setAttribute('style', 'width:100%')

    // 加载图像并添加
    loadImagesAndAppendToPrintableElement(printDataElement, params).then(() => {
      // 检查是否添加标题
      if (params.header) addHeader(printDataElement, params.header, params.headerStyle)

      // 存储HTML数据
      params.htmlData = printDataElement.outerHTML

      // 打印图片
      Print.send(params, printFrame)
    })
  }
}

// 动态创建图片节点
function loadImagesAndAppendToPrintableElement (printDataElement, params) {
  let promises = []

  // 遍历图片数组
  params.printData.forEach((image, index) => {
    // 创建图片dom
    let img = document.createElement('img')

    // 设置图片的src
    img.src = image

    // 载入图片
    promises.push(loadImageAndAppendToPrintableElement(printDataElement, params, img, index))
  })
  // 同时加载图片
  return Promise.all(promises)
}

function loadImageAndAppendToPrintableElement (printDataElement, params, img, index) {
  return new Promise(resolve => {
    img.onload = () => {
      // 创建图片容器
      let imageWrapper = document.createElement('div')
      imageWrapper.setAttribute('style', params.imageStyle)

      img.setAttribute('style', 'width:100%;')
      img.setAttribute('id', 'printDataImage' + index)

      // 加入图片
      imageWrapper.appendChild(img)

      // 将包装元素附加到可打印元素
      printDataElement.appendChild(imageWrapper)

      resolve()
    }
  })
}
