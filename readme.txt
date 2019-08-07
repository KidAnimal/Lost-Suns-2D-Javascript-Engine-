Welcome to the Brendon Reynolds' Term Project 

Installation Instructions...

1. $npm install 
2. $ npm i --save lodash

Gameplay...

Controls 

W. Walk Right 
A. Walk Left
S. Walk Up
D. Walk Down 

Space Bar - Attack 
Shift - Projectile 
Shift When Boss Attacking - Parry

To Win - Kill The Boss...

SCENARIO - 
echo "# Lost-Suns-2D-Javascript-Engine-" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/KidAnimal/Lost-Suns-2D-Javascript-Engine-.git
git push -u origin master
This is essentially the foundation for a game that I hope to continue making. 
It is essentially a Diablo style action RPG in which the player picks a character, 
and follows a story...or at least thats what I would like it to be. 

What this application is, is a game where the player, plays a character and fights a boss. 
As there are visual queues with animaton not implemented yet, the player recieves audio queues and 
can see counters change. The player needs to dodge enemy attacks, shoot at a range or parry to win. 

Things We Learned In Class That I Implemented...

HTML5 Canvas - Game 
Audio - Game Audio 
Forms - Character Name/Class Change
Objects - Character, Boss, ect 
Arrays - Loot, ect. 
XML Loading - LootTable XML file
Web Worker - Simple Web Worker Run First Time Player is Hit 
Local Storage - Local Storage in Both Angular and Javascript
Two Way Binding - Character Name and Type 
Filter - Check Two way Binding For Spaces and adds underscore. 
Routing - Links, route to different ng-views. 
Services - SetTimeOut, Interval. 
Directives - ng-click


Known Bugs... 

*** Please Note This Game Does Contain Bugs and Is Being Tested ***

#   When hitting delete it will restart the game, however in doing so will 
    double increase the speed of the game counter, and thus attack speeds and 
    code execution.

#   Loot is only pushed into the loot array when an item is looted. This means  
    in order to see loot in the game you need to reload after picking up an item. 
    Looting will be completely reworked.

#   Items can be looted multiple times, however the looted parameter is only changed once.
    I will leverage this later on to only allow for a single drop. For example 
    if(items[$index].looted = true){DO NOT DROP}
