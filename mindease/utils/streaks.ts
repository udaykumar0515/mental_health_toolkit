// A utility to manage daily streaks

// Helper to check if two dates are on consecutive days
const areConsecutiveDays = (date1: Date, date2: Date): boolean => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  return diffDays === 1;
};

// Helper to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};


/**
 * Retrieves the current streak for a user.
 * Resets the streak if the last activity was not yesterday or today.
 * @param userEmail - The email of the user.
 * @returns The current streak number.
 */
export const getStreak = (userEmail: string): number => {
  const streakData = JSON.parse(localStorage.getItem(`mind_ease_streak_${userEmail}`) || '{}');
  const lastDateStr = streakData.lastDate;
  const currentStreak = streakData.streak || 0;

  if (!lastDateStr) {
    return 0;
  }

  const lastDate = new Date(lastDateStr);
  const today = new Date();

  if (isSameDay(lastDate, today) || areConsecutiveDays(lastDate, today)) {
    return currentStreak;
  }

  // If more than one day has passed, reset the streak
  localStorage.setItem(`mind_ease_streak_${userEmail}`, JSON.stringify({ streak: 0, lastDate: null }));
  return 0;
};

/**
 * Updates the user's streak based on today's activity.
 * Increments if the last activity was yesterday.
 * Resets to 1 if the last activity was before yesterday.
 * Does nothing if activity has already been recorded today.
 * @param userEmail - The email of the user.
 * @returns The new streak number.
 */
export const updateStreak = (userEmail: string): number => {
    const streakData = JSON.parse(localStorage.getItem(`mind_ease_streak_${userEmail}`) || '{}');
    let currentStreak = streakData.streak || 0;
    const lastDateStr = streakData.lastDate;
    const today = new Date();

    if (lastDateStr) {
        const lastDate = new Date(lastDateStr);

        if (isSameDay(lastDate, today)) {
            // Already active today, no change
            return currentStreak;
        }

        if (areConsecutiveDays(lastDate, today)) {
            // It's a new day, and it's consecutive
            currentStreak++;
        } else {
            // Missed a day, reset streak to 1
            currentStreak = 1;
        }
    } else {
        // First time activity
        currentStreak = 1;
    }

    localStorage.setItem(`mind_ease_streak_${userEmail}`, JSON.stringify({ streak: currentStreak, lastDate: today.toISOString() }));
    return currentStreak;
};