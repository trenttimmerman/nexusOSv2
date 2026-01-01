#!/usr/bin/env python3
import re

# Read the file
with open('components/HeaderLibrary.tsx', 'r') as f:
    content = f.read()

# List of headers to update (excluding Canvas, Nebula, Bunker, Orbit which are done)
headers_to_update = [
    'HeaderProtocol', 'HeaderHorizon', 'HeaderStudio', 'HeaderTerminal',
    'HeaderPortfolio', 'HeaderVenture', 'HeaderMetro', 'HeaderModul',
    'HeaderLuxe', 'HeaderGullwing', 'HeaderPop', 'HeaderStark',
    'HeaderOffset', 'HeaderTicker', 'HeaderNoir', 'HeaderGhost', 'HeaderPilot'
]

for header_name in headers_to_update:
    # Pattern to match the function signature
    old_pattern = f'export const {header_name}: React.FC<HeaderProps> = \\(\\{{ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart \\}}\\)'
    
    # New signature with color props
    new_signature = f'''export const {header_name}: React.FC<HeaderProps> = ({{ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}})'''
    
    # Replace the signature
    content = re.sub(old_pattern, new_signature, content)

# Write back
with open('components/HeaderLibrary.tsx', 'w') as f:
    f.write(content)

print(f"Updated {len(headers_to_update)} header function signatures")
