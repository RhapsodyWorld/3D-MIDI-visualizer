var MidiRenderer = function() {

  var animator = null;
  var midi;
  var notes;

  var offsetDelay = 100; // add delay to fix animation bug (ms)

  // Method to add note to scene
  function _addNote(noteID) {
  	var note = new Note().setNoteID(noteID);
  	animator.onNoteAdded(note);
  }

  // Convert elapsed time to midi ticks
  function _timeToTicks(time) {
    // Time is given i ms
    var sec = (time / 1000);
    // Get beats per second
    var bps = midi.getBPM() / 60;
    var currentBeat = bps * sec;

    var tick = midi.getTicksPerBeat() * currentBeat;

    return tick;
  }

  function render(time) {
    // Get current tick
    var tick = _timeToTicks(time);

    var nArray = notes;
    // Loop through all non-played notes
    for (i = 0; i < nArray.length; i++) {
      // If note should not be played, break the loop since array i sorted by time
      if (nArray[i].start + offsetDelay > tick)
        break;

      // If note should be played, but has not been added to the scene, add it
      _addNote(nArray[i].note);
      // Remove the note from the array
      notes.splice(i, 1);
    }
  }

  function init(midiObject, anim) {
    midi = midiObject;
    animator = anim;

    var tracks = midiObject.getTracks();
    // Get first track only
    notes = tracks[0].notes;

    return this;
  }

  return {
    init: init,
    render: render
  }

}