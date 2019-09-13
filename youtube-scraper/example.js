const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  html = await page.goto('https://youtube.com');
  const searchBar = await page.$('#search');
  await searchBar.click()
  await page.keyboard.type('finanças');
  await page.screenshot({path: 'youtube_fin.png'});
  const searchButton = await page.$('#search-icon-legacy')
  await searchButton.click()
  await page.waitForNavigation({ waitUntil: 'networkidle2' }),
  await page.screenshot({path: 'search_click.png'});
  const videoHrefs = await page.evaluate(() => {
    const anchors = document.querySelectorAll('a.ytd-video-renderer');
    return [].map.call(anchors, a => a.href);
  });
  console.log(videoHrefs);


  await browser.close();
})();
