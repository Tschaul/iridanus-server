let attacker = 20;
let defender = 10;

let round = 0;

while(attacker > 0 && defender > 0) {
  const tempAttacker = attacker;
  const tempDefender = defender;

  attacker -= 0.094276 * Math.ceil(tempDefender);
  defender -= 0.094276 * Math.ceil(tempAttacker);
  round++;
  console.log({attacker, defender, round})

}