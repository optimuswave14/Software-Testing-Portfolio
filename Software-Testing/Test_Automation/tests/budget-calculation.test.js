
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testBudgetCalculation() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open Finance Tracker
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Navigate to Expenses
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
    ).click();

    await driver.wait(
      until.elementLocated(By.name("title")),
      10000
    );

    // Add a Food expense of ₹250
    await driver.findElement(By.name("title"))
      .sendKeys("AT13 Budget Calculation Expense");

    await driver.findElement(By.name("amount"))
      .sendKeys("250");

    await driver.findElement(By.name("category"))
      .sendKeys("Food");

    await driver.findElement(By.name("type"))
      .sendKeys("Expense");

    await driver.findElement(By.name("notes"))
      .sendKeys("Testing budget calculation");

    await driver.findElement(
      By.css("form.panel button.primary")
    ).click();

    // Verify expense was added
    await driver.wait(
      until.elementLocated(
        By.xpath("//td[normalize-space()='AT13 Budget Calculation Expense']")
      ),
      10000
    );

    console.log("₹250 Food expense added");

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
    const monthField = await driver.findElement(
      By.xpath("//label[contains(.,'Month')]/input")
    );

    const month = await monthField.getAttribute("value");

    // Select Food category
    await driver.findElement(
      By.xpath("//label[contains(.,'Category')]/select")
    ).sendKeys("Food");

    // Enter budget limit
    const limit = await driver.findElement(
      By.xpath("//label[contains(.,'Budget limit')]/input")
    );

    await limit.clear();
    await limit.sendKeys("10000");

    // Save budget
    await driver.findElement(
      By.xpath("//button[normalize-space()='Save budget']")
    ).click();

    // Find the Food budget card
    const budgetCard = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//article[.//strong[normalize-space()='Food · ${month}']]`
        )
      ),
      10000
    );

    // Verify displayed spending
    const cardText = await budgetCard.getText();

    console.log("Budget details:", cardText);

    assert.ok(
      cardText.includes("250"),
      "Expected spending of ₹250 was not displayed"
    );

    console.log(
      "AT-13 PASSED: Expense calculated correctly in budget"
    );

  } catch (error) {
    console.log("AT-13 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testBudgetCalculation();
