
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

const {
  openBudgetsPage,
  getBudgetMonth,
  saveMonthlyBudget,
  getBudgetCard
} = require("./helpers/test-helpers");

async function testDeleteBudget() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3001");
    await openBudgetsPage(driver);

    const month = await getBudgetMonth(driver);

    // Create a budget specifically for this test
    await saveMonthlyBudget(driver, "Food", "75000");

    // Locate the Food budget for the current month
    const budgetCard = await getBudgetCard(driver, "Food", month);

    console.log("Food budget found");

    // Locate the Delete button inside the budget card
    const deleteButton = await budgetCard.findElement(
      By.xpath(".//button[normalize-space()='Delete']")
    );

    await deleteButton.click();

    // Wait until the budget card is removed
    await driver.wait(async () => {
      const cards = await driver.findElements(
        By.xpath(
          `//article[.//strong[normalize-space()=${JSON.stringify(`Food · ${month}`)}]]`
        )
      );

      return cards.length === 0;
    }, 10000);

    // Verify that the budget no longer exists
    const remainingCards = await driver.findElements(
      By.xpath(
        `//article[.//strong[normalize-space()=${JSON.stringify(`Food · ${month}`)}]]`
      )
    );

    assert.strictEqual(
      remainingCards.length,
      0,
      "Budget was not deleted"
    );

    console.log("AT-16 PASSED: Monthly budget deleted successfully");

  } catch (error) {
    console.log("AT-16 FAILED:", error.message);
    process.exitCode = 1;

  } finally {
    await driver.quit();
  }
}

testDeleteBudget();
