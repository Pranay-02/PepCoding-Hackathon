const pup = require("puppeteer");

let id = "singhal.pranay@yahoo.com";
let pass = "123@4567";

// importing the files
let emailID = require("./temp1");
let message = require("./temp2");

let subject = "Automation Testing";

async function main() {
    //opening the browser using puppeteer
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
    });

    //signing in on the Yahoo Page
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto("https://login.yahoo.com/");
    await tab.waitForSelector("#login-username" , {visible : true});
    await tab.type("#login-username", id);
    await tab.click("#login-signin");
    await tab.waitForSelector("#login-passwd" , {visible : true});
    await tab.type("#login-passwd", pass);
    await tab.click("#login-signin");

    //extracting the Mail URL
    await tab.waitForSelector("#header-mail-button" , {visible : true});
    let mailButton = await tab.$$("#header-mail-button");
    let MailLink = await tab.evaluate(function(ele){
        return ele.getAttribute("href");
    },mailButton[0]);
    
    //composing emails for multiple users in multiple tabs
    for(let i = 0 ; i < emailID.length ; i++){
        await writeMail(MailLink, emailID[i] , await browser.newPage());
    }
  
}

//function for composing email
async function writeMail(url , id , tab){
    await tab.goto(url);
    await tab.waitForSelector(".e_dRA.it3_dRA" , {visible : true});
    await tab.click(".e_dRA.it3_dRA");
    await tab.waitForSelector(".input-to" , {visible : true});
    await tab.type(".input-to" , id);
    await tab.waitForSelector(".y_Z2hYGcu.N_fq7" , {visible : true});
    await tab.type(".y_Z2hYGcu.N_fq7" , subject);
    await tab.waitForSelector(".rte.em_N" , {visible : true});
    await tab.type(".rte.em_N" , message);
    await tab.click(".q_Z2aVTcY.e_dRA");
    await tab.waitForSelector(".C_Z2aVTcY.r_P" , {visible : true});
}

main();