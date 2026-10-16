const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const screenshotDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Initial Hero
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotDir, '01_hero_initial.png') });
  console.log('Saved 01_hero_initial.png');

  // 2. Scroll through Hero to test scrub
  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '02_hero_scrub.png') });
  console.log('Saved 02_hero_scrub.png');

  // 3. Scroll to Flavors
  await page.evaluate(() => {
    const el = document.getElementById('flavors');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '03_flavors_section.png') });
  console.log('Saved 03_flavors_section.png');

  // 4. Scroll to Alchemy (Second video scroll)
  await page.evaluate(() => {
    const el = document.getElementById('alchemy');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '04_alchemy_section.png') });
  console.log('Saved 04_alchemy_section.png');

  // 5. Scroll to Parallax Gallery
  await page.evaluate(() => {
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '05_parallax_gallery.png') });
  console.log('Saved 05_parallax_gallery.png');

  // 6. Scroll to Purity Ledger
  await page.evaluate(() => {
    const el = document.getElementById('purity');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '06_purity_ledger.png') });
  console.log('Saved 06_purity_ledger.png');

  // 7. Test Tasting Flight Drawer
  await page.click('button:has-text("Add Flight")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Tasting Box")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '07_flight_drawer.png') });
  console.log('Saved 07_flight_drawer.png');

  await browser.close();
  console.log('All visual verification screenshots captured!');
})();
