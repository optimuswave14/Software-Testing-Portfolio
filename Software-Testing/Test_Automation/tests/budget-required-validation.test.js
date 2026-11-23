
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testBudgetRequiredValidation() {
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

    // Locate the required budget limit field
    const limitField = await driver.findElement(
      By.xpath("//label[contains(.,'Budget limit')]/input")
    );

    // Ensure the field is empty
    await limitField.clear();

    // Attempt to submit without entering a budget limit
    const saveButton = await driver.findElement(
      By.xpath("//button[normalize-space()='Save budget']")
    );

    await saveButton.click();

    // Check HTML5 required-field validation
    const isValid = await limitField.getAttribute("validity");

    const validationMessage = await driver.executeScript(
      "return arguments[0].validationMessage;",
      limitField
    );

    const isInvalid = await driver.executeScript(
      "return arguments[0].validity.valueMissing;",
      limitField
    );

    assert.strictEqual(
      isInvalid,
      true,
      "Budget limit field should be required"
    );

    assert.ok(
      validationMessage.length > 0,
      "Expected a required-field validation message"
    );

    console.log("Validation message:", validationMessage);
    console.log("AT-17 PASSED: Empty budget limit is rejected");

  } catch (error) {
    console.log("AT-17 FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

testBudgetRequiredValidation();
