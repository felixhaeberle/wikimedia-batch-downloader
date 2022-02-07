const path = require('path');
const downloadPath = path.resolve('./download');

process.on('message', async (url, browser)=> {
    console.log("CHILD: url received from parent process", url);
    await download(url, browser)
});

process.send('Executed');

async function download(url, browser) {
    const page = await browser.newPage();
    await page.goto(
        url, 
        { waitUntil: 'networkidle2' }
    );
    // Download logic goes here
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath 
    });
    await page.click('.internal ')
    // 
};
