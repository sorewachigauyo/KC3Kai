/* global battleData */
QUnit.module('modules > BattlePrediction', function () {
  QUnit.module('analyzeBattle', {
    beforeEach() {
      window.KC3Log = { error: e => console.error(e.message) };

      this.subject = KC3BattlePrediction.analyzeBattle;
    },
  }, function () {
    const { Player, Enemy, Time } = KC3BattlePrediction;

    QUnit.test('partial CF - air raid', function (assert) {
      const battleType = { player: Player.CTF, enemy: Enemy.SINGLE, time: Time.DAY };
      const damecons = {};

      const result = this.subject(battleData.cfLdAirbattle, damecons, battleType);

      assert.equal(result.isPlayerNoDamage, false);
      assert.deepEqual(result.fleets, {
        playerMain: [
          { hp: 62 - 57, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: 50 - 7, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
        ],
        playerEscort: [
          { hp: 26 - 17, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: 13, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: 16, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
        ],
        enemyMain: [
          { hp: 350, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: 88, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: 88, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: 48, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: 60, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: 60, sunk: false, dameConConsumed: false, damageDealt: 0, attacks: [] },
        ],
        enemyEscort: [],
        friendMain: [],
        friendEscort: [],
      });
    });

    QUnit.test('7v12 night to day + damecon used', function (assert) {
      const battleType = { player: Player.SINGLE, enemy: Enemy.COMBINED, time: Time.NIGHT_TO_DAY };
      const damecons = {
        main: [0, 0, 0, 0, 0, 0, 1],
      };

      const result = this.subject(battleData.strikeForceVsCFNightToDayWithDamecon, damecons, battleType);

      assert.equal(result.isPlayerNoDamage, false);
      assert.deepEqual(result.fleets, {
        playerMain: [
          { hp: 77, sunk: false, dameConConsumed: false, damageDealt: 30 + 326 + 113 + 144, attacks: [{damage:[30,0],acc:[1,1],equip:["236","105"],cutin: undefined, ncutin:1,target:[11,11],hp:77,ehp: 9,phase: "hougeki", attacker: {side: "player", position: 0}, defender: {side: "enemy", position: 11}},{damage:[153,173],acc:[1,1],equip:["236","105"],cutin: undefined, ncutin:1,target:[4,4],hp:77,ehp: 70,phase: "hougeki",attacker: {side: "player", position: 0},defender: {side: "enemy", position: 4}},{damage:[65,48],acc:[1,1],equip:["236","105"],ncutin: undefined, cutin:2,target:[0, 0],hp:77,ehp: 284,phase: "hougeki",attacker: {side: "player", position: 0},defender: {side: "enemy", position: 0}},{damage:[62,82],acc:[1,1],equip:["236","105"],ncutin: undefined, cutin:2,target:[0, 0],hp:77,ehp: 19,phase: "hougeki",attacker: {side: "player", position: 0},defender: {side: "enemy", position: 0}}] },
          { hp: 18, sunk: false, dameConConsumed: false, damageDealt: 192 + 329 + 3, attacks: [{damage:[4,188],acc:[1,1],equip:["122","122"],cutin: undefined, ncutin:1,target:[5, 5],hp:18,ehp: 48,phase: "hougeki",attacker: {side: "player", position: 1},defender: {side: "enemy", position: 5}},{damage:[168,161],acc:[1,1],equip:["122","122"],cutin: undefined, ncutin:1,target:[3, 3],hp:18,ehp: 98,phase: "hougeki",attacker: {side: "player", position: 1},defender: {side: "enemy", position: 3}},{damage:[3],acc:[2],equip:[122],ncutin: undefined, cutin:0,target:[0],hp:18,ehp: 27,phase: "hougeki",attacker: {side: "player", position: 1},defender: {side: "enemy", position: 0}}] },
          { hp: 12, sunk: false, dameConConsumed: false, damageDealt: 278 + 70 + 1, attacks: [{damage:[278,0],acc:[2,1],equip:["122","122"],cutin: undefined, ncutin:1,target:[1, 1],hp:31,ehp: 85,phase: "hougeki",attacker: {side: "player", position: 2},defender: {side: "enemy", position: 1}},{damage:[70,0],acc:[1,1],equip:["122","122"],cutin: undefined, ncutin:1,target:[10, 10],hp:12,ehp: 8,phase: "hougeki",attacker: {side: "player", position: 2},defender: {side: "enemy", position: 10}},{damage:[1],acc:[1],equip:[122],ncutin: undefined, cutin:0,target:[0],hp:12,ehp: 20,phase: "hougeki",attacker: {side: "player", position: 2},defender: {side: "enemy", position: 0}}] },
          { hp: 27, sunk: false, dameConConsumed: false, damageDealt: 0 + 295 + 3, attacks: [{damage:[0,0],acc:[1,1],equip:["122","122"],cutin: undefined, ncutin:1,target:[10, 10],hp:27,ehp: 9,phase: "hougeki",attacker: {side: "player", position: 3},defender: {side: "enemy", position: 10}},{damage:[134,161],acc:[1,1],equip:["122","122"],cutin: undefined, ncutin:1,target:[6, 6],hp:27,ehp: 69,phase: "hougeki",attacker: {side: "player", position: 3},defender: {side: "enemy", position: 6}},{damage:[3],acc:[1],equip:[122],ncutin: undefined, cutin:0,target:[0],hp:27,ehp: 24,phase: "hougeki",attacker: {side: "player", position: 3},defender: {side: "enemy", position: 0}}] },
          { hp: 25, sunk: false, dameConConsumed: false, damageDealt: 255 + 373 + 1, attacks: [{damage:[134,121],acc:[1,1],equip:["122","122"],cutin: undefined, ncutin:1,target:[2, 2],hp:25,ehp: 98,phase: "hougeki",attacker: {side: "player", position: 4},defender: {side: "enemy", position: 2}},{damage:[194,179],acc:[1,1],equip:["122","122"],cutin: undefined, ncutin:1,target:[8, 8],hp:25,ehp: 40,phase: "hougeki",attacker: {side: "player", position: 4},defender: {side: "enemy", position: 8}},{damage:[1],acc:[1],equip:[122],ncutin: undefined, cutin:0,target:[0],hp:25,ehp: 21,phase: "hougeki",attacker: {side: "player", position: 4},defender: {side: "enemy", position: 0}}] },
          { hp: 77, sunk: false, dameConConsumed: false, damageDealt: 559 + 1 + 144, attacks: [{damage:[345,214],acc:[2,1],equip:["105","105"],cutin: undefined, ncutin:1,target:[9, 9],hp:77,ehp: 40,phase: "hougeki",attacker: {side: "player", position: 5},defender: {side: "enemy", position: 9}},{damage:[0,1],acc:[1,1],equip:["105","105"],cutin: undefined, ncutin:1,target:[10, 10],hp:77,ehp: 9,phase: "hougeki",attacker: {side: "player", position: 5},defender: {side: "enemy", position: 10}},{damage:[50,94],acc:[1,1],equip:["105","105"],ncutin: undefined, cutin:2,target:[0, 0],hp:77,ehp: 171,phase: "hougeki",attacker: {side: "player", position: 5},defender: {side: "enemy", position: 0}}] },
          { hp: 4, sunk: false, dameConConsumed: true, damageDealt: 0 + 0, attacks: [{acc: 0, attacker: {side: "player", position: 6}, damage: 0, defender: {side: "enemy", position: 0}, ehp: 284, hp: 4, phase: "raigeki"}] },
        ],
        playerEscort: [],
        enemyMain: [
          { hp: -125, sunk: true, dameConConsumed: false, damageDealt: 15, attacks: [{damage:[2,13],acc:[1,1],equip:[553,553],cutin: undefined, ncutin:1,target:[2, 2],hp:655,ehp: 27,phase: "hougeki",attacker: {side: "enemy", position: 0},defender: {side: "player", position: 2}},{damage:[0],acc:[0],equip:[553],ncutin: undefined, cutin:0,target:[5],hp:171,ehp: 77,phase: "hougeki",attacker: {side: "enemy", position: 0},defender: {side: "player", position: 5}}] },
          { hp: -193, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: -157, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: -231, sunk: true, dameConConsumed: false, damageDealt: 4, attacks: [{damage:[2,2],acc:[1,1],equip:[509,509],cutin: undefined, ncutin:1,target:[2, 2],hp:98,ehp: 31,phase: "hougeki",attacker: {side: "enemy", position: 3},defender: {side: "player", position: 2}}] },
          { hp: -256, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: -144, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [] },
        ],
        enemyEscort: [
          { hp: -226, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [{damage:[0],acc:[1],equip:[-1],cutin: undefined, ncutin:0,target:[6],hp:69,ehp: 4,phase: "hougeki",attacker: {side: "enemy", position: 6},defender: {side: "player", position: 6}}] },
          { hp: -157, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [] },
          { hp: -333, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [{damage:[0],acc:[0],equip:[-1],cutin: undefined, ncutin:0,target:[6],hp:40,ehp: 4,phase: "hougeki",attacker: {side: "enemy", position: 8},defender: {side: "player", position: 6}}] },
          { hp: -519, sunk: true, dameConConsumed: false, damageDealt: 12, attacks: [{damage:[12],acc:[1],equip:[-1],cutin: undefined, ncutin:0,target:[6],hp:40,ehp: 2,phase: "hougeki",attacker: {side: "enemy", position: 9},defender: {side: "player", position: 6}}] },
          { hp: -62, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [{damage:[0],acc:[1],equip:[-1],cutin: undefined, ncutin:0,target:[6],hp:9,ehp: 4,phase: "hougeki",attacker: {side: "enemy", position: 10},defender: {side: "player", position: 6}}] },
          { hp: -21, sunk: true, dameConConsumed: false, damageDealt: 0, attacks: [] },
        ],
        friendMain: [],
        friendEscort: [],
      });
    });
  });
});
