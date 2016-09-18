var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles={
 'articleone'={
    title: 'Article One',
    description: '1 Sep 2016',
    textContent:`
    <p>
             This is the first content.This is the first content.This is the first content. This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.
    </p>
    <p>
             This is the first content.This is the first content.This is the first content. This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.This is the first content.
    </p>
};
};

function CreateTemplate(data)
{

var title=data.title;
var description=data.description;
var content=data.textcontent;

var htmltemplate=`
<html>
  <head>
  <title>${title}</title> 
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link href="/ui/style.css" rel="stylesheet" />
  </head>
  <body>
     <div><a href='/articlesecond'>article second</a></div>
     <hr/>
     <div>${description}</div>
     <div>
         ${content}
     </div>
  </body>
  
<html>
`;
};

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:ArticleName',function(req,res)
{
    var articlename=req.params.ArticleName
    res.send(CreateTemplate(articlename));
});

app.get('/articlesecond',function(req,res)
{
    res.sendFile(path.join(__dirname, 'ui', 'articlesecond.html'));
});

app.get('/articlethree',function(req,res)
{
    res.send('This is article three');
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
