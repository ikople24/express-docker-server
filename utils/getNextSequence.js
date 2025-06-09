// utils/getNextSequence.js

async function getNextSequence(db, name) {
  const counters = db.collection('counters');
  const result = await counters.findOneAndUpdate(
    { _id: name },
    { $inc: { sequence_value: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  const number = result.value.sequence_value.toString().padStart(6, '0');
  return `CMP-${number}`;
}

module.exports = { getNextSequence };