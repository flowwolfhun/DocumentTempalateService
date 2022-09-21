const fs = require('fs').promises;
const fsSync = require('fs');
var html_to_pdf = require('html-pdf-node');
const path = require('path');
const config = require('../config.json');
const uuid = require('uuid');

const VueRender = require ('./vueRender');
const { resolve } = require('path');

const ModuleBase = require('./ModuleBase');

let options = { format: 'A4' };
class TemplateManager extends ModuleBase {
    templateFileName = ""; //file name from disk
    templateContent  = ""; // template from parameter
    templateData     = {}; //json data to fill template
    errorOnContructor = false;
    
    outputSetting      = {
        returnHtml : false,
        returnPdf : false,
        writeHtml : false,
        writePdf : false,
        fileName : '' //without extension
    };
    constructor(templateFileName, templateContent, templateData, outputSetting){
        super();
        if(templateFileName){
            for(const tp of config.templatePath ) {
                if(fsSync.existsSync(path.resolve( tp , templateFileName))) {
                    this.templateFileName = path.resolve( tp , templateFileName);
                    break;
                }
            }
        }
        this.templateContent  = templateContent;
        
        if(templateData){
            try{
                this.templateData = typeof templateData === 'string'? JSON.parse(templateData) :templateData;
            }
            catch(e){
                try{
                    let evalout = null;
                    eval('evalout = '+templateData);
                    this.templateData = evalout;
                }
                catch(ee){
                    this.errorOnContructor = true;
                }
            }
        }
        
        outputSetting = outputSetting || this.outputSetting;
        this.outputSetting = typeof outputSetting === 'string'? JSON.parse(outputSetting) : outputSetting ;
        if(this.outputSetting.writeHtml || this.outputSetting.writePdf){
            this.outputSetting.fileName = this.GetOutputFileName();
        }
        this.logger.debug("TemplateMangerModule initet");
    }

    GetOutputFileName(){        
        let filenameRequest = this.outputSetting.fileName || uuid.v1();
        if(config.renameIfFileExist){
            return path.resolve(config.outPath,filenameRequest);
        }
        let counter = 0;
        let availableFileName = '';
        while(!availableFileName){

            let postfix = counter>0?("_"+counter):'';

            if(!(fsSync.existsSync(path.resolve( config.outPath, filenameRequest )+postfix+".html") ||  
            fsSync.existsSync(path.resolve( config.outPath, filenameRequest )+postfix+".pdf"))){
                availableFileName = path.resolve( config.outPath, filenameRequest )+postfix;
            }
            else{
                counter++;
            }
        }
        return path.resolve(config.outPath,availableFileName);
    }

    Create() {
        if(this.errorOnContructor) return {result: "Error in process"};
        let anyProcess = this.outputSetting.returnHtml || this.outputSetting.returnPdf || this.outputSetting.writeHtml || this.outputSetting.writePdf;
        if(!anyProcess){
            const myPromise = new Promise((resolve, reject) => {
                resolve({result: "nothing to do"});
            });
            return myPromise;
        }
        try{
            const resultObject = {
                html : '',
                pdfBuffer : [],
                result: "ok",
                fileName: this.outputSetting.fileName
            }
            return this.GetTemplate()
            .then((template)=>{
                const data = this.templateData;
                return new VueRender().Render(template, data);
            }).then((rendered)=>{
                
                let file = { content:  rendered  };
                resultObject.html = this.outputSetting.returnHtml? rendered: '';
                if(this.outputSetting.writeHtml){
                    fs.writeFile(this.outputSetting.fileName+'.html', rendered);
                }
                
                if(this.outputSetting.returnPdf || this.outputSetting.writePdf){
                    return html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
                        if(this.outputSetting.writePdf){
                            fs.writeFile(this.outputSetting.fileName+'.pdf', pdfBuffer).then(()=>{

                            });
                        }
                        return pdfBuffer;
                    })
                }
                else{
                    return null;
                }
            })
            .then((pdfBuff)=>{
                if(this.outputSetting.returnPdf){
                    resultObject.pdfBuffer = [...pdfBuff];
                }
                return resultObject;
            })
            .catch((error) => {
                this.logger.error(error);
                const myPromise = new Promise((resolve, reject) => {
                    resolve({error: "Error in process"});
                });
                return myPromise;
            });
        }
        catch(e){
            this.logger.error(error);
            const myPromise = new Promise((resolve, reject) => {
                resolve({error: "Error in process"});
            });
            return myPromise;
        }
    }

    GetTemplate () {
        if(this.templateContent){
            const myPromise = new Promise((resolve, reject) => {
            resolve(this.templateContent);
          });
          return myPromise;
        }
        else{
            return fs.readFile(this.templateFileName)
            .then((data)=>{
                const myPromise = new Promise((resolve, reject) => {
                    resolve(data.toString());
                });
                return myPromise;
            });
        }
    }
}

module.exports = TemplateManager;