GamePlayManager = {   //ObjetoGamePlayManager
    init: function(){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Haciendo nuestro juego totalmente responsivo
        game.scale.pageAlignHorizontally = true; //Centrando nuestro juego horizontalmente
        game.scale.pageAlignVertically = true; // Centrando nuestro juego verticalmente
    },
    preload: function(){
        game.load.image('background', 'assets/images/background.png'); //cargando la imagen del backgroud
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2) //Cargando nuestro spritesheet en el cual tomamos el primer cballo de mar indicamos las dimensiones del ancho y el largo en conjunto con cuantas imagenes contiene la imagen principal
    },
    create: function(){
        console.log("Create");
        game.add.sprite(0,0,'background'); // implementando el background en la esquina superior izquierda coordenadas 0,0
        this.horse = game.add.sprite(0,0, 'horse'); //Guardando la instancia de nuestro caballo para poder acceder a sus propiedades, 'this' se ocupa para que este se encuentre dentro de todo nuestro objeto GamePlayManager
        this.horse.frame = 1 //Accediendo a la propiedad frame y toma el dibujo con los ojos abiertos por el 1, si ponemos 0 toma el dibujo con ojos cerrados.
    },
    update: function(){
        console.log("Init");
    }
}


var game = new Phaser.Game(1136,640, Phaser.CANVAS); //instanciamos juego en facer con sus especificaciones

game.state.add('gameplay',GamePlayManager); //Agregamos un estado que le vamos a llamar gameplay y se le asigna el objeto GamePlayMañager
game.state.start('gameplay'); //Llama a cada uno de los metodos

