#!/usr/bin/env bash
set -euo pipefail

# check-suppressions.sh
# Minimal script: run npm audit, extract CVE/GHSA IDs via jq, then
# prune entries from each cve-exceptions.json whose cve is not present.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required. Install it (e.g., brew install jq) and retry." >&2
  exit 1
fi

AUDIT_JSON=$(mktemp)
AUDIT_IDS_JSON=$(mktemp)
cleanup() { rm -f "$AUDIT_JSON" "$AUDIT_IDS_JSON"; }
trap cleanup EXIT

# Run audit and capture current vulnerabilities
if ! npm audit --json > "$AUDIT_JSON"; then
  echo "npm audit returned non-zero exit; continuing with captured output" >&2
fi

# Build a JSON array of uppercase IDs from audit JSON using jq only
jq -r '
  tostring
  | [ scan("CVE-\\d{4}-\\d+|GHSA-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}") ]
  | map(ascii_upcase)
  | unique
' "$AUDIT_JSON" > "$AUDIT_IDS_JSON"

# Safety: if no IDs found, exit without making changes
if ! jq -e 'type == "array" and length > 0' "$AUDIT_IDS_JSON" >/dev/null; then
  echo "No CVE/GHSA IDs found in audit output; skipping changes."
  exit 0
fi

# For each suppression file, remove entries whose cve is not in audit IDs
find packages -type f -name 'cve-exceptions.json' -print0 | while IFS= read -r -d '' file; do
  removed=$(jq --argfile ids "$AUDIT_IDS_JSON" '
    ((.suppressions // []) | length)
    - ([ (.suppressions // [])[]
        | select((.cve // "") as $c | ($ids | index(($c|tostring|ascii_upcase))))
      ] | length)
  ' "$file")
  if [[ "$removed" -gt 0 ]]; then
    tmp=$(mktemp)
    jq --argfile ids "$AUDIT_IDS_JSON" '
      .suppressions = (.suppressions // [])
      | .suppressions = [ .suppressions[] | select((.cve // "") as $c | ($ids | index(($c|tostring|ascii_upcase)))) ]
    ' "$file" > "$tmp"
    mv "$tmp" "$file"
    echo "${file#"$PWD/"}: removed $removed suppression(s)"
  fi
done

echo "Check complete."