[![Build Status](https://travis-ci.org/Tschaul/iridanus-server.svg?branch=master)](https://travis-ci.org/Tschaul/iridanus-server)

# Iridanus-server
Server for Iridanus

# TODOS


- CTRL to select multiple fleets / button to toggle mutliple selection mode
- rally orders at world that are given to every fleet that is built
- faster capturing with bigger majority (delta_t ~ -1 * (dominance_rel - 1) / dominance_rel)
- chat / direct messages in game
- diplomacy / conditional fire orders
- command points: see below
- store game history in seperate files (one per timestamp)
- better star background (more relastic size and color distribution)

# Bugs

# Further Improvements

- skipping time in dev mode
- help: context based links into docs
- chose color in game lobby

# Some Ideas

- instead of artifacts worlds as landmarks: new resource: artifacts which spawn at all worlds like metal, special worlds have more of it. artifacts are transported like metal to the home world. Every artifacts brought home unlocks one research point. technologies (see below) can be purchased with research points. When spent artifacts stay at the home world so they can be gathered again by an onther player when the home world is captured. Win condition: the player that possesses a majority of all artifacts wins the game.
OR: artifacts can not be transporeted. "research" is given by artifacts times populations at each world. Researching tech duration is inversly proportional to research. Win condition is the same.

- command points: regenerate (capacitor charge curve) to a maximum equal to population count over 1 to 2 weeks. can be spent on buffs per ship:
    - speed: fleet warps faster
    - aggressive: more damage
    - defensive: takes less damage
    - convincing: capture worlds faster/easier

- 4 classes of ships: freighter for cargo and building industry, and three sizes of military fleets with one, two or three slots for upgrades. Upgrades would be chosable in ship designer from those bought with research/developement.

- ships have a delay when starting or ending a cargo mission (need to modify the ships to change between civil and military mode). During this swith all damage taken is doubled.

- no more arriving and leaving delay. Explicit 'retreat' order needed to leave a fight which takes some time during which the fleets gets double damage.

- ships warp twice as fast and cargo capacity is reduced to half. This should make it more attractive to send ships to the enemy side to scout and harrass.

- you can only have as many ships + industry as you have population

- instead of spell casting upgrades, the particular upgrade enables you to build a 'big ship' (a.k.a deathstar, juggernaut) at a world, which can cast the spell.

## Research

# Artefact Worlds

Artefacts are randomly scattered across the map at random. Artefacts cannot be transfered. When a world with an artefact is captured the type fo artefact can be chosen from a hand of cards that is shared between all players. When one artefact is placed a new card is chosen from the deck and all players get notified. Every artefact exists at most once per game. The artefact of a world can not be switched afterwards and is fixed for the game. The player that controls the world of the artefacts gains the perc/bonus of the artefact. Therefore artefacts are taken over by other players when the world is captured.

# Possible Upgrades:

cooldown for most abilities: ~1 week

- armor: a percentage of damage is absorbed
- warp bomb: worlds can send bombs that do AoE damage to all ships in probed system
- speed: warping takes only a portion of the time unless transporting cargo
- cloak: ships at given world become invisible fow a period until it attacks
- scan: reveal any world and neighbroing worlds for a few days
- stim: decreases weapon cooldown at world for a period of time
- bombs: more damage agains enemy population
- weapons: permanently increase normal damage by percentage
- storm: deals damage to all enemy ships in the system
- blink: fleets can attack instantly after arrival (no arrival delay)
- repair: a fraction of destroyed ships per fleet get regenerated over time
- reflection: percentage of damage on ships is reflected back
- population grows faster
- drop ships as population
- recall your ships from any world to one of your owned world
- recycling: ships that are destroyed on one of your worlds have a chance to spawn metal
- sacrifice population for metal
- building industry is cheaper
- fleets can transport more metal
- fleets can transport more population
- mind control one other fleet for a period of time
- freeze all ships at world for period of time
- world lose less population from ship attacks / takes longer to capture world
- tactical retreat: no leaving delay
- population generates more upkeep
- disable any artefact for a period of time
- reduce production of ships at any world for a period of time
- disable enemy ships weapons at given world for a period of time
- population needs less space (populationLimit is bigger)

## Fast realtime challenges

The current architecture allows for only ~1 fast realtime game per engine. Therefore the engine would have to run in the browser of the client. For that the following challanges must be overcome:

- game must be deterministic. i.e. random values but also timestamps in general
- all players must have a webrtc connection. setting new order would happen via a two phase commit with a majority vote (PAXOS??)

To allow for smooth animations/ transitions (e.g. for ships in transit), significant parts of the UI must be redone. Ships must go onto a seperate layer and have their own animation logic.

## AI

Four modules:

- mind: rates the position in the game and allocates fleets to the other modules. Decides when to be greedy, safe or aggressive to what amount. Also decides which enemy to attack.
- greed: allocates given ships to cargo routes and deploys them as industry to maximize the production of new ships.
- fear: allocates given ships to defending.
- fury: coordinates attacks with given ships.

## Old ideas

# Victory condition

- Points for 3 upgrades of same color
- Points for highest amount of population or enemy ships destroyed or industry
- Points can be bought with developement
- Points for owning special artefact worlds
- Points for each owned capital world

OR:

first palyer to reach a certain population wins.

# Possible Upgrades:

cooldown for most abilities: ~1 week

white
- ?
- armor: a low percentage of damage is constantly absorbed
- warp bomb: worlds can send bombs (like probes) that do AoE damage to all ships in probed system

blue
- speed: warping takes only a portion of the time unless transporting cargo
- cloak: ships that are not attacking (or on cooldown) and idle can not be seen by the enemy
- vision: ?

black
- stim: costs ships and decreases weapon cooldown for a period of time
- bomb: instant damage to worlds (industry, ships, population)
- sacrifice: Does AoE to all fleets including own ones

red
- charge: instant extra damage proportional to normal damage
- weapons: permanently increase normal damage by low percentage
- storm: deals damage to all enemy ships in the system

green
- blink: fleets can attack instantly after arrival with an increased damage output
- repair: a fraction of destroyed ships per fleet get regenerated with a time delay
- reflection: Deals damage to enemies proportional of there total fleet ships

more ideas for upgrades:

- population grows faster
- chance to capture enemy world with population
- drop ships as population
- recall your ships from any world to one of your owned world
- recycling: ships that are destroyed on one of your worlds have a 50% chance to spawn metal
- sacrifice population for metal
- building industry is cheaper
- fleets can transport more metal
- instant strike: when enagaging the enemy ships fire once instantly
- mind control one other fleet