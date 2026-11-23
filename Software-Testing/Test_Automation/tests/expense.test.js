
const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const { addTransaction } = require("./helpers/test-helpers");

async function testAddExpense() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    const transaction = await addTransaction(driver, {
      title: "Selenium Test Expense",
      amount: "500",
      category: "Food",
      date: "2026-11-23",
      type: "expense",
      notes: "Added using Selenium automation"
    });

    assert.strictEqual(
      await transaction.isDisplayed(),
      true
    );

    console.log("AT-03 PASSED: Expense added successfully");

  } catch (error) {
    console.log("AT-03 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testAddExpense();
