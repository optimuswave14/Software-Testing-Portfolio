
const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const {
  openReportsPage,
  getReportCard
} = require("./helpers/test-helpers");

async function testReportExpenses() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    await openReportsPage(driver);

    const expensesCard = await getReportCard(driver, "Expenses");
    const expensesText = await expensesCard.getText();

    assert.ok(
      expensesText.includes("₹"),
      "Expenses amount is not displayed"
    );

    console.log("Expenses displayed:", expensesText);
    console.log("AT-21 PASSED: Expenses amount displayed successfully");

  } catch (error) {
    console.log("AT-21 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testReportExpenses();
