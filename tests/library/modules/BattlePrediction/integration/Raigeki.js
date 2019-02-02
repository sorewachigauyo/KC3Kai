QUnit.module('modules > BattlePrediction > phases > Raigeki', function () {
  const Raigeki = KC3BattlePrediction.battle.phases.raigeki;
  const { Side, battle: { createAttack } } = KC3BattlePrediction;

  QUnit.module('parseRaigeki', {
    beforeEach() { this.subject = Raigeki.parseRaigeki; },
  }, function () {
    QUnit.test('7v6', function (assert) {
      const json = {
        api_frai: [0, 0, 2, 2, 0, -1, 0],
        api_fydam: [18, 0, 0, 45, 0, 0, 9],
        api_fcl: [1, 0, 0, 1, 0, 0, 1],
        api_erai: [6, -1, -1, -1, -1, -1, -1],
        api_eydam: [30, 0, 0, 0, 0, 0, 0],
        api_ecl: [1, 0, 0, 0, 0, 0, 0],
      };

      const result = this.subject(json);

      assert.deepEqual(result, [
        createAttack({ damage: 18, defender: { side: Side.ENEMY, position: 0 }, attacker: { side: Side.PLAYER, position: 0 }, info: { acc: 1, damage: 18, phase: "raigeki"} }),
        createAttack({ damage: 0, defender: { side: Side.ENEMY, position: 0 }, attacker: { side: Side.PLAYER, position: 1 }, info: { acc: 0, damage: 0, phase: "raigeki"} }),
        createAttack({ damage: 0, defender: { side: Side.ENEMY, position: 2 }, attacker: { side: Side.PLAYER, position: 2 }, info: { acc: 0, damage: 0, phase: "raigeki"} }),
        createAttack({ damage: 45, defender: { side: Side.ENEMY, position: 2 }, attacker: { side: Side.PLAYER, position: 3 }, info: { acc: 1, damage: 45, phase: "raigeki"} }),
        createAttack({ damage: 0, defender: { side: Side.ENEMY, position: 0 }, attacker: { side: Side.PLAYER, position: 4 }, info: { acc: 0, damage: 0, phase: "raigeki"} }),
        createAttack({ damage: 9, defender: { side: Side.ENEMY, position: 0 }, attacker: { side: Side.PLAYER, position: 6 }, info: { acc: 1, damage: 9, phase: "raigeki"} }),

        createAttack({ damage: 30, defender: { side: Side.PLAYER, position: 6 }, attacker: { side: Side.ENEMY, position: 0 }, info: { acc: 1, damage: 30, phase: "raigeki"} }),
      ]);
    });
  });
});
