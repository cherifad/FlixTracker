function slugify(str) {
  if(!str) return 'string-is-empty'
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
}

function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + '...' : str
}

export { slugify, truncate }