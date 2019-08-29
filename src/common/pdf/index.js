import PDFJS from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function showPdf(base64, callback) {
  if (!base64) {
    alert('无PDF文件');
  }
  const fragment = document.createDocumentFragment(); // 生成一个空的documentFragment文档片段 //创建documentFragment储存canvas节点一次性渲染//通过querySelector选择DOM节点,使用document.getElementById()也一样

  const decodedBase64 = atob(base64); // 使用浏览器自带的方法解码
  const pdf = await PDFJS.getDocument({ data: decodedBase64 }); // 返回一个pdf对象
  const pages = pdf.numPages; // 声明一个pages变量等于当前pdf文件的页数
  for (let i = 1; i <= pages; i += 1) {
    // 循环页数
    const canvas = document.createElement('canvas');
    const image = document.createElement('img');
    canvas.setAttribute('style', 'margin-bottom:10px;');
    // eslint-disable-next-line no-await-in-loop
    const page = await pdf.getPage(i); // 调用getPage方法传入当前循环的页数,返回一个page对象
    const scale = 2; // 缩放倍数，1表示原始大小
    const viewport = page.getViewport(scale);
    const context = canvas.getContext('2d'); // 创建绘制canvas的对象
    canvas.height = viewport.height; // 定义canvas高和宽
    canvas.width = viewport.width;
    // context.scale(0.5,0.5);
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    // eslint-disable-next-line no-await-in-loop
    await page.render(renderContext);
    canvas.className = 'canvas'; // 给canvas节点定义一个class名,这里我取名为canvas
    image.setAttribute('src', canvas.toDataURL());
    image.setAttribute(
      'style',
      'height:978px;width:650px;margin-bottom: 10px;display: block;margin: 0 auto;',
    );
    fragment.appendChild(image); // 添加canvas节点到fragment文档片段中
  }
  callback(fragment);
}

// const testDom = document.getElementsByClassName('print-btn')[0];

// testDom.addEventListener('click', () => {
//   setTimeout(() => {
//     showPdf;(window.printURL);
//   }, 5000);
// });
window.showPdf = showPdf;
