
class BuiltInFunctions {
    constructor(){

    }

    TestFunc(input){
        return input + ' testFunced'
    }

    toFixed(input, fix){
        return parseFloat(input).toFixed(fix);
    }
    formatHourMinute(input){
        if(input.trim().length === 4){
             input = input.substring(0, 2)+":"+input.substring(2);
        }
        return input ;
    }
}

module.exports = BuiltInFunctions;