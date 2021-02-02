#!/usr/bin/env node

'use strict'

import argparse from 'argparse'
import assert from 'assert'
import fs from 'fs'
import path from 'path'

import {
  loadYaml
} from './utils.js'

/**
 * Main driver.
 */
const main = () => {
  const options = getOptions()
  let numbering = buildNumbering(loadYaml(options.appendix), 'appendix', false)
  options.volumes.forEach(filename => {
    const volume = path.basename(filename, '.yml')
    numbering = Object.assign(numbering,
      buildNumbering(loadYaml(filename).chapters, volume, true))
  })
  fs.writeFileSync(options.output,
    JSON.stringify(numbering, null, 2), 'utf-8')
}

/**
 * Build program options.
 * @returns {Object} Program options.
 */
const getOptions = () => {
  const parser = new argparse.ArgumentParser()
  parser.add_argument('--volumes', { nargs: '+' })
  parser.add_argument('--appendix')
  parser.add_argument('--output')
  return parser.parse_args()
}

/**
 * Build numbering lookup table.
 * @param {Object} entries What to build numbering for.
 * @param {string} volume What volume this is.
 * @param {Boolean} numeric Use numbers (if not, use letters).
 * @returns {Object} slug-to-number-or-letter lookup table.
 */
const buildNumbering = (entries, volume, numeric) => {
  const result = {}
  const start = 'A'.charCodeAt(0)
  entries.forEach((fileInfo, i) => {
    assert(!(fileInfo.slug in result),
      `Duplicate chapter slug ${fileInfo.slug}`)
    const id = numeric ? `${i + 1}` : String.fromCharCode(start + i)
    result[fileInfo.slug] = { id, volume }
  })
  return result
}

// Run program.
main()
