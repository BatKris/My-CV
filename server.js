const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/generate-pdf', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto('http://127.0.0.1:5500', { waitUntil: 'networkidle0' });
        await page.addStyleTag({ content: 'main { width: auto;} .download { display: none}' });
        await page.addScriptTag({ content: "document.querySelectorAll('a').forEach(a => a.style.textDecoration = 'none')" });

        const pdf = await page.pdf({
            printBackground: true,
            format: 'A3',
            pageRanges: '1'
        });

        await browser.close();

        res.contentType("application/pdf");
        res.send(pdf);
    } catch (error) {
        console.error(error);
        res.status(500).send("Грешка при генериране на PDF");
    }
});

app.listen(3000, () => console.log('Сървърът работи на http://localhost:3000'));