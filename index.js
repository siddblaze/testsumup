const axios = require('axios');
const qs = require('querystring');
const http = require('http');
const url = require('url');
const apiPath = "/api";
const client_id = "xaf30vJG2Vsj2LfRY5NhZx7l7mel";
const client_secret = "f0af09c5d54a0c5df964d1e49a3662b692ce4067059a27784e6fa2021f3dbb97";
const PORT = process.env.PORT || 5000;
const server = http.createServer(async (req, res) => {
    if (req.url === `${apiPath}/checkout` && req.method === "POST") {
        try{
            let receivedData;
        req.on("data", (arg) => {
            receivedData = JSON.parse(arg);
        });
        const reqtoken = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret
        });
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let token;

        axios.post('https://api.sumup.com/token', reqtoken, config)
            .then((result) => {
                // res.writeHead(200, { "Content-Type": "application/json" });
                //console.log(result.data);
                // res.write(JSON.stringify(result.data));
                token = result.data.access_token;
                // res.end();

            }).then((resp) => {
                const checkoutconfig = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };
                axios.post('https://api.sumup.com/v0.1/checkouts', receivedData, checkoutconfig)
                    .then((result) => {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        console.log(result.data);
                        res.write(JSON.stringify(result.data));
                        res.end();
                    }).catch((err) => {
                        res.writeHead(err.response.status, { "Content-Type": "application/json" });
                        console.log(err);
                        res.end(JSON.stringify(err.response.data));
                    });
            })
            .catch((err) => {
                res.writeHead(404, { "Content-Type": "application/json" });
                // console.log(err);
                res.end(JSON.stringify(err.response));
            });

        }catch(err){
            res.writeHead(500, { "Content-Type": "application/json" });
            // console.log(err);
            res.end(JSON.stringify({message:"Internal Server Error"}));
        }
        

    } else if (req.url === `${apiPath}/checkout` && req.method === "PUT") {
        try{
            let receivedData;
        req.on("data", (arg) => {
            receivedData = JSON.parse(arg);
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios.put(`https://api.sumup.com/v0.1/checkouts/${receivedData.id}`, receivedData, config)
            .then((result) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                console.log(result.data);
                res.write(JSON.stringify(result.data));
                res.end();
            }).catch((err) => {
                res.writeHead(404, { "Content-Type": "application/json" });
                // console.log(err);
                res.end(JSON.stringify(err.response.data));
            });
        });
        // const reqUrl = url.parse(req.url, true);
        // console.log(reqUrl);
        }catch(err){
            res.writeHead(500, { "Content-Type": "application/json" });
            // console.log(err);
            res.end(JSON.stringify({message:"Internal Server Error"}));
        }
        

    }else{
        res.writeHead(200,{"Content-Type": "application/json"});
        res.end(JSON.stringify({message:req.url}));
    }
    
});
server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});