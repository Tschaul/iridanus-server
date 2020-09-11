[![Build Status](https://travis-ci.org/Tschaul/iridanus-server.svg?branch=master)](https://travis-ci.org/Tschaul/iridanus-server)

# Iridanus-server
Server for Iridanus

# TODOS

- make deploy ships for industry a fleet order (tests missing)
- split fleets order (tests missing)
- fire at population when no enemy fleets are there
- loose world when population drops to zero

# Bugs

- sometimes: population = 1, but world is not captured
- notification mail when game goes from PROPOSED to STARTED

# Further Improvements

- help: context based links into docs
- chose color in game lobby

# Some Ideas

- at regular intervals all worlds known to any player get revealed to all players

- Capturing a world with population is not possible. Population must be killed first and own population must be transfered to world in order to take it over. Ships automatically start killing enemy population once no more enemy ships are at the world.

- ships warp twice as fast and cargo capacity ist reduced to half. This should make it more attractive to send ships to the enemy side to scout and harrass.

- arrival and leaving delay happen everytime you warp into or out of a battle/world capturing (except on your own world). This aplies also for cargo fleet. When warping into battle cargo fleet instantly stop their cargo mission.

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
- Points for highest amount of population or enemy ships destroyed
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

- population grows faster
- chance to capture enemy world with population
- drop ships as population
- recall your ships from any world to one of your owned world
- recycling: ships that are destroyed on one of your worlds have a 50% chance to spawn metal
- sacrefice population for metal
- building industry is cheaper
- fleets can transport more metal
- instant strike: when enagaging the enemy ships fire once instantly
- sacrifice population for metal

## Fast realtime challanges

The current architecture allows for only ~1 fast realtime game per engine. Therefore the engine would have to run in the browser of the client. For that the following challanges must be overcome:

- game must be deterministic. i.e. random values but also timestamps in general
- all players must have a webrtc connection. setting new order would happen via a two phase commit with a majority vote (PAXOS??)

To allow for smooth animations/ transitions (e.g. for ships in transit), significant parts of the UI must be redone. Ships must go onto a seperate layer and have their own animation logic.
