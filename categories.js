const categories = {
  trivia_categories: [
    {
      id: 9,
      name: "General Knowledge"
    },
    {
      id: 10,
      name: "Entertainment: Books"
    },
    {
      id: 11,
      name: "Entertainment: Film"
    },
    {
      id: 12,
      name: "Entertainment: Music"
    },
    {
      id: 13,
      name: "Entertainment: Musicals & Theatres"
    },
    {
      id: 14,
      name: "Entertainment: Television"
    },
    {
      id: 15,
      name: "Entertainment: Video Games"
    },
    {
      id: 16,
      name: "Entertainment: Board Games"
    },
    {
      id: 17,
      name: "Science & Nature"
    },
    {
      id: 18,
      name: "Science: Computers"
    },
    {
      id: 19,
      name: "Science: Mathematics"
    },
    {
      id: 20,
      name: "Mythology"
    },
    {
      id: 21,
      name: "Sports"
    },
    {
      id: 22,
      name: "Geography"
    },
    {
      id: 23,
      name: "History"
    },
    {
      id: 24,
      name: "Politics"
    },
    {
      id: 25,
      name: "Art"
    },
    {
      id: 26,
      name: "Celebrities"
    },
    {
      id: 27,
      name: "Animals"
    },
    {
      id: 28,
      name: "Vehicles"
    },
    {
      id: 29,
      name: "Entertainment: Comics"
    },
    {
      id: 30,
      name: "Science: Gadgets"
    },
    {
      id: 31,
      name: "Entertainment: Japanese Anime & Manga"
    },
    {
      id: 32,
      name: "Entertainment: Cartoon & Animations"
    }
  ]
};

// const out = `
// <select>${categories.trivia_categories
//   .map(category => `<option value="${category.id}">${category.name}</option>`)
//   .join("")}</select>
// `;

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// categories.trivia_categories.forEach(async category => {
//   const easy = await fetch(
//     `https://opentdb.com/api.php?amount=10&category=${
//       category.id
//     }&difficulty=${"easy"}`
//   ).then(response => response.json());
//   await sleep(2000);
//   const medium = await fetch(
//     `https://opentdb.com/api.php?amount=10&category=${
//       category.id
//     }&difficulty=${"medium"}`
//   ).then(response => response.json());
//   await sleep(2000);
//   const hard = await fetch(
//     `https://opentdb.com/api.php?amount=10&category=${
//       category.id
//     }&difficulty=${"hard"}`
//   ).then(response => response.json());
//   await sleep(2000);
//   if (easy.results.length === 0) {
//     console.log(`${category.name} does not have 10 results for easy`);
//     return;
//   }
//   if (medium.results.length === 0) {
//     console.log(`${category.name} does not have 10 results for medium`);
//     return;
//   }
//   if (hard.results.length === 0) {
//     console.log(`${category.name} does not have 10 results for hard`);
//     return;
//   }
// });
