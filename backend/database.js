import { LowSync, JSONFileSync } from 'lowdb';
import _ from 'lodash';

let database;

export const init = () => {
  const adapter = new JSONFileSync('data.json');
  database = new LowSync(adapter);
  database.read();
  if (!database.data.scores) {
    database.data.scores = [];
    database.write();
  }
};

export const getScores = () => {
  return  _.sortBy(database.data.scores, (item) => -item.score);  
};

export const addScore = (name, score) => {
  database.data.scores.push({ name, score });
  database.write();
};
