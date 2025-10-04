const puppeteer = require('puppeteer');

const args = process.argv.slice(2);
const headlessMode = args.includes('--headless');

(async () => {
  const browser = await puppeteer.launch({
    headless: headlessMode,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2
  });
  
  console.log(`Running in ${headlessMode ? 'headless' : 'visible'} mode...`);
  console.log('Loading Notion page...');
  await page.goto('https://amondbabaro.notion.site/kimtaeeun', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  await page.waitForTimeout(3000);
  
  console.log('Scrolling through entire page (loading all content)...');

  await autoScroll(page);

  await page.waitForTimeout(3000);
  
  console.log('Generating PDF...');

  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  
  await page.pdf({
    path: 'notion-portfolio.pdf',
    width: '1920px',
    height: `${bodyHeight}px`,
    printBackground: true,
    preferCSSPagedMedia: false
  });
  
  console.log('PDF generated successfully: notion-portfolio.pdf');
  
  await browser.close();
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
