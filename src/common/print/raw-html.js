/* eslint-disable */
import { addWrapper } from './functions'
import Print from './print'

export default {
  print: (params, printFrame) => {
    // 存储HTML数据
    params.htmlData = addWrapper(params.printData, params)

    Print.send(params, printFrame)
  }
}
