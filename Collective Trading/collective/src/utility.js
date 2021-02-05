export function makeKeywords(productName) {
  const keywords = productName.toLowerCase().split(" ");

  const searchTerms = [];

  for (let i = 0; i < keywords.length; i++) {
    searchTerms.push(keywords[i]);
    let word = keywords[i];
    for (let j = i + 1; j < keywords.length; j++) {
      word += " " + keywords[j];
      searchTerms.push(word);
    }
  }
  return searchTerms;
}

export function displayLoginError(error) {
  switch (error.code) {
    case "auth/invalid-email":
    case "auth/email-already-in-use":
    case "auth/weak-password":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return error.message;
    default:
      return "Error during authentication. Please try again later!";
  }
}

export function calcCartTotal(cartItems) {
  let sum = 0.0;
  cartItems.forEach((item) => {
    sum += item.product.price;
  });

  return sum;
}
