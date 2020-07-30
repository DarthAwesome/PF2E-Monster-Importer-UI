# Foundry VTT - PF2E - Monster Import UI
![Preview](https://i.imgur.com/tmNAO84.gif)

Version 1.1.0
* New feature: Can save monsters to local browser storage in JSON format and export back for use in bestiary importer module.

Version 1.0.0
* New feature: mousing over the preview will highlight the corresponding text in the textarea to make it easier to find text that needs tweaking.

* Fix for size, rarity and alignment traits needing to be all caps to ingest properly
* Fix #5 for ranged attacks to show up as "Ranged" in the preview and spells parsed incorrectly if they have commas inside of parenthesis
* Some improved styling to the textarea in general

To open: right click the anvil in top-left; using the anvil-menu from https://gitlab.com/Ionshard/foundry-vtt-anvil-menu Thanks!

## To use: 
1. Start pasting the monster into the pane on the left - works best from official PDF to preserve action costs in [one-action], [two-actions], [three-actions], [reaction] type format, though hopefully that'll be improved with time.
2. If something doesn't look right in the preview, mouseover the preview to highlight the offending text. 
3. When happy with result, click "Import" to see the new NPC Sheet
4. If something went wrong, you can quickly delete the newly created NPC with the delete button, make a tweak and then try again!

## Some gotchas to look out for:
* Items must all be on one line
* Any interaction abilities (those normally on the statblock just above AC and below Items) should be separated by an extra newline from Items
* Actions tend to parse better if they have a newline between them, but parser does a best effort to try and find breakpoints like action costs.
* Immunities should be on the same line as HP, it seems to get messed up right now if they're on a different line.
* Immunities, Weaknesses, Resistances should be in that order
    

### Still to do:
* Update CSS a bit to use screen real-estate better and allow for wider textarea
* Fix Item ingestion to lookup items in compendiums and use those
* Fix focus spellEntry to import as focus instead of based on actual tradition

* Some interactive way to change actions-type from the preview??
* Some way to insert newlines from the preview??

Need to also update the actual NPC sheet some to import some of these things better :)