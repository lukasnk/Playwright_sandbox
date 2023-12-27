import { test, expect } from '@playwright/test';

test.describe('Verification tests', async () => {

    test('Page smoke test verification', async ({page}) => {
        await page.goto('https://ultimateqa.com/simple-html-elements-for-automation/');
        await expect(page).toHaveURL('https://ultimateqa.com/simple-html-elements-for-automation/');

        const pageContent = page.locator('div.et_pb_text_inner h3');
        const requiredTexts = [
            "This section has really simple HTML elements so that you can understand their basic nature. Feel free to practice your test automation on these elements."
        ];

        await expect(pageContent).toHaveText(requiredTexts);
    });

    test('HTML Table with job titles, work types, and salaries', async ({ page }) => {
        const expectedData = [
            { title: 'Software Development Engineer in Test', work: 'Automation', salary: '$150,000+' },
            { title: 'Automation Testing Architect', work: 'Automation', salary: '$120,000+' },
            { title: 'Quality Assurance Engineer', work: 'Manual', salary: '$50,000+' }
        ];

        await page.goto('https://ultimateqa.com/simple-html-elements-for-automation/');

        await expect(page.locator(".et_pb_text_inner h2").nth(1)).toHaveText("HTML Table with no id");

        const tableSelector = '.et_pb_text_inner table';
        const secondTable = page.locator(tableSelector).nth(1);

        for (const [index, job] of expectedData.entries()) {
            const rowLocator = secondTable.locator('tbody tr').nth(index + 1); // +1 to skip header row
            await expect(rowLocator).toContainText(job.title, { timeout: 5000 });
            await expect(rowLocator).toContainText(job.work, { timeout: 5000 });
            await expect(rowLocator).toContainText(job.salary, { timeout: 5000 });
        }
    });
});