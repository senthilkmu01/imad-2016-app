console.log('Loaded!');
var button=document.getElementbyId('btncounter');

button.onclick=function(){
    var request=new XMLHttpRequest();
    
    request.onreadystatechange=function()
    {
      if(request.readyState==XMLHttpRequest.DONE)
      {
          if(request.status==200)
          {
              var counter=request.responseText;
              counter=counter+1;
              var span=document.getElementbyId('count');
              span.innerHTML=counter.toString();
          }
      }
    };
    
    request.open('GET','http://senthilkmu01.imad.hasura-app.io/counter',true);
    request.send(null);
};