import fetch from 'node-fetch';

export default class FirstClass {
    constructor(context) {
        this.context = context;         
    }

    async start() {
        try{
            let url = "https://api.github.com/users/github";
            return await this.myMethod(url).then(result => {
                //this.context.log('result - ', result);
                return {
                    status: 200,
                    body: result
                };   
            });
        } catch (e){
            return e;
        }
    };

    myMethod (url) {
        this.context.log('entering myMethod');
        return fetch(url).then(response => {
            if(response.ok) {
                this.context.log('response is OK!');
                return response.json();
            } else {
                this.context.log('error response - ', response.status);
                throw new Error (response.statusText);
            }
        }).then(json => {
            this.context.log('getting ready to return json object');
            return json; 
        }).catch(error => {
            throw error;
        });
    }
}
