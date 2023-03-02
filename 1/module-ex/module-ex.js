// console.log('hello');
// console.log(path.dirname(__filename));
// console.log(__filename);

let a = 10;
const b = 'hello';

function myFn() {
  console.log('fn', this);

  let a = 111;

  const arrow = () => {
    let a = 10;
    console.log('arr', this);
  };

  arrow();
}

module.exports = { myFn };
