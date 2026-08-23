/* The three standard prompts. Never edit these between models;
   if a change is ever needed, start a new series and note it here. */

window.GAME_PROMPTS = {
    snake: [
        "Create a complete, playable Snake game as a single HTML file.",
        "All CSS and JavaScript must be inline in that one file.",
        "Requirements: the arrow keys and WASD both steer the snake, food spawns at random positions,",
        "the score and best score are shown and the best score persists between sessions using localStorage,",
        "the snake speeds up gradually as it grows, colliding with a wall or itself ends the game,",
        "and there is a game over screen with a way to restart.",
        "No external libraries, no network requests, no build step. One file only."
    ].join(" "),

    breakout: [
        "Create a complete, playable Breakout game as a single HTML file.",
        "All CSS and JavaScript must be inline in that one file.",
        "Requirements: the paddle is controlled with the mouse and the arrow keys,",
        "the ball bounces off walls, paddle and bricks with sensible physics,",
        "there are at least five rows of coloured bricks that disappear when hit,",
        "some bricks drop power-ups when they break, and what those do is up to you,",
        "the player has three lives, score is tracked per brick,",
        "clearing all bricks shows a win screen and losing all lives shows a lose screen,",
        "both with a way to restart.",
        "No external libraries, no network requests, no build step. One file only."
    ].join(" "),

    freeform: [
        "Build something in 3D as a single HTML file.",
        "What you build is up to you: a scene, a toy, a visualiser, a small world, whatever you think is worth looking at.",
        "All CSS and JavaScript must be inline in that one file, and the 3D has to be your own work,",
        "so WebGL or canvas or CSS transforms, but no engine and no helper library of any kind.",
        "It must run the moment the file is opened, react to the mouse or the keyboard in some way,",
        "and still be interesting after a minute of looking at it.",
        "Do not ask me any questions, do not check anything with me first, and do not explain what you are about to do.",
        "Just build it and give me the file.",
        "No external libraries, no network requests, no build step. One file only."
    ].join(" ")
};

/* Display names, kept next to the prompts so the two never drift apart. */
window.GAME_TITLES = {
    snake: "Snake",
    breakout: "Breakout",
    freeform: "Freeform 3D"
};
