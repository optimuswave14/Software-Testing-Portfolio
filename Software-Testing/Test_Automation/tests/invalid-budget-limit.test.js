
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testInvalidBudgetLimit() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Navigate to Budgets
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
    ).click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[normalize-space()='Monthly Budgets']")
      ),
      10000
    );

    console.log("Budgets page opened");

    // Select Food category
    const categoryField = await driver.findElement(
      By.xpath("//label[contains(.,'Category')]/select")
    );

    await categoryField.sendKeys("Food");

    // Enter an invalid budget limit of zero
    const limitField = await driver.findElement(
      By.xpath("//label[contains(.,'Budget limit')]/input")
    );

    await limitField.clear();
    await limitField.sendKeys("0");

    // Verify the browser considers the value invalid
    const isValid = await driver.executeScript(
      "return arguments[0].validity.valid;",
      limitField
    );

    const rangeUnderflow = await driver.executeScript(
      "return arguments[0].validity.rangeUnderflow;",
      limitField
    );

    assert.strictEqual(
      rangeUnderflow,
      true,
      "Zero should be below the minimum budget limit"
    );

    assert.strictEqual(
      isValid,
      false,
      "Zero should not be a valid budget limit"
    );

    // Attempt to save the invalid budget
    await driver.findElement(
      By.xpath("//button[normalize-space()='Save budget']")
    ).click();

    // Verify that the invalid value remains in the form
    const enteredValue = await limitField.getAttribute("value");

    assert.strictEqual(
      enteredValue,
      "0",
      "Invalid budget value should remain in the form"
    );

    console.log("AT-18 PASSED: Zero budget limit rejected successfully");

  } catch (error) {
    console.log("AT-18 FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

testInvalidBudgetLimit();
