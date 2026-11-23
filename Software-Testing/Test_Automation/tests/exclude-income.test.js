
const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const {
  addTransaction,
  openBudgetsPage,
  getBudgetMonth,
  saveMonthlyBudget,
  getBudgetSpending
} = require("./helpers/test-helpers");

async function testExcludeIncome() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Open Budgets
    await openBudgetsPage(driver);

    const month = await getBudgetMonth(driver);

    // Create a new Food budget
    await saveMonthlyBudget(driver, "Food", "100000");

    // Read spending before adding income
    const spendingBefore = await getBudgetSpending(
      driver,
      "Food",
      month
    );

    console.log("Spending before income:", spendingBefore);

    // Add income of ₹3000
    await addTransaction(driver, {
      title: "AT14 Income Exclusion Test",
      amount: "3000",
      category: "Food",
      type: "Income",
      notes: "Testing income exclusion from budget"
    });

    console.log("Income transaction added");

    // Navigate back to Budgets
    await openBudgetsPage(driver);

    // Read spending after adding income
    const spendingAfter = await getBudgetSpending(
      driver,
      "Food",
      month
    );

    console.log("Spending after income:", spendingAfter);

    // Verify income did not increase spending
    assert.strictEqual(
      spendingAfter,
      spendingBefore,
      "Income was incorrectly included in budget spending"
    );

    console.log(
      "AT-14 PASSED: Income excluded from budget spending"
    );

  } catch (error) {
    console.log("AT-14 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testExcludeIncome();
