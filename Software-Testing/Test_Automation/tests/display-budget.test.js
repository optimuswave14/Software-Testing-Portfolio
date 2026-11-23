
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testDisplayBudget() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open Finance Tracker
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Navigate to Budgets
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
    ).click();

    // Wait for Budgets page
    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[normalize-space()='Monthly Budgets']")
      ),
      10000
    );

    // Read the current month from the form
    const monthField = await driver.findElement(
      By.xpath("//label[contains(.,'Month')]/input")
    );

    const month = await monthField.getAttribute("value");

    const budgetXPath =
      `//strong[normalize-space()='Food · ${month}']`;

    // Verify budget before refreshing
    await driver.wait(
      until.elementLocated(By.xpath(budgetXPath)),
      10000
    );

    console.log("Budget found before refresh");

    // Refresh the application
    await driver.navigate().refresh();

    // Wait for application to load again
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
      ),
      10000
    );

    // Navigate to Budgets again after refresh
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
    ).click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[normalize-space()='Monthly Budgets']")
      ),
      10000
    );

    // Verify saved budget is still displayed
    const budget = await driver.wait(
      until.elementLocated(By.xpath(budgetXPath)),
      10000
    );

    assert.strictEqual(await budget.isDisplayed(), true);

    console.log(
      "AT-12 PASSED: Saved budget displayed after refresh"
    );

  } catch (error) {
    console.log("AT-12 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testDisplayBudget();
