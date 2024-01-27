class Trainer {
  private startTime: number = 0;
  private timerInterval: any = null;
  private currentTime: number = 0;

  private currentChar: string = "";

  private allChars: string[] = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  private remainingChars: string[] = [];

  private setCurrentTime: (n: number) => void;
  private setCurrentChar: (n: string) => void;
  private setRemainingChars: (n: string[]) => void;

  constructor(
    setCurrentTime: (n: number) => void,
    setCurrentChar: (s: string) => void,
    setRemainingChars: (s: string[]) => void
  ) {
    this.setCurrentTime = setCurrentTime;
    this.setCurrentChar = setCurrentChar;
    this.setRemainingChars = setRemainingChars;
    console.log("created new object");
  }

  selectRandomChar() {
    return this.remainingChars[
      Math.floor(Math.random() * this.remainingChars.length)
    ];
  }

  selectAndRemoveRandomChar() {
    const index = Math.floor(Math.random() * this.remainingChars.length);
    const char = this.remainingChars[index];
    this.remainingChars.splice(index, 1);
    this.setRemainingChars(this.remainingChars);
    return char;
  }

  startGame() {
    if (this.timerInterval) {
      console.log("game already started");
      return;
    }

    console.log("starting game");

    this.remainingChars = [...this.allChars];
    this.setRemainingChars(this.remainingChars);

    this.newChar();

    this.startTime = Date.now();
    this.timerInterval = setInterval(this.updateTimer.bind(this), 1000);
  }

  endGame() {
    if (!this.timerInterval) {
      console.log("game already ended");
      return;
    }
    console.log("ending game");
    console.log(this.timerInterval);
    clearInterval(this.timerInterval);

    this.timerInterval = null;
    console.log(this.timerInterval);
  }

  resetGame() {
    console.log("reseting game");
    clearInterval(this.timerInterval);
    this.startTime = 0;
    this.timerInterval = null;
    this.currentTime = 0;
    this.setCurrentTime(this.currentTime);
  }

  updateTimer() {
    this.currentTime = Math.floor((Date.now() - this.startTime) / 1000);
    console.log(`Time elapsed: ${this.currentTime} seconds`);
    this.setCurrentTime(this.currentTime);
  }

  newChar() {
    if (this.remainingChars.length == 0) {
      this.gameOver();
      this.setCurrentChar("Finished");
      return;
    }

    this.currentChar = this.selectAndRemoveRandomChar();
    this.setCurrentChar(this.currentChar);
  }

  checkChar(userChar: string) {
    if (userChar.toLowerCase() == this.currentChar?.toLowerCase()) {
      this.newChar();
    }
  }

  gameOver() {
    this.endGame();
  }

  //   checkInput() {
  //     const userInput = this.inputElement.value;
  //     // Add your game logic to check the user input here
  //     console.log("User input:", userInput);
  //   }
}

export default Trainer;
