const topics = require("./topics");
const words = require("./words");
module.exports = function generateTopicandWord(data, roomObj) {
  const generateTopic = Math.floor(Math.random() * topics.length);
  const chosenTopic = topics[generateTopic];
  const generateWord = Math.floor(Math.random() * words[chosenTopic].length);
  const chosenWord = words[chosenTopic][generateWord];
  console.log(chosenTopic, chosenWord);
  // chosenWord.toUpperCase();
  roomObj[data.room].currentTopic = chosenTopic.toUpperCase();
  roomObj[data.room].currentWord = chosenWord.toUpperCase();
  roomObj[data.room].currentRound++;
};
