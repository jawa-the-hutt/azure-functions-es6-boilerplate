
export default class ObjectCleaner {
    constructor() {
        this.malformedJSON = this.malformedJSON.bind(this);
        
    }

    malformedJSON (value) {
        try{
            //setup new object to send back
            let returnObj = {};
            if (typeof value === 'object') {
                let objCount = 0;
                // wait until we've gone through all properties
                // at this level of the object
                while(objCount < Object.keys(value).length) {
                    for (let [k, v] of Object.entries(value)){
                        objCount++;
                        if (v){
                            // this might be a subobject so run
                            // it back through the function
                            returnObj[k] = this.malformedJSON(v);
                        }                
                    }
                }
                return returnObj;
            } else {
                // not an object, so test if it's a JSON string
                // if so, then it will return the parsed string
                // we do this so that we catch potential malformed 
                // JSON that has enclosed an object in quotes.
                try{
                    return JSON.parse(value);
                } catch (error) {
                    return value;
                }
            };
        } catch (error){
            return error;
        }
    }

    deleteSubObjectsByRule(obj, allowed) {

        try {
            return JSON.parse(JSON.stringify(obj), (k, v) => {

                // listing of rules that can be matched to values
                // in rulesArray.  Use this to predefine rules
                // you want run against the object
                let rules = {
                    '_info-Remove': k === '_info',
                    'removeEmpty': v === null 
                        || (Array.isArray(v) && v.length === 0) 
                        || (typeof v === 'object' && Object.keys(v).length === 0)
                        || v === ''
                }

                // filter the rules object to only rules found in the 'allowed' parameter
                rules = Object.keys(rules)
                    .filter(key => allowed.includes(key))
                    .reduce((o, key) => {
                        o[key] = rules[key];
                        return o;
                }, {});
               
                let rulesToRun = null;
                for (let [k, v] of Object.entries(rules)){
                    rulesToRun = rulesToRun + rules[k];
                };
                
                // delete the subObject that matches all the rules passed
                // into the 'allowed' parameter
                return (
                    rulesToRun
                ) ? undefined : v;
            });
        }catch(error) {
            return error;
        }
    }



}
