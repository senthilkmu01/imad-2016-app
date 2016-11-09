var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;

var app = express();
app.use(morgan('combined'));

var config={
    user:'senthilkmu01',
    database:'senthilkmu01',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
}

var articles={
 'articleone':{
    title: 'Article One',
    description: '1 Sep 2016',
    textContent:`
    <p>
             This is the first content.This is the first content.This is the first content. This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.
    </p>
    <p>
             This is the first content.This is the first content.This is the first content. This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.
    </p>`
}

};


function CreateTemplate(data)
{

var title=data.title;
var description=data.description;
var content=data.textContent;

var htmltemplate=`
<html>
<head>${title}</head>
<body>
<div>${description}</div>
<div>${content}</div>
<body>
</html>
`
return htmltemplate;
}

var counter=0;
app.get('/counter',function(req,res)
{
    counter=counter+1;
    res.send(counter.toString());
});

var pool=new Pool(config);
app.get('/testdb',function(req,res){
    pool.query("SELECT * FROM User",function(err,result){
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            res.send(JSON.stringify(result.rows));
        }
        
    });
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:ArticleName',function(req,res)
{
    var articlename=req.params.ArticleName
     pool.query("SELECT * FROM User WHERE UserName='"+req.params.ArticleName+"'",function(err,result){
        if(err)
        {
            res.status(500).send(err.toString());
        }
        else
        {
            if(result.rows.length===0)
            {
                res.status(400).send('No records found');
            }
            else
            {
                var datalist=result.rows[0];
                res.send(CreateTemplate(datalist));
            }
        }
        
    });
    //res.send(CreateTemplate(articles[articlename]));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
