const fork = require('child_process').fork;
const ls = fork("./child.js");
const puppeteer = require('puppeteer');
const symbols = require('./symbols');
const path = require('path');
const https = require('https');
const downloadPath = path.resolve('./download');
const fs = require('fs');

(async function () {
    await puppeteer.launch({
        headless: false
    }).then((browser) => {
        symbols.forEach(async (symbol) => {
            const page = await browser.newPage();
            await page.goto(
                symbol, 
                { waitUntil: 'networkidle2' }
            );
            // Download logic goes here
            await page._client.send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: downloadPath 
            });
            
            await page.click('.internal').then(() => {
                let url = page.url();
                const matches = /.*\.(jpg|png|svg|gif)$/.exec(url);
                if (matches && (matches.length === 2)) {
                    https.get(url, (response) => {
                        response.pipe(fs.createWriteStream(`${downloadPath}/${url.substring(url.lastIndexOf('/')+1)}`));
                    });
                }
            })
            // 
        })
    });
})()