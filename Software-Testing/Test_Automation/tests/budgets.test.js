
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testBudgetsNavigation() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open Finance Tracker
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Find and click Budgets
    const budgetsTab = await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
      ),
      10000
    );

    await budgetsTab.click();
    console.log("Budgets tab clicked");

    // Verify Budgets page is displayed
    const heading = await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::h1 or self::h2][contains(normalize-space(.),'Budget')]")
      ),
      10000
    );

    assert.strictEqual(await heading.isDisplayed(), true);

    console.log("AT-07 PASSED: Budgets page opened successfully");

  } catch (error) {
    console.log("AT-07 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testBudgetsNavigation();
