
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testReportCategory() {
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

    // Verify category heading
    const categoryHeading = await driver.findElement(
      By.xpath("//h3[normalize-space()='Expenses by category']")
    );

    assert.ok(
      await categoryHeading.isDisplayed(),
      "Expenses by category heading is not displayed"
    );

    // Check whether category rows or empty message are displayed
    const categoryRows = await driver.findElements(
      By.css(".category-row")
    );

    const emptyMessage = await driver.findElements(
      By.xpath("//p[normalize-space()='No expenses recorded for this month.']")
    );

    if (categoryRows.length > 0) {
      console.log("Categories found:", categoryRows.length);

      for (const row of categoryRows) {
        const rowText = await row.getText();

        assert.ok(
          rowText.trim().length > 0,
          "Category row is empty"
        );

        console.log("Category details:", rowText);
      }

      console.log(
        "AT-24 PASSED: Category-wise expenses displayed successfully"
      );

    } else {
      assert.ok(
        emptyMessage.length > 0,
        "Neither category rows nor empty-state message were displayed"
      );

      console.log(
        "AT-24 PASSED: Empty category report displayed correctly"
      );
    }

  } catch (error) {
    console.log("AT-24 FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

testReportCategory();
