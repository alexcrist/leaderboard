import _ from 'lodash';
import { JSONFileSync, LowSync } from 'lowdb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

let database;

export const init = () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const file = join(__dirname, 'data.json')
  const adapter = new JSONFileSync(file);
  database = new LowSync(adapter);
  database.read();
  if (!database.data?.scores) {
    database.data = { scores: [] };
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

export const removeScore = (name, score) => {
  for (let i = 0; i < database.data.scores.length; i++) {
    const scoreItem = database.data.scores[i];
    console.log(scoreItem);
    if (
      scoreItem.name === name 
      && Number(scoreItem.score) === Number(score)
    ) {
      database.data.scores.splice(i, 1);
      break;
    }
  }
  database.write();
};