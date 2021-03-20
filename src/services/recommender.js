const Gender = require('../config/gender');
const Workout = require('../models/workout');

/**
 * @param {number} age
 * @returns {[number, number]}
 */
function findAgeLimit(age) {
    if (age < 30) return [0, 29];
    else if (age < 60) return [30, 59];
    else return [60, 120];
}

/**
 * @param {number} rfm
 * @returns {[number, number]}
 */
function findRfmLimit(rfm) {
    if (rfm < 6) return [0, 6];
    else if (rfm < 14) return [6, 14];
    else if (rfm < 18) return [14, 18];
    else if (rfm < 25) return [18, 25];
    else if (rfm < 32) return [25, 32];
    else return [32, 100];
}


/**
 * @param {number} rfm
 * @param {number} age
 * @param {number} freq
 * @param {Gender} gender
 */
async function filterWorkoutData(rfm, age, freq, gender) {
    const allWorkouts = await Workout.find({ gender });

    const [minAge, maxAge] = findAgeLimit(age);
    const [minRfm, maxRfm] = findRfmLimit(rfm);

    return allWorkouts.filter(w =>
        (w.age >= minAge && w.age <= maxAge) &&
        (w.rfm >= minRfm && w.rfm < maxRfm) // maxRfm must be '<'
    );
}


module.exports = {
    filterWorkoutData,
};
