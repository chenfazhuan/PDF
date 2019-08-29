/* eslint-disable */
import Print from './print'

export default {
  print: (params, printFrame) => {
    params.htmlData = params.printData;

    Print.send(params, printFrame)
  }
}
