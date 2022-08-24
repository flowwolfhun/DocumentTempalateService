"use strict";

const TempateManager = require('../modules/templateManager.module');

module.exports = {
    name:"tempatemanager",
    actions:{
        create(ctx){
            let templateFileName = ctx.params.templateFileName;
            let templateContent = ctx.params.templateContent;
            let templateData = ctx.params.templateData;
            let outFileName = ctx.params.outFileName;
            let outOnlyFile = ctx.params.outOnlyFile;
            const tempateManager = new TempateManager(templateFileName, templateContent, templateData, outFileName, outOnlyFile);
            tempateManager.Create();
        }
    }
}

//TEST
function Dummy1(){
    const tempateManager =  new TempateManager('demo1.html', null, { count: 666, random:  Math.random()  }, 'demoOut1.pdf', false);
    tempateManager.Create();
}
Dummy1();

function Dummy2(){
    const tempateManager =  new TempateManager('demo2.html', null, { items: [{message: 'x1'}, {message: 'x2'}, {message: 'xn'}]  }, 'demoOut2.pdf', false);
    tempateManager.Create();
}
Dummy2();

