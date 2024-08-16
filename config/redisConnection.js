// using redis database 
const  { createClient } = require('redis');
const client=createClient();
const createConnection=async()=>{
    await client.connect();

}
const quitConnection=async()=>{
    await client.quit();

}

module.exports={createConnection,quitConnection,client};
