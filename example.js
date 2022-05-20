const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://192.168.8.109:3000/pdf', {
        waitUntil: 'networkidle2',
    });
    await page.pdf({ path: 'badges.pdf', format: 'a4' });

    await browser.close();
})();