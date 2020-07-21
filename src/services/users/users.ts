import allUsers from './UserData.json';

type User = import('../../models/user').User;

// This is no very realistic. Instead of expecting all the users, it is more common to be given a subset of users
// (for example: lastest mentioned by the user, or other users that have been referenced him/her).
// I could emulate a real fetch request with a window.setTimeout
export async function fetchAllUsers(): Promise<User[]> {
  return Promise.resolve(
    allUsers.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    })
  );
}

// It would more useful to have a more flexible query term (that allows to search by only username, name, sorting, etc.)
export function fetchUsersByNameOrUsername(
  valueToFind: string
): Promise<User[]> {
  const searchTerm = valueToFind.toLocaleLowerCase();
  return Promise.resolve(
    allUsers.filter(
      user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
    )
  );
}
