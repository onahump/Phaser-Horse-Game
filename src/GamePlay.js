var AMOUNT_DIAMONDS = 30; //Variable Global

GamePlayManager = {   //ObjetoGamePlayManager
    init: function(){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Haciendo nuestro juego totalmente responsivo
        game.scale.pageAlignHorizontally = true; //Centrando nuestro juego horizontalmente
        game.scale.pageAlignVertically = true; // Centrando nuestro juego verticalmente

        this.flagFirstMouseDown = false; //Creando una bandera para que nuestro mouse no se mueva
        this.amountDiamondsCaught = 0;
        this.endGame = false;
    },
    preload: function(){
        game.load.image('background', 'assets/images/background.png'); //cargando la imagen del backgroud
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2); //Cargando nuestro spritesheet en el cual tomamos el primer cballo de mar indicamos las dimensiones del ancho y el largo en conjunto con cuantas imagenes contiene la imagen principal
        game.load.spritesheet('diamonds', 'assets/images/diamonds.png', 81, 84, 4);
        game.load.spritesheet('explosion', 'assets/images/explosion.png');
        game.load.spritesheet('shark', 'assets/images/shark.png');
        game.load.spritesheet('fishes', 'assets/images/fishes.png');
        game.load.spritesheet('mollusk', 'assets/images/mollusk.png');
        game.load.spritesheet('booble1', 'assets/images/booble1.png');
        game.load.spritesheet('booble2', 'assets/images/booble2.png');
    },
    create: function(){
        game.add.sprite(0,0,'background'); // implementando el background en la esquina superior izquierda coordenadas 0,0

        this.boobleArray = [];

        for(var i=0; i<AMOUNT_DIAMONDS; i++){
            var xBooble = game.rnd.integerInRange(1,1140);
            var yBooble = game.rnd.integerInRange(600,950);

            var booble =  game.add.sprite(xBooble, yBooble, 'booble' + game.rnd.integerInRange(1,2));
            booble.vel = 0.2 + game.rnd.frac() * 2;
            booble.alpha = 0.9;
            booble.scale.setTo( 0.2 + game.rnd.frac());
            this.boobleArray[i] = booble
        }

        this.mollusk = game.add.sprite(500,200,'mollusk');
        this.shark = game.add.sprite(500,20,'shark');
        this.fishes = game.add.sprite(20,500,'fishes');

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

            this.diamonds[i] = diamond;
            var rectCurrenDiamond = this.getBoundsDiamond(diamond);
            var rectHorse = this.getBoundsDiamond(this.horse);

            while (this.isOverlappingOtherDiamond(i,rectCurrenDiamond) || (this.isRectanglesOverLapping(rectHorse, rectCurrenDiamond))) {
                diamond.x = game.rnd.integerInRange(50,1050);
                diamond.y = game.rnd.integerInRange(50,600);
                rectCurrenDiamond = this.getBoundsDiamond(diamond)
            }
        }

        this.explosionGroup = game.add.group(); //creando un grupo
        for(var i=0; i<10; i++){
            this.explosion = this.explosionGroup.create(100,100, 'explosion'); // cargando 10 explosiones para asiganarlas al grupo
            this.explosion.tweenScale = game.add.tween(this.explosion.scale).to({ //agregando el tween al sprite explosion con la propiedad escala
                                        x: [0.4, 0.8, 0.4], // arranca en 0,4 y termina en 0.4
                                        y: [0.4, 0.8, 0.4]
            }, 600, Phaser.Easing.Exponential.out, false, 0, 0, false); //600 milisegundos, usando el easing, false para autostart, 0 delay, 0 veces para repetir el twening, false si queremos usar el show show para que vaya y vuelva
            this.explosion.tweenAlpha = game.add.tween(this.explosion).to({ //Modificando el brillo de nuestra explosion para la animacion
                                        alpha: [1, 0.5, 0]
            }, 600, Phaser.Easing.Exponential.out, false, 0, 0, false);
            this.explosion.anchor.setTo(0.5);//Configurando el anchor de nuestro explosion
            this.explosion.kill(); //  Explosion no es visible
        }

        this.currentScore = 0;
        var style = {
                font: 'bold 30pt Arial',
                fill: '#FFFF',
                align: 'center'
        }

        this.scoreText = game.add.text(game.width/2, 40, '0', style);
        this.scoreText.anchor.setTo(0.5)

        this.totalTime = 30;
        this.timerText = game.add.text(1000, 40, this.totalTime + ' ' , style);
        this.timerText.anchor.setTo(0.5)

        this.timerGameOver = game.time.events.loop(Phaser.Timer.SECOND, function(){
            if(this.flagFirstMouseDown){
                this.totalTime--;
                this.timerText.text = this.totalTime+'';
                if (this.totalTime<=0) {
                    game.time.events.remove(this.timerGameOver);
                    this.endGame = true;
                    this.showFinalMessage('GAME OVER')
                }
            }
        }, this)

    },
    increaseScore: function(){
        this.currentScore += 100;
        this.scoreText.text = this.currentScore;

        this.amountDiamondsCaught += 1;
        if(this.amountDiamondsCaught >= AMOUNT_DIAMONDS){
            game.time.events.remove(this.timerGameOver);
            this.showFinalMessage('CONGRATULATIOSNS');
            this.endGame = true;
        }
    },
    showFinalMessage: function (msg){
        this.tweenMollusk.stop();
        var bgAlpha = game.add.bitmapData(game.width, game.height);
        bgAlpha.ctx.fillStyle = '#000000';
        bgAlpha.ctx.fillRect(0,0, game.width, game.height);

        var bg = game.add.sprite(0,0, bgAlpha);
        bg.alpha = 0.5;

        var style = {
            font: 'bold 60pt Arial',
            fill: '#FFFFFF',
            align: 'center'
        }

        this.textFieldFinalMsg = game.add.text(game.width/2, game.height/2, msg, style);
        this.textFieldFinalMsg.anchor.setTo(0.5);



    },
    getBoundsDiamond:function (currentDiamond) {
        return new Phaser.Rectangle(currentDiamond.left, currentDiamond.top, currentDiamond.width, currentDiamond.height);
    },
    isRectanglesOverLapping:function (rect1, rect2) {
        if (rect1.x > rect2.x+rect2.width || rect2.x > rect1.x+rect1.width ) {
            return false;
        }
        if (rect1.y > rect2.y+rect2.height || rect2.y > rect1.y+rect1.height) {
            return false;
        }
        return true
    },
    isOverlappingOtherDiamond:function (index, rect2) {
        for (var i = 0; i < index; i++) {
            var rect1 = this.getBoundsDiamond(this.diamonds[i]);
            if (this.isRectanglesOverLapping(rect1,rect2)) {
                return true;
            }
        }
    },
    onTap:function(){
        if(!this.flagFirstMouseDown){
            this.tweenMollusk = game.add.tween(this.mollusk.position).to({
                y:-0.001}, 5800, Phaser.Easing.Cubic.InOut, true, 0, 1000, true).loop(true);
            }
            this.flagFirstMouseDown = true; //vuelve nuestro flag en verdadero
    },
    getsBoundsHorse: function () { //tomando el cuadro del caballo
        var x0 = this.horse.x - Math.abs(this.horse.width)/4;
        var width = Math.abs(this.horse.width)/2;
        var y0 = this.horse.y - this.horse.height/2;
        var height = this.horse.height;

        return new Phaser.Rectangle(x0, y0, width, height);
    },
    /* render: function(){
        game.debug.spriteBounds(this.horse);
        for(var i= 0; i<AMOUNT_DIAMONDS; i++){
            game.debug.spriteBounds(this.diamonds[i]);
        }
    },*/
    update: function(){

        if(this.flagFirstMouseDown && !this.endGame){ //Hasta que nuestro flag sea verdadero se correra este bloque de codigo
            //this.horse.angle +=1 Rotando nuestro caballo 1 posicion mas cada frame

            for(var i=0; i<AMOUNT_DIAMONDS; i++){
                var booble = this.boobleArray[i];
                booble.y -= booble.vel;
                if (booble.y < -50) {
                    booble.y = 700;
                    booble.x = game.rnd.integerInRange(1,1140);
                }
            }

            this.shark.x--;
            if(this.shark.x < -300){
                this.shark.x = 1300;
            }

            this.fishes.x+=0.3;
            if(this.shark.x > 1300){
                this.shark.x = -100;
            }

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

            for (var i = 0; i < AMOUNT_DIAMONDS; i++) {
                var rectHorse = this.getsBoundsHorse();
                var rectDiamond = this.getBoundsDiamond(this.diamonds[i]);
                if (this.diamonds[i].visible && this.isRectanglesOverLapping(rectHorse, rectDiamond)) {
                    this.increaseScore();
                    this.diamonds[i].visible = false //escondiendo el diamante cuando este hace colision

                    var explosion = this.explosionGroup.getFirstDead();  //pidiendo 1 elemento del grupo para que se pueda ocupar
                    if(explosion != null){ // verificando que la explision sea diferente de nulo
                        explosion.reset(this.diamonds[i].x , this.diamonds[i].y); //dando las coordenadas del diamante tanto en x como en y

                        explosion.tweenScale.start(); //iniciando el tweens
                        explosion.tweenAlpha.start();

                        explosion.tweenAlpha.onComplete.add(function (currentTarget, currentTween){
                            currentTarget.kill();   //elimanndo el elemento del grupo que se esta ocupando para poder ocuparlo mas adelante
                        }, this);
                    }
                }
            }
        }
    }
}


var game = new Phaser.Game(1136,640, Phaser.CANVAS); //instanciamos juego en facer con sus especificaciones

game.state.add('gameplay',GamePlayManager); //Agregamos un estado que le vamos a llamar gameplay y se le asigna el objeto GamePlayMañager
game.state.start('gameplay'); //Llama a cada uno de los metodos

