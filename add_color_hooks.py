#!/usr/bin/env python3
import re

# Read the file
with open('components/HeaderLibrary.tsx', 'r') as f:
    content = f.read()

# List of headers to update
headers_to_update = [
    'HeaderProtocol', 'HeaderHorizon', 'HeaderStudio', 'HeaderTerminal',
    'HeaderPortfolio', 'HeaderVenture', 'HeaderMetro', 'HeaderModul',
    'HeaderLuxe', 'HeaderGullwing', 'HeaderPop', 'HeaderStark',
    'HeaderOffset', 'HeaderTicker', 'HeaderNoir', 'HeaderGhost', 'HeaderPilot'
]

for header_name in headers_to_update:
    # Pattern to find the opening of the function body after the signature
    pattern = f'({header_name}: React.FC<HeaderProps> = \\(\\{{[^}}]+headerButtonTextColor\\s*\\}}\\) => \\{{)'
    
    # Add the useHeaderColors call right after the opening brace
    replacement = r'\1\n  const colors = useHeaderColors({ headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor });'
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open('components/HeaderLibrary.tsx', 'w') as f:
    f.write(content)

print(f"Added useHeaderColors to {len(headers_to_update)} headers")
