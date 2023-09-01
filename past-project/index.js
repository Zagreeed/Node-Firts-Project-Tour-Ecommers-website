const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find that file 😢");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write file 😢");
      resolve("success");
    });
  });
};

// readFileProm(`${__dirname}/txt/dogs.txt`)
//   .then((data) => {
//     console.log(`The breed:${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((data) => {
//     console.log(data.body.message);
//     return writeFileProm("./txt/api-dogs2.txt", data.body.message);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const getDogpic = async () => {
  try {
    const data = await readFilePro("./txt/dogs.txt");
    console.log(`type of breed:${data}`);

    const dogpic1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const dogpic2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const dogpic3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const allPromise = await Promise.all([dogpic1, dogpic2, dogpic3]);

    const imgs = allPromise.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePro("./txt/api-dogs3.txt", imgs.join("\n"));
  } catch (err) {
    console.log(err);

    throw err;
  }

  return "hellow2";
};
console.log("hellow1");
getDogpic()
  .then((x) => {
    console.log(x);
    console.log("hellow3");
  })
  .catch((err) => {
    console.log("ERROR");
  });
