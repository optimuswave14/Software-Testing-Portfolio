
const { By, until } = require("selenium-webdriver");

const APP_URL = "http://localhost:3001";

// Open the Expenses page
async function openExpensesPage(driver) {
  await driver.get(APP_URL);

  console.log("Finance Tracker opened");

  const expensesTab = await driver.wait(
    until.elementLocated(
      By.xpath("//*[self::button or self::a][normalize-space()='Expenses']")
    ),
    10000
  );

  await expensesTab.click();

  await driver.wait(
    until.elementLocated(By.name("title")),
    10000
  );
}

// Add an income or expense transaction
async function addTransaction(driver, details) {
  await openExpensesPage(driver);

  await driver.findElement(By.name("title"))
    .sendKeys(details.title);

  await driver.findElement(By.name("amount"))
    .sendKeys(details.amount);

  await driver.findElement(By.name("category"))
    .sendKeys(details.category);

  if (details.date) {
    const dateField = await driver.findElement(By.name("date"));
    await dateField.clear();
    await dateField.sendKeys(details.date);
  }

  await driver.findElement(By.name("type"))
    .sendKeys(details.type);

  await driver.findElement(By.name("notes"))
    .sendKeys(details.notes || "Added using Selenium automation");

  await driver.findElement(
    By.css("form.panel button.primary")
  ).click();

  const transaction = await driver.wait(
    until.elementLocated(
      By.xpath(`//td[normalize-space()=${JSON.stringify(details.title)}]`)
    ),
    10000
  );

  return transaction;
}

// Open the Budgets page
async function openBudgetsPage(driver) {
  await driver.findElement(
    By.xpath("//*[self::button or self::a][normalize-space()='Budgets']")
  ).click();

  await driver.wait(
    until.elementLocated(
      By.xpath("//h2[normalize-space()='Monthly Budgets']")
    ),
    10000
  );
}

// Read the currently selected budget month
async function getBudgetMonth(driver) {
  const monthField = await driver.findElement(
    By.xpath("//label[contains(.,'Month')]/input")
  );

  return await monthField.getAttribute("value");
}

// Save a budget
async function saveMonthlyBudget(driver, category, amount) {
  const categoryField = await driver.findElement(
    By.xpath("//label[contains(.,'Category')]/select")
  );

  await categoryField.sendKeys(category);

  const limitField = await driver.findElement(
    By.xpath("//label[contains(.,'Budget limit')]/input")
  );

  await limitField.clear();
  await limitField.sendKeys(String(amount));

  await driver.findElement(
    By.xpath("//button[normalize-space()='Save budget']")
  ).click();
}

// Find a budget card for a category and month
async function getBudgetCard(driver, category, month) {
  return await driver.wait(
    until.elementLocated(
      By.xpath(
        `//article[.//strong[normalize-space()=${JSON.stringify(`${category} · ${month}`)}]]`
      )
    ),
    10000
  );
}


async function getBudgetSpending(driver, category, month) {
  const card = await getBudgetCard(driver, category, month);
  const text = await card.getText();

  const match = text.match(/₹([\d,]+\.\d{2}) spent of/);

  if (!match) {
    throw new Error("Could not read budget spending amount");
  }

  return Number(match[1].replace(/,/g, ""));
}


// Open Reports page and wait for report data to load
async function openReportsPage(driver) {
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
}

// Find a report summary card
async function getReportCard(driver, label) {
  return await driver.findElement(
    By.xpath(`//article[.//span[normalize-space()=${JSON.stringify(label)}]]`)
  );
}

// Extract a numerical amount from report card text
function extractAmount(text) {
  const match = text.match(/-?[\d,]+(?:\.\d+)?/);

  if (!match) {
    throw new Error("Could not extract amount from: " + text);
  }

  return Number(match[0].replace(/,/g, ""));
}


module.exports = {
  openExpensesPage,
  addTransaction,
  openBudgetsPage,
  getBudgetMonth,
  saveMonthlyBudget,
  getBudgetCard,
  getBudgetSpending,
  openReportsPage,
  getReportCard,
  extractAmount
};
