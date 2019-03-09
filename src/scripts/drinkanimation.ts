//Slightly modified by me
//Source: https://codepen.io/dsenneff/pen/zryPLa

function runDrinkAnimation() {
    let canvas = $$("#demoCanvas");
    //@ts-ignore
    let stage = new createjs.Stage("demoCanvas");

    let data = {
        images: ["img/canvas_sprites.svg?ck=" + Math.round((Math.random() * 1000))],
        frames: [
            [],
            [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
            [1020, 2844, 72, 288, , -12,], [1208, 2994, 62, 60, , -84, -84],
            [1174, 2844, 82, 86, , -76, -46],				//130
            [1092, 2844, 82, 88, , -72, -44], [1092, 2932, 56, 92, , -72, -28], [1148, 2994, 60, 64, , -72, -44], [1092, 3024, 60, 64, , -76, -44],
            [1174, 2930, 84, 64, , -48, -44],				//135
            [], [], [], [],

        ],
        animations: {
            kristinStand: [128],
            kristinCoffee: {
                frames: [129, 130, 131, 132, 133, 134, 134, 134, 134, 134, 134, 134, 134, 135, 135, 135, 135, 134, 134, 134, 134, 135, 135, 135, 135, 134, 134, 134, 134, 135, 135, 135, 135, 134, 134, 134, 134, 133, 132, 131, 130, 129],
                speed: 1
            }
        }
    };

    //@ts-ignore
    let spriteSheet = new createjs.SpriteSheet(data);
    if (!spriteSheet.complete) {
        // not preloaded, listen for the complete event:
        spriteSheet.addEventListener("complete", function () {
            initGraphics();
        });
    }

    function initGraphics() {
        //stage.scaleX = stage.scaleY = 2;
        stage.addChild(kristinBody);
        stage.addChild(kristinArm);
        kristinBody.gotoAndStop("kristinStand");
        kristinArm.gotoAndPlay("kristinCoffee");
        stage.update();
        //@ts-ignore
        createjs.Ticker.framerate = 12;
        //@ts-ignore
        createjs.Ticker.addEventListener("tick", tick);
    }
    //@ts-ignore
    var kristinBody = new createjs.Sprite(spriteSheet);
    //@ts-ignore
    var kristinArm = new createjs.Sprite(spriteSheet);

    function tick(event: any) {
        stage.update();
    }
}