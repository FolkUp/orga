#!/bin/bash

# Google Fonts API URLs for optimized woff2 files
# Using the canonical Google Fonts URLs with specific weight and subset parameters

FONTS_DIR="."

# Inter font variants
echo "Downloading Inter fonts..."

# Inter Regular 400
curl -L -o inter-regular.woff2 \
  "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3i6t4v6kDCP4w.woff2" \
  2>/dev/null && echo "✓ inter-regular.woff2 downloaded"

# Inter Medium 500
curl -L -o inter-medium.woff2 \
  "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3i6t4v6lDCP4w.woff2" \
  2>/dev/null && echo "✓ inter-medium.woff2 downloaded"

# Inter Bold 700
curl -L -o inter-bold.woff2 \
  "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3i6t4v6pDCP4w.woff2" \
  2>/dev/null && echo "✓ inter-bold.woff2 downloaded"

# Inter Black 900
curl -L -o inter-black.woff2 \
  "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3i6t4v6qDCP4w.woff2" \
  2>/dev/null && echo "✓ inter-black.woff2 downloaded"

echo ""
echo "Downloading Source Serif Pro fonts..."

# Source Serif Pro Regular 400
curl -L -o source-serif-pro-regular.woff2 \
  "https://fonts.gstatic.com/s/sourceserifpro/v21/neIlzCqWr4j4v-IFg_-c8itM.woff2" \
  2>/dev/null && echo "✓ source-serif-pro-regular.woff2 downloaded"

# Source Serif Pro Bold 700
curl -L -o source-serif-pro-bold.woff2 \
  "https://fonts.gstatic.com/s/sourceserifpro/v21/neIgzCqWr4j4v-IFg_-c8iNhPpNg.woff2" \
  2>/dev/null && echo "✓ source-serif-pro-bold.woff2 downloaded"

# Source Serif Pro Italic 400
curl -L -o source-serif-pro-italic.woff2 \
  "https://fonts.gstatic.com/s/sourceserifpro/v21/neImzCqWr4j4v-IFg_-c8iOLLHOI1g.woff2" \
  2>/dev/null && echo "✓ source-serif-pro-italic.woff2 downloaded"

echo ""
echo "Download complete. File sizes:"
ls -lh *.woff2 2>/dev/null || echo "No fonts downloaded"

