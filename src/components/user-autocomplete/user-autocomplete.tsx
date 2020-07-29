import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

import {
  fetchAllUsers,
  fetchUsersByNameOrUsername,
} from '../../services/users/users';

import Styles from './user-autocomplete.module.css';

type User = import('../../models/user').User;
type Ref = {
  selectCurrent: VoidFunction;
  focusNext: VoidFunction;
  focusPrevious: VoidFunction;
};
type Props = {
  searchTerm?: string; // setting searchTerm to undefined resets to the initial user list
  cursorPosition?: { top: number; left: number; height: number };
  show?: boolean;
  onChange?: (user: User) => void;
};

export const UserAutocomplete = React.memo(
  forwardRef<Ref, Props>(
    ({ searchTerm, cursorPosition, show, onChange }, ref) => {
      const [initialUsers, setInitialUsers] = useState<User[]>([]);
      const [users, setUsers] = useState<User[]>([]);
      const [position, setPosition] = useState<{ top: number; left: number }>();
      const [indexFocus, setIndexFocus] = useState(0);
      const ulRef = useRef<HTMLUListElement>(null);

      useEffect(() => {
        const fetch = async () => {
          const users = await fetchAllUsers();
          setInitialUsers(users);
        };

        fetch();

        // Cancel request;
        // return () => { cleanup; };
      }, []);

      useEffect(() => {
        setIndexFocus(0);

        if (!searchTerm) {
          setUsers(initialUsers);
          return;
        }

        const fetch = async () => {
          const users = await fetchUsersByNameOrUsername(searchTerm);
          setUsers(users);
        };
        fetch();

        // Cancel request;
        // return () => { cleanup; };
      }, [searchTerm, initialUsers]);

      useEffect(() => {
        // Top, left position maybe very close to the lower or right edges of the 'parent' (textarea or div.contenteditable) bounding box.
        // TODO: handle those cases.
        if (cursorPosition === undefined) {
          return;
        }
        const { top, left, height } = cursorPosition;
        setPosition({ top: top + height, left });
      }, [cursorPosition]);

      function selectCurrent() {
        onChange?.(users[indexFocus]);
        setIndexFocus(0);
      }

      function focusNext() {
        let newIndex = indexFocus + 1;
        if (newIndex >= users.length) {
          newIndex = 0;
        }
        setIndexFocus(newIndex);
        (ulRef.current?.childNodes[newIndex] as HTMLLIElement).scrollIntoView();
      }

      function focusPrevious() {
        let newIndex = indexFocus - 1;
        if (newIndex < 0) {
          newIndex = users.length - 1;
        }
        (ulRef.current?.childNodes[newIndex] as HTMLLIElement).scrollIntoView();
        setIndexFocus(newIndex);
      }
      useImperativeHandle(ref, () => ({
        selectCurrent,
        focusNext,
        focusPrevious,
      }));

      if (!show || users.length === 0) {
        return null;
      }

      // TODO: add spiner while loading the users
      return (
        <div className={`card ${Styles.UserDropdown}`} style={position}>
          <ul className="list-group list-group-flush" ref={ulRef}>
            {users.map((user, index) => (
              <li
                className={`list-group-item list-group-item-action list-group-item-action py-1 btn ${
                  index === indexFocus ? Styles.FocusUser : ''
                }`}
                onClick={() => {
                  onChange?.(user);
                  setIndexFocus(0);
                }}
                // onMouseEnter={() => setIndexFocus(index)}
                // onMouseLeave={() => setIndexFocus(0)}
                key={user.username}
              >
                <div className="media">
                  <img
                    loading="lazy"
                    className={`${Styles.UserAvatar} mr-3`}
                    src={user.avatar_url}
                    alt="avatar"
                  />
                  <div className="media-body">
                    <p className="mb-0">{user.name}</p>
                    <small className="text-muted">{user.username}</small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  )
);
