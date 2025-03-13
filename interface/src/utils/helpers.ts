export const parseTones = (tones: string) =>
  tones.split(', ').map((tone) => tone.trim());

export const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});
