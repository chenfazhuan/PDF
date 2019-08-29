/* eslint-disable */
// postcss.config.js
const autoprefixer = require('autoprefixer');
// const postcssPxtorem = require('postcss-pxtorem');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [
        // 加这个后可以出现额外的兼容性前缀
        "> 0.01%"
      ]
    }),
    // postcssPxtorem({
    //   rootValue: 37.5,
    //   propList: ['*']
    // }),
  ]
}
