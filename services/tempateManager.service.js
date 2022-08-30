"use strict";

const TempateManager = require('../modules/templateManager.module');

module.exports = {
    name:"tempatemanager",
    actions:{
        async create(ctx){
            let templateFileName = ctx.params.templateFileName;
            let templateContent = ctx.params.templateContent;
            let templateData = ctx.params.templateData;
            let outputSetting = ctx.params.outputSetting;
            const tempateManager = new TempateManager(templateFileName, templateContent, templateData, outputSetting);
            const res = await tempateManager.Create();
            return res;
        }
    }
}

//TEST
//Ok, Ok... This is not the best practice for testing, i know
/*
function  Dummy1(){
    const tempateManager =  new TempateManager('demo1.html', null, { count: 666, random:  Math.random()  }, {
        returnHtml : false,
        returnPdf : false,
        writeHtml : false,
        writePdf : false,
        fileName : 'dummy1' //without extension
    } );
    tempateManager.Create().then((res)=>{
        console.log(res);
    });
}
Dummy1();
*/
/*
function Dummy2(){
    const tempateManager =  new TempateManager('demo2.html', null, { items: [{message: 'x1'}, {message: 'x2'}, {message: 'xn'}]  },{
        returnHtml : true,
        returnPdf : true,
        writeHtml : true,
        writePdf : true,
        fileName : '' //without extension
    });
    var res = tempateManager.Create();
}
Dummy2();
*/
