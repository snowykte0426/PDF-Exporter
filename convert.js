const puppeteer = require('puppeteer');

const args = process.argv.slice(2);
const headlessMode = args.includes('--headless');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  let browser;
  
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: headlessMode,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
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

    console.log('Page loaded. Waiting for content to render...');
    await wait(3000);
    
    console.log('Scrolling through entire page (loading all content)...');
    await autoScroll(page);

    console.log('Waiting for dynamic content to fully load...');
    await wait(3000);
    
    console.log('Generating PDF...');

    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`Page height: ${bodyHeight}px`);
    
    await page.pdf({
      path: 'notion-portfolio.pdf',
      width: '1920px',
      height: `${bodyHeight}px`,
      printBackground: true,
      preferCSSPagedMedia: false
    });
    
    console.log('✓ PDF generated successfully: notion-portfolio.pdf');
    
  } catch (error) {
    console.error('Error occurred:');
    console.error(error.message);
    
    if (error.message.includes('timeout')) {
      console.error('\nTip: The page took too long to load. Try:');
      console.error('- Checking your internet connection');
      console.error('- Increasing the timeout value in the script');
    } else if (error.message.includes('Could not find') || error.message.includes('browser')) {
      console.error('\nTip: Browser launch failed. Try:');
      console.error('- Running: npm install puppeteer --force');
      console.error('- Checking if Chromium was downloaded correctly');
    }
    
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
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
