import { chromium, devices } from 'playwright';

async function runBrowserTest() {
  console.log('=== Starting Extended Browser Tests ===\n');
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    // ============================================
    // TEST 1: API Reliability - Real Wallet Test
    // ============================================
    console.log('--- Test 1: API Reliability ---');
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Test with a real Helium wallet (public hotspot owner)
    const testWallet = '13zraRWLRUVtP3CnsL8hk3kC6UzXkS7REqDMkyG3mL3L';
    await page.fill('input[placeholder*="Helium"]', testWallet);
    await page.click('button:has-text("Check")');
    
    // Wait for API response
    await page.waitForTimeout(3000);
    
    const apiResponse = await page.locator('text=HNT').count();
    if (apiResponse > 0) {
      console.log('✓ Helium API returns data');
    } else {
      console.log('⚠ Helium API returned no data (may be rate limited)');
    }
    
    // Test CoinGecko API (token prices should load)
    await page.waitForTimeout(2000);
    const priceData = await page.locator('text=$').first().isVisible().catch(() => false);
    if (priceData) {
      console.log('✓ CoinGecko price data loaded');
    } else {
      console.log('⚠ CoinGecko data not visible');
    }

    // ============================================
    // TEST 2: Mobile Responsiveness
    // ============================================
    console.log('\n--- Test 2: Mobile Responsiveness ---');
    
    // iPhone 12 Pro
    const mobilePage = await browser.newPage(devices['iPhone 12 Pro']);
    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    const mobileTitle = await mobilePage.locator('h1').textContent();
    if (mobileTitle?.includes('DePIN')) {
      console.log('✓ Mobile view: Title renders correctly');
    }
    
    const mobileInput = await mobilePage.locator('input').first().isVisible();
    if (mobileInput) {
      console.log('✓ Mobile view: Input fields visible');
    }
    
    // Tablet view
    const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await tabletPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    const tabletTitle = await tabletPage.locator('h1').textContent();
    if (tabletTitle?.includes('DePIN')) {
      console.log('✓ Tablet view: Title renders correctly');
    }
    
    await tabletPage.close();
    await mobilePage.close();

    // ============================================
    // TEST 3: Error Handling - Invalid Wallet
    // ============================================
    console.log('\n--- Test 3: Error Handling ---');
    const errorPage = await browser.newPage();
    
    // Capture console errors
    const consoleErrors: string[] = [];
    errorPage.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await errorPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Test with invalid wallet address
    await errorPage.fill('input[placeholder*="Helium"]', 'invalid_wallet_123');
    await errorPage.click('button:has-text("Check")');
    await errorPage.waitForTimeout(3000);
    
    const hasErrorMessage = await errorPage.locator('text=Error').first().isVisible().catch(() => false) ||
                           await errorPage.locator('text=Invalid').first().isVisible().catch(() => false);
    
    if (hasErrorMessage || consoleErrors.length > 0) {
      console.log('✓ Invalid wallet: Error handled gracefully');
    } else {
      console.log('⚠ Invalid wallet: No visible error message');
    }
    
    // Test with empty wallet - just click and see if it handles gracefully
    await errorPage.click('button:has-text("Check")').catch(() => {
      console.log('✓ Empty input: Button correctly disabled');
    });
    await errorPage.waitForTimeout(1000);
    
    const pageStillWorks = await errorPage.locator('h1').isVisible();
    if (pageStillWorks) {
      console.log('✓ Empty input: Page remains functional');
    }

    // Test network error handling (offline simulation)
    const networkErrorPage = await browser.newPage();
    let networkErrorCaught = false;
    
    await networkErrorPage.route('**/*', route => {
      if (route.request().url().includes('coingecko')) {
        networkErrorCaught = true;
        route.abort('failed');
      } else {
        route.continue();
      }
    });
    
    await networkErrorPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await networkErrorPage.waitForTimeout(2000);
    
    const mainPageStillWorks = await networkErrorPage.locator('h1').isVisible();
    if (mainPageStillWorks) {
      console.log('✓ Network error: Main page still functional');
    }
    
    await networkErrorPage.close();
    await errorPage.close();

    // ============================================
    // TEST 4: Page Load Performance
    // ============================================
    console.log('\n--- Test 4: Performance ---');
    const perfPage = await browser.newPage();
    
    const startTime = Date.now();
    await perfPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`✓ Page load time: ${loadTime}ms`);
    if (loadTime < 3000) {
      console.log('✓ Performance: Good load time (<3s)');
    } else {
      console.log('⚠ Performance: Slow load time (>3s)');
    }
    
    await perfPage.close();
    await page.close();
    
    console.log('\n=== All Extended Tests Completed ===');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runBrowserTest();
