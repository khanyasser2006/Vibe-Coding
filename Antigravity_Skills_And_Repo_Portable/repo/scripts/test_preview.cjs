const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const screenshotDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Scroll to flavors section
  await page.evaluate(() => {
    const el = document.getElementById('flavors');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, 'flavors_simplified.png') });
  console.log('Saved flavors_simplified.png');

  // 2. Click on the first flavor card
  const flavorCard = await page.locator('text=Peach Nectar Velvet').first();
  await flavorCard.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(screenshotDir, 'flavor_preview_top.png') });
  console.log('Saved flavor_preview_top.png');

  // 3. Scroll down inside the preview modal
  await page.evaluate(() => {
    const modal = document.querySelector('.z-\\[9999\\]');
    if (modal) modal.scrollTo(0, 300);
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, 'flavor_preview_bottom.png') });
  console.log('Saved flavor_preview_bottom.png');

  // 4. Click 'Back To Flavors'
  await page.click('button:has-text("Back To Flavors")');
  await page.waitForTimeout(400);

  // 5. Click on the second flavor (Tangerine Caramel Swirl)
  const secondFlavor = await page.locator('text=Tangerine Caramel Swirl').first();
  await secondFlavor.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, 'flavor_preview_tangerine.png') });
  console.log('Saved flavor_preview_tangerine.png');

  await browser.close();
  console.log('All Playwright verification completed successfully!');
})();
