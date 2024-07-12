const usernames = require("./names");
module.exports = { playerNameGenerator, intiNameSet };
function playerNameGenerator(roomid, nameSetArray) {
  let randNumber = Math.floor(Math.random() * nameSetArray[roomid].size);
  console.log(randNumber, nameSetArray[roomid].size);
  for (const itr of nameSetArray[roomid]) {
    if (randNumber <= 1) {
      let rt = itr;
      nameSetArray[roomid].delete(itr);
      return rt;
    }
    randNumber--;
  }
}
function intiNameSet(nameSetArray) {
  for (let i = 0; i < 1000; i++) {
    let x = new Set();
    for (let j = 0; j < 100; j++) {
      x.add(usernames[j]);
    }
    nameSetArray.push(x);
  }
}
