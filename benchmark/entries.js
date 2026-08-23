/* Every run that has been published, newest first.

   To add one: append an object below and commit. The three game keys are
   snake, breakout and freeform, and each one holds the path to its result page.
   Leave a game out (or set it to null) while it is still unplayed; the card
   will show it as pending until the path is filled in.

   {
       model: "Claude Opus 5",
       effort: "One shot, extended thinking on",
       harness: "claude.ai web chat",
       date: "22 August 2026",   // the day you played it
       games: {
           snake: "results/opus-5-snake.html",
           breakout: null,
           freeform: null
       }
   }
*/

window.LAB_ENTRIES = [];
