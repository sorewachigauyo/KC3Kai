// Parser for 航空 (aerial combat) phase
(function () {
  const COMBINED_FLEET_MAIN_ALIGN = 6;
  const Kouku = {};
  const { pipe, juxt, flatten, map, filter, Side } = KC3BattlePrediction;
  const KOUKU_PLAYER = ["api_fdam", "api_fcl_flag", "api_fbak_flag", "api_frai_flag"];
  const KOUKU_ENEMY = ["api_edam", "api_ecl_flag", "api_ebak_flag", "api_erai_flag"];
  /*--------------------------------------------------------*/
  /* ----------------------[ PUBLIC ]---------------------- */
  /*--------------------------------------------------------*/

  Kouku.parseKouku = (battleData) => {
    const { createAttack } = KC3BattlePrediction.battle;
    const {
      normalizeFleetDamageArrays,
      parsePlayerJson,
      parseEnemyJson,
      isDamagingAttack,
    } = KC3BattlePrediction.battle.phases.kouku;

    return pipe(
      normalizeFleetDamageArrays,
      juxt([parsePlayerJson, parseEnemyJson]),
      flatten,
      filter(isDamagingAttack),
      map(createAttack)
    )(battleData);
  };

  Kouku.logKouku = (battleData) => {
    const { padDamageArray, extractPlayerInfo, extractEnemyInfo, isValidAttack } = KC3BattlePrediction.battle.phases.kouku;
    return pipe(
      juxt([
        extractPlayerInfo('api_stage3'),
        extractPlayerInfo('api_stage3_combined'),
        extractEnemyInfo('api_stage3'),
        extractEnemyInfo('api_stage3_combined'),
      ]),
      map(padDamageArray),
      ([playerMain, playerEscort, enemyMain, enemyEscort]) => ({
        player: ([].concat(playerMain, playerEscort)).filter(isValidAttack),
        enemy: ([].concat(enemyMain, enemyEscort)).filter(isValidAttack),
      })
    )(battleData);
  };

  /*--------------------------------------------------------*/
  /* ---------------------[ INTERNAL ]--------------------- */
  /*--------------------------------------------------------*/


  Kouku.normalizeFleetDamageArrays = (battleData) => {
    const { extractDamageArray, padDamageArray } = KC3BattlePrediction.battle.phases.kouku;

    return pipe(
      juxt([
        extractDamageArray('api_stage3', 'api_fdam'),
        extractDamageArray('api_stage3_combined', 'api_fdam'),
        extractDamageArray('api_stage3', 'api_edam'),
        extractDamageArray('api_stage3_combined', 'api_edam'),
      ]),
      map(padDamageArray),
      ([playerMain, playerEscort, enemyMain, enemyEscort]) => ({
        api_fdam: [].concat(playerMain, playerEscort),
        api_edam: [].concat(enemyMain, enemyEscort),
      })
    )(battleData);
  };

  Kouku.extractDamageArray = (stageName, damageArrayName) => battleData =>
    (battleData[stageName] && battleData[stageName][damageArrayName]) || [];

  Kouku.padDamageArray = damageArray =>
    (damageArray.length < COMBINED_FLEET_MAIN_ALIGN
      ? damageArray.concat(new Array(COMBINED_FLEET_MAIN_ALIGN - damageArray.length).fill(0))
      : damageArray);

  Kouku.parsePlayerJson = ({ api_fdam }) => api_fdam.map(
    (damage, position) => ({ damage, defender: { side: Side.PLAYER, position }, info: { phase: "kouku", damage: damage }})
  );
  Kouku.parseEnemyJson = ({ api_edam }) => api_edam.map(
    (damage, position) => ({ damage, defender: { side: Side.ENEMY, position }, info: { phase: "kouku", damage: damage }})
  );
 Kouku.extractPlayerInfo = stage_name => battleData => {
    const { extractFromJson } = KC3BattlePrediction.battle.phases;
    const { parsePlayerInfo } = KC3BattlePrediction.battle.phases.kouku;
    if (battleData[stage_name] && battleData[stage_name][KOUKU_PLAYER[0]]) {
      return pipe(
        extractFromJson(KOUKU_PLAYER), 
        map(parsePlayerInfo)
      )(battleData[stage_name]);
    }
    return [];
  };
  Kouku.parsePlayerInfo = ({ api_fdam, api_fcl_flag, api_fbak_flag, api_frai_flag }) =>
    ({ damage: api_fdam, acc: api_fcl_flag, rai_flag: api_frai_flag, bak_flag: api_fbak_flag, defender: { side: Side.PLAYER } });

  Kouku.extractEnemyInfo = stage_name => battleData => {
    const { extractFromJson } = KC3BattlePrediction.battle.phases;
    const { parseEnemyInfo } = KC3BattlePrediction.battle.phases.kouku;
    if (battleData[stage_name] && battleData[stage_name][KOUKU_ENEMY[0]]) {
      return pipe(
        extractFromJson(KOUKU_ENEMY),
        map(parseEnemyInfo)
      )(battleData[stage_name]);
    }
    return [];
  };
  Kouku.parseEnemyInfo = ({ api_edam, api_ecl_flag, api_ebak_flag, api_erai_flag }) =>
    ({ damage: api_edam, acc: api_ecl_flag, rai_flag: api_erai_flag, bak_flag: api_ebak_flag, defender: { side: Side.ENEMY } });

  Kouku.isDamagingAttack = ({ damage }) => damage > 0;
  Kouku.isValidAttack = (attack, position) => {
    if (attack) {
      attack.defender.position = position;
      attack.phase = "kouku";
      return attack.rai_flag || attack.bak_flag;
    }
  };

  Kouku.isDamagingAttack = ({ damage }) => damage > 0;

  /*--------------------------------------------------------*/
  /* ---------------------[ EXPORTS ]---------------------- */
  /*--------------------------------------------------------*/

  Object.assign(KC3BattlePrediction.battle.phases.kouku, Kouku);
}());
