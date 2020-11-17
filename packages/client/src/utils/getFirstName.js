import capitalize from "src/utils/captitalize";

function getFirstName(string) {
  return capitalize(string.split(" ")[0]);
}

export default getFirstName;
