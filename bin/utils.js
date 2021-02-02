'use strict'

import assert from 'assert'
import fs from 'fs'
import path from 'path'
import url from 'url'
import yaml from 'js-yaml'

/**
 * Extract directory name from file path.
 * @param {string} callerURL Path to work with.
 * @returns {string} Directory name.
 */
export const dirname = (callerURL) => {
  return path.dirname(url.fileURLToPath(callerURL))
}

/**
 * Ensure output directory exists.
 * @param {string} outputPath File path.
 */
export const ensureOutputDir = (outputPath) => {
  const dirName = path.dirname(outputPath)
  fs.mkdirSync(dirName, { recursive: true })
}

/**
 * Build full options from command-line arguments and configuration files.
 * @param {Object} fromArgs Parsed arguments.
 */
export const fullOptions = (fromArgs) => {
  let result = {}
  fromArgs.config.forEach(filename => {
    result = Object.assign(result, loadYaml(filename))
  })
  return Object.assign(result, fromArgs)
}

/**
 * Get all glossary references from a file.
 * @param {string} text Text of file.
 * @returns {Array<string>} Keys of all glossary references.
 */
export const getGlossaryReferences = (text) => {
  const pat = /<g\s+key="(.+?)">/g
  const matches = [...text.matchAll(pat)]
  return matches.map(m => m[1])
}

/**
 * Load multiple numbering files and consolidate.
 * @param {Array<string>} filenames Files to read.
 * @returns {Object} merged numbering.
 */
export const loadNumbering = (filenames) => {
  let result = {}
  filenames.forEach(filename => {
    const text = fs.readFileSync(filename, 'utf-8')
    result = Object.assign(result, JSON.parse(text))
  })
  return result
}

/**
 * Load a YAML file.
 * @param {string} filename File to load.
 * @returns {Object} YAML.
 */
export const loadYaml = (filename) => {
  return yaml.safeLoad(fs.readFileSync(filename, 'utf-8'))
}

/**
 * Save a YAML file.
 * @param {string} filename File to write.
 * @param {Object} data YAML.
 */
export const saveYaml = (filename, data) => {
  fs.writeFileSync(filename, yaml.safeDump(data), 'utf-8')
}
