"use strict";

const { configure } = require('log4js');
const TemplateManager = require('../modules/templateManager.module');
const config = require('../config.json');

module.exports = {
    name:"templatemanager",
    logger : config.logger,
    actions:{
        create :{
            rest: {
                method: "POST",
                path: "/create"
            },
            async handler(ctx){
                let templateFileName = ctx.params.templateFileName;
                let templateContent = ctx.params.templateContent;
                let templateData = ctx.params.templateData;
                let outputSetting = ctx.params.outputSetting;
                const templateManager = new TemplateManager(templateFileName, templateContent, templateData, outputSetting);
                const res = await templateManager.Create();
                return res;
            }
        }
    }
}

//TEST
//Ok, Ok... This is not the best practice for testing, i know

//By Postman: localhost:3000/api/templatemanager/create?outputSetting={ "returnHtml" : true, "returnPdf" : false, "writeHtml" : true, "writePdf" : true, "fileName" : "dummy1" }&templateFileName=demo1.html&templateData={ "count": 666, "random": "Math.random()" }

/*
function  Dummy1(){
    const templateManager =  new TemplateManager('demo1.html', null, { count: 666, random:  Math.random()  }, {
        returnHtml : false,
        returnPdf : false,
        writeHtml : true,
        writePdf : true,
        fileName : 'dummy1' //without extension
    } );
    templateManager.Create().then((res)=>{
        console.log(res);
    });
}
Dummy1();


function Dummy2(){
    const templateManager =  new TemplateManager('demo2.html', null, { items: [{message: 'x1'}, {message: 'x2'}, {message: 'xn'}]  },{
        returnHtml : true,
        returnPdf : true,
        writeHtml : true,
        writePdf : true,
        fileName : '' //without extension
    });
    var res = templateManager.Create();
}
Dummy2();

*/