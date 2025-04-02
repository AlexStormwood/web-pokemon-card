# Holofoil

Types: 
- Border foil (e.g. yellow/silver borders gaining a holosheet. This is typically the "Rare" type of foil.)
- Art foil (e.g. artwork clipped/masked to display the holosheet across some of the art. This is typically the "Rare" type of foil.)
- Background foil (e.g. holosheet across the type texture or type colour background of the card, clipped/masked to not obscure the card text. This is typically the "Reverse Holo" type of foil.)

Stamps (e.g. set launch promo stamps) and some logos (e.g. eCard/eSeries) also have a holofoil effect on them, typically matching one of the other foil types already on the card.

In some TCG eras, card names and other resources (such as HP) are also printed in holofoil, again typically matching one of the other foil types already on the card.


## Implementation progress

Highlighting from cursor working, but the blending modes and masking functionality needs more work. Firefox supports `element()`, which would solve a lot of problems, but other browsers do not have that function yet.

I think this will need to be one big div over the whole card that masks to several different points.

And/or figure out how to make the shiny appear in multiple elements at the same time.