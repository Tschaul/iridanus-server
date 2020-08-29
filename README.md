[![Build Status](https://travis-ci.org/Tschaul/iridanus-server.svg?branch=master)](https://travis-ci.org/Tschaul/iridanus-server)

# Iridanus-server
Server for Iridanus

# Bugs

- notification mail when game goes from PROPOSED to STARTED

# Further Improvements

- help: context based links into docs
- chose color in game lobby

# Some Ideas

- no more build orders at worlds. instead ships are built automatically

- at regular intervals all worlds known to any player get revealed to all players

- scrapping industry to metal

- automatic cargo: Fleets can be sent onto gates between to adjecent controlled and lost worlds to act as cargo fleet. Cargo between these worlds get automatically according to 'gradients' in metal and population by these cargo fleets. Also population distributes itsself randomly along trading routes.

- there are no more mines. instead world the have simply a lot of metal on them.

- ship transfers happen instantly witout delay

- fleet keys can be created and destroyed at owned worlds

- even more radical: fleets have always 5 ships i.e. remove destinction between fleet and ships

- ships/fleets are built in classes. The more industry a world has the higher the class of ships/fleet it produces. The class defines the firepower and cargo capacity much like the ships before. However such a ship is destroyed fully or not at all i.e. its class does not lower with damage.

- all worlds start with 0 population. All population must therefore migrate there. Worlds without population cannot be owned. Maybe some worlds have population, but those would have ships defending them.

- the time it takes to caputure a world goes up with the population of that world.

## Battle tactics

multiple different attack modes per fleet/world

- Weighted random (default behavior)
- Focus smallest
- Focus biggest
- Focus fleets
- Focus world industry
- Focus world ships
- Focus world population

## Research

- Research gets gathered proportional to population over time
- Research can be spent on 5 trees with five colors similar to MTG colors
- Researched upgrades effect all fleets/worlds instantly
- Only a total of 5 upgrades can be purchased per game

Possible Upgrades:

cooldown for most abilities: ~1 week

white
- ?
- armor: a low percentage of damage is constantly absorbed
- warp bomb: worlds can send bombs (like probes) that do AoE damage to all ships in probed system

blue
- speed: warping takes only a portion of the time
- cloak: ships that are not attacking (on cooldown) and idle can not be seen by the enemy
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
- sacrifice population to get extra metal from mines



