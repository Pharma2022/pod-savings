#!/bin/bash

# Array of component names
components=(
  "avatar" "badge" "breadcrumb" "button" "calendar" "card" "chart" "checkbox"
  "collapsible" "command" "dialog" "dropdown-menu" "form" "hover-card" "input"
  "label" "popover" "progress" "scroll-area" "select" "separator" "sheet" "sidebar"
  "skeleton" "table" "tooltip"
)

# Loop through the components and install each one
for component in "${components[@]}"; do
  echo "Installing $component..."
  npx shadcn@latest add "$component"
done

echo "Installation complete!"
