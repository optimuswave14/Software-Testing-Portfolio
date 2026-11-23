
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testAddBudget() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

    // Navigate to Budgets
    const budgetsTab = await driver.wait(
      until.elementLocated(
        By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
      ),
      10000
    );

    await budgetsTab.click();

    // Wait for Budgets page
    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[normalize-space()='Monthly Budgets']")
      ),
      10000
    );

    // Read the default category and month
    const category = await driver.findElement(
      By.xpath("//label[contains(.,'Category')]/select")
    );

    const selectedCategory = await category.getAttribute("value");

    const monthField = await driver.findElement(
      By.xpath("//label[contains(.,'Month')]/input")
    );

    const selectedMonth = await monthField.getAttribute("value");

    console.log("Category:", selectedCategory);
    console.log("Month:", selectedMonth);

    // Enter budget limit
    const limit = await driver.findElement(
      By.xpath("//label[contains(.,'Budget limit')]/input")
    );

    await limit.clear();
    await limit.sendKeys("5000");

    // Save budget
    await driver.findElement(
      By.xpath("//button[normalize-space()='Save budget']")
    ).click();

    console.log("Save budget button clicked");

    // Wait for saved budget or application error
    const result = await driver.wait(async () => {
      const budget = await driver.findElements(
        By.xpath(
          `//strong[normalize-space()='${selectedCategory} · ${selectedMonth}']`
        )
      );

      const errors = await driver.findElements(
        By.css("p.error")
      );

      if (budget.length > 0) return "success";

      if (errors.length > 0) {
        const message = await errors[0].getText();
        if (message.trim()) return "error: " + message;
      }

      return false;
    }, 15000);

    if (result !== "success") {
      throw new Error(result);
    }

    assert.strictEqual(result, "success");

    console.log("AT-11 PASSED: Monthly budget added successfully");

  } catch (error) {
    console.log("AT-11 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testAddBudget();
