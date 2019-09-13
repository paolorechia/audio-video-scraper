const puppeteer = require('puppeteer');

(async () => {
  show=false;
  let browser;
  if (show === false) {
    browser = await puppeteer.launch({
      height: 1080,
      width: 800

    });
  } else {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 30 // slow down by 250ms
    });
  }
  const page = await browser.newPage();
  html = await page.goto('https://youtube.com');
  const searchBar = await page.$('#search');
  await searchBar.click()
  await page.keyboard.type('finanças');
  await page.screenshot({path: 'youtube_search_fin.png'});
  const searchButton = await page.$('#search-icon-legacy')
  await searchButton.click()
  await page.waitForNavigation({ waitUntil: 'networkidle2' }),
  await page.screenshot({path: 'sclick.png'});
  const filterButton = await page.$('#button.ytd-toggle-button-renderer');
  await filterButton.click()
  await page.screenshot({ path: 'filter_click.png'});

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
  await page.screenshot({ path: 'filtered_screen.png'});
  const videoHrefs = await page.evaluate(() => {
    const anchors = document.querySelectorAll('a.ytd-video-renderer');
    return [].map.call(anchors, a => a.href);
  });
  console.log(videoHrefs)
  await scrollDown(page);
  await page.waitFor(1500)
  await page.screenshot({ path: 'scrolled_down.png'});
  const videoHrefs2 = await page.evaluate(() => {
    const anchors = document.querySelectorAll('a.ytd-video-renderer');
    return [].map.call(anchors, a => a.href);
  });
  console.log(videoHrefs2)
  await browser.close();
})();


async function scrollDown(page) {
    await page.evaluate(async () => {
      window.scrollBy(0, 129301290);
    });
}
