// utils/getNextSequence.js


export async function getNextSequence(db, name) {
  const counters = db.collection('counters');
  const result = await counters.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  const number = result.value.seq.toString().padStart(6, '0'); // เช่น 000001
  return `CMP-${number}`;
}