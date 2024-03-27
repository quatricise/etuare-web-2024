function createRowImage() {
  const input = El("input", "input--image", [["name", "fix-this-shit-later"], ["type", "file"], ["multiple"]])
  Q("#upload-form--inputs").append(input)
}

function createRowText() {
  const input = El("textarea", "input--text", [["name", "fix-this-shit-later"]])
  Q("#upload-form--inputs").append(input)
}