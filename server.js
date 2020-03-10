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
var Diamantes=[];
var Trebols=[];
var Corazons=[];
var Picas=[];

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
        this.apuestas=[];
        this.readyToPlay=false;
    }
    addApuesta(apuesta){
        this.apuestas.push(apuesta)
    }
    resolverApuestas(win){


        this.apuestas.map(apuesta=> {
            console.log(apuesta);
            switch(apuesta.tipo){
                case 1://Apuesta al número
                    if(win==apuesta.numero){
                        this.credito=this.credito+apuesta.valor*35;
                    }
                    break;
                case 2://Apuesta a la fila
                    switch (apuesta.numero) {
                        case 37:
                            if(filaUno.includes(win))this.credito=this.credito+apuesta.valor*3;
                            break;
                        case 38:
                            if(filaDos.includes(win))this.credito=this.credito+apuesta.valor*3;
                            break;
                        case 39:
                            if(filaTres.includes(win))this.credito=this.credito+apuesta.valor*3;
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
        });
        this.apuestas=[];
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
        jugador =new Jugador(socket.id,name);
        console.log(socket.id);
        switch(room){
            case "Diamante":
                Diamantes.push(jugador);
                console.log(Diamantes);
                io.in(room).emit('newUser',Diamantes);   
                break;
            case "Trebol":
                //Agrega al array
                Trebols.push(jugador);
                //Manda al nuevo la lista 
                io.in(room).emit('newUser',Trebols)
                break;
            case "Corazon":
                Corazons.push(jugador);
                io.in(room).emit('newUser',Corazons)
                break;
            case "Pica":
                Picas.push(jugador);
                io.in(room).emit('newUser',Picas)

                break;         
        }
        socket.on('apuestaReady',()=>{
            switch (room) {
                case "Diamante":
                    Diamantes.map(i=>{
                        if(i.socket==socket.id){
                            i.readyToPlay=true;
                        }
                    })
                    aux=Diamantes.length;
                    if(Diamantes.length===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }
                    else{
                        if(countReadyToPlay(Diamantes))
                        {
                            host=Math.round(Math.random()*(aux-1));
                            io.to(Diamantes[host].socket).emit('host');
                            disableReady(Diamantes)
                        }
                    }
                    break;
                case "Trebol":
                    Trebols.map(i=>{
                        if(i.socket==socket.id){
                            i.readyToPlay=true;
                        }
                    })
                    aux=Trebols.length;
                    if(Trebols.length===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }else{
                        if(countReadyToPlay(Trebols))
                        {
                            host=Math.round(Math.random()*(aux-1))
                            io.to(Trebols[host].socket).emit('host')
                            disableReady(Trebols)
                        }
                    }

                break;
                case "Corazon":
                    Corazons.map(i=>{
                        if(i.socket==socket.id){
                            i.readyToPlay=true;
                        }
                    })
                    aux=Corazons.length;
                    if(Corazons.length===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }
                    else {
                        if(countReadyToPlay(Corazons))
                        {
                            host=Math.round(Math.random()*(aux-1))
                            io.to(Corazons[host].socket).emit('host')
                            disableReady(Corazons)
                        }
                    }
                    break;

                case "Pica":
                    Picas.map(i=>{
                        if(i.socket==socket.id){
                            i.readyToPlay=true;
                        }
                    });
                    aux=Picas.length;
                    if(Corazons.length===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }else{
                        if(countReadyToPlay(Picas))
                        {
                            host=Math.round(Math.random()*(aux-1));
                            io.to(Picas[host].socket).emit('host');
                            disableReady(Picas)
                        }
                    }
                    break;
            }

        });

        socket.on('textApuesta',data=>{
            console.log('estas son las apuestas' ,data.apuestas);
            io.in(room).emit('text',data)
        })
        socket.on('apuesta',data=>{
            

            a=new Apuesta(data.numero,data.valor,data.estado); 
            switch (room) {
                case "Diamante":
                    Diamantes.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Diamantes);
                    aux=Diamantes.length;
                    if(aux===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    }           
                    break;
    
                case "Trebol":
                    Trebols.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Trebols);
                    aux=Trebols.length;
                    if(aux===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    } 
                    break;
    
                case "Corazon":
                    Corazons.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Corazons);
                    aux=Corazons.length;
                    if(aux===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    } 
                    break;
    
                case "Pica":
                    Picas.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Picas);
                    aux=Picas.length;
                    if(aux===1){
                        io.to(socket.id).emit('estasSolo','Esperando a otros jugadores');
                    } 
                    break;
            }
        })

        socket.in(room).on('disconnect',()=>{        
            switch (room) {
                case "Diamante":
                    Diamantes = Diamantes.filter((i)=>i.socket !== socket.id)
                    socket.in(room).emit('userLeft',Diamantes);
                    break;
    
                case "Trebol":
                    Trebols = Trebols.filter((i)=>i.socket !== socket.id)
                    socket.in(room).emit('userLeft',Trebols);
                    break;
    
                case "Corazon":
                    Corazons = Corazons.filter((i)=>i.socket !== socket.id)
                    socket.in(room).emit('userLeft',Corazons);
                    break;
    
                case "Pica":
                    Picas = Picas.filter((i)=>i.socket !== socket.id)
                    socket.in(room).emit('userLeft',Picas);
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
                case "Diamante":
                    Diamantes.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    io.in(room).emit('newRound',{arreglo:Diamantes, numberWin:win})
                    break;
    
                case "Trebol":
                    Trebols.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    io.in(room).emit('newRound',{arreglo:Trebols, numberWin:win})
                    break;
    
                case "Corazon":
                    Corazons.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    io.in(room).emit('newRound',{arreglo:Corazons, numberWin:win})
                    break;
    
                case "Pica":
                    Picas.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    io.in(room).emit('newRound',{arreglo:Picas, numberWin:win})
                    break;
        };

        })

    });

});

