// `prettier.config.js` or `.prettierrc.js`
const prettierConfigStandard = require('prettier-config-standard')
const merge = require('lodash.merge')
console.log(prettierConfigStandard)
const modifiedConfig = merge({}, prettierConfigStandard, {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  jsxBracketSameLine: true
})

module.exports = modifiedConfig
