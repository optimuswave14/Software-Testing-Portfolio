
const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const {
  addTransaction,
  openBudgetsPage,
  getBudgetMonth,
  saveMonthlyBudget,
  getBudgetCard
} = require("./helpers/test-helpers");

async function testBudgetCalculation() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await addTransaction(driver, {
      title: "AT13 Budget Calculation Expense",
      amount: "250",
      category: "Food",
      type: "Expense",
      notes: "Testing budget calculation"
    });

    console.log("₹250 Food expense added");

    await openBudgetsPage(driver);

    const month = await getBudgetMonth(driver);

    await saveMonthlyBudget(driver, "Food", "100000");

    const budgetCard = await getBudgetCard(driver, "Food", month);
    const cardText = await budgetCard.getText();

    console.log("Budget details:", cardText);

    const spendingMatch = cardText.match(
      /₹([\d,]+\.\d{2}) spent of/
    );

    assert.ok(
      spendingMatch,
      "Budget spending amount was not displayed"
    );

    const spending = Number(
      spendingMatch[1].replace(/,/g, "")
    );

    assert.ok(
      spending >= 250,
      "Budget spending did not include the new expense"
    );

    console.log(
      "AT-13 PASSED: Expense included in budget calculation"
    );

  } catch (error) {
    console.log("AT-13 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testBudgetCalculation();
