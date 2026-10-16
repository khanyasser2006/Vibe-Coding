---
name: playwright-testing
description: End-to-end browser testing with Playwright. Spins up a real browser, navigates the UI, takes screenshots, and catches bugs before they ship. Use when asked to test a web app, verify UI behavior, check visual regressions, or validate user flows work correctly.
---

# Playwright Testing — See What You Ship

**Purpose:** Use Playwright to visually verify web applications by launching a real browser, interacting with the UI, and catching bugs before users do.

---

## Setup

### Install Playwright
```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

### Basic Config (`playwright.config.js`)
```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'on',
    video: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Core Testing Patterns

### 1. Page Navigation & Screenshot
```javascript
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Your App/);
  await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
});
```

### 2. Form Interaction
```javascript
test('login form works', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

### 3. Visual Regression Testing
```javascript
test('UI matches design', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    threshold: 0.2, // 20% pixel difference tolerance
  });
});
```

### 4. User Flow Testing
```javascript
test('complete booking flow', async ({ page }) => {
  // Step 1: Login
  await page.goto('/login');
  await page.fill('#email', 'patient@test.com');
  await page.fill('#password', 'pass123');
  await page.click('text=Login');
  
  // Step 2: Find doctor
  await page.click('text=Search Doctor');
  await page.waitForSelector('.doctor-card');
  
  // Step 3: Book appointment
  await page.click('.doctor-card >> text=Book');
  await page.click('.time-slot:first-child');
  await page.click('text=Confirm Booking');
  
  // Step 4: Verify confirmation
  await expect(page.locator('.success-message')).toBeVisible();
  await page.screenshot({ path: 'screenshots/booking-success.png' });
});
```

### 5. API + UI Combined Testing
```javascript
test('data loads from API', async ({ page }) => {
  // Intercept API calls
  await page.route('**/api/appointments', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, doctor: 'Dr. Test', date: '2026-07-15' }]),
    });
  });
  
  await page.goto('/appointments');
  await expect(page.locator('.appointment-card')).toHaveCount(1);
  await expect(page.locator('.appointment-card')).toContainText('Dr. Test');
});
```

---

## UI Audit with Playwright

### Check for Broken Images
```javascript
test('no broken images', async ({ page }) => {
  await page.goto('/');
  const images = await page.locator('img').all();
  
  for (const img of images) {
    const src = await img.getAttribute('src');
    const naturalWidth = await img.evaluate(el => el.naturalWidth);
    expect(naturalWidth, `Broken image: ${src}`).toBeGreaterThan(0);
  }
});
```

### Check Accessibility (Basic)
```javascript
test('basic accessibility', async ({ page }) => {
  await page.goto('/');
  
  // All images have alt text
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  expect(imagesWithoutAlt).toBe(0);
  
  // All buttons are accessible
  const buttonsWithoutLabel = await page.locator('button:not([aria-label]):not(:has-text(*))').count();
  expect(buttonsWithoutLabel).toBe(0);
});
```

### Check Console Errors
```javascript
test('no console errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  expect(errors).toHaveLength(0);
});
```

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/auth.spec.js

# Run with UI (visual debugger)
npx playwright test --ui

# Generate HTML report
npx playwright test --reporter=html
npx playwright show-report

# Screenshot a specific URL quickly
npx playwright screenshot --browser chromium http://localhost:5173 screenshot.png
```

---

## Quick Screenshot Without Tests
For immediate visual verification during development:

```javascript
// quick-screenshot.js
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'ui-check.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved: ui-check.png');
})();
```

Run: `node quick-screenshot.js`

---

## Application

When asked to test or verify UI:
1. **Install** Playwright if not present: `npm install --save-dev @playwright/test`
2. **Write tests** matching the user flow described
3. **Run** and capture screenshots automatically
4. **Report** any failures with the screenshot evidence
5. **Fix** issues found and re-test

**Source:** Based on [microsoft/playwright](https://github.com/microsoft/playwright) + Antigravity integration patterns
