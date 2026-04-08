/**
 * Daily Spark – uplifting, light-hearted content to brighten the mood.
 *
 * Guidelines:
 *  - Jokes are gentle, affirming, and never mock mental health
 *  - Mix of one-liners, puns, and short funny observations
 *  - Safe for all audiences
 */

export const DailyJokes = [
  {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything! (Kind of like that inner critic.)",
  },
  {
    setup: "I told my therapist I was having trouble letting go of the past.",
    punchline: "She said, 'Noted.' I said, 'That's literally what I just said.'",
  },
  {
    setup: "Why did the scarecrow win an award?",
    punchline: "Because he was outstanding in his field. You are too.",
  },
  {
    setup: "I used to hate facial hair...",
    punchline: "...but then it grew on me. (Growth is like that.)",
  },
  {
    setup: "What do you call a sleeping dinosaur?",
    punchline: "A dino-snore. Rest is productive.",
  },
  {
    setup: "Why did the math book look so stressed?",
    punchline: "It had too many problems. You only have to solve one at a time.",
  },
  {
    setup: "I asked the universe for a sign...",
    punchline: "It sent a stop sign. I think it just wants me to breathe for a moment.",
  },
  {
    setup: "What's a computer's favorite snack?",
    punchline: "Microchips. You deserve a snack break too.",
  },
  {
    setup: "Why can't you give Elsa a balloon?",
    punchline: "Because she'll let it go. (Sometimes that's okay.)",
  },
  {
    setup: "I'm reading a book about anti-gravity.",
    punchline: "It's impossible to put down. Kind of like you — once you decide to rise, nothing holds you back.",
  },
  {
    setup: "Did you hear about the guy who invented Lifesavers?",
    punchline: "He made a mint. You're saving lives just by reaching out.",
  },
  {
    setup: "Why do cows wear bells?",
    punchline: "Because their horns don't work. Even when we're 'broken,' we still have something to offer.",
  },
  {
    setup: "I told my doctor I broke my arm in two places.",
    punchline: "He said I should stop going to those places. (Good advice, honestly.)",
  },
  {
    setup: "What do you call cheese that isn't yours?",
    punchline: "Nacho cheese. Not every problem is yours to carry.",
  },
  {
    setup: "Why did the bicycle fall over?",
    punchline: "It was two-tired. Take a rest. Two-tired is valid.",
  },
  {
    setup: "I'm on a seafood diet.",
    punchline: "I see food and I eat it. Nourishing yourself is self-care.",
  },
  {
    setup: "What's brown and sticky?",
    punchline: "A stick. Sometimes the simplest things are the best things.",
  },
  {
    setup: "Why don't skeletons fight each other?",
    punchline: "They don't have the guts. Courage is built one small step at a time.",
  },
  {
    setup: "I asked my dog what two minus two is.",
    punchline: "He said nothing. Silence is sometimes the wisest answer.",
  },
  {
    setup: "What do you call a parade of rabbits hopping backwards?",
    punchline: "A receding hare-line. It's okay to laugh at the small stuff.",
  },
  {
    setup: "Why did the golfer bring an extra pair of pants?",
    punchline: "In case he got a hole in one. Preparation = confidence.",
  },
  {
    setup: "I told my boss I needed a raise because three companies were after me.",
    punchline: "He asked which ones. 'The electric company, the gas company, and the water company.' You've got this.",
  },
  {
    setup: "Why can't Elsa have a balloon?",
    punchline: "She lets things go. That's a superpower.",
  },
  {
    setup: "A skeleton walks into a bar...",
    punchline: "...orders a beer and a mop. Even on the rough days, showing up counts.",
  },
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs! Even the best code needs debugging.",
  },
  {
    setup: "What did the ocean say to the beach?",
    punchline: "Nothing — it just waved. Sometimes just being present is enough.",
  },
  {
    setup: "Why did the tomato turn red?",
    punchline: "Because it saw the salad dressing! Embarrassment means you care.",
  },
  {
    setup: "I tried to write a joke about procrastination...",
    punchline: "I'll finish it later. You did show up today — that's everything.",
  },
];

/**
 * Returns the joke for today based on the day of year,
 * so it changes daily but is consistent all day.
 */
export function getTodaysJoke() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DailyJokes[dayOfYear % DailyJokes.length];
}

/** Returns a random joke */
export function getRandomJoke() {
  return DailyJokes[Math.floor(Math.random() * DailyJokes.length)];
}
