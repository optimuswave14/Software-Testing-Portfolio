
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testReportMonthFilter() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Navigate to Reports
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Reports']")
    ).click();

    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[normalize-space()='Monthly Report']")
      ),
      10000
    );

    console.log("Reports page opened");

    // Locate month input
    const monthField = await driver.findElement(
      By.css("input[type='month']")
    );

    const originalMonth = await monthField.getAttribute("value");

    console.log("Original month:", originalMonth);

    // Calculate previous month
    const [year, month] = originalMonth.split("-").map(Number);

    const previousDate = new Date(year, month - 2, 1);

    const previousMonth =
      `${previousDate.getFullYear()}-${String(
        previousDate.getMonth() + 1
      ).padStart(2, "0")}`;

    console.log("Changing month to:", previousMonth);

    // Change month using JavaScript and trigger React onChange
    await driver.executeScript(`
      const input = arguments[0];
      const newValue = arguments[1];

      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      ).set;

      setter.call(input, newValue);

      input.dispatchEvent(
        new Event("input", { bubbles: true })
      );

      input.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    `, monthField, previousMonth);

    // Verify selected month
    await driver.wait(async () => {
      const value = await monthField.getAttribute("value");
      return value === previousMonth;
    }, 10000);

    console.log("Month successfully changed");

    // Wait for report loading to finish
    await driver.wait(async () => {
      const loading = await driver.findElements(
        By.xpath("//p[normalize-space()='Loading report...']")
      );

      return loading.length === 0;
    }, 15000);

    // Verify report content
    const stats = await driver.findElements(
      By.css(".stats")
    );

    const emptyMessage = await driver.findElements(
      By.xpath(
        "//p[normalize-space()='No expenses recorded for this month.']"
      )
    );

    assert.ok(
      stats.length > 0 || emptyMessage.length > 0,
      "Report content was not displayed after changing month"
    );

    // Final verification
    const finalMonth = await monthField.getAttribute("value");

    assert.strictEqual(
      finalMonth,
      previousMonth,
      "Selected month does not match expected month"
    );

    console.log("Original month:", originalMonth);
    console.log("Selected month:", finalMonth);

    console.log(
      "AT-23 PASSED: Monthly report month selection works"
    );

  } catch (error) {
    console.log("AT-23 FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

testReportMonthFilter();
