/**
 * Add common options to argument parser.
 * @param {Object} parser Argument parser.
 * Other parameters are extra options.
 */
export const addCommonArguments = (parser, ...extras) => {
  const args = ['--common', '--volume', '--docs', '--root']
  args.forEach(arg => parser.add_argument(arg))
  extras.forEach(arg => parser.add_argument(arg))
}

/**
 * Fill in file paths for all files in a set.
 * @param {Object} options Object with .root, .html, .extras, .chapters, and .appendices.
 * @returns {Array<Object>} Concatenated and decorated file information.
 */
export const createFilePaths = (options) => {
  const allEntries = getAllEntries(options)
  allEntries.forEach((fileInfo, i) => {
    assert('slug' in fileInfo,
      `Every page must have a slug ${Object.keys(fileInfo)}`)
    fileInfo.index = i

    // Markdown source file
    if (!('source' in fileInfo)) {
      fileInfo.source = path.join(options.root, fileInfo.slug, 'index.md')
    }

    // Problems and solutions (if any)
    if ('exercises' in fileInfo) {
      fileInfo.exercises.map(ex => {
        ex.problem = path.join(options.root, fileInfo.slug, ex.slug, 'problem.md')
        ex.solution = path.join(options.root, fileInfo.slug, ex.slug, 'solution.md')
      })
    }

    // Output HTML
    if ('html' in fileInfo) {
      fileInfo.html = path.join(options.html, fileInfo.html)
    } else {
      fileInfo.html = path.join(options.html, fileInfo.slug, 'index.html')
    }
  })

  // Mark entries as chapters or not.
  options.chapters.forEach(fileInfo => {
    fileInfo.isChapter = true
  })
  options.extras.forEach(fileInfo => {
    fileInfo.isChapter = false
  })
  options.appendices.forEach(fileInfo => {
    fileInfo.isChapter = false
  })

  return allEntries
}

/**
 * Get all entries from options.
 * @param {Object} options Options with .extras, .chapters, and .appendices.
 * @returns {Array<Object>} Linearized chapters
 */
export const getAllEntries = (options) => {
  return [
    ...options.extras,
    ...options.chapters,
    ...options.appendices
  ]
}

/**
 * Get all Markdown source files.
 * @param {Object} options Options with .extras, .chapters, and .appendices.
 * @returns {Array<string>} All Markdown file paths.
 */
export const getAllSources = (options) => {
  const result = []
  getAllEntries(options).forEach(entry => {
    result.push(entry.source)
    if ('exercises' in entry) {
      entry.exercises.forEach(ex => {
        result.push(ex.problem)
        result.push(ex.solution)
      })
    }
  })
  return result
}
