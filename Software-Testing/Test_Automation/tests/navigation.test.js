
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testNavigation() {

    let driver = await new Builder()
        .forBrowser("chrome")
        .build();

    try {

        // Step 1: Open Finance Tracker
        await driver.get("http://localhost:3001");

        console.log("Finance Tracker opened");

        // Step 2: Wait for Expenses button
        const expensesButton = await driver.wait(
            until.elementLocated(
                By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
            ),
            10000
        );

        // Step 3: Click Expenses
        await driver.wait(
            until.elementIsVisible(expensesButton),
            10000
        );

        await expensesButton.click();

        console.log("Expenses tab clicked");

        // Step 4: Wait for Income & Expenses heading
        const heading = await driver.wait(
            until.elementLocated(
                By.xpath("//*[self::h1 or self::h2][contains(normalize-space(.),'Income & Expenses')]")
            ),
            10000
        );

        // Step 5: Verify Expenses page
        assert.strictEqual(
            await heading.isDisplayed(),
            true
        );

        console.log("AT-02 PASSED: Expenses page opened successfully");

    } catch (error) {

        console.log("AT-02 FAILED:", error.message);
        process.exitCode = 1;

    } finally {

        await driver.quit();

    }
}

testNavigation();
