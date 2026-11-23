
const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const {
  openReportsPage,
  getReportCard,
  extractAmount
} = require("./helpers/test-helpers");

async function testReportBalance() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    await openReportsPage(driver);

    const incomeCard = await getReportCard(driver, "Income");
    const expensesCard = await getReportCard(driver, "Expenses");
    const balanceCard = await getReportCard(driver, "Net balance");

    const income = extractAmount(await incomeCard.getText());
    const expenses = extractAmount(await expensesCard.getText());
    const balance = extractAmount(await balanceCard.getText());

    const expectedBalance = income - expenses;

    console.log("Income:", income);
    console.log("Expenses:", expenses);
    console.log("Displayed balance:", balance);
    console.log("Expected balance:", expectedBalance);

    assert.ok(
      Math.abs(balance - expectedBalance) < 0.01,
      "Net balance calculation is incorrect"
    );

    console.log("AT-22 PASSED: Net balance calculated correctly");

  } catch (error) {
    console.log("AT-22 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testReportBalance();
