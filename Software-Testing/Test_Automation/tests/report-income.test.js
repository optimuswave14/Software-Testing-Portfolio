
const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const {
  openReportsPage,
  getReportCard
} = require("./helpers/test-helpers");

async function testReportIncome() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    await openReportsPage(driver);

    const incomeCard = await getReportCard(driver, "Income");
    const incomeText = await incomeCard.getText();

    assert.ok(
      incomeText.includes("₹"),
      "Income amount is not displayed"
    );

    console.log("Income displayed:", incomeText);
    console.log("AT-20 PASSED: Income amount displayed successfully");

  } catch (error) {
    console.log("AT-20 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testReportIncome();
