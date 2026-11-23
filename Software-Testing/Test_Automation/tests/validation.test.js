
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testRequiredFieldValidation() {
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

    // Leave Title empty and enter an amount
    const title = await driver.findElement(By.name("title"));
    await title.clear();

    const amount = await driver.findElement(By.name("amount"));
    await amount.clear();
    await amount.sendKeys("100");

    // Try submitting the form
    await driver.findElement(
      By.css("form.panel button.primary")
    ).click();

    // Verify that the required validation is triggered
    const isTitleRequired = await driver.executeScript(
      "return arguments[0].validity.valueMissing;",
      title
    );

    assert.strictEqual(isTitleRequired, true);

    console.log(
      "AT-09 PASSED: Required-field validation works successfully"
    );

  } catch (error) {
    console.log("AT-09 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testRequiredFieldValidation();
