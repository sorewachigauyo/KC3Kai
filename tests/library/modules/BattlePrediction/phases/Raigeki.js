QUnit.module('modules > BattlePrediction > phases > Raigeki', function () {
  const Raigeki = KC3BattlePrediction.battle.phases.raigeki;
  const { Side } = KC3BattlePrediction;

  QUnit.module('parsePlayerJson', {
    beforeEach() { this.subject = Raigeki.parsePlayerJson; },
  }, function () {
    QUnit.test('extract player attack data from kcsapi json', function (assert) {
      const json = {
        api_frai: 'defender index',
        api_fydam: 'damage',
        api_fcl: 'accuracy',
      };

      const result = this.subject(json, 'attacker index');

      assert.deepEqual(result, {
        damage: 'damage',
        defender: { side: Side.ENEMY, position: 'defender index' },
        attacker: { side: Side.PLAYER, position: 'attacker index' },
        info: { acc: 'accuracy', damage: 'damage', phase: "raigeki"},
      });
    });
  });

  QUnit.module('parseEnemyJson', {
    beforeEach() { this.subject = Raigeki.parseEnemyJson; },
  }, function () {
    QUnit.test('extract enemy attack data from kcsapi json', function (assert) {
      const json = {
        api_erai: 'defender index',
        api_eydam: 'damage',
        api_ecl: 'accuracy',
      };

      const result = this.subject(json, 'attacker index');

      assert.deepEqual(result, {
        damage: 'damage',
        defender: { side: Side.PLAYER, position: 'defender index' },
        attacker: { side: Side.ENEMY, position: 'attacker index' },
        info: { acc: 'accuracy', damage: 'damage', phase: "raigeki"},
      });
    });
  });
});
