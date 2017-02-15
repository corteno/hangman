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

var words = [
    {
        difficulty: "easy",
        word: "something"
    },
    {
        difficulty: "easy",
        word: "dog"
    },
    {
        difficulty: "easy",
        "word": "ferry"
    },
    {
        difficulty: "easy",
        word: "web developement"
    },
    {
        difficulty: "medium",
        word: "brown fox"
    },
    {
        difficulty: "medium",
        word: "lazy doggy"
    },
    {
        difficulty: "medium",
        word: "good boye"
    },
    {
        difficulty: "medium",
        "word": "jumps over"
    },

    {
        difficulty: "hard",
        word: "megszentségteleníthetetlségeskedésietekért"
    },
    {
        difficulty: "hard",
        word: "meticulous"
    }

];

var currentWord = "";
var difficulty = "";
var mistakesLeft;
var guessedLetters = [];
var lettersToGuess = 0;


//----------------------
// States
//----------------------

var startingScreen = () => {
    createStartingScreen();

};


var game = () => {
    setDifficulty();
    createLetters();
    createGuessInput();
    console.log(currentWord);


    document.getElementById("guess-input").onkeypress = function (e) {
        if (!e) e = window.event;

        var keyCode = e.keyCode || e.which;

        if (keyCode == '13') {
            var re = new RegExp("^[A-Za-z]");
            var currentLetter = document.getElementById("guess-input").value;

            if (re.test(currentLetter)) {
                if (!checkLetter(currentLetter)) {
                    updateMistakes();
                }
            }
            if (document.getElementById("guess-input") != undefined) {
                document.getElementById("guess-input").value = "";
            }

            return false;
        }

    };


};

var gameOver = (state) => {
    lettersToGuess = 0;


    if (state == "win") {
        clearApp();
        createGameOverScene(state);

        console.log("Congratulations! You've won!");
    } else if (state == "loss") {
        clearApp();
        createGameOverScene(state);

        console.log("You lost!");
    }


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
            mistakesLeftDisplay.innerHTML = `Mistakes left: <span class='strong' id='mistakes-left'>${mistakesLeft}</span>`;

            stats.appendChild(diffDisplay);
            stats.appendChild(mistakesLeftDisplay);
            appendToApp(stats);
        }
    });
};

var createStartingScreen = () => {
    clearApp();
    var startScreenWrapper = document.createElement("div");
    var inputWrapper = document.createElement("div");
    var label = document.createElement("label");
    var span = document.createElement("span");
    var input = document.createElement("input");
    var first = true;
    var button = document.createElement("button");

    button.className = "start-button";
    button.innerHTML = "Start Game";

    button.addEventListener("click", () => {
        //Setting difficulty
        difficulty = document.querySelector('input[name="diff[]"]:checked').value;

        //Setting current word
        currentWord = getRandomWord(difficulty);

        //Clearing the div
        clearApp();
        //Starting the game
        game();
    });


    //Enable to get input to play with own word
    /*startScreenWrapper.id = "start-screen";
     inputWrapper.id = "input-wrapper";
     input.id = "word-input";
     input.setAttribute("pattern", "[A-Za-z]");

     label.className = "input-label";

     span.innerHTML = "Give me a word";
     span.className = "label-text";


     label.appendChild(span);

     inputWrapper.appendChild(input);
     inputWrapper.appendChild(label);

     startScreenWrapper.appendChild(inputWrapper);*/

    difficulties.forEach((diff) => {
        var radio = document.createElement("input");
        var radioWrapper = document.createElement("div");
        var radioLabel = document.createElement("label");

        radioWrapper.className = "radio-wrapper";
        radioLabel.innerHTML = diff.name;

        radio.type = "radio";
        radio.name = "diff[]";
        radio.value = diff.name;
        if (first) {
            radio.checked = true;
            first = false;
        }

        radioWrapper.appendChild(radio);
        radioWrapper.appendChild(radioLabel);
        startScreenWrapper.appendChild(radioWrapper);

    });

    startScreenWrapper.appendChild(button);
    appendToApp(startScreenWrapper);

    //On enter press of this input
    input.onkeypress = function (e) {
        if (!e) e = window.event;

        var keyCode = e.keyCode || e.which;

        if (keyCode == '13') {
            var re = new RegExp("[A-Za-z]");

            //Setting word to guess
            currentWord = document.getElementById("word-input").value.toLowerCase();
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

    input.focus();
};

var createLetters = () => {
    var lettersWrapper = document.createElement("div");
    lettersWrapper.className = "letters-wrapper";

    for (var i = 0; i < currentWord.length; i++) {
        if (currentWord[i] != " ") {                            //If it's a letter
            var letterElement = document.createElement("div");
            letterElement.className = "letter";
            lettersWrapper.appendChild(letterElement);
            lettersToGuess++;
        } else {                                                // If it's a space
            var spaceElement = document.createElement("div");
            spaceElement.className = "space-element";
            lettersWrapper.appendChild(spaceElement);
        }

    }
    appendToApp(lettersWrapper);
};

var createGuessInput = () => {
    var inputWrapper = document.createElement("div");
    var input = document.createElement("input");
    var label = document.createElement("label");
    var span = document.createElement("span");

    inputWrapper.className = "input-wrapper";
    inputWrapper.id = "guess-wrapper";
    input.id = "guess-input";
    input.className = "guess-input";
    input.setAttribute("maxlength", "1");

    label.className = "input-label";

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(label);
    appendToApp(inputWrapper);
    input.focus();
};

var checkLetter = (letter) => {
    var foundLetter = false;

    for (var i = 0; i < currentWord.length; i++) {
        if (letter == currentWord[i]) {
            var letterDivs = document.getElementsByClassName("letters-wrapper")[0].children;
            letterDivs[i].innerHTML = letter;
            foundLetter = true;
            guessedLetters.push(letter);


            if (lettersToGuess - 1 > 0) {
                lettersToGuess--;
            } else {
                gameOver("win");
            }


        }
    }


    if (!foundLetter && !inGuessedLetters(letter)) {
        guessedLetters.push(letter);
        return false;
    } else {
        return true;
    }
};

var updateMistakes = () => {
    if (mistakesLeft - 1 < 0) {
        gameOver("loss");
    } else {
        mistakesLeft--;
        var mistakes = document.getElementById("mistakes-left");
        mistakes.innerHTML = mistakesLeft;
    }

}

var inGuessedLetters = (letter) => {
    if (guessedLetters.indexOf(letter) == -1) {
        return false;
    } else {
        console.log("Already guessed letter");
        return true;
    }
};

var createGameOverScene = (state) => {
    var gameOverText = document.createElement("p");
    var continueButton = document.createElement("button");

    continueButton.innerHTML = "Continue";
    continueButton.className = "continue-button button";
    continueButton.addEventListener("click", () => {
        createStartingScreen();
    });

    if (state == "win") {
        gameOverText.innerHTML = `Congratulations! You've guessed <span class='strong'>${currentWord}!</span>`;
    } else if (state == "loss") {
        gameOverText.innerHTML = `Sorry! Your word was ${currentWord}.`;
    }


    appendToApp(gameOverText);
    appendToApp(continueButton);
};

var getRandomWord = (difficulty) => {
    var tempWords = [];

    switch (difficulty) {
        case "easy":

            words.forEach((word) => {
                if (word.difficulty == difficulty) {
                    tempWords.push(word);
                }
            });
            return tempWords[getRandomInt(0, tempWords.length)].word;

            break;
        case "medium":
            words.forEach((word) => {
                if (word.difficulty == difficulty) {
                    tempWords.push(word);
                }
            });
            return tempWords[getRandomInt(0, tempWords.length)].word;

            break;
        case "hard":
            words.forEach((word) => {
                if (word.difficulty == difficulty) {
                    tempWords.push(word);
                }
            });
            return tempWords[getRandomInt(0, tempWords.length)].word;
            break;
        default:
            break;
    }

};

var clearApp = () => {
    app.innerHTML = "";
};

var appendToApp = (element) => {
    app.appendChild(element);
}

var getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Starting game
startingScreen();

