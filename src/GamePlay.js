GamePlayManager = {   //ObjetoGamePlayManager
    init: function(){
        console.log("Init");
    },
    preload: function(){
        console.log("Preload");
    },
    create: function(){
        console.log("Create");
    },
    update: function(){
        console.log("Init");
    }
}


var game = new Phaser.Game(1136,640, Phaser.AUTO); //instanciamos juego en facer con sus especificaciones

game.state.add('gameplay',GamePlayManager); //Agregamos un estado que le vamos a llamar gameplay y se le asigna el objeto GamePlayMañager
game.state.start('gameplay'); //Llama a cada uno de los metodos

