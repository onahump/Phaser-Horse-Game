var AMOUNT_DIAMONDS = 30; //Variable Global

GamePlayManager = {   //ObjetoGamePlayManager
    init: function(){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Haciendo nuestro juego totalmente responsivo
        game.scale.pageAlignHorizontally = true; //Centrando nuestro juego horizontalmente
        game.scale.pageAlignVertically = true; // Centrando nuestro juego verticalmente

        this.flagFirstMouseDown = false; //Creando una bandera para que nuestro mouse no se mueva
    },
    preload: function(){
        game.load.image('background', 'assets/images/background.png'); //cargando la imagen del backgroud
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2); //Cargando nuestro spritesheet en el cual tomamos el primer cballo de mar indicamos las dimensiones del ancho y el largo en conjunto con cuantas imagenes contiene la imagen principal
        game.load.spritesheet('diamonds', 'assets/images/diamonds.png', 81, 84, 4);
    },
    create: function(){
        game.add.sprite(0,0,'background'); // implementando el background en la esquina superior izquierda coordenadas 0,0
        this.horse = game.add.sprite(0,0, 'horse'); //Guardando la instancia de nuestro caballo para poder acceder a sus propiedades, 'this' se ocupa para que este se encuentre dentro de todo nuestro objeto GamePlayManager
        this.horse.frame = 1; //Accediendo a la propiedad frame y toma el dibujo con los ojos abiertos por el 1, si ponemos 0 toma el dibujo con ojos cerrados.
        this.horse.x = game.width/2;  //Posicionando nuestro caballo en el centro de la pantalla
        this.horse.y = game.height/2; //Posicionando nuestro caballo en el centro de la pantalla
        this.horse.anchor.setTo(0.5); //Tomando el anchor de nuestro caballo justamente en su centro

        game.input.onDown.add(this.onTap, this); // Funcion para cuando el usuario de click en nuestro juego nuestro flag sea verdadero

        this.diamonds = [];
        for(var i=0; i<AMOUNT_DIAMONDS; i++){ //creando la cantidad de diamantes que  la variable global señala
            var diamond = game.add.sprite(100,100 ,'diamonds'); //creando el diamante
            diamond.frame = game.rnd.integerInRange(0,3);  //tomando un random para escoger 1 de los posibles 4 diamantes
            diamond.scale.setTo( 0.30 + game.rnd.frac()); //Asignando un tamaño random al diamante
            diamond.anchor.setTo(0.5); // Asignando el anchor en el centro
            diamond.x = game.rnd.integerInRange(50,1050); //Escogiendo una posicion al azar para x entre 50 y 1050
            diamond.y = game.rnd.integerInRange(50,600);  //Escogiendo una posicion al azar para x entre 50 y 600
        }
    },
    onTap:function(){
        this.flagFirstMouseDown = true; //vuelve nuestro flag en verdadero
    },
    update: function(){

        if(this.flagFirstMouseDown){ //Hasta que nuestro flag sea verdadero se correra este bloque de codigo
            //this.horse.angle +=1 Rotando nuestro caballo 1 posicion mas cada frame
            var pointerX = game.input.x; //Encontrando las coordenadas de nuestro mouse en X
            var pointerY = game.input.y; //Encontrando las coordenadas de nuestro mouse en Y

            var distX= pointerX - this.horse.x; //Sacando la distancia en X que existe entre nuestro caballo y el mouse
            var distY= pointerY - this.horse.y; //Sacando la distancia en Y que existe entre nuestro caballo y el mouse

            if(distX>0){ //si la distancia en X es mayor que 0
                this.horse.scale.setTo(1,1); //nuestro caballo tiene que ver a la derecha
            }else{  //sino
                this.horse.scale.setTo(-1, 1); //nuestro caballo tiene que ver a la izquierda
            }

            this.horse.x += distX * 0.02;
            this.horse.y += distY * 0.02;
        }
    }
}


var game = new Phaser.Game(1136,640, Phaser.CANVAS); //instanciamos juego en facer con sus especificaciones

game.state.add('gameplay',GamePlayManager); //Agregamos un estado que le vamos a llamar gameplay y se le asigna el objeto GamePlayMañager
game.state.start('gameplay'); //Llama a cada uno de los metodos

