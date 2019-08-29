/* eslint-disable */
// 打印大文件,模态框提示
const Modal = {
  show (params) {
    // Build modal
    let modalStyle = 'font-family:sans-serif; ' +
        'display:table; ' +
        'text-align:center; ' +
        'font-weight:300; ' +
        'font-size:30px; ' +
        'left:0; top:0;' +
        'position:fixed; ' +
        'z-index: 9990;' +
        'color: #0460B5; ' +
        'width: 100%; ' +
        'height: 100%; ' +
        'background-color:rgba(255,255,255,.9);' +
        'transition: opacity .3s ease;'
    let openStyle = '.printModal{font-family:sans-serif;display:flex;text-align:center;font-weight:300;font-size:30px;left:0;top:0;position:absolute;color:#0460b5;width:100%;height:100%;background-color:rgba(255,255,255,0.91)}.printClose{position:absolute;right:10px;top:10px}.printClose:before{content:"\\00D7";font-family:"Helvetica Neue",sans-serif;font-weight:100;line-height:1px;padding-top:.5em;display:block;font-size:2em;text-indent:1px;overflow:hidden;height:1.25em;width:1.25em;text-align:center;cursor:pointer}.printModal{font-family:sans-serif;display:flex;text-align:center;font-weight:300;font-size:30px;left:0;top:0;position:absolute;color:#0460b5;width:100%;height:100%;background-color:rgba(255,255,255,0.91)}.printClose{position:absolute;right:10px;top:10px}.printClose:before{content:"\\00D7";font-family:"Helvetica Neue",sans-serif;font-weight:100;line-height:1px;padding-top:.5em;display:block;font-size:2em;text-indent:1px;overflow:hidden;height:1.25em;width:1.25em;text-align:center;cursor:pointer}'

    // Create wrapper
    let printModal = document.createElement('div')
    printModal.setAttribute('style', modalStyle)
    printModal.setAttribute('id', 'wePrint-Modal')

    // Create content div
    let contentDiv = document.createElement('div')
    contentDiv.setAttribute('style', 'display:table-cell; vertical-align:middle; padding-bottom:100px;')

    const style = document.createElement('style')
    style.innerHTML = openStyle
    contentDiv.appendChild(style)

    // Add close button (requires print.css)
    let closeButton = document.createElement('div')
    closeButton.setAttribute('class', 'printClose')
    closeButton.setAttribute('id', 'printClose')
    contentDiv.appendChild(closeButton)

    // Add spinner (requires print.css)
    let spinner = document.createElement('span')
    spinner.setAttribute('class', 'printSpinner')
    contentDiv.appendChild(spinner)

    // Add message
    if (params.modalMessage) {
      let messageNode = document.createTextNode(params.modalMessage)
      contentDiv.appendChild(messageNode)
    }

    // Add contentDiv to printModal
    printModal.appendChild(contentDiv)

    // Append print modal element to document body
    document.getElementsByTagName('body')[0].appendChild(printModal)

    // Add event listener to close button
    document.getElementById('printClose').addEventListener('click', function () {
      Modal.close()
    })
  },
  close () {
    let printFrame = document.getElementById('wePrint-Modal')

    printFrame.parentNode.removeChild(printFrame)
  }
}

export default Modal
