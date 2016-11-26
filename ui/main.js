
        var pagesize = 0;
        var rows = 5; 
        var serverurlpath='http://localhost:7001/';
        var p = 0;

       $(document).ready(function () {
            var win = $(window);
            loadCountries();
            loadChefCustomerGrid();
            loadChefs();
             $("#selectedDinner").val(0);
            loadDinnerMenu();   
            loadCharts1(); 

            $('#chartContainer').jqxChart({});
         //    moveit();  //Move images in Circle

        //  //window loading
        //     $("#jqxwindow").jqxWindow({
        //     height: '100px',
        //     width: '200px',
        //     showCloseButton: false,
        //     //theme: 'energyblue',
        //     autoOpen: true
        //     });
            $("#jqxListBox").jqxListBox({ autoHeight:false,filterable: true, theme:'POET'});
            $('#mainSplitter').jqxSplitter({ width: 1000, height: 480,theme:'POET', panels: [{ size: 300 },{size: 600}] });
              
    
            $("#jqxNavBar").jqxNavBar({ columns: ['33%', '33%', '33%'], height: 50, selectedItem: 0 });
            $("#page2").hide();
            $("#page3").hide();

            randomPost(pagesize);
            $("#excelExport").jqxButton();
            $("#xmlExport").jqxButton();
            $("#csvExport").jqxButton();
            $("#tsvExport").jqxButton();
            $("#htmlExport").jqxButton();
            $("#jsonExport").jqxButton();
            $("#pdfExport").jqxButton();
            $("#excelExport").click(function () {
                $("#jqxChefMealsGrid").jqxGrid('exportdata', 'xls', 'jqxChefMealsGrid',true, null, true);           
            });
            $("#xmlExport").click(function () {
                $("#jqxChefMealsGrid").jqxGrid('exportdata', 'xml', 'jqxChefMealsGrid',true, null, true);
            });
            $("#csvExport").click(function () {
                $("#jqxChefMealsGrid").jqxGrid('exportdata', 'csv', 'jqxChefMealsGrid',true, null, true);
            });
            $("#tsvExport").click(function () {
                $("#jqxChefMealsGrid").jqxGrid('exportdata', 'tsv', 'jqxChefMealsGrid',true, null, true);
            });
            $("#htmlExport").click(function () {
                $("#jqxChefMealsGrid").jqxGrid('exportdata', 'html', 'jqxChefMealsGrid',true, null, true);
            });
            $("#jsonExport").click(function () {
                $("#jqxChefMealsGrid").jqxGrid('exportdata', 'json', 'jqxChefMealsGrid',true, null, true);
            });
            $("#pdfExport").click(function () {
                $("#jqxChefMealsGrid").jqxGrid('exportdata', 'pdf', 'jqxChefMealsGrid',true, null, true);
            });
           
            // Each time the user scrolls
           $('.testscroll').scroll(function () {
                if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                    pagesize += 1;
                    $('#loading').show();
                    randomPost(pagesize);
                    $('#loading').hide();
                }
            });
        
            $('#jqxListBox').on('change', function (event) {
            var args = event.args;
            if (args) {
            // index represents the item's index.                          
            var index = args.index;
            var item = args.item;
            // get item's label and value.
            var label = item.label;
            var value = item.value;
            console.log("Dinner name from label: " + label);
            $("#panel2").val("");
            $("#selectedDinner").val(value);
            loadDinnerMenu();
            }
            });

        $("#jqxNavBar").on('change', function () {
        console.log('selection is changed.');
        var selectedItem = $('#jqxNavBar').jqxNavBar('selectedItem');
        if(selectedItem == 0)
        {
        console.log('selection is changed = > 0');
        $("#jqxNavBar").jqxNavBar({ selectedItem: 0 });
        $("#page1").show();
        $("#page2").hide();
        $("#page3").hide();
        }
        else if(selectedItem == 1){
        console.log('selection is changed = > 1');
        $("#jqxNavBar").jqxNavBar({ selectedItem: 1 });

        $("#page1").hide();
         $("#page2").show();
         $("#page3").hide();
         loadChefCustomerGrid();
        }
        else if(selectedItem == 2){
        console.log('selection is changed = > 2');
        $("#jqxNavBar").jqxNavBar({ selectedItem: 2 });
         $("#page1").hide();
         $("#page2").hide();
         $("#page3").show();
          loadCharts1();
        }
        });
            
       });//Ready ends


        function loadChefs()
        {
            obj = $.ajax({
                    type: 'get',
                    // contentType ('application/x-www-form-urlencoded; charset=UTF-8'),
                    url: serverurlpath+"loadchefs",
                    datatype:JSON,
                    cache: false,
                    async : true,
                    error : function(xhr) {
			        console.log("ERROR while doing loadChefs");
			    }
            });
           
            obj.done(function(data){
                 var dataEdited = []; var chefPic= "";
                    dataEdited  =  JSON.parse(data);
                    var sourcei=0; var count = 1;
                    var source=new Array();
                    $.each(dataEdited,function(key, value) {
                        var chefsid=value["chefsid"].toString();
                        var chefsname=value["firstname"].toString() +" " + value["lastname"].toString();
                        var chefspic="person"+count+".jpg";
                        chefPic = chefspic;
                        source[sourcei] = { chefsid:chefsid,chefsname:chefsname,chefspic:chefspic };
                        sourcei=sourcei+1;
                        count++;
                   });
                    
                    var dataAdapter = new $.jqx.dataAdapter(source);
            
                    $('#jqxChef').jqxComboBox({ selectedIndex: -1,theme:'POET', placeHolder:"Select Chef..", source: dataAdapter, displayMember: "chefsname", valueMember: "chefsid", itemHeight: 70, height: 25, width: 270,
                        renderer: function (index, label, value) {
                            var datarecord = source[index];
                            var imgurl = '/Pictures/Meals/'+chefPic;
                            var img = '<img height="50" width="45" src="' + imgurl + '"/>';
                            var table = '<table style="min-width: 150px;"><tr><td style="width: 55px;" rowspan="2">' + img + '</td><td>' + datarecord.chefsname + '</td></tr><tr><td>' + datarecord.chefsid + '</td></tr></table>';
                            return table;
                        }
                    });
                });   
        }


         function loadCharts1()
        {
            obj = $.ajax({
                    type: 'get',
                    // contentType ('application/x-www-form-urlencoded; charset=UTF-8'),
                    url: serverurlpath+"loadcharts",
                    datatype:JSON,
                    cache: false,
                    async : true,
                    error : function(xhr) {
			        console.log("ERROR while doing loadCharts");
			    }
            });
           
            obj.done(function(data){
            console.log("loaded charts");
            var jsonString = JSON.stringify(data);
            var parseData = JSON.parse(jsonString);
            console.log("parseData >>>"+ parseData);
                 // prepare chart data
            var source =
                {
                    datafields: [
                        { name: 'dinnersid',  datafield: 'dinnersid', type: 'string'},
                        { name: 'dinnername',  datafield: 'dinnername', type: 'string' },
                        { name: 'count', type: 'string' , datafield: 'count'}
                    ],
                    datatype: 'json',
                    localdata: data,
                    async:false
                };     

           
            var dataAdapter = new $.jqx.dataAdapter(source, { async: false, autoBind: true, loadError: function (xhr, status, error) { alert('Error loading "' + source.url + '" : ' + error);} });
            // prepare jqxChart settings
            var settings = {
                title: "Maximum meals per Dinner",
                description: "Statistics for 2016",
                showLegend: true,
                enableAnimations: true,
                padding: { left: 5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: dataAdapter,
                xAxis:
                {
                    dataField: 'dinnername',
                    gridLines: { visible: true },
                    flip: false
                  
                },
                 valueAxis:
                                    {
                                        flip: true,
                                        unitInterval: 2,
                                        minValue: 0,
                                        maxValue: 10,
                                        displayValueAxis: true,
                                        //orientation: 'vertical',
                                        horizontalTextAlignment: 'right' ,
                                        labels: {
                                            visible: true                                                                                  
                                        }
                                    },
                colorScheme: 'scheme01',
                seriesGroups:
                    [
                        {
                            type: 'column',
                            labels: { horizontalAlignment: 'left' },
                            columnsGapPercent: 55,
                           valueAxis: { horizontalAlignment: 'left', unitInterval: 2,
                                        minValue: 0,
                                        maxValue: 10, },
                           // toolTipFormatSettings: { thousandsSeparator: ',' },
                            series: [
                                    { dataField: 'count', displayText: 'Meals count' }
                                ]
                        }
                    ]
            };
            // setup the chart
            $('#chartContainer').jqxChart(settings);
              
                });   
        }



        function loadCountries()
        {
            var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'countryname' },
                        { name: 'countryid' }
                    ],
                    url: serverurlpath+"loadcountries",
                    async: true
                };
                
                var dataAdapter = new $.jqx.dataAdapter(source);
                $("#jqxCountry").jqxDropDownList({
                    selectedIndex: -1, source: dataAdapter, theme:'POET',displayMember: "countryname", valueMember: "countryid", width: 200, height: 25
                });

               

        }

        function loadDinnerMenu()
        {    
            var obj = new $.Deferred();
            var stringURL = "";
            stringURL = "http://localhost:7001/griddata/";
            var selectedDinnerId = $("#selectedDinner").val();
            stringURL += ""+selectedDinnerId;
            console.log("stringURL = >" + stringURL);
            obj = $.ajax({
            type: 'get',
           // contentType ('application/x-www-form-urlencoded; charset=UTF-8'),
            url: stringURL,
            datatype:JSON,
            cache: false,
            async : true,
            error : function(xhr) {
			console.log("ERROR while doing loadDinnerMenu(pagesize)");
			}
        });

             obj.done(function(data){
                console.log("Data returns = >" + JSON.stringify(data));  
                
                var dataEdited = [];
                dataEdited  =  JSON.parse(data);
                $("#panel2").html("");
               
                $.each(dataEdited,function(key,value) {
                console.log("Object details " + value["mealsname"] + "mealsComments " + value["mealscomments"] +"mealsPictures " +value["mealspics"]);
                $("#panel2").append("<table><tr bgcolor='#808000'; style = 'font-family:verdana;font-size:20px;text-align:center'><th align='center'><b>"+value["dinnername"]+"</b></th></tr>");
                
                var nameStr = value["mealsname"];
                var picStr = value["mealspics"];
                var commentsStr = value["mealscomments"];
                var individualmeals = nameStr.split("|");
                var individualPics = picStr.split("|");
                var individualComments = commentsStr.split("|");
                console.log("individualmeals =>" + individualmeals);
                for(var v=0; v<individualmeals.length; v++)
                {
                    console.log("value[dinnername]" + value["dinnername"]);
                    $("#panel2").append("<tr><td></td><td>"+individualmeals[v]+"</td><td></td>"); 
                    $("#panel2").append("</tr><br><tr  style = 'height:15px;'>");
                    $("#panel2").append("<td></td><td ><img class='autoResizeImage' src= /Pictures/Meals/"+individualPics[v]+" /></td><td></td>");
                    $("#panel2").append("<td></td><td bgcolor = '#FFE4C4' style = 'font-family:verdana;font-size:15px;text-align:right'>"+individualComments[v]+"</td><td></td></tr><br>");
                }
                // $("#panel2").append("</tr><tr>");
                // for(var v=0; v<individualPics.length; v++)
                // {
                //     console.log("value[individualPics]" + individualPics[v]);
                //     $("#panel2").append("<td></td><td ><img class='autoResizeImage' src= /Pictures/Meals/"+individualPics[v]+" /></td><td></td></tr>");
                 
                // }
                               
                });

               $("#panel2").append( "</table>");
          
                   });   
                      
        }
        
        // Generate a random post
        function randomPost(pagesize) {
            var obj = new $.Deferred();
            var rowstartno = 0;
            var rowendno = 0; var stringURL = "";
            // Paragraphs that will appear in the post
            rowstartno = pagesize * rows;
            rowendno=rowstartno+rows;
            stringURL = "http://localhost:7001/griddata/";
            if(rows != undefined && rows != null )
            {  
              stringURL+=(""+rows.toString() +"/"+rowstartno.toString());
            }
            console.log("stringURL = >" + stringURL);
            obj = $.ajax({
            type: 'get',
           // contentType ('application/x-www-form-urlencoded; charset=UTF-8'),
            url: stringURL,
            datatype:JSON,
            cache: false,
            async : true,
            error : function(xhr) {
			console.log("ERROR while doing randomPost(pagesize)");
			}
        });

             obj.done(function(data){
                  console.log("Data returns = >" + JSON.stringify(data));   
                // var post="";
                 //var dataEdited = [];
                 //   dataEdited  =  JSON.parse(data);
                //     $.each(dataEdited,function(key, value) {
                //     post += '<p>';
                //     post += '<li>';
                //     post += '<article>';
                //     post += '<header><h1 style="font-family: Verdana, Geneva, Tahoma, sans-serif;font-size: 18px;">Dinner Name '+value["dinnername"]+'!</h1></header>';
                //     post += value["address"];
                //     post += '</article>';
                //     post += '</li>';
                //     post += '</p>';
                //     });
                //  $('#posts').append(post);
                var dinnerCollections = data;
                var jsonString = JSON.stringify(dinnerCollections);
                var dataEdited = []; var address ="";
                dataEdited  =  JSON.parse(data);
                var sourcei=0;
                var source=new Array();
                $.each(dataEdited,function(key, value) {
                var dinnerid=value["dinnersid"].toString();
                var dinnername=value["dinnername"].toString();
                var address = value["address"].toString();
                console.log("Address = >" + address);
                source[sourcei] = { dinnerid:dinnerid,dinnername:dinnername,address:address};
                sourcei=sourcei+1;
                });
				
                var dataAdapter = new $.jqx.dataAdapter(source);
                // Create a jqxListBox
				$("#jqxListBox").jqxListBox({ source: dataAdapter,theme:'POET', displayMember: "dinnername", valueMember: "dinnerid", width: 250, height: 165,selectedIndex: 0
                // renderer: function (index, label, value) {
                //             var datarecord = source[index];
                //             address = datarecord.address;}
                        });
                $("#jqxListBox").on('select', function (event) {
                    if (event.args) {
                        var item = event.args.item;
                        if (item) {
                            var valueelement = $("<div></div>");
                            valueelement.text("Value: " + item.value);
                            var labelelement = $("<div></div>");
                            labelelement.text("Label: " + item.label);
                            //  var adressElement = $("<div></div>");
                            //  adressElement.text("address: " + address);
                            $("#selectionlog").children().remove();
                            $("#selectionlog").append(labelelement);
                            $("#selectionlog").append(valueelement);
                            $("#selectedDinner").val(valueelement);
                            
                          //  $("#selectionlog").append(adressElement);

                        }
                    }
                });
                   });   
             
                      
        }

function loadChefCustomerGrid()
{
    var obj = new $.Deferred();
    obj = $.ajax({
            type: 'get',
           // contentType ('application/x-www-form-urlencoded; charset=UTF-8'),
            url: serverurlpath+'gridlistdata',
            datatype:JSON,
            cache: false,
            async : true,
            error : function(xhr) {
			console.log("ERROR while doing loadChefCustomerGrid");
			}
        });
        
        obj.done(function(data){
            console.log("data ---> "+ JSON.stringify(data));
        var jsonString = JSON.stringify(data);
           
          var  parsedData = JSON.parse(jsonString);
            console.log("parsedData = >"+ parsedData);
        //  $.each(parsedData,function(key, value){
        // console.log("value['dinnersid'] ->" + value["dinnersid"] + "data.dinnersid = "+ data.dinnersid );
        // for(var v=0; v<)
            var source =
                {
                    datafields: [
                        { name: 'dinnersid', type: 'string', map: 'dinnersid' },
                        { name: 'dinnername', type: 'string', map: 'dinnername' },
                        { name: 'address', type: 'string' , map: 'address'},
                        { name: 'chefname', type: 'string', map: 'chefname' }
                        //{ name: 'mealspics', type: 'string', map: 'dinners>0>picture' }
                       
   
                    ],
                    datatype: 'json',
                    localdata: data,
                  //  root: "dinners",
                //record: "dinner",
                   // id:"dinnersid"
                    async:false
                };
            
            var adapter = new $.jqx.dataAdapter(source);
               // create nested grid.
               
                var initrowdetails = function (index, parentElement, gridElement, record) {
                    var id = record.uid.toString();
                    var grid = $($(parentElement).children()[0]);
               
   //    console.log("dinners eds= >" + parsedData.getJsonArray("dinners"));
                    var nestedSource =
                    {
                        datafields: [
                            { name: 'mealsname', map: 'dinners>0>mealsname', type: 'string' },
                            { name: 'mealscomments', map: 'dinners>0>comments', type: 'string' },
                            { name: 'mealspics', map: 'dinners>0>picture', type: 'string' }
                                                
                        ],
                        datatype: 'json',
                       // root: 'dinners',
                        localdata: data
                    };
                    
            var nestedAdapter = new $.jqx.dataAdapter(nestedSource);
                    if (grid != null) {
                        grid.jqxGrid({
                            source: nestedAdapter, width: 600, height: 150,
                            columns: [
                                // { text: "recipie", datafield: "recipie" },
                                // { text: "Comments", datafield: "Comments" },
                                // { text: "pics", datafield: "pics" }
                        { text: 'Meals Name', datafield: 'mealsname',  width: 200 },
                        { text: 'Comments on Meals', datafield: 'mealscomments',  width: 250 },
                        { text: 'Sample pic', datafield: 'mealspics',  width: 150 }

                                
                        ]
                        });
                    }
                }
               

                $("#jqxChefMealsGrid").jqxGrid(
                {
                    width: '100%',
                    height: '90%',
                    source: adapter,
                   // theme: theme,
                    rowdetails: true,
                  //  columnsresize: true,
                    rowsheight: 35,
                    theme: 'POET',
                    initrowdetails: initrowdetails,
                   rowdetailstemplate: { rowdetails: "<div id='grid' style='margin: 10px;'></div>", 
                    rowdetailsheight: 150, rowdetailshidden: true },
                    ready: function () {
                        $("#jqxChefMealsGrid").jqxGrid('showrowdetails', 1);
                    },
                    columns: [
                        { text: 'Dinner', datafield: 'dinnername', width: 150 },
                       { text: 'Address', datafield: 'address', width: 150  },
                        { text: 'Dinner Id', datafield: 'dinnersid',  width: 150 },
                        { text: 'Chef Name', datafield: 'chefname',  width: 150 }

                        
                    ]
                });
                //  });          
             });
               
}



function moveit() {
    p += 0.02;

    var r = 175;
    var xcenter = 200;
    var ycenter = 200;

    
    var newLeft = Math.floor(xcenter + (r* Math.cos(p+90)));
    var newTop = Math.floor(ycenter + (r * Math.sin(p+90)));
    var newLeft1 = Math.floor(xcenter + -(r* Math.cos(p+90)));
    var newTop1 = Math.floor(ycenter + -(r * Math.sin(p+90)));
     var newLeft2 = Math.floor(ycenter + (r* Math.cos(p+170)));
    var newTop2 = Math.floor(xcenter + (r* Math.sin(p+170)));
     var newLeft3 = Math.floor(ycenter + -(r* Math.cos(p+170)));
    var newTop3 = Math.floor(xcenter + -(r* Math.sin(p+170)));
    
    
    $('#meal1').animate({
            top: newTop,
            left: newLeft,
        }, 10, function() {
            moveit()
                });
    $('#meal2').animate({
        top: newTop1,
        left: newLeft1,
    },10, function() {
        moveit();
    });
    $('#meal3').animate({
        top: newTop2,
        left: newLeft2,
    },10, function() {
        moveit();
    });
    $('#meal4').animate({
        top: newTop3,
        left: newLeft3,
    },10, function() {
        moveit();
    });
 }


function loadPageLoader()
{
    $('#loading').show();
} 
function hidePageLoader()
{
    $('#loading').hide();
} 
        