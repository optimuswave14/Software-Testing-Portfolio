
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testBudgetExceeded() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Open Expenses
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
    ).click();

    await driver.wait(until.elementLocated(By.name("title")), 10000);

    // Add an expense of ₹6000
    await driver.findElement(By.name("title"))
      .sendKeys("AT15 Budget Exceeded Expense");

    await driver.findElement(By.name("amount")).sendKeys("6000");

    await driver.findElement(By.name("category")).sendKeys("Food");

    await driver.findElement(By.name("type")).sendKeys("Expense");

    await driver.findElement(By.css("form.panel button.primary")).click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//td[normalize-space()='AT15 Budget Exceeded Expense']")
      ),
      10000
    );

    console.log("₹6000 expense added");

    // Open Budgets
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
    ).click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[normalize-space()='Monthly Budgets']")
      ),
      10000
    );

    // Read the current month
    const month = await driver.findElement(
      By.xpath("//label[contains(.,'Month')]/input")
    ).getAttribute("value");

    // Set Food budget to ₹5000
    await driver.findElement(
      By.xpath("//label[contains(.,'Category')]/select")
    ).sendKeys("Food");

    const limit = await driver.findElement(
      By.xpath("//label[contains(.,'Budget limit')]/input")
    );

    await limit.clear();
    await limit.sendKeys("5000");

    await driver.findElement(
      By.xpath("//button[normalize-space()='Save budget']")
    ).click();

    // Wait for the budget warning
    const warning = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//article[.//strong[normalize-space()='Food · ${month}']]//small[normalize-space()='Budget exceeded']`
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
