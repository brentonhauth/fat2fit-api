const Gender = require('../config/gender');
const Workout = require('../models/workout');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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
 * @param {Gender} gender
 */
async function filterWorkoutData(rfm, age, gender) {
    const allWorkouts = await Workout.find({ gender });

    const [minAge, maxAge] = findAgeLimit(age);
    const [minRfm, maxRfm] = findRfmLimit(rfm);

    return allWorkouts.filter(w =>
        (w.age >= minAge && w.age <= maxAge) &&
        (w.rfm >= minRfm && w.rfm < maxRfm) // maxRfm must be '<'
    );
}

/**
 * @param {mongoose.Document<any>} user
 */
async function setWorkoutsForUser(user) {
    const rfm = user.calcRfm();
    const filtered = await filterWorkoutData(rfm, user.age, user.gender);

    const workouts = filtered.slice(0, user.freq);
    user.workouts = workouts.map(w => w._id);

    const updated = await user.save();
    return updated.populate('workouts').execPopulate();
}


module.exports = {
    filterWorkoutData,
    setWorkoutsForUser,
};
