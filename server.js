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
                    if(negros.includes(win))this.credito=this.credito+apuesta.valor*2;
                    else if(rojos.includes(win))this.credito=this.credito+apuesta.valor*2
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


const rooms=["Diamond","Clover","Heart","Spade"];
var Diamonds=[];
var Clovers=[];
var Hearts=[];
var Spades=[];

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
                Clovers.push({socket:socket.id,name:name,credito:1000});
                //Manda al nuevo la lista 
                io.in(room).emit('newUser',Clovers)
                break;
            case "Heart":
                Hearts.push({socket:socket.id,name:name,credito:1000});
                io.in(room).emit('newUser',Hearts)

                break;
            case "Spade":
                Spades.push({socket:socket.id,name:name,credito:1000});
                io.in(room).emit('newUser',Spades)

                break;         
        }

        socket.on('apuesta',data=>{
            a=new Apuesta(data.numero,data.valor,data.estado)
            switch (room) {
                case "Diamond":
                    Diamonds.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Diamonds);               
                    break;
    
                case "Clover":
                    Clovers.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Clovers);   
                    break;
    
                case "Heart":
                    Hearts.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Hearts);   
                    break;
    
                case "Spade":
                    Spades.map(i=>{
                        if(i.socket==socket.id){
                            i.apuestas.push(a);
                            i.credito=i.credito-a.valor;
                        }
                    })
                    io.in(room).emit('checkApuesta',Spades);   
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
                    io.in(room).emit('newRound',Diamonds)
                    break;
    
                case "Clover":
                    Clovers.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    break;
    
                case "Heart":
                    Hearts.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    break;
    
                case "Spade":
                    Spades.map(jugador=>{
                        jugador.resolverApuestas(win);
                    })
                    break;
            console.log('se fue alguien',room);
        };

        })

    });

});

