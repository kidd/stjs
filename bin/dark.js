#!/usr/bin/env node

import fs from 'fs'
import glob from 'glob'

/**
 * Create -dark.svg versions of all figures.
 */
const main = () => {
  const root = process.argv[2]
  glob.sync(`${root}/**/figures/*.svg`, { ignore: '**/*-dark.svg' }).forEach(filename => {
    const light = fs.readFileSync(filename, 'utf-8')
    const dark = light.replace(new RegExp('#000000', 'g'), '#ffffff')
    fs.writeFileSync(filename.replace('.svg', '-dark.svg'), dark, 'utf-8')
  })
}

main()
