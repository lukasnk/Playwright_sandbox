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

test.describe('Form submission tests', async () => {
    test('Form with correct data', async ({ page }) => {
        await page.goto('https://ultimateqa.com/complicated-page/');

        await page.locator('#et_pb_contact_name_1').waitFor({ state: 'visible' })
        await page.locator('#et_pb_contact_name_1').click()
        await page.fill('#et_pb_contact_name_1', 'John Doe');

        await page.locator('#et_pb_contact_email_1').click()
        await page.fill('#et_pb_contact_email_1', 'john.doe@example.com');

        await page.locator('#et_pb_contact_message_1').click()
        await page.fill('#et_pb_contact_message_1', 'This is a sample message.');

        const captchaQuestion = await page.textContent('.et_pb_contact_captcha_question >> nth=1');
        if (captchaQuestion) {
            const numbers = captchaQuestion.match(/\d+/g)?.map(Number);
            if (numbers) {
                const sum = numbers.reduce((a, b) => a + b, 0);
                await page.fill('.input.et_pb_contact_captcha >> nth=1', sum.toString());
            }
        }

        await page.click('.et_pb_contact_submit >> nth=1');

        await page.waitForSelector('.et-pb-contact-message p', {
            state: 'attached',
            timeout: 5000
        });

        const messageText = await page.textContent('.et-pb-contact-message p');
        expect(messageText).toContain('Thanks for contacting us');
    });

    test('submit form with missing Name field', async ({ page }) => {
        await page.goto('https://ultimateqa.com/complicated-page/');

        const emailField = page.locator('#et_pb_contact_email_1');
        await emailField.fill('john.doe@example.com');

        const messageField = page.locator('#et_pb_contact_message_1');
        await messageField.fill('This is a sample message.');

        const captchaQuestion = await page.textContent('.et_pb_contact_captcha_question >> nth=1');
        if (captchaQuestion) {
            const numbers = captchaQuestion.match(/\d+/g)?.map(Number);
            if (numbers && numbers.length === 2) {
                const sum = numbers[0] + numbers[1];
                await page.fill('.input.et_pb_contact_captcha >> nth=1', sum.toString());
            }
        }

        await page.click('.et_pb_contact_submit >> nth=1');

        await page.waitForSelector('.et-pb-contact-message p', {
            state: 'visible',
            timeout: 5000
        });
        const errorMessage = await page.textContent('.et-pb-contact-message p');
        expect(errorMessage).toContain('Please, fill in the following fields:');
        expect(await page.textContent('.et-pb-contact-message ul li')).toBe('Name');
    });
})