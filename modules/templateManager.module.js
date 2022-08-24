const fs = require('fs').promises;
const fsSync = require('fs');
var html_to_pdf = require('html-pdf-node');
const config = require('../config.json');

const VueRender = require ('./vueRender');

let options = { format: 'A4' };
class TempateManager {
    templateFileName = ""; //file name from disk
    templateContent  = ""; // template from parameter
    templateData     = {}; //json data to fill template
    outFileName      = "";
    outOnlyFile      = false;

    constructor(templateFileName, templateContent, templateData, outFileName, outOnlyFile){
        
        if(templateFileName){
            for(const tp of config.templatePath ) {
                if(fsSync.existsSync(tp + templateFileName)) {
                    this.templateFileName = tp + templateFileName;
                    break;
                }
            }
        }
        this.templateContent  = templateContent;
        this.templateData     = templateData;
        this.outFileName      = config.outPath + outFileName;
        this.outOnlyFile      = !!outOnlyFile;
    }

    Create() {
try{
        this.GetTemplate()
        .then((template)=>{
            new VueRender().Render(template, this.templateData)
            .then((rendered)=>{

                let file = { content:  rendered  };
                html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
                    if(this.outFileName){
                        fs.writeFile(this.outFileName, pdfBuffer).then(()=>{
                        });
                    }
                });
                if(!this.outOnlyFile){
                    return rendered;
                }
            })
        })
    }
    catch(e){
        console.error(e);
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

module.exports = TempateManager;