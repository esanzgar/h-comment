import { fetchAllUsers, fetchUsersByNameOrUsername } from './users';

describe('fetchAllUsers', () => {
  test('retrieve all users with fetchAllUsers', async () => {
    const allUsers = await fetchAllUsers();
    expect(allUsers.length).toEqual(200);
    expect(allUsers[0].username < allUsers[199].username).toEqual(true);
  });
});

describe('fetchUsersByNameOrUsername', () => {
  test('retrieve all users', async () => {
    const allUsers = await fetchUsersByNameOrUsername('');
    expect(allUsers.length).toEqual(200);
    expect(allUsers[0].username < allUsers[199].username).toEqual(true);
  });

  test('retrieve only one user by matching username', async () => {
    const search = 'cmorales3u';
    const user = await fetchUsersByNameOrUsername(search);
    expect(user.length).toEqual(1);
    expect(user[0].username).toEqual(search);
  });

  test('retrieve only one user by matching name', async () => {
    const search = 'Amanda Kelly';
    const user = await fetchUsersByNameOrUsername(search);
    expect(user.length).toEqual(1);
    expect(user[0].name).toEqual(search);
  });

  test('retrieve only one user by matching username (ignoring case)', async () => {
    const search = 'cmorales3u';
    const user = await fetchUsersByNameOrUsername(search.toLocaleUpperCase());
    expect(user.length).toEqual(1);
    expect(user[0].username).toEqual(search);
  });

  test('retrieve only one user by matching name (ignoring case)', async () => {
    const search = 'Amanda Kelly';
    const user = await fetchUsersByNameOrUsername(search.toLocaleUpperCase());
    expect(user.length).toEqual(1);
    expect(user[0].name).toEqual(search);
  });

  test('retrieve no user', async () => {
    const search = '@cmorales3u';
    const user = await fetchUsersByNameOrUsername(search);
    expect(user.length).toEqual(0);
  });
});
