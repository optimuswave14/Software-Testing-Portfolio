
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testAddIncome() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open Finance Tracker
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Navigate to Expenses page
    const expensesTab = await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
      ),
      10000
    );

    await expensesTab.click();

    // Wait for the transaction form
    await driver.wait(
      until.elementLocated(By.name("title")),
      10000
    );

    // Enter income details
    await driver.findElement(By.name("title"))
      .sendKeys("Selenium Test Income");

    await driver.findElement(By.name("amount"))
      .sendKeys("5000");

    // Select category
    const category = await driver.findElement(By.name("category"));
    await category.sendKeys("Salary");

    // Select Income as transaction type
    const type = await driver.findElement(By.name("type"));
    await type.sendKeys("Income");

    // Enter notes
    await driver.findElement(By.name("notes"))
      .sendKeys("Added using Selenium automation");

    // Submit the form
    await driver.findElement(
      By.css("form.panel button.primary")
    ).click();

    // Verify that the income appears in the transactions table
    const transaction = await driver.wait(
      until.elementLocated(
        By.xpath("//td[normalize-space()='Selenium Test Income']")
      ),
      10000
    );

    assert.strictEqual(await transaction.isDisplayed(), true);

    console.log("AT-04 PASSED: Income added successfully");

  } catch (error) {
    console.log("AT-04 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testAddIncome();
