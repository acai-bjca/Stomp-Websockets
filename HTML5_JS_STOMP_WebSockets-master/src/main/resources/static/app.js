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
        
        //subscribe to /topic/TOPICXX when connections succeed
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
            var id = document.getElementById("id").value;     
            stompClient.subscribe('/topic/newpoint.'+id, function (eventbody) {
                var puntoJSON =  JSON.parse(eventbody.body);
                //var callback = mostrarMensaje;
                var callback = addPointToCanvas;
                mostrar(puntoJSON, callback);
            });            
        });
    };

    function mostrar(puntoJSON, callback){
        callback(puntoJSON);
    }
    
    function mostrarMensaje(puntoJSON){
        alert("Coordenada X: " + puntoJSON.x + ", Coordenada Y: "+ puntoJSON.y);
    }   
    
    function printMousePos(event) {
        var px = getMousePosition(event).x;
        var py = getMousePosition(event).y;
        var pt=new Point(px, py);
        var id = document.getElementById("id").value;
        stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));
        stompClient.send("/topic/newpoint."+id, {}, JSON.stringify(pt));
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
            stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));
            stompClient.send("/topic/newpoint."+id, {}, JSON.stringify(pt));
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
