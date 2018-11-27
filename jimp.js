const configure = require('@jimp/custom')
const types = require('@jimp/types')
const plugins = require('@jimp/plugins')
const circle = require('@jimp/plugin-circle')
const replaceColor = require('replace-color')

const jimp = configure({
  types: [types],
  plugins: [plugins, circle]
})

jimp.replaceColor = async (image, replaceThis, withThis) => {
  image = await replaceColor({
    image,
    colors: {
      type: 'hex',
      targetColor: replaceThis,
      replaceColor: withThis
    }
  })
  return image
}

module.exports = jimp
