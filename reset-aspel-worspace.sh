#!/bin/bash

# Step 1: Reset and clean all submodules
for dir in packages/*; do
  if [ -d "$dir/.git" ]; then
    echo "-----------------------------------------------"
    echo " 🚧  Resetting and cleaning $dir... Please wait!"
    echo "-----------------------------------------------"

    # Navigate to the submodule directory
    cd "$dir"

    # Revert any changes (reset to HEAD)
    git reset --hard

    # Remove untracked files (including node_modules and package-lock.json)
    git clean -fdx

    # Go back to the root directory
    cd - > /dev/null
  fi
done

echo "==============================================="
echo "   ✅  All submodules have been reset and cleaned!  "
echo "==============================================="

# Step 2: Checkout the main or master branch and pull the latest changes
echo "-----------------------------------------------"
echo " 🔄  Checking out main/master and pulling latest changes for all submodules..."
echo "-----------------------------------------------"

git submodule foreach 'git checkout main || git checkout master'
git submodule foreach git pull

echo "==============================================="
echo "   ✅  All submodules have been updated to the latest version!  "
echo "==============================================="

# Step 3: Remove node_modules and package-lock.json across all submodules
find packages -type d -name "node_modules" -exec rm -rf {} +
find packages -type f -name "package-lock.json" -exec rm -f {} +

echo "Cleanup of node_modules and package-lock.json completed."

# Step 4: Reinstall dependencies using Yarn
yarn install

echo "==============================================="
echo "   ✅ Yarn has installed dependencies - ready to run the servers..."
echo "==============================================="
