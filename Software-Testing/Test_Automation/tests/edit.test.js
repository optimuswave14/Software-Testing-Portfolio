
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testEditExpense() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open Finance Tracker
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Navigate to Expenses
    const expensesTab = await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
      ),
      10000
    );

    await expensesTab.click();

    // Find the existing test expense
    const editButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//tr[td[normalize-space()='Selenium Test Expense']]//button[normalize-space()='Edit']"
        )
      ),
      10000
    );

    await editButton.click();
    console.log("Edit button clicked");

    // Wait for the form
    const titleField = await driver.wait(
      until.elementLocated(By.name("title")),
      10000
    );

    // Change the title
    await titleField.clear();
    await titleField.sendKeys("Updated Selenium Expense");

    // Change the amount
    const amountField = await driver.findElement(By.name("amount"));
    await amountField.clear();
    await amountField.sendKeys("750");

    // Submit updated transaction
    await driver.findElement(
      By.xpath("//button[normalize-space()='Update transaction']")
    ).click();

    // Verify updated transaction
    const updatedTransaction = await driver.wait(
      until.elementLocated(
        By.xpath("//td[normalize-space()='Updated Selenium Expense']")
      ),
      10000
    );

    assert.strictEqual(await updatedTransaction.isDisplayed(), true);

    console.log("AT-05 PASSED: Transaction edited successfully");

  } catch (error) {
    console.log("AT-05 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testEditExpense();
