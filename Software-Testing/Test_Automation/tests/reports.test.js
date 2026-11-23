
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testReportsNavigation() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open Finance Tracker
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Find and click Reports
    const reportsTab = await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::button or self::a][normalize-space()='Reports']")
      ),
      10000
    );

    await reportsTab.click();
    console.log("Reports tab clicked");

    // Verify Reports page heading
    const heading = await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::h1 or self::h2][contains(normalize-space(.),'Report')]")
      ),
      10000
    );

    assert.strictEqual(await heading.isDisplayed(), true);

    console.log("AT-08 PASSED: Reports page opened successfully");

  } catch (error) {
    console.log("AT-08 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testReportsNavigation();
