# All volumes
VOLUMES := vol1 vol2

# Website output directory.
DOCS := docs

# Configuratio files.
CONFIG_COMMON := common.yml
CONFIG_VOLUMES := $(patsubst %,%.yml,${VOLUMES})
CONFIG_APPENDIX := appendix.yml
CONFIG_ALL = ${CONFIG_COMMON} ${CONFIG_VOLUMES} ${CONFIG_APPENDIX}

# Numbering for all volumes.
NUMBERING := ${DOCS}/numbering.js

# Chapters (input and output).
CHAPTERS_MD := $(wildcard */index.md)
CHAPTERS_HTML := $(patsubst %/index.md,${DOCS}/%/index.html,${CHAPTERS_MD})

# Exercise Markdown source.
EXERCISES_MD := $(wildcard */x-*/problem.md) $(wildcard */x-*/solution.md)

# Markdown-formatted links table used to build chapters.
LINKS_TABLE := links-table.md

# Figures (input and output).
FIGURES_IN := $(wildcard */figures/*.svg)
FIGURES_OUT := $(patsubst %,${DOCS}/%,${FIGURES_IN})

# Static files (input and output).
STATIC_IN := .nojekyll CNAME favicon.ico index.html \
  $(wildcard static/*.*) \
  $(wildcard static/fonts/*/*.*)
STATIC_OUT := $(patsubst %,${DOCS}/%,${STATIC_IN})

# Tools used to create and update things.
TOOLS := $(filter-out bin/utils.js,$(wildcard bin/*.js))

# ----------------------------------------------------------------------

.DEFAULT: commands

## commands: show available commands.
commands:
	@grep -h -E '^##' ${MAKEFILE_LIST} | sed -e 's/## //g' | column -t -s ':'

## html: rebuild HTML without serving.
html: ${FIGURES_OUT} ${STATIC_OUT}

## bib.md: bibliography as Markdown.
bib.md: bib.yml bin/bib.js
	bin/bib.js \
	--input $< \
	--output $@

## gloss.md: glossary as Markdown.
gloss.md: gloss.yml bin/gloss.js ${CHAPTERS_MD} ${EXERCISES_MD}
	bin/gloss.js \
	--glosario \
	--input $< \
	--output $@ \
	--files ${CHAPTERS_MD} ${EXERCISES_MD}

## links-table.md: Markdown-formatted links table used to build HTML.
links-table.md: links.yml bin/links.js
	bin/links.js \
	--input $< \
	--output $@

## docs/numbering.js: Volume numbering.
${NUMBERING}: ${CONFIG_COMMON} ${CONFIG_VOLUMES} ${CONFIG_APPENDIX}
	bin/numbering.js \
	--volumes ${CONFIG_VOLUMES} \
	--appendix ${CONFIG_APPENDIX} \
	--output $@

# ----------------------------------------------------------------------

## settings: show all settings.
settings:
	@echo "CHAPTERS_HTML =" ${CHAPTERS_HTML}
	@echo "CHAPTERS_MD =" ${CHAPTERS_MD}
	@echo "CONFIG_ALL =" ${CONFIG_ALL}
	@echo "DOCS =" ${DOCS}
	@echo "EXERCISES_MD =" ${EXERCISES_MD}
	@echo "FIGURES_IN =" ${FIGURES_IN}
	@echo "FIGURES_OUT =" ${FIGURES_OUT}
	@echo "STATIC_IN =" ${STATIC_IN}
	@echo "STATIC_OUT =" ${STATIC_OUT}
	@echo "VOL =" ${VOL}
	@echo "VOLUMES =" ${VOLUMES}

# ----------------------------------------------------------------------

# Chapter HTML.
# FIXME: remove vol1.yml
${DOCS}/%/index.html: %/index.md bin/html.js links-table.md gloss.yml
	bin/html.js \
	--config ${CONFIG_ALL} \
	--input $< \
	--output $@ \
	--links links-table.md \
	--numbering ${NUMBERING} \
	--glossary gloss.yml \
	--root .

# Static files.
${DOCS}/static/%: static/%
	@mkdir -p $(dir $@)
	cp $< $@

# Static files in root directory.
${DOCS}/%: ./%
	@mkdir -p $(dir $@)
	cp $< $@

# SVG figures.
${DOCS}/%.svg: %.svg
	@mkdir -p $(dir $@)
	cp $< $@

# Tools.
${TOOLS}: bin/utils.js
	touch $@
