PUT YOUR .MP3 FILES IN THIS FOLDER
==================================

1. Copy your .mp3 files here (this folder).
2. Open ../music.js and edit MUSIC_PLAYLIST at the top:
   one line per file, exact file name (case matters!).

   Example — if you add "Blue Bird.mp3" and "Gurenge.mp3":

   const MUSIC_PLAYLIST = [
     'music/Blue Bird.mp3',
     'music/Gurenge.mp3',
   ];

3. Push everything to GitHub. Done.

Notes:
- The name shown in the bottom-left corner of the site = the file name (without .mp3).
- MUSIC_SHUFFLE (in music.js): false = plays your list in order, true = random.
- If a track name is wrong/missing, the player skips it automatically
  (check the browser console for a warning message).
