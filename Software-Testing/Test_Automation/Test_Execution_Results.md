# Test Execution Results

## 1. Introduction

This document presents the execution results of the Selenium automation test cases performed on the Finance Tracker application.

The application was tested to verify the functionality of its major modules, including application navigation, income and expense management, monthly budgets, and monthly reports.

Selenium WebDriver with JavaScript was used to automate the test cases. The tests were executed using Google Chrome, with the frontend and backend servers running locally.

## 2. Test Environment

| Parameter | Details |
|---|---|
| Application | Finance Tracker |
| Testing Type | Functional Testing and UI Automation |
| Automation Tool | Selenium WebDriver |
| Programming Language | JavaScript |
| Runtime Environment | Node.js |
| Browser | Google Chrome |
| Frontend | React.js |
| Backend | Node.js |
| Execution Method | Manual execution of automated test scripts |
| CI/CD | Not used |

## 3. Test Execution Summary

A total of 24 automation test cases were executed across the application modules. All 24 test cases passed successfully.

| Total Test Cases | Passed | Failed | Blocked | Pass Percentage |
|---:|---:|---:|---:|---:|
| 24 | 24 | 0 | 0 | 100% |

## 4. Detailed Test Execution Results

The detailed execution results are provided in the following table.

| Test ID | Test Case | Module | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| AT-01 | Open Finance Tracker | Application | Application opens successfully | Application opened successfully | Pass |
| AT-02 | Navigate to Expenses | Navigation | Expenses page is displayed | Expenses page displayed | Pass |
| AT-03 | Add Expense | Expenses | Expense is added successfully | Expense added successfully | Pass |
| AT-04 | Add Income | Expenses | Income is added successfully | Income added successfully | Pass |
| AT-05 | Edit Expense | Expenses | Expense details are updated | Expense updated successfully | Pass |
| AT-06 | Delete Expense | Expenses | Selected expense is deleted | Expense deleted successfully | Pass |
| AT-07 | Navigate to Budgets | Navigation | Budgets page is displayed | Budgets page displayed | Pass |
| AT-08 | Navigate to Reports | Navigation | Reports page is displayed | Reports page displayed | Pass |
| AT-09 | Required Field Validation | Expenses | Empty title should be rejected | Empty title rejected | Pass |
| AT-10 | Invalid Amount Validation | Expenses | Zero amount should be rejected | Zero amount rejected | Pass |
| AT-11 | Add Monthly Budget | Budgets | Budget should be saved | Budget saved successfully | Pass |
| AT-12 | Display Saved Budget After Refresh | Budgets | Saved budget should remain visible | Budget displayed after refresh | Pass |
| AT-13 | Calculate Expenses | Budgets | Budget spending should reflect expenses | Spending calculated successfully | Pass |
| AT-14 | Exclude Income from Spending | Budgets | Income should not increase budget spending | Income excluded from spending | Pass |
| AT-15 | Budget Exceeded Warning | Budgets | Warning should appear when spending exceeds budget | Warning displayed | Pass |
| AT-16 | Delete Monthly Budget | Budgets | Selected budget should be deleted | Budget deleted successfully | Pass |
| AT-17 | Budget Required Field Validation | Budgets | Empty budget limit should be rejected | Empty limit rejected | Pass |
| AT-18 | Invalid Budget Limit | Budgets | Zero budget limit should be rejected | Invalid limit rejected | Pass |
| AT-19 | Display Monthly Report | Reports | Monthly report details should be displayed | Report displayed successfully | Pass |
| AT-20 | Verify Income Display | Reports | Income amount should be displayed | Income displayed | Pass |
| AT-21 | Verify Expenses Display | Reports | Expenses amount should be displayed | Expenses displayed | Pass |
| AT-22 | Verify Net Balance Calculation | Reports | Balance should equal income minus expenses | Balance calculation verified | Pass |
| AT-23 | Verify Month Selection | Reports | Report should update when month changes | Month selection verified | Pass |
| AT-24 | Verify Expenses by Category | Reports | Category-wise expenses should be displayed | Category details verified | Pass |