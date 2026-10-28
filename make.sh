#!/bin/sh
set -eu
case "${1:-}" in
  lint)
    ./node_modules/.bin/prettier --check '**/*.{mjs,json,yaml,yml,md}'
    node --check skills/factory-maestri/scripts/portfolio.mjs
    node --check tests/portfolio.test.mjs
    git diff --check
    ;;
  format) ./node_modules/.bin/prettier --write '**/*.{mjs,json,yaml,yml,md}' ;;
  test) node --test tests/*.test.mjs ;;
  *) echo 'Usage: ./make.sh lint|format|test' >&2; exit 1 ;;
esac
