import { readFile, writeFile } from 'node:fs/promises';
const packages = [
  ['Next.js', 'next/license.md'],
  ['React', 'react/LICENSE'],
  ['React DOM', 'react-dom/LICENSE'],
  ['Tailwind CSS', 'tailwindcss/LICENSE'],
  ['FlyonUI (including its upstream notices)', 'flyonui/LICENSE'],
  ['Material Icons', 'material-icons/LICENSE'],
  ['Manrope', '@fontsource-variable/manrope/LICENSE'],
  ['Fraunces', '@fontsource-variable/fraunces/LICENSE'],
];
const sections = await Promise.all(
  packages.map(
    async ([name, path]) =>
      `${name}\n${'='.repeat(name.length)}\n\n${await readFile(`node_modules/${path}`, 'utf8')}`
  )
);
await writeFile(
  'public/THIRD_PARTY_NOTICES.txt',
  `Hikari official website — third-party notices\n\n${sections.join('\n\n---\n\n')}`
);
