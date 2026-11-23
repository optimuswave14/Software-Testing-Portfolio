
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testAddExpense() {

    let driver = await new Builder()
        .forBrowser("chrome")
        .build();

    try {

        // Step 1: Open Finance Tracker
        await driver.get("http://localhost:3001");

        console.log("Finance Tracker opened");

        // Step 2: Navigate to Expenses
        const expensesTab = await driver.wait(
            until.elementLocated(
                By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
            ),
            10000
        );

        await expensesTab.click();

        // Step 3: Wait for Expenses form
        await driver.wait(
            until.elementLocated(By.name("title")),
            10000
        );

        // Step 4: Enter transaction title
        await driver.findElement(By.name("title"))
            .sendKeys("Selenium Test Expense");

        // Step 5: Enter amount
        await driver.findElement(By.name("amount"))
            .sendKeys("500");

        // Step 6: Select category
        const category = await driver.findElement(By.name("category"));
        await category.sendKeys("Food");

        // Step 7: Select date
        const date = await driver.findElement(By.name("date"));
        await date.clear();
        await date.sendKeys("2026-11-23");

        // Step 8: Select expense type
        const type = await driver.findElement(By.name("type"));
        await type.sendKeys("expense");

        // Step 9: Enter notes
        await driver.findElement(By.name("notes"))
            .sendKeys("Added using Selenium automation");

        // Step 10: Click Add transaction
        await driver.findElement(
            By.css("button.primary")
        ).click();

        // Step 11: Verify transaction appears
        const transaction = await driver.wait(
            until.elementLocated(
                By.xpath("//td[normalize-space()='Selenium Test Expense']")
            ),
            10000
        );

        assert.ok(await transaction.isDisplayed());

        console.log("AT-03 PASSED: Expense added successfully");

    } catch (error) {

        console.log("AT-03 FAILED:", error.message);
        process.exitCode = 1;

    } finally {

        await driver.quit();

    }
}

testAddExpense();
