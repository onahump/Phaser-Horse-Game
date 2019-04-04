GamePlayManager = {   //ObjetoGamePlayManager
    init: function(){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
    preload: function(){
        game.load.image('background', 'assets/images/background.png'); //cargando la imagen del backgroud
    },
    create: function(){
        console.log("Create");
        game.add.sprite(0,0,'background'); // implementando el background en la esquina superior izquierda coordenadas 0,0
    },
    update: function(){
        console.log("Init");
    }
}


var game = new Phaser.Game(1136,640, Phaser.CANVAS); //instanciamos juego en facer con sus especificaciones

game.state.add('gameplay',GamePlayManager); //Agregamos un estado que le vamos a llamar gameplay y se le asigna el objeto GamePlayMañager
game.state.start('gameplay'); //Llama a cada uno de los metodos

