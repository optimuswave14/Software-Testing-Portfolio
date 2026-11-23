
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

const {
  addTransaction,
  openBudgetsPage,
  getBudgetMonth,
  saveMonthlyBudget
} = require("./helpers/test-helpers");

async function testBudgetExceeded() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Add an expense of ₹6000
    await addTransaction(driver, {
      title: "AT15 Budget Exceeded Expense",
      amount: "6000",
      category: "Food",
      type: "Expense"
    });

    console.log("₹6000 expense added");

    // Open Budgets
    await openBudgetsPage(driver);

    const month = await getBudgetMonth(driver);

    // Set Food budget to ₹5000
    await saveMonthlyBudget(driver, "Food", "5000");

    // Verify budget exceeded warning
    const warning = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//article[.//strong[normalize-space()=${JSON.stringify(`Food · ${month}`)}]]//small[normalize-space()='Budget exceeded']`
        )
      ),
      10000
    );

    assert.strictEqual(
      await warning.getText(),
      "Budget exceeded"
    );

    console.log("AT-15 PASSED: Budget exceeded warning displayed");

  } catch (error) {
    console.log("AT-15 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testBudgetExceeded();
