# Azure Functions ES6 Boilerplate


This repo is intended to give you a standard way of using ES6 Javascript in conjunction with Azure Functions.  It uses Webpack and Babel to compile to ES5 and specifically targets node 6.5.0 and above.  It uses Async/Await, Classes and has some common utility methods that I use on a regular basis with Azure Functions.  In essence with the use of classes, you can effectively have multiple related sub-functions available within one Azure Function app.

Use cases might include:
  - Sub-functions that target Azure Table Storage, Queue Storage and Blob Storage but are grouped together in one Function app to allow for effective code management.
  - Sub-functions that include HTTP Triggers, WebHooks or Timers.  This repo includes an example HTTP Trigger and Timer Trigger sub-function.

In your Function's `local.settings.json` config, you can include the following settings that help with debugging locally via `azure-functions-core-tools`:
```
{
  "IsEncrypted": false,
  "Values": {
    "USE_SSL": true,
    "SELF_SIGNED_SSL": true
  }
}
```


#### Main Function
This function is an example HTTP Trigger function.  It uses `fetch` to get information from the Github API.  The ES6 version of the function starts with the following code:
```
import GetEnvironmentVariable from "../utils/get-environment-variable";
import GetBoolean from "../utils/get-boolean";

export default (context, req) => {
    // only set this if using SSL and a self-signed certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = GetBoolean(GetEnvironmentVariable('USE_SSL')) ? GetBoolean(GetEnvironmentVariable('SELF_SIGNED_SSL')) ?
        0 : 1 : 1;

    //do something else here
}
```

We use async/await to allow for asynchronus workflows within the code.  While the actual code in the repository is more extensive for this section, as basic overview of how we instantiate the classes would go something like this: 

```
import * as MyClasses from "./classes";

const getThePartyStarted = async () => {
    try {
        // create the instance of the class
        let action = new MyClasses[params.class](context, req);

        // call the function
        await action.start().then(response => {
            if (response instanceof Error) {
                context.log('error in response');
            } else {
                context.res = {
                    status: 200,
                    body: response
                }
            }
        }).then(res => {
            context.done();
        })
    } catch (e) {
        context.log.error(e);
        return e;
    };
}
    
getThePartyStarted();
```

The Function includes one class and it would basically look something like this:
```
export default class FirstClass {
    constructor(context) {
        this.context = context;         
    }

    async start() {
        try{
            this.context.log('logging stuff here');
            //do something else here and then return
        } catch (e){
            return e;
        }
    };
}

```

As before, the code in this repo is more extensive and uses `fetch` to return data from Github's API's.  the `start()` method calls another method to show how this is done.



#### Keep Warm Function
This function is called every 5 minutes and essentially is there to overcome the cold start issue that Azure Functions has.  It's code is as follows:
```
export default (context, myTimer) => {
    const timeStamp = new Date().toISOString();
    
    if(myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
    
    context.done();
};
```