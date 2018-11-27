const qs = require('querystring')
const url = require('url')
const puppeteer = require('puppeteer')
const jimp = require('./jimp')
const replaceColor = jimp.replaceColor

process.setMaxListeners(0)

const styles = `
  #doc {
    display: none;
  }
  #permalink-overlay {
    background: #444444;
  }
  .original-permalink-page {
    overflow: hidden;
  }
  .permalink-in-reply-tos,
  .permalink-replies .stream-items,
  .PermalinkProfile-dismiss,
  .follow-bar,
  .ProfileTweet-action > .dropdown,
  .permalink-footer,
  .trends,
  .stream-loading {
    display: none !important;
  }
  .timeline-end.has-more-items .stream-end {
    display: block !important;
  }
  .ThreadedConversation--permalinkTweetWithAncestors:before, .permalink-tweet-container:after {
    border-style: hidden !important;
  }
`

let browser

const start = async () => {
  console.log('launching browser')
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
}

module.exports = async (req, res) => {
  const query = qs.parse(url.parse(req.url).query)
  const tweetUrl = query.url

  if (!browser) {
    console.log('starting browser!')
    await start()
  }

  console.log('opening new page')
  page = await browser.newPage()
  await page.setViewport({ width: 1000, height: 1000, deviceScaleFactor: 1.25 })

  console.log('navigating to url')
  await page.goto(tweetUrl)

  console.log('waiting for page to be ready')
  await page.$('.tweet')

  console.log('adding styles')
  await page.addStyleTag({ content: styles })

  console.log('taking screenshot')
  const screenshot = await page.screenshot({})

  console.log('remove background')
  const image = await replaceColor(screenshot, '#444444', '#00000000')

  console.log('cropping image')
  image.autocrop({ leaveBorder: 25 })

  image.getBuffer('image/png', (error, result) => {
    console.log('sending response')
    res.end(result)
    page.close()
  })
}
