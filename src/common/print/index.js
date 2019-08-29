import print from './init';

const wePrint = print.init;

if (typeof window !== 'undefined') {
  window.wePrint = wePrint;
}

export default wePrint;
