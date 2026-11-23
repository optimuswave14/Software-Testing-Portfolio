
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testDeleteExpense() {
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

    // Find the expense to delete
    const deleteButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//tr[td[normalize-space()='Updated Selenium Expense']]//button[normalize-space()='Delete']"
        )
      ),
      10000
    );

    await deleteButton.click();
    console.log("Delete button clicked");

    // Accept the browser confirmation popup
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    await alert.accept();

    console.log("Delete confirmation accepted");

    // Verify that the transaction is removed
    await driver.wait(async () => {
      const rows = await driver.findElements(
        By.xpath("//td[normalize-space()='Updated Selenium Expense']")
      );
      return rows.length === 0;
    }, 10000);

    assert.strictEqual(
      (await driver.findElements(
        By.xpath("//td[normalize-space()='Updated Selenium Expense']")
      )).length,
      0
    );

    console.log("AT-06 PASSED: Expense deleted successfully");

  } catch (error) {
    console.log("AT-06 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testDeleteExpense();
