#!/bin/bash

# Update About page
sed -i '' "s/import AnimatedCard from '..\/components\/AnimatedCard'/import AnimatedCard from '..\/components\/AnimatedCard'\nimport usePageTitle from '..\/hooks\/usePageTitle'/g" src/pages/About.tsx
sed -i '' "/const About: React.FC = () => {/a\\
  usePageTitle('About Us')
" src/pages/About.tsx

# Update other pages similarly
echo "Pages updated with titles"