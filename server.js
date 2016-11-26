var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;

var config={
    user:'senthilkmu01',
    database:'senthilkmu01',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:'db-senthilkmu01-10667'
}

var app = express();
app.use(morgan('combined'));
var pool=new Pool(config);

app.get('/griddata/:rowsTodisplay/:pageno/:countryid',function(req,res)
{
  console.log(req.params.rowsTodisplay);

  pool.query("SELECT dinnersid,dinnername,address FROM dinners where countryid ="+req.params.countryid+" LIMIT "+req.params.rowsTodisplay+" offset "+req.params.pageno+";",function(err,result){
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
                res.send(JSON.stringify(result.rows));
            }
        }
        
    });
});

app.get('/griddata/:rowsTodisplay/:pageno',function(req,res)
{
  console.log(req.params.rowsTodisplay);

  pool.query("SELECT dinnersid,dinnername,address FROM dinners LIMIT "+req.params.rowsTodisplay+" offset "+req.params.pageno+";",function(err,result){
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
                res.send(JSON.stringify(result.rows));
            }
        }
        
    });
});

app.get('/loadchefs/:countryid',function(req,res)
{
  console.log("eq.params.countryid=>"+ req.params.countryid);
  pool.query("select * from chefs where countryid = "+req.params.countryid,function(err,result){
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
                res.send(JSON.stringify(result.rows));
            }
        }
  });
});

app.get('/loadcountries',function(req,res)
{
  pool.query("select countryid,countryname from countries order by countryname asc;",function(err,result){
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
                res.send(JSON.stringify(result.rows));
            }
        }
  });
});

app.get('/loadcharts',function(req,res)
{
  pool.query("select b.dinnersid,c.dinnername,count(a.mealsid)as count from meals a join dinnermeals b on (a.mealsid = b.mealsid) join dinners c on(c.dinnersid = b.dinnersid) group by b.dinnersid,c.dinnername ;",function(err,result){
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
                res.send(JSON.stringify(result.rows));
            }
        }
  });
});

app.get('/gridlistdata',function(req,res)
{
  
// pool.query("select dinnersid,dinnername,address FROM dinners",function(err,result){
//   pool.query("select a.dinnersid,a.dinnername,count(c.mealsid) as mealCountPerDinner, "
// +"json_agg(c.mealsname)  as mealsName, "
// + "json_agg(c.comments) as mealsComments,"
// +"json_agg(c.picture) as mealsPics "
//   +"from dinners a "
// +"JOIN dinnermeals b on(a.dinnersid = b.dinnersid) JOIN meals c on(b.mealsid = c.mealsid) group by a.dinnersid,a.dinnername "
// +";",function(err,result){
  
		pool.query(" with details as (select mealsname,comments,picture,mealsid from meals c)"
		+ "select a.dinnersid as dinnersid ,a.dinnername as dinnername,a.address as address, d.firstname as chefname, "
		+	"json_agg(c.*)   as dinners "
   // +	"json_agg(json_agg(c.*) as dinner) as dinners "
		+	"from dinners a "
		+	"JOIN dinnermeals b on(a.dinnersid = b.dinnersid) JOIN details c on(b.mealsid = c.mealsid) JOIN CHEFS d on(d.chefsid = a.chefsid) group by a.dinnersid,a.dinnername,d.firstname "
		+	";",function(err,result){
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
                res.send(JSON.stringify(result.rows));
            }
        }
        
    });
});

app.get('/griddata/:dinnerid',function(req,res)
{
  console.log( "dinnerid" + req.params.dinnerid);

//   pool.query("select a.dinnersid,a.dinnername,count(c.mealsid) as mealCountPerDinner, "
// +"string_agg(c.mealsname,'|')  as mealsName, "
// + "string_agg(c.comments,'|') as mealsComments,"
// +"string_agg(c.picture,'|') as mealsPics "
//   +"from dinners a "
// +"JOIN dinnermeals b on(a.dinnersid = b.dinnersid) JOIN meals c on(b.mealsid = c.mealsid) group by a.dinnersid,a.dinnername "
// +";",function(err,result){
var query = "select a.dinnersid,a.dinnername,count(c.mealsid) as mealCountPerDinner, "
+" string_agg(c.mealsname,'|')  as mealsName, "
+ "string_agg(c.comments,'|') as mealsComments,"
+"string_agg(c.picture,'|') as mealsPics "
  +"from dinners a "
+"JOIN dinnermeals b on(a.dinnersid = b.dinnersid) JOIN meals c on(b.mealsid = c.mealsid) where a.dinnersid ="+req.params.dinnerid+" group by a.dinnersid,a.dinnername ;"
console.log("quert: " + query); 
pool.query(query , function(err,result){
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
                      res.send(JSON.stringify(result.rows));
              
            }
        }
        
    });
});


var counter=0;
app.get('/counter',function(req,res)
{
    counter=counter+1;
    res.send(counter.toString());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

 app.get('/ui/POET.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'POET.css'));
});

app.get('/ui/bootstrap.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'bootstrap.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/themes/black-cab/loading.gif', function (req, res) {
  res.sendFile(path.join(__dirname, 'themes/black-cab/', 'loading.gif'));
});


app.get('/Pictures/Meals/:loadimage', function (req, res) {
  res.sendFile(path.join(__dirname,'/Pictures/Meals',req.params.loadimage));
});

app.get('/jqwidgets/styles/images/:jqwidgetsimage', function (req, res) {

  res.sendFile(path.join(__dirname,'/jqwidgets/styles/images',req.params.jqwidgetsimage));
});


app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

app.get('/jqwidgets/styles/jqx.base.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets/styles', 'jqx.base.css'));
});
app.get('/scripts/jquery-1.11.1.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'jquery-1.11.1.min.js'));
});
app.get('/scripts/demos.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'scripts', 'demos.js'));
});
app.get('/jqwidgets/jqxcore.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxcore.js'));
});
app.get('/jqwidgets/jqxlistmenu.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxlistmenu.js'));
});
app.get('/jqwidgets/jqxbuttons.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxbuttons.js'));
});
app.get('/jqwidgets/jqxDropDownList.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxDropDownList.js'));
});
app.get('/jqwidgets/jqxlistbox.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxlistbox.js'));
});
app.get('/jqwidgets/jqxcombobox.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxcombobox.js'));
});
app.get('/jqwidgets/jqxscrollbar.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxscrollbar.js'));
});

app.get('/jqwidgets/jqxdraw.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxdraw.js'));
});
app.get('/jqwidgets/jqxchart.core.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxchart.core.js'));
});
app.get('/jqwidgets/jqxdata.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxdata.js'));
});

app.get('/jqwidgets/jqxmenu.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxmenu.js'));
});
app.get('/jqwidgets/jqxgrid.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxgrid.js'));
});
app.get('/jqwidgets/jqxgrid.selection.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxgrid.selection.js'));
});
app.get('/jqwidgets/jqxgrid.filter.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxgrid.filter.js'));
});
app.get('/jqwidgets/jqxgrid.sort.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxgrid.sort.js'));
});
app.get('/jqwidgets/jqxnavbar.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxnavbar.js'));
});
app.get('/jqwidgets/jqxsplitter.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxsplitter.js'));
});	

app.get('/jqwidgets/jqxwindow.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxwindow.js'));
});	
app.get('/jqwidgets/jqxgrid.columnsresize.js', function (req, res) {
res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxgrid.columnsresize.js'));
});	
app.get('/jqwidgets/jqxdata.js', function (req, res) {
res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxdata.js'));
});
app.get('/jqwidgets/jqxdata.export.js', function (req, res) {
res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxdata.export.js'));
});
app.get('/jqwidgets/jqxgrid.export.js', function (req, res) {
res.sendFile(path.join(__dirname, 'jqwidgets', 'jqxgrid.export.js'));
});



var port = 7001; // Use 8080 for local development because you might already have apache running on 80
app.listen(7001, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
