const fs = require('fs');
const process = require('process');
const puppeteer = require('puppeteer');

const search_keywords = ['finanças', 'negócios', 'administração', 'economia', 'análise de dados', 'ciência de dados']
const number_of_scroll_downs = 10;

(async () => {
  isHeadless = process.env.headless
  const browser = await puppeteer.launch({
    headless: isHeadless === undefined ? true : isHeadless,
//    slowMo: 30, // slow down by 250ms
    height: 1080,
    width: 800
  });
  for (let keyword of search_keywords) {
    await collectLinksForKeyword(browser, keyword);
  }
  await browser.close();
})();

async function collectLinksForKeyword(browser, keyword) {
    console.log('Starting browser to collect links for keyword ' + keyword + '...');
    const page = await browser.newPage();
    console.log('Going to youtube...')
    html = await page.goto('https://youtube.com');
    const searchBar = await page.$('#search');
    console.log('Clicking search bar...')
    await searchBar.click()
    console.log('Typing keyword...')
    await page.keyboard.type(keyword);
    await page.screenshot({path: 'youtube_search_fin.png'});
    const searchButton = await page.$('#search-icon-legacy')
    console.log('Hitting search button...')
    await searchButton.click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' }),
    await page.screenshot({path: 'sclick.png'});
    console.log('Clicking filter button...')
    const filterButton = await page.$('#button.ytd-toggle-button-renderer');
    await filterButton.click()
    await page.screenshot({ path: 'filter_click.png'});

    console.log('Enabling creative commons filter...')
    const creativeCommonsFilter = await page.evaluate(() => {
      const filters =
        document.querySelectorAll('yt-formatted-string.ytd-search-filter-renderer')
        return [].map.call(filters, async t => { 
          if (t.innerHTML === 'Creative Commons') {
            await t.click()
            return t.innerHTML;
            }
        });
    });
    await page.waitFor(1000)
    await filterButton.click()
    await page.screenshot({ path: 'filter_click2.png'});
    console.log('Enabling subtitles filter...')
    const SubtitlesCCFilter = await page.evaluate(() => {
      const filters =
        document.querySelectorAll('yt-formatted-string.ytd-search-filter-renderer')
        return [].map.call(filters, async t => { 
          if (t.innerHTML === 'Legendas/CC') {
            await t.click()
            return t.innerHTML;
            }
        });
    });
    await page.waitFor(1000)
    await filterButton.click()
    await page.waitFor(1000)
    await page.screenshot({ path: 'filter_click3.png'});
    await filterButton.click()
    await page.waitFor(1000)
    const filename = 'links/' + keyword + '.txt';
    await page.screenshot({ path: 'filtered_screen.png'});
    console.log('Collecting first set of links...')
    const videoHrefs = await page.evaluate(() => {
      const anchors = document.querySelectorAll('a.ytd-video-renderer');
      return [].map.call(anchors, a => a.href);
    });
    console.log(videoHrefs)
    console.log('Saving first set of links...')
    videoHrefs.map( href => {
      fs.appendFile(filename, href + '\n', function (err) {
        if (err) throw err;
      });
    });
    console.log('Appended!');
    console.log('Starting scrolldown loop...')
    for (let i = 0; i < number_of_scroll_downs; i++) {
      await scrollDown(page);
      await page.waitFor(1500)
      // await page.screenshot({ path: 'scrolled_down_png'});
      console.log('Collecting a set of links...')
      const videoHrefs2 = await page.evaluate(() => {
        const anchors = document.querySelectorAll('a.ytd-video-renderer');
        return [].map.call(anchors, a => a.href);
      });
      console.log('Appending links file...')
      videoHrefs.map( href => {
        fs.appendFile(filename, href + '\n', function (err) {
          if (err) throw err;
        });
      })
      console.log('Appended!');
    }
  }

async function scrollDown(page) {
    await page.evaluate(async () => {
      window.scrollBy(0, 129301290);
    });
}
