import * as MyClasses from "./classes";
import GetEnvironmentVariable from "../utils/get-environment-variable";
import GetBoolean from "../utils/get-boolean";

export default (context, req) => {
    context.log("Staring up the Azure Function!");

    // only set this if using SSL and a self-signed certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = GetBoolean(GetEnvironmentVariable('USE_SSL')) ? GetBoolean(GetEnvironmentVariable('SELF_SIGNED_SSL')) ?
        0 : 1 : 1;

    // standard boilerplate stuff
    const query = req.query;                // dictionary of query strings
    const body = req.body;                  // Parsed body based on content-type
    const method = req.method;              // HTTP Method (GET, POST, PUT, etc.)
    const originalUrl = req.originalUrl;    // Original URL of the request - https://myapp.azurewebsites.net/api/foo?code=sc8Rj2a7J
    const headers = req.headers;            // dictionary of headers
    const params = req.params;              // dictionary of params from URL

    const getThePartyStarted = async () => {
        try {
            // create the instance of the class
            let action = new MyClasses[params.class](context, req);

            // call the function
            await action.start().then(response => {
                //context.log('initial response - ', response);
                if (response instanceof Error) {
                    context.log('error in response')
                    context.res = {
                        status: response ? response.status ? response.status : 500 : 500,
                        body: {
                            message: response ? response.message ? response.message : response : 'Unknown Error!',
                            stackTrace: response ? response.stack ? response.stack : response : ''
                        }
                    };
                } else {
                    context.res = {
                        status: response ? response.status ? response.status : 200 : 200,
                        body: response ? response.body ? response.body : response : { msg: 'ok' },
                        headers: {
                            'content-type': 'application/json'
                        }
                    };
                };
            }).then(res => {
                //context.log('final response - ', context.res);
                context.done();
            })
        } catch (e) {
            context.log.error(e);
            return e;
        };
    }
    
    getThePartyStarted();
}