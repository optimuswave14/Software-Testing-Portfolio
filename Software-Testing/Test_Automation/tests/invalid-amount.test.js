
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testInvalidAmount() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open Finance Tracker
    await driver.get("http://localhost:3001");

    // Navigate to Expenses
    const expensesTab = await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
      ),
      10000
    );
    await expensesTab.click();

    // Wait for the form
    await driver.wait(until.elementLocated(By.name("title")), 10000);

    // Enter transaction title
    await driver.findElement(By.name("title"))
      .sendKeys("Invalid Amount Test");

    // Enter invalid amount
    const amount = await driver.findElement(By.name("amount"));
    await amount.clear();
    await amount.sendKeys("0");

    // Try submitting the form
    await driver.findElement(
      By.css("form.panel button.primary")
    ).click();

    // Verify that the amount is below the minimum
    const isAmountInvalid = await driver.executeScript(
      "return arguments[0].validity.rangeUnderflow;",
      amount
    );

    assert.strictEqual(isAmountInvalid, true);

    console.log(
      "AT-10 PASSED: Invalid amount validation works successfully"
    );

  } catch (error) {
    console.log("AT-10 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testInvalidAmount();
