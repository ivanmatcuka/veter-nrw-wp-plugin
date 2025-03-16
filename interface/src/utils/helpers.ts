export const parseTones = (tones: string) =>
  tones.split(', ').map((tone) => tone.trim());

export const a11yProps = (index: number) => ({
  'aria-controls': `simple-tabpanel-${index}`,
  id: `simple-tab-${index}`,
});
