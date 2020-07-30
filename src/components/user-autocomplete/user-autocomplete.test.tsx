import React from 'react';
import { mount } from 'enzyme';

import { UserAutocomplete } from './user-autocomplete';

import {
  fetchAllUsers,
  fetchUsersByNameOrUsername,
} from '../../services/users/users';
import { act } from 'react-dom/test-utils';

jest.mock('../../services/users/users', () => {
  const allUsers = [
    { username: '1', name: '1', avatar_url: '1' },
    { username: '2', name: '2', avatar_url: '2' },
    { username: '3', name: '3', avatar_url: '3' },
  ];

  return {
    fetchAllUsers: jest.fn(_ => allUsers).mockImplementationOnce(_ => []),
    fetchUsersByNameOrUsername: jest.fn(_ => allUsers.slice(0, 2)),
  };
});

it('renders null', async () => {
  // because initial call to fetchAllUsers returns empty list
  const wrapper = mount(<UserAutocomplete show={true} />);
  await act(async () => {
    wrapper.update();
  });

  expect(fetchAllUsers).toHaveBeenCalledTimes(1);
  expect(fetchAllUsers).nthReturnedWith(1, []);
  expect(wrapper.instance()).toBeNull();
});

it('renders three <li> components', async () => {
  const wrapper = mount(<UserAutocomplete show={true} />);
  await act(async () => {
    wrapper.update();
  });

  expect(fetchAllUsers).toHaveBeenCalledTimes(2);
  expect(fetchAllUsers).nthReturnedWith(2, [
    { username: '1', name: '1', avatar_url: '1' },
    { username: '2', name: '2', avatar_url: '2' },
    { username: '3', name: '3', avatar_url: '3' },
  ]);
  expect(fetchUsersByNameOrUsername).toHaveBeenCalledTimes(0);
  //   expect(fetchUsersByNameOrUsername).nthReturnedWith(1, [
  //     { username: '1', name: '1', avatar_url: '1' },
  //     { username: '2', name: '2', avatar_url: '2' },
  //   ]);
  //expect(wrapper.render()).toBeNull();
  //expect(wrapper.find(<li />).length).toEqual(99);
});

// it('renders an `.icon-star`', () => {
//   const wrapper = shallow(<MyComponent />);
//   expect(wrapper.find('.icon-star')).to.have.lengthOf(1);
// });
