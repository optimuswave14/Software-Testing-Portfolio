
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testDeleteBudget() {
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

    // Read the current month
    const month = await driver.findElement(
      By.xpath("//label[contains(.,'Month')]/input")
    ).getAttribute("value");

    // Create a budget specifically for this test
    await driver.findElement(
      By.xpath("//label[contains(.,'Category')]/select")
    ).sendKeys("Food");

    const limit = await driver.findElement(
      By.xpath("//label[contains(.,'Budget limit')]/input")
    );

    await limit.clear();
    await limit.sendKeys("75000");

    await driver.findElement(
      By.xpath("//button[normalize-space()='Save budget']")
    ).click();

    // Locate the Food budget for the current month
    const budgetCardXPath =
      `//article[.//strong[normalize-space()='Food · ${month}']]`;

    await driver.wait(
      until.elementLocated(By.xpath(budgetCardXPath)),
      10000
    );

    console.log("Food budget found");

    // Locate the Delete button inside that budget card
    const deleteButton = await driver.findElement(
      By.xpath(`${budgetCardXPath}//button[normalize-space()='Delete']`)
    );

    await deleteButton.click();

    // Wait until the budget card is removed
    await driver.wait(async () => {
      const cards = await driver.findElements(
        By.xpath(budgetCardXPath)
      );
      return cards.length === 0;
    }, 10000);

    // Verify that the budget no longer exists
    const remainingCards = await driver.findElements(
      By.xpath(budgetCardXPath)
    );

    assert.strictEqual(
      remainingCards.length,
      0,
      "Budget was not deleted"
    );

    console.log("AT-16 PASSED: Monthly budget deleted successfully");

  } catch (error) {
    console.log("AT-16 FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

testDeleteBudget();
