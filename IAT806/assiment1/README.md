## what is the assignment

for assignment 1 we could create any interactive sketch the idea was to make something weird
and crazy while using these things

- at least three different kinds of shapes
- mouse interaction
- keyboard interaction
- conditionals using if / else
- randomness using random()
- an array
- at least one function we wrote besides setup() and draw()

## my concept

my concept is the difference between day and night during the day,
everything looks normal when you click the sun the landscape becomes a colourful
disco and the craziness and dancing begin.
i wanted the change to feel unexpected.
an octopus, a unicorn, and a tree start dancing together, and you can add pink square rain.
The background also reacts to the mouse.

## instructions on use

- click the sun to enter disco mode.
- click the moon area to return to daytime.
- move the mouse near the disco circles to make them smaller.
- move farther away to make them bigger.
- press s to turn the pink square rain on or off in disco mode.
- the characters dance automatically during disco mode.

## where i used the requirements

- shapes: rectangles for the sky, a circle for the sun, triangles
  for mountains, an arc for the moon, ellipses for the disco
  background, and squares for the rain.
- mouse: clicking the sun changes the mode. mouse position also
  changes the size of the disco circles.
- keyboard: pressing s switches the square rain on or off.
- conditionals: if / else chooses between daytime and disco.
  other conditions control the rain and restart falling squares.
- randomness: random() chooses disco colours, rain positions,
  and falling speeds.
- arrays: arrays store sky colours, disco colours, rain positions,
  rain speeds, and character images.
- functions: i used drawSky(), drawDisco(), drawRain(),
  animateCharacters(), animate(), and getFrameIndex().
- maybe i forgot something idk

## artifacts and where they came from

the three characters are an octopus, a unicorn, and a tree.
their animation frames were generated using chatgpt image generation.
i provided the colour palette and reference images to guide the style.

## citations and ai use

i used the course labs as reference
i used chatgpt to help generate the character images and explain some syntax to show my understanding i wrote it in the code
i used some ai for debugs but i wrote where i used it

## challenges and where things went wrong

one problem was forgetting to declare discoMode before using it.
adding let discoMode = false fixed that took me hours to figure out

i also had to understand the angles used by arc() to draw the moon very complicated
this was confusing because the angles use radians by default.

another challenge was arranging the disco circles in rows.
i used help to understand how row % 2 checks for odd rows and shifts
them sideways although i did it in lab4 but still confused me

i originally wanted hexagons but like the p5 refrence gave me something thst didnt works
, but i liked how the circles looked and decided to keep them.

the background needed to clear every frame so changing circle sizes
would not leave trails i also moved the random colour selection
into draw() because i wanted the disco colours to keep changing.
