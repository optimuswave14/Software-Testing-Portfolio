
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

function extractAmount(text) {
  const match = text.match(/-?[\d,]+(?:\.\d+)?/);

  assert.ok(match, "Could not extract amount from: " + text);

  return Number(match[0].replace(/,/g, ""));
}

async function testReportBalance() {
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

    const incomeCard = await driver.findElement(
      By.xpath("//article[.//span[normalize-space()='Income']]")
    );

    const expensesCard = await driver.findElement(
      By.xpath("//article[.//span[normalize-space()='Expenses']]")
    );

    const balanceCard = await driver.findElement(
      By.xpath("//article[.//span[normalize-space()='Net balance']]")
    );

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
