
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testReportExpenses() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Reports']")
    ).click();

    await driver.wait(
      until.elementLocated(By.css(".stats")),
      15000
    );

    await driver.wait(async () => {
      return (await driver.findElements(
        By.xpath("//p[normalize-space()='Loading report...']")
      )).length === 0;
    }, 15000);

    const expensesCard = await driver.findElement(
      By.xpath("//article[.//span[normalize-space()='Expenses']]")
    );

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
