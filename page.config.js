/* eslint-disable */
const glob = require('glob');


const html = glob.sync('src/pages/**/*.html').map(path => {
    const name = path.split('/').pop().split('.')[0];
    return name;
})

const js = glob.sync('src/pages/**/*.js').map(path => {
    const name = path.split('/').pop().split('.')[0];
    return name;
})

const arr = [];
html.forEach((item, index) => {
  arr.push(
      {
          name: item,
          html: glob.sync('src/pages/**/*.html')[index],
          jsEntry: glob.sync('./src/pages/**/*.js')[index]?['./src/app.js', glob.sync('./src/pages/**/*.js')[index]] : ['./src/app.js']
      }
  )
})


module.exports = arr
