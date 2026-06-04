export function isPhase2Enabled(): boolean {
  return process.env.NEXT_PUBLIC_PHASE_2 === 'true';
}
