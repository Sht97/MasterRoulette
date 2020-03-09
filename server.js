const app = require("./app");

const io = require("socket.io")(
    app.listen(process.env.PORT || 3000, () => {
        console.log("Listen o port ", 3000);
    })
);
//37 fila 1
//38 fila 2
//39 fila 3
//40 rojo
//41 negro
var Diamonds=[];
var Clovers=[];
var Hearts=[];
var Spades=[];

filaUno=[3,6,9,12,15,18,21,24,27,30,33,36]
filaDos=[2,5,8,11,14,17,20,23,26,29,32,35]
filaTres=[1,4,7,10,13,16,19,22,25,28,31,34]
negros=[2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]
rojos=[1,3,5,7,9,12,14,16,18,19,21,22,25,27,30,32,34,36]


class Jugador{
    constructor(socket,name){
        this.socket=socket;
        this.name=name;
        this.credito=10000;
        this.apuestas=[]
        this.readyToPlay=false;
    }
    addApuesta(apuesta){
        this.apuestas.push(apuesta)
    }
    resolverApuestas(win){
        this.apuestas.map(apuesta=>{
            switch(apuesta.tipo){
                case 1://Apuesta al número
                    if(win==apuesta.numero){
                        this.credito=this.credito+apuesta.valor*35;
                    }
                    break;
                case 2://Apuesta a la fila
                    switch (apuesta.numero) {
                        case 37:
                            if(filaUno.includes(win))this.credito=this.credito+apuesta.valor*3
                            break;
                        case 38:
                            if(filaDos.includes(win))this.credito=this.credito+apuesta.valor*3
                            break;
                        case 39:
                            if(filaTres.includes(win))this.credito=this.credito+apuesta.valor*3
                            break;
                    }                    
                    break;
                case 3:
                    switch(apuesta.numero){                
                        
                        case 41:
                            if(negros.includes(win))
                                {this.credito=this.credito+apuesta.valor*2 ;
                                console.log('apuesta a color negro');}
                        break;
                        case 40:
                         
                            if(rojos.includes(win))
                            {this.credito=this.credito+apuesta.valor*2;
                                console.log('apuesta a color rojo');}}
    
                        break;
            }

            this.apuestas.pop(apuesta);
        })
    }

}

class Apuesta{
    constructor(numero,valor,estado){
        if(numero<36)this.tipo=1;
        else if(numero<40 && numero>36)this.tipo=2;
        else this.tipo=3
        this.numero= numero;
        this.valor=valor;
        this.estado= estado;
    }
}

function contarApuestas(sala){
    var aux=true;
    sala.map(i=>{
        if(i.apuestas.length===0)aux= false;
    })
    return aux;
}

function countReadyToPlay(room){
    var aux=true;
    room.map(i=>{
        if(i.readyToPlay===false) aux=false;
    })
    return aux;
}

function disableReady(room){
    room.map(i=>{
        i.readyToPlay= false;  
    })

}

io.on('connection', socket=> {

    socket.on('JoinRoom',(data)=>{
        var{room,name}=data;
        socket.join(room);
        jugador =new Jugador(socket.id,name)
        console.log(socket.id)
        switch(room){
            case "Diamond":
                Diamonds.push(jugador);
                console.log(Diamonds);
                io.in(room).emit('newUser',Diamonds);   
                break;
            case "Clover":
                //Agrega al array
                Clovers.push(jugador);
                //Manda al nuevo la lista 
                io.in(room).emit('newUser',Clovers)
                break;
            case "Heart":
                Hearts.push(jugador);
                io.in(room).emit('newUser',Hearts)
                break;
            case "Spade":
                Spades.push(jugador);
                io.in(room).emit('newUser',Spades)

                break;         
        }
        socket.on('apuestaReady',()=>{
            switch (room) {
                case "Diamond":
                    Diamonds.map(i=>{
                        if(i.socket==socket.id){
                            i.readyToPlay=true;
                        }
                    })
                    aux=Diamonds.length;
                    if(Diamonds.length===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }
                    else{
                        if(countReadyToPlay(Diamonds))
                        {
                            host=Math.round(Math.random()*(aux-1));
                            io.to(Diamonds[host].socket).emit('host');
                            disableReady(Diamonds)
                        }
                    }
                    break;
                case "Clover":
                    Clovers.map(i=>{
                        if(i.socket==socket.id){
                            i.readyToPlay=true;
                        }
                    })
                    aux=Clovers.length;
                    if(Clovers.length===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }else{
                        if(countReadyToPlay(Clovers))
                        {
                            host=Math.round(Math.random()*(aux-1))
                            io.to(Clovers[host].socket).emit('host')
                            disableReady(Clovers)
                        }
                    }

                break;
                case "Heart":
                    Hearts.map(i=>{
                        if(i.socket==socket.id){
                            i.readyToPlay=true;
                        }
                    })
                    aux=Hearts.length;
                    if(Hearts.length===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }
                    else {
                        if(countReadyToPlay(Hearts))
                        {
                            host=Math.round(Math.random()*(aux-1))
                            io.to(Hearts[host].socket).emit('host')
                            disableReady(Hearts)
                        }
                    }
                    break;

                case "Spade":
                    Spades.map(i=>{
                        if(i.socket==socket.id){
                            i.readyToPlay=true;
                        }
                    });
                    aux=Spades.length;
                    if(Hearts.length===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }else{
                        if(countReadyToPlay(Spades))
                        {
                            host=Math.round(Math.random()*(aux-1));
                            io.to(Spades[host].socket).emit('host');
                            disableReady(Spades)
                        }
                    }
                    break;
            }
        });

        socket.on('textApuesta',data=>{
            console.log('data')
            io.in(room).emit('text',data)
        })
        socket.on('apuesta',data=>{
            

            a=new Apuesta(data.numero,data.valor,data.estado); 
            switch (room) {
                case "Diamond":
                    Diamonds.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Diamonds);
                    aux=Diamonds.length;
                    if(aux===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }           
                    break;
    
                case "Clover":
                    Clovers.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Clovers);
                    aux=Clovers.length;
                    if(aux===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    } 
                    break;
    
                case "Heart":
                    Hearts.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Hearts);
                    aux=Hearts.length;
                    if(aux===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    } 
                    break;
    
                case "Spade":
                    Spades.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Spades);
                    aux=Spades.length;
                    if(aux===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    } 
                    break;
            }
        })

        socket.in(room).on('disconnect',()=>{        
            switch (room) {
                case "Diamond":
                    Diamonds = Diamonds.filter((i)=>i.socket !== socket.id)
                    socket.in(room).emit('userLeft',Diamonds);
                    break;
    
                case "Clover":
                    Clovers = Clovers.filter((i)=>i.socket !== socket.id)
                    socket.in(room).emit('userLeft',Clovers);
                    break;
    
                case "Heart":
                    Hearts = Hearts.filter((i)=>i.socket !== socket.id)
                    socket.in(room).emit('userLeft',Hearts);
                    break;
    
                case "Spade":
                    Spades = Spades.filter((i)=>i.socket !== socket.id)
                    socket.in(room).emit('userLeft',Spades);
                    break;
            console.log('se fue alguien',room);
            }
        });


        socket.in(room).on('rotateHost',(data)=>{
            console.log(data);
            socket.in(room).emit('rotateGuest',data);
        });
        
        socket.in(room).on('win',(data)=>{
            var win=data*1;

            switch (room) {
                case "Diamond":
                    Diamonds.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    io.in(room).emit('newRound',{arreglo:Diamonds, numberWin:win})
                    break;
    
                case "Clover":
                    Clovers.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    io.in(room).emit('newRound',{arreglo:Clovers, numberWin:win})
                    break;
    
                case "Heart":
                    Hearts.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    io.in(room).emit('newRound',{arreglo:Hearts, numberWin:win})
                    break;
    
                case "Spade":
                    Spades.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    io.in(room).emit('newRound',{arreglo:Spades, numberWin:win})
                    break;
        };

        })

    });

});

