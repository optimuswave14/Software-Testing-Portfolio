
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function testApplication() {

    let driver = await new Builder()
        .forBrowser("chrome")
        .build();

    try {

        // Step 1: Open Finance Tracker
        await driver.get("http://localhost:3001");

        console.log("Finance Tracker opened");

        // Step 2: Find the visible application heading
        const heading = await driver.wait(
            until.elementLocated(
                By.xpath("//h1[contains(normalize-space(.), 'Finance Tracker')]")
            ),
            10000
        );

        // Step 3: Wait until heading becomes visible
        await driver.wait(
            until.elementIsVisible(heading),
            10000
        );

        // Step 4: Verify heading
        assert.strictEqual(await heading.isDisplayed(), true);

        console.log("AT-01 PASSED: Finance Tracker opened successfully");

    } catch (error) {

        console.log("AT-01 FAILED:", error.message);
        process.exitCode = 1;

    } finally {

        await driver.quit();

    }
}

testApplication();
