Number.isNaN = Number.isNaN || function(value) {
  // eslint-disable-next-line no-self-compare
  return value !== null && (value !== value || +value !== value);
};

if (Number.parseInt === undefined) {
  Number.parseInt = window.parseInt;
}
