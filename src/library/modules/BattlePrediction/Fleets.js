(function () {
  const Fleets = {};
  const { Side } = KC3BattlePrediction;
  const { pipe, juxt, map, zipWith, over } = KC3BattlePrediction;
  const COMBINED_FLEET_MAIN_ALIGN = 6;
  /*--------------------------------------------------------*/
  /* --------------------[ PUBLIC API ]-------------------- */
  /*--------------------------------------------------------*/

  // Create a Fleets object with the state of the player and enemy Fleets at battle start
  Fleets.getInitialState = (battleData, playerDamecons) => {
    const { extractHps, extractSubInfo, installDamecons } = KC3BattlePrediction.fleets;

    return pipe(
      juxt([
        extractHps('api_f_nowhps', 'api_f_maxhps'),
        extractHps('api_f_nowhps_combined', 'api_f_maxhps_combined'),
        extractHps('api_e_nowhps', 'api_e_maxhps'),
        extractHps('api_e_nowhps_combined', 'api_e_maxhps_combined'),
        pipe(extractSubInfo('api_friendly_info'), extractHps('api_nowhps', 'api_maxhps')),
      ]),
      ([playerMain, playerEscort, enemyMain, enemyEscort, friendMain]) => ({
        [Side.PLAYER]: { main: playerMain, escort: playerEscort },
        [Side.ENEMY]: { main: enemyMain, escort: enemyEscort },
        // No escort fleet found yet for NPC friend fleet support
        [Side.FRIEND]: { main: friendMain, escort: [] },
        log: [],
      }),
      over(Side.PLAYER, map(installDamecons(playerDamecons)))
    )(battleData);
  };

  Fleets.simulateAttack = (fleets, { damage, defender, attacker, info }) => {
    const { getPath } = KC3BattlePrediction.fleets;
    const { dealDamage, takeDamage } = KC3BattlePrediction.fleets.ship;

    if (info) { info.attacker = attacker; info.defender = defender; fleets.log.push(info); }

    return pipe(
      over(getPath(fleets, defender), takeDamage(damage, info)),
      attacker ? over(getPath(fleets, attacker), dealDamage(damage, info)) : x => x
    )(fleets);
  };

  // map() for the whole fleets structure
  // i.e. f => side.forEach(role.forEach(ship.forEach(s => f(s))))
  const mapShips = pipe(map, map, map);

  Fleets.formatFleets = (fleets) => {
    const { formatShip } = KC3BattlePrediction.fleets.ship;
    const fleetsCopy = Object.assign({}, fleets, { log: [] });
    return pipe(
      mapShips(formatShip),
      ({ [Side.PLAYER]: player, [Side.ENEMY]: enemy, [Side.FRIEND]: friend }) => ({
        playerMain: player.main,
        playerEscort: player.escort,
        enemyMain: enemy.main,
        enemyEscort: enemy.escort,
        friendMain: friend.main,
        friendEscort: friend.escort,
      })
    )(fleetsCopy);
  };

  /*--------------------------------------------------------*/
  /* --------------------[ INTERNALS ]--------------------- */
  /*--------------------------------------------------------*/

  /* ----------------[ GET INITIAL STATE ]----------------- */

  Fleets.extractHps = (nowHpsProp, maxHpsProp) => battleData => {
    const { createShip } = KC3BattlePrediction.fleets.ship;

    const nowHps = battleData[nowHpsProp] || [];
    const maxHps = battleData[maxHpsProp] || [];

    if (nowHps.length !== maxHps.length) {
      throw new Error(`Mismatched array lengths: "${nowHpsProp}" and "${maxHpsProp}"`);
    }

    return zipWith(createShip, nowHps, maxHps);
  };

  Fleets.extractSubInfo = (subProp) => battleData => {
    return battleData[subProp] || {};
  };

  Fleets.installDamecons = playerDamecons => (fleet, fleetRole) => {
    const { installDamecon } = KC3BattlePrediction.fleets.ship;

    return pipe(
      ds => ds[fleetRole] || [],
      ds => ds.slice(0, fleet.length),
      ds => zipWith(installDamecon, fleet, ds)
    )(playerDamecons);
  };

  /* -----------------[ SIMULATE ATTACK ]------------------ */

  Fleets.getPath = (fleets, { side, position }) => {
    if (fleets[side].main[position]) {
      return `${side}.main.${position}`;
    }
    const escortIndex = position - COMBINED_FLEET_MAIN_ALIGN;
    if (fleets[side].escort[escortIndex]) {
      return `${side}.escort.${escortIndex}`;
    }
    throw new Error(`Bad target: ${JSON.stringify({ side, position })}`);
  };

  /*--------------------------------------------------------*/
  /* ---------------------[ EXPORTS ]---------------------- */
  /*--------------------------------------------------------*/

  Object.assign(window.KC3BattlePrediction.fleets, Fleets);
}());
