//This determines the game loop for the game - I borrowed much of this code
//https://idiallo.com/blog/javascript-game-state-stack-engine

let State = function () {
    this.name; // Just to identify the State
    this.update = function () {};
    this.render = function () {};
    this.onEnter = function () {};
    this.onExit = function () {};
    this.onPause = function () {};
    this.onResume = function () {};
};
let EmptyState = function(){
    this.name = "EmptyState"; 
    this.render = function(){};
    this.update = function(){};
    this.onEnter = function(){};
    this.onExit = function(){};
}
let StateList = function () {
    let states = [];
    this.pop = function () {
        return states.pop();
    };
    this.push = function (state) {
        states.push(state);
    };
    this.top = function () {
        return states[states.length - 1];
    }
};
let StateStack = function () {
    let states = new StateList();
    states.push(new EmptyState());
    this.update = function () {
        let state = states.top();
        if (state) {
            state.update();
        }
    };
    this.render = function () {
        let state = states.top();
        if (state) {
            state.render();
        }
    };
    this.push = function (state) {
        states.push(state);
        state.onEnter();
    };
    this.pop = function () {
        let state = states.top();
        state.onExit();
        return states.pop();
    };

    this.pause = function () {
        let state = states.top();
        if (state.onPause) {
            state.onPause();
        }
    };

    this.resume = function () {
        let state = states.top();
        if (state.onResume) {
            state.onResume();
        }
    };
};