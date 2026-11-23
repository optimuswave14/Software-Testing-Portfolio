
const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const { addTransaction } = require("./helpers/test-helpers");

async function testAddIncome() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    const transaction = await addTransaction(driver, {
      title: "Selenium Test Income",
      amount: "5000",
      category: "Salary",
      type: "Income",
      notes: "Added using Selenium automation"
    });

    assert.strictEqual(
      await transaction.isDisplayed(),
      true
    );

    console.log("AT-04 PASSED: Income added successfully");

  } catch (error) {
    console.log("AT-04 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testAddIncome();
