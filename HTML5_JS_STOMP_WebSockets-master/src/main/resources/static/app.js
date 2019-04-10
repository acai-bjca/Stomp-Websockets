var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        //ctx.arc(point.x, point.y);
        ctx.stroke();
    };

    var addPolygonToCanvas = function (points) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for( item=1 ; item < points.length; item+=1 ){
            ctx.lineTo(points[item].x , points[item].y );
        }
        ctx.closePath();
        ctx.fill();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };                         
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        var id = document.getElementById("id").value;
        
        stompClient.connect({}, function (frame) {            
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var puntoJSON =  JSON.parse(eventbody.body);
                //var callback = mostrarMensaje;
                var callback = addPointToCanvas;
                mostrar(puntoJSON, callback);
            });
        });

        stompClient.connect({}, function (frame) {            
            console.log('Connected: ' + frame);               
            stompClient.subscribe('/topic/newpoint.'+id, function (eventbody) {
                var puntoObj =  JSON.parse(eventbody.body); //convertir json en obj                
                //var callback = mostrarMensaje;
                var callback = addPointToCanvas;
                mostrar(puntoObj, callback);
            });            
        });
        
        stompClient.connect({}, function (frame) {            
            console.log('Connected: ' + frame);                 
            stompClient.subscribe('/topic/newpolygon.'+id, function (eventbody) {                
                var poligonoObj =  JSON.parse(eventbody.body); //convertir json en obj           
                var callback = addPolygonToCanvas;
                mostrar(poligonoObj, callback);
            });    
        });
    };

    function mostrar(puntoObj, callback){
        callback(puntoObj);
    }
    
    function mostrarMensaje(puntoObj){
        alert("Coordenada X: " + puntoObj.x + ", Coordenada Y: "+ puntoObj.y);
    }   
    
    function printMousePos(event) {
        var px = getMousePosition(event).x;
        var py = getMousePosition(event).y;
        var pt=new Point(px, py);
        var id = document.getElementById("id").value;
        //stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));
        //stompClient.send("/topic/newpoint."+id, {}, JSON.stringify(pt));
        stompClient.send("/app/newpoint."+id, {}, JSON.stringify(pt)); //convierte objeto javascript en json
    }
      
    document.addEventListener("click", printMousePos);

    return {
        init: function () {
            var can = document.getElementById("canvas");            
            //websocket connection
            connectAndSubscribe();
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            var id = document.getElementById("id").value;
            //stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));
            //stompClient.send("/topic/newpoint."+id, {}, JSON.stringify(pt));
            stompClient.send("/app/newpoint."+id, {}, JSON.stringify(pt));
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        },

        connectTopic: function(){
            connectAndSubscribe();
        }
    };

})();
