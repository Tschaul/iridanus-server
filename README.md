[![Build Status](https://travis-ci.org/Tschaul/iridanus-server.svg?branch=master)](https://travis-ci.org/Tschaul/iridanus-server)

# Iridanus-server
Server for Iridanus

# TODOS

- make deploy ships for industry a fleet order
- split fleets
- build fleets automatically
- remove world orders
- auto capture worlds by transfering population to lost fleet
- turn around when ending cargo mission on foreign world
- remove mines

# Bugs

- notification mail when game goes from PROPOSED to STARTED

# Further Improvements

- help: context based links into docs
- chose color in game lobby

# Some Ideas

- destroyed ships create metal on the world where they are destroyed.

- at regular intervals all worlds known to any player get revealed to all players

- there are no more mines. instead worlds have simply a lot of metal on them.

- ships can no longer be transfered between fleets. Industry produces new fleets in regular intervals. The more industry a world has the more ships do the fleets have it produces. Fleets that loos all there ships are destroyed (intead of lost). You can no longer capture a fleet.

- the time it takes to caputure a world is random and goes up with the population of that world. While capturing ships kill opulation over time until the world is captured

## Research

- Research gets gathered by proportional to population over time
- Research can be spent on 5 trees with five colors similar to MTG colors
- Researched upgrades effect all fleets/worlds instantly
- Only a total of 5 upgrades can be purchased per game

# Other idea:

- Research/developement gets gathered by proportional to population over time
- There is a pool of uprades shared by all plyers.
- When i buy a research/developement no one else can buy it

# Victory condition

- Points for 3 upgrades of same color
- Points for highest amount of ships or population respectively
- Points can be bought with developement
- Points for owning special artefact worlds
- Points for each owned capital world

# Possible Upgrades:

cooldown for most abilities: ~1 week

white
- ?
- armor: a low percentage of damage is constantly absorbed
- warp bomb: worlds can send bombs (like probes) that do AoE damage to all ships in probed system

blue
- speed: warping takes only a portion of the time
- cloak: ships that are not attacking (or on cooldown) and idle can not be seen by the enemy
- vision: all neighboring systems are constantly 'probed' for free

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

- building industry is cheaper
- fleets can transport more metal
- instant strike: when enagaging the enemy ships fire once instantly
- sacrifice population for metal

## Fast realtime challanges

The current architecture allows for only ~1 fast realtime game per engine. Therefore the engine would have to run in the browser of the client. For that the following challanges must be overcome:

- game must be deterministic. i.e. random values but also timestamps in general
- all players must have a webrtc connection. setting new order would happen via a two phase commit with a majority vote (PAXOS??)

To allow for smooth animations/ transitions (e.g. for ships in transit), significant parts of the UI must be redone. Ships must go onto a seperate layer and have their own animation logic.
