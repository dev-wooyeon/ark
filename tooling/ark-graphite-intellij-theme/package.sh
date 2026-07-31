#!/bin/sh
set -eu

root_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
build_dir="$root_dir/build/ark-graphite-intellij-theme"
dist_dir="$root_dir/dist"

rm -rf "$build_dir"
mkdir -p "$build_dir/lib" "$dist_dir"

(
  cd "$root_dir/src/main/resources"
  jar --create --file "$build_dir/lib/ark-graphite-intellij-theme.jar" .
)

rm -f "$dist_dir/graphite-theme.zip" "$dist_dir/ark-graphite-intellij-theme.zip"
(
  cd "$root_dir/build"
  zip -qr "$dist_dir/graphite-theme.zip" ark-graphite-intellij-theme
)
