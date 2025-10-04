const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for background execution
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport size (desktop standard)
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2 // High resolution for better quality
  });
  
  console.log('Loading Notion page...');
  await page.goto('https://amondbabaro.notion.site/kimtaeeun', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });
  
  // Wait for page to fully load
  await page.waitForTimeout(3000);
  
  console.log('Scrolling through entire page (loading all content)...');
  
  // Auto-scroll to bottom to load lazy-loaded content
  await autoScroll(page);
  
  // Additional wait after scroll for databases and dynamic content
  await page.waitForTimeout(3000);
  
  console.log('Generating PDF...');
  
  // Get full page height
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  
  await page.pdf({
    path: 'notion-portfolio.pdf',
    width: '1920px',
    height: `${bodyHeight}px`, // Full height as single page
    printBackground: true,
    preferCSSPagedMedia: false
  });
  
  console.log('PDF generated successfully: notion-portfolio.pdf');
  
  await browser.close();
})();

// Auto-scroll function to load all lazy content
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
