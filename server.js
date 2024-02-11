let express = require('express');
let app = express();
//let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/',(req, res) =>{
    res.send('This is my API running...')
});

// app.get('/', function (req, res) {
//     return res.send({ error: true, message: 'user Web API' })
// });


let dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pagunplook',
});

dbConn.connect((err) => {
    if (err){
        console.log('error connect mySQL database = ',err)
        return;
    }
    console.log('my SQL connecting successfully');
});

app.get('/alluser', function (req, res) {
    dbConn.query('SELECT * FROM user', function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

///login
app.post('/login/', function(req, res) {
    let data = req.body;

    let name = data.user_name;
    let password = data.user_password;

    dbConn.query('SELECT * FROM user WHERE user_name = ? AND user_password = ?', [name,password], function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return res.json({user_id:results[0].user_id,user_name:results[0].user_name,user_email:results[0].user_email,user_password:results[0].user_password});
        } else {
            return res.status(400).send({ error: true, message: 'user id Not Found!!' });
        }
    });
});

//insert user /register

app.post('/user',function (req,res){
    var user = req.body
    if(!user){
        return res.status(400).send({error:true, message: 'Plase provide user'});
    }

    dbConn.query("INSERT INTO user SET ?" , user, function(error,results,fields){
        if(error) throw error;
        return res.send(results);

    });
});



//insert add myplants /register

app.post('/addmyplants',function (req,res){
    var myplants = req.body
    if(!myplants){
        return res.status(400).send({error:true, message: 'Plase provide myplants'});
    }

    dbConn.query("INSERT INTO my_plants SET ?" , myplants, function(error,results,fields){
        if(error) throw error;
        return res.send(results);

    });
});

//query myplants
app.get('/allmyplant/:id', function (req, res) {
    let user_id= req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query("SELECT * from my_plants INNER JOIN status ON my_plants.status_id = status.status_id WHERE my_plants.user_id = ?", user_id, function (error, results, fields) {
        if(error) throw error;
        return res.send(results);
        
    });
});


//query problem
app.get('/allproblem/:id', function (req, res) {
    let user_id= req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query("SELECT * from problem INNER JOIN problem_list ON problem.problem_id = problem_list.problem_id WHERE problem.user_id = ?", user_id, function (error, results, fields) {
        if(error) throw error;
        return res.send(results);
        
    });
});

//query profile
app.get('/profile/:id', function (req, res) {
    let user_id= req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query("SELECT * from user WHERE user_id = ?", user_id, function (error, results, fields) {
        if(error) throw error;
        return res.send(results);
        
    });
});

//update status
app.put('/status/:id',function(req,res){
    let plants_id = req.params.id;
    let my_plants = req.body
    if(!plants_id || !my_plants){
        return res.status(400).send({ error: true, message: 'Please provide user id and user data' }); 
    }

    dbConn.query('UPDATE my_plants SET ? WHERE plants_id = ?', [my_plants, plants_id], function(error, results, fields) {
        if (error) throw error;
        
        return res.send({ error: false, message: 'my_plants has been updated seccessfully' });
       
    });    
})

//delete problem
app.delete('/delproblem/:pb_id', function(req,res){
    let pb_id = req.params.pb_id;
    if (!pb_id) {
        return res.status(400).send({ error: true, message: 'Please provide pb_id' });
    }
    dbConn.query('DELETE FROM problem WHERE pb_id = ?', pb_id, function(error, results, fields) {
        if (error) throw error;
        
        return res.send({ error: false, message: 'user has been problem  seccessfully' });
       
    });    
})

//addProblem
app.post('/addproblem',function (req,res){
    var problem = req.body
    if(!problem){
        return res.status(400).send({error:true, message: 'Plase provide user'});
    }

    dbConn.query("INSERT INTO problem SET ?" , problem, function(error,results,fields){
        if(error) throw error;
        return res.send(results);

    });
});



//set port
app.listen(4000, function () {
    console.log('Node app is running on port 4000');

});

module.exports = app;


