export default class EffectAutoDestory extends Laya.Script {
  onAwake() {
    Laya.timer.once(2000, this, () => {
      this.owner.destroy();
    });
  }
}
