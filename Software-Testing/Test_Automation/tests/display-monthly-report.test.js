
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testDisplayMonthlyReport() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open Finance Tracker
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Navigate to Reports
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Reports']")
    ).click();

    // Wait for Monthly Report heading
    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[normalize-space()='Monthly Report']")
      ),
      10000
    );

    console.log("Monthly Report page opened");

    // Verify month selection field
    const monthField = await driver.findElement(
      By.css("input[type='month']")
    );

    assert.ok(
      await monthField.isDisplayed(),
      "Month selection field is not displayed"
    );

    const selectedMonth = await monthField.getAttribute("value");

    assert.ok(
      selectedMonth,
      "Current month is not selected"
    );

    console.log("Selected month:", selectedMonth);

    // Wait until report data is loaded
    await driver.wait(async () => {
      const loading = await driver.findElements(
        By.xpath("//p[normalize-space()='Loading report...']")
      );

      return loading.length === 0;
    }, 15000);

    // Verify report content
    const reportContent = await driver.wait(
      until.elementLocated(
        By.css(".stats")
      ),
      10000
    );

    assert.ok(
      await reportContent.isDisplayed(),
      "Monthly report statistics are not displayed"
    );

    // Verify Income, Expenses and Net balance
    const income = await driver.findElement(
      By.xpath("//article[.//span[normalize-space()='Income']]")
    );

    const expenses = await driver.findElement(
      By.xpath("//article[.//span[normalize-space()='Expenses']]")
    );

    const balance = await driver.findElement(
      By.xpath("//article[.//span[normalize-space()='Net balance']]")
    );

    assert.ok(await income.isDisplayed(), "Income is not displayed");
    assert.ok(await expenses.isDisplayed(), "Expenses are not displayed");
    assert.ok(await balance.isDisplayed(), "Net balance is not displayed");

    console.log("Income displayed:", await income.getText());
    console.log("Expenses displayed:", await expenses.getText());
    console.log("Net balance displayed:", await balance.getText());

    console.log(
      "AT-19 PASSED: Monthly report displayed successfully"
    );

  } catch (error) {
    console.log("AT-19 FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

testDisplayMonthlyReport();
