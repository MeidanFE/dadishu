(function () {
  'use strict';

  class EffectAutoDestory extends Laya.Script {
      onAwake() {
          Laya.timer.once(2000, this, () => {
              this.owner.destroy();
          });
      }
  }

  class MoleCtrl extends Laya.Script {
      constructor() {
          super();
          this.isUp = false;
          this.isDown = false;
      }
      onAwake() {
          this.randomUp();
      }
      onUpdate() {
          const owner = this.owner;
          if (this.isUp) {
              owner.transform.translate(new Laya.Vector3(0, 0.1, 0));
              if (owner.transform.localPosition.y >= 2.5) {
                  this.isUp = false;
                  owner.transform.localPosition = new Laya.Vector3(0, 2.5, 0);
                  Laya.timer.once(1000, this, function () {
                      this.isDown = true;
                  });
              }
          }
          if (this.isDown) {
              owner.transform.translate(new Laya.Vector3(0, -0.1, 0));
              if (owner.transform.localPosition.y <= 0) {
                  this.isDown = false;
                  owner.transform.localPosition = new Laya.Vector3();
                  this.randomUp();
              }
          }
      }
      randomUp() {
          var value = Math.random();
          Laya.timer.once(value * 8000, this, function () {
              this.isUp = true;
          });
      }
      Knock() {
          this.owner.transform.localPosition = new Laya.Vector3();
          this.isUp = false;
          this.isDown = false;
      }
  }

  class HummerCtrl extends Laya.Script {
      constructor() {
          super();
          this.isGameOver = false;
      }
      Init(camera, scene, effect) {
          this.camera = camera;
          this.scene = scene;
          this.effect = effect;
          this.physicsSimulation = scene.physicsSimulation;
      }
      onAwake() {
          this.ray = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());
          this.hitResult = new Laya.HitResult();
          Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
          Laya.stage.on("GameOver", this, function () {
              this.isGameOver = true;
          });
          Laya.stage.on("AgainGame", this, function () {
              this.isGameOver = false;
          });
      }
      onDown() {
          if (this.isGameOver) {
              return;
          }
          this.camera.viewportPointToRay(new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY), this.ray);
          if (this.physicsSimulation.rayCast(this.ray, this.hitResult)) {
              const target = this.hitResult.collider.owner;
              if (target.transform.localPosition.y >= 2) {
                  this.targetPos = target.transform.position;
                  this.targetPos.y = 0.35;
                  this.owner.transform.position = new Laya.Vector3(this.targetPos.x, 7, this.targetPos.z);
                  Laya.Tween.from(this.owner.transform, {
                      localPositionX: this.targetPos.x,
                      localPositionY: this.targetPos.y,
                      localPositionZ: this.targetPos.z,
                  }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, () => {
                      this.hitResult.collider.owner.getComponent(MoleCtrl).Knock();
                      var temp = Laya.Sprite3D.instantiate(this.effect, this.scene, false, this.targetPos).addComponent(EffectAutoDestory);
                      console.log(Laya.stage.event("AddScore"));
                      Laya.SoundManager.playSound("res/audio/hit.mp3");
                      Laya.Tween.from(this.owner.transform, {
                          localPositionX: this.targetPos.x,
                          localPositionY: 7,
                          localPositionZ: this.targetPos.z,
                      }, 200, Laya.Ease.linearIn, Laya.Handler.create(this, function () { }), 0, true);
                  }), 0, true);
              }
          }
      }
  }

  class GameRoot extends Laya.Script {
      constructor() {
          super();
          this.intType = 1000;
          this.numType = 1000;
          this.strType = "hello laya";
          this.boolType = true;
      }
      onAwake() {
          Laya.Scene3D.load("res/scene/LayaScene_Main/Conventional/Main.ls", Laya.Handler.create(this, this.onLoadSceneFinish));
      }
      onLoadSceneFinish(loadScene) {
          Laya.SoundManager.playMusic("res/audio/bg.mp3", 0);
          loadScene.zOrder = -1;
          Laya.stage.addChild(loadScene);
          var moles = loadScene.getChildByName("Moles");
          for (var i = 0; i < moles.numChildren; i++) {
              moles.getChildAt(i).getChildAt(0).addComponent(MoleCtrl);
          }
          var camera = loadScene.getChildByName("Main Camera");
          var effect = loadScene.getChildByName("Particle System");
          var effectPrefab = Laya.Sprite3D.instantiate(effect);
          effect.active = false;
          loadScene
              .getChildByName("Hummer")
              .addComponent(HummerCtrl)
              .Init(camera, loadScene, effectPrefab);
      }
  }

  class UICtrl extends Laya.Script {
      constructor() {
          super();
          this.txt_Time = null;
          this.txt_Score = null;
          this.gameOverPanel = null;
          this.score = 0;
          this.timer = 0;
          this.time = 60;
          Laya.stage.on("AddScore", this, this.addScore);
      }
      onAwake() {
          this.gameOverPanel.getChildAt(0).on(Laya.Event.CLICK, this, this.againGame);
      }
      addScore() {
          this.score++;
          console.log(this.score);
          this.txt_Score.text = "Score:" + this.score;
      }
      onUpdate() {
          if (this.time <= 0) {
              this.gameOver();
              return;
          }
          this.timer += Laya.timer.delta / 1000;
          if (this.timer >= 1) {
              this.timer = 0;
              this.time--;
              this.txt_Time.text = "Time:" + this.time + "s";
          }
      }
      gameOver() {
          console.log("游戏结束了");
          this.txt_Score.visible = false;
          this.txt_Time.visible = false;
          this.gameOverPanel.visible = true;
          Laya.stage.event("GameOver");
      }
      againGame() {
          this.score = 0;
          this.time = 60;
          this.timer = 0;
          this.txt_Score.text = "Score:0";
          this.txt_Score.visible = true;
          this.txt_Time.text = "Time:60s";
          this.txt_Time.visible = true;
          this.gameOverPanel.visible = false;
          Laya.stage.event("AgainGame");
      }
  }

  class GameConfig {
      constructor() {
      }
      static init() {
          var reg = Laya.ClassUtils.regClass;
          reg("GameRoot.ts", GameRoot);
          reg("UICtrl.ts", UICtrl);
      }
  }
  GameConfig.width = 1920;
  GameConfig.height = 1080;
  GameConfig.scaleMode = "fixedwidth";
  GameConfig.screenMode = "none";
  GameConfig.alignV = "top";
  GameConfig.alignH = "left";
  GameConfig.startScene = "GameRoot.scene";
  GameConfig.sceneRoot = "";
  GameConfig.debug = false;
  GameConfig.stat = false;
  GameConfig.physicsDebug = false;
  GameConfig.exportSceneToJson = true;
  GameConfig.init();

  class Main {
      constructor() {
          if (window["Laya3D"])
              Laya3D.init(GameConfig.width, GameConfig.height);
          else
              Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
          Laya["Physics"] && Laya["Physics"].enable();
          Laya["DebugPanel"] && Laya["DebugPanel"].enable();
          Laya.stage.scaleMode = GameConfig.scaleMode;
          Laya.stage.screenMode = GameConfig.screenMode;
          Laya.stage.alignV = GameConfig.alignV;
          Laya.stage.alignH = GameConfig.alignH;
          Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
          if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
              Laya.enableDebugPanel();
          if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
              Laya["PhysicsDebugDraw"].enable();
          if (GameConfig.stat)
              Laya.Stat.show();
          Laya.alertGlobalError(true);
          Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
      }
      onVersionLoaded() {
          Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
      }
      onConfigLoaded() {
          GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
      }
  }
  new Main();

}());
