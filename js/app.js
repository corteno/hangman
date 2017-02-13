const words = [
    "hangman",
    "something",
    "doggy"

];
const app = document.getElementById("app");
const difficulties = [
    {
        name: "easy",
        value: 15
    },
    {
        name: "medium",
        value: 10
    },
    {
        name: "hard",
        value: 5
    }
];

var currentState = "";
var currentWord = "";
var difficulty = "";
var mistakesLeft;
var guessedLetters = [];


//----------------------
// States
//----------------------

var startingScreen = () => {
    currentState = "start";
    //Set focus on the input field
    document.getElementById("word-input").focus();


    //On enter press of this input
    document.getElementById("word-input").onkeypress = function (e) {
        if (!e) e = window.event;

        var keyCode = e.keyCode || e.which;

        if (keyCode == '13') {
            var re = new RegExp("[A-Za-z]");

            //Setting word to guess
            currentWord = document.getElementById("word-input").value;
            if (re.test(currentWord)) {
                //console.log(currentWord);

                //Setting difficulty
                difficulty = document.querySelector('input[name="diff[]"]:checked').value;
                //Clearing the div
                clearApp();
                //Starting the game
                game();

            } else {
                console.log("Give me a proper word!");
            }
            return false;
        }
    }


};


var game = () => {
    setDifficulty();
    createLetters();
    createGuessInput();


    document.getElementById("guess-input").onkeypress = function (e) {
        if (!e) e = window.event;

        var keyCode = e.keyCode || e.which;

        if (keyCode == '13') {
            var re = new RegExp("^[A-Za-z]");
            var currentLetter = document.getElementById("guess-input").value;

            if (re.test(currentLetter)) {
                if(!checkLetter(currentLetter)){
                    mistakesLeft--;
                    console.log(mistakesLeft);
                }
            }

            return false;
        }
    };


};

//----------------------
// Common functions
//----------------------


var setDifficulty = () => {
    difficulties.forEach((diff) => {
        if (diff.name == difficulty) {
            mistakesLeft = diff.value;

            var stats = document.createElement("div");
            var diffDisplay = document.createElement("p");
            var mistakesLeftDisplay = document.createElement("p");

            stats.id = "stats";
            diffDisplay.className = "stat";
            mistakesLeftDisplay.className = "stat";

            diffDisplay.innerHTML = `Difficulty: <span class='strong'>${difficulty}</span>`;
            mistakesLeftDisplay.innerHTML = `Mistakes left: <span class='strong'>${mistakesLeft}</span>`;

            stats.appendChild(diffDisplay);
            stats.appendChild(mistakesLeftDisplay);
            appendToApp(stats);
        }
    });
};

var createLetters = () => {
    var lettersWrapper = document.createElement("div");
    lettersWrapper.className = "letters-wrapper";

    for (var i = 0; i < currentWord.length; i++) {
        if (currentWord[i] != " ") {

            var letterElement = document.createElement("div");
            letterElement.className = "letter";
            lettersWrapper.appendChild(letterElement);
        }

    }
    appendToApp(lettersWrapper);
};

var createGuessInput = () => {
    var inputWrapper = document.createElement("div");
    var input = document.createElement("input");

    inputWrapper.className = "input-wrapper";
    input.id = "guess-input";
    input.setAttribute("maxlength", "1");

    inputWrapper.appendChild(input);
    appendToApp(inputWrapper);
    input.focus();
};

var checkLetter = (letter) => {
    var foundLetter = false;

    for (var i = 0; i < currentWord.length; i++) {
        if (letter == currentWord[i] /* check if already typed this letter*/) {
            console.log("correct guess");
            var letterDivs = document.getElementsByClassName("letters-wrapper")[0].children;
            letterDivs[i].innerHTML = letter;
            foundLetter = true;

        }
    }

    if(!foundLetter){
        guessedLetters.push(letter);
        console.log(guessedLetters);
        return false;
    } else {
        return true;
    }
};

var checkGuessedLetters = () => {
    //To be added
};


var clearApp = () => {
    app.innerHTML = "";
};

var appendToApp = (element) => {
    app.appendChild(element);
}


//Starting game
startingScreen();

