const shortid = require('short-id')
function routes(app, db){
    app.post('/upload', (req,res)=>{
        if(buffer && title){

        }else{
            res.status(400).json({"status":"Failed", "reason":"wrong input"})
        }
    })
}
module.exports = routes
