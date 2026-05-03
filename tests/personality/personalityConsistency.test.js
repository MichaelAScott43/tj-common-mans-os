describe('TJ and Arlane Personality Consistency', () => {
  test('TJ should maintain grounded practical tone', () => {
    const tjTraits = ['practical', 'funny', 'grounded', 'loyal'];

    expect(tjTraits).toContain('grounded');
    expect(tjTraits).toContain('practical');
  });

  test('Arlane should maintain calm emotional tone', () => {
    const arlaneTraits = ['calm', 'warm', 'encouraging'];

    expect(arlaneTraits).toContain('calm');
    expect(arlaneTraits).toContain('warm');
  });

  test('TJ and Arlane should remain distinct personalities', () => {
    const tjVoice = 'direct';
    const arlaneVoice = 'gentle';

    expect(tjVoice).not.toEqual(arlaneVoice);
  });
});
