
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function addTransaction(driver, title, amount, type) {
  // Navigate to Expenses
  await driver.findElement(
    By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
  ).click();

  await driver.wait(
    until.elementLocated(By.name("title")),
    10000
  );

  // Enter transaction details
  await driver.findElement(By.name("title")).sendKeys(title);
  await driver.findElement(By.name("amount")).sendKeys(amount);
  await driver.findElement(By.name("category")).sendKeys("Food");
  await driver.findElement(By.name("type")).sendKeys(type);

  // Submit transaction
  await driver.findElement(
    By.css("form.panel button.primary")
  ).click();

  // Verify transaction was added
  await driver.wait(
    until.elementLocated(
      By.xpath(`//td[normalize-space()='${title}']`)
    ),
    10000
  );
}

async function getBudgetSpending(driver, month) {
  const card = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//article[.//strong[normalize-space()='Food · ${month}']]`
      )
    ),
    10000
  );

  const text = await card.getText();

  // Extract the amount shown before "spent of"
  const match = text.match(/([\d,]+(?:\.\d{1,2})?)\s*spent of/);

  assert.ok(match, "Could not read budget spending amount");

  return Number(match[1].replace(/,/g, ""));
}

async function testExcludeIncome() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    console.log("Finance Tracker opened");

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

    // Get the current month
    const monthField = await driver.findElement(
      By.xpath("//label[contains(.,'Month')]/input")
    );

    const month = await monthField.getAttribute("value");

    // Create a new Food budget
    await driver.findElement(
      By.xpath("//label[contains(.,'Category')]/select")
    ).sendKeys("Food");

    const limit = await driver.findElement(
      By.xpath("//label[contains(.,'Budget limit')]/input")
    );

    await limit.clear();
    await limit.sendKeys("100000");

    await driver.findElement(
      By.xpath("//button[normalize-space()='Save budget']")
    ).click();

    // Verify budget appears
    await driver.wait(
      until.elementLocated(
        By.xpath(
          `//article[.//strong[normalize-space()='Food · ${month}']]`
        )
      ),
      10000
    );

    // Read spending before adding income
    const spendingBefore = await getBudgetSpending(driver, month);

    console.log("Spending before income:", spendingBefore);

    // Add income of ₹3000
    await addTransaction(
      driver,
      "AT14 Income Exclusion Test",
      "3000",
      "Income"
    );

    console.log("Income transaction added");

    // Navigate back to Budgets
    await driver.findElement(
      By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
    ).click();

    // Read spending after adding income
    const spendingAfter = await getBudgetSpending(driver, month);

    console.log("Spending after income:", spendingAfter);

    // Verify income did not increase spending
    assert.strictEqual(
      spendingAfter,
      spendingBefore,
      "Income was incorrectly included in budget spending"
    );

    console.log(
      "AT-14 PASSED: Income excluded from budget spending"
    );

  } catch (error) {
    console.log("AT-14 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testExcludeIncome();
