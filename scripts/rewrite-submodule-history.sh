#!/usr/bin/env bash

# This script builds on the work by Lucas Jenß, described in his blog
# post "Integrating a submodule into the parent repository", but automates the
# entire process and cleans up a few other corner cases.
# https://x3ro.de/2013/09/01/Integrating-a-submodule-into-the-parent-repository.html

# USAGE

function usage(){
  echo "Usage: $0 <submodule-name> [<submodule-branch>]"
  echo "Merge a single branch of <submodule-name> into a repo, retaining file history."
  echo "If provided then <submodule-branch> will be merged, otherwise master."
  echo ""
  echo "options:"
  echo "  -h, --help                Print this message"
  echo "  -f, --force               Skip the warning message (use with caution)"
  echo "  -v, --verbose             Display verbose output"
}

function abort {
    echo "$(tput setaf 1)$1$(tput sgr0)"
    exit 1
}

function request_confirmation {
    read -p "$(tput setaf 4)$1 (y/n) $(tput sgr0)"
    [ "$REPLY" == "y" ] || abort "Aborted!"
}

function warn() {
  cat << EOF
    This script will convert your "${sub}" git submodule into
    a simple subdirectory in the parent repository while retaining all
    contents, file history and its own submodules.

    The script will:
      * delete the ${sub} submodule configuration from .gitmodules and
        .git/config and commit it.
      * rewrite the entire history of the ${sub} submodule so that all
        paths are prefixed by ${path}.
        This ensures that git log will correctly follow the original file
        history.
      * merge the submodule's tags into its parent repository and commit
        each tag merge individually.
        (only those tags are considered which are reachable from
         the tip of ${sub}/${branch})
      * merge the submodule into its parent repository and commit it.
      * reinstate any of the submodule's own submodules as part of the parent
        repository

    NOTE: This script might completely garble your repository, so PLEASE apply
    this only to a fresh clone of the repository where it does not matter if
    the repo is destroyed.  It would be wise to keep a backup clone of your
    repository, so that you can reconstitute it if need be.  You have been
    warned.  Use at your own risk.

EOF

  request_confirmation "Do you want to proceed?"
}

# HELPERS

function git_version_lte() {
  OP_VERSION=$(printf "%03d%03d%03d%03d" $(echo "$1" | tr '.' '\n' | head -n 4))
  GIT_VERSION=$(git version)
  GIT_VERSION=$(printf "%03d%03d%03d%03d" $(echo "${GIT_VERSION#git version }" | sed -E "s/([0-9.]*).*/\1/" | tr '.' '\n' | head -n 4))
  echo -e "${GIT_VERSION}\n${OP_VERSION}" | sort | head -n1
  [ ${GIT_VERSION} -le ${OP_VERSION} ]
}

function absolute_url {
  local url=$1
  local base=$2

  if [[ $url =~ \.\. ]]; then
    echo "$base/$(basename $url)"
  else
    echo $url
  fi
}

# STEPS

# Remove the submodule files and git configuration from the superproject.
function remove_submodule {
  git config -f .gitmodules --remove-section "submodule.${sub}"
  if git config -f .git/config --get "submodule.${sub}.url"; then
    git config -f .git/config --remove-section "submodule.${sub}"
  fi
  rm -rf "${path}"
  git add -A .
  git commit -m "Remove submodule ${sub}"
  rm -rf ".git/modules/${sub}"
}

# Clone the submodule at the specified branch into a new temporary directory.
# Rewrite the history of the submodule in this directory so that all paths are prefixed
# by ${path}. This ensures that git log will correctly follow the original file
# history. Rename any tags on this branch to prepend the base submodule directory name.
function rewrite_submodule_history {
  local tmpdir=$1
  git clone -b "${branch}" "${url}" "${tmpdir}"
  # Be sure to get all tags as well as we will mege them later on
  git fetch --tags
  pushd "${tmpdir}"
  local tab="$(printf '\t')"
  local subBasename="$(basename $sub)"
  local filter="git ls-files -s | sed \"s:${tab}:${tab}${path}/:\" | GIT_INDEX_FILE=\${GIT_INDEX_FILE}.new git update-index --index-info && mv \${GIT_INDEX_FILE}.new \${GIT_INDEX_FILE} || true"
  FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --index-filter "${filter}" --tag-name-filter "echo \"${subBasename}/\$(cat)\"" HEAD
  for tag in $(git tag --list); do
    if [[ "$tag" != "${subBasename}/"* ]]; then
        git tag -d "$tag"
    fi
  done
  git --no-pager tag --list
  popd
}

# Add our modified submodule clone as a remote to the superproject and fetch all tags.
# Merge the submodule into the superproject from the remote using the "ours" strategy
# to prefer the superproject's history.
function merge_submodule_history {
  local tmpdir=$1

  git remote add "${sub}" "${tmpdir}"
  git fetch --tags "${sub}"

  if git_version_lte 2.8.4
  then
    # Previous to git 2.9.0 the parameter would yield an error
    ALLOW_UNRELATED_HISTORIES=""
  else
    # From git 2.9.0 this parameter is required
    ALLOW_UNRELATED_HISTORIES="--allow-unrelated-histories"
  fi

  for tag in $(git tag --no-merged); do
    # Log all tags and their new commits as a sanity check and fallback for manual resolution
    commit_sha=$(git rev-parse "$tag^{commit}")
    echo "tag $tag points to $commit_sha"
  done

  git merge -s ours --no-commit ${ALLOW_UNRELATED_HISTORIES} "${sub}/${branch}"

  rm -rf $tmpdir
}

# Add the submodule contents to the superproject and commit it, transfering
# any sub-submodules to the superproject as well.
function add_submodule_content {
  # Add submodule content
  git clone -b "${branch}" "${url}" "${path}"

  # Transfer its own submodules to the parent
  add_submod_cmds=""
  if [ -f ${path}/.gitmodules ]; then
    sub_names=$(git config -f ${path}/.gitmodules --get-regex path | sed 's/.* \(.*\)$/\1/g' || true)

    for sub_name in ${sub_names}; do
      sub_branch=$(git config -f ${path}/.gitmodules --get "submodule.${sub_name}.branch") || true
      [ -n "${sub_branch}" ] && sub_branch="-b ${sub_branch}"
      sub_path=$(git config -f ${path}/.gitmodules --get "submodule.${sub_name}.path")
      sub_url=$(git config -f ${path}/.gitmodules --get "submodule.${sub_name}.url")

      # remove the sub-submodule (which should be empty) and cache the command to reinstate it
      rmdir ${path}/${sub_path}
      add_submod_cmds="$add_submod_cmds git submodule add ${sub_branch} --name ${sub_name} -- ${sub_url} ${path}/${sub_path} ; "
    done
  fi

  rm -rf "${path}/.git" "${path}/.gitmodules"
  git add "${path}"
  if [ -n "${add_submod_cmds}" ]; then
    bash -c "${add_submod_cmds}"
  fi

  git commit -m "Merge submodule contents for ${sub}/${branch}"
}

# Clean up any remaining git configuration from the superproject.
function cleanup_submodule {
  git config -f .git/config --remove-section "remote.${sub}"
}

function main() {
  local tmpdir="$(mktemp -d -t submodule-rewrite-XXXXXX)"

  remove_submodule
  rewrite_submodule_history $tmpdir
  merge_submodule_history $tmpdir
  add_submodule_content
  cleanup_submodule

  set +x
  echo "$(tput setaf 2)Submodule merge complete. Push changes after review.$(tput sgr0)"
}

# RUN

set -euo pipefail

declare verbose=false
declare skip_warn=false
while [ $# -gt 0 ]; do
    case "$1" in
        (-h|--help)
            usage
            exit 0
            ;;
        (-v|--verbose)
            verbose=true
            ;;
	(-f|--force)
	    skip_warn=true
	    ;;
        (*)
            break
            ;;
    esac
    shift
done

declare sub="${1:-}"
declare branch="${2:-master}"

if [ -z "${sub}" ]; then
  >&2 echo "Error: No submodule specified"
  usage
  exit 1
fi

shift

if [ -n "${1:-}" ]; then
  shift
fi

if [ -n "${1:-}" ]; then
  >&2 echo "Error: Unknown option: ${1:-}"
  usage
  exit 1
fi

if ! [ -d ".git" ]; then
  >&2 echo "Error: No git repository found.  Must be run from the root of a git repository"
  usage
  exit 1
fi

declare path="$(git config -f .gitmodules --get "submodule.${sub}.path")"
declare superproject_dir="$(dirname $(git config --get remote.origin.url))"
declare url=$(absolute_url $(git config -f .gitmodules --get "submodule.${sub}.url") $superproject_dir)

if [ -z "${path}" ]; then
  >&2 echo "Error: Submodule not found: ${sub}"
  usage
  exit 1
fi

if [ -z "${superproject_dir}" ]; then
  >&2 echo "Error: Could not determine the remote origin for this superproject: ${superproject_dir}"
  usage
  exit 1
fi

if ! [ -d "${path}" ]; then
  >&2 echo "Error: Submodule path not found: ${path}"
  usage
  exit 1
fi

if [ "${skip_warn}" != "true" ]; then
	warn
fi

if [ "${verbose}" == "true" ]; then
  set -x
fi

main
