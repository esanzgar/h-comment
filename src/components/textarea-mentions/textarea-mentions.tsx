import React, { useState, useRef, forwardRef, memo } from 'react';

import getCaretCoordinates from 'textarea-caret';

import { UserAutocomplete } from '../user-autocomplete/user-autocomplete';

type User = import('../../models/user').User;

// TODO: test if this function works RTL languages
function findWordOnCursor({
  value,
  selectionStart,
  selectionEnd,
}: {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}): RegExpExecArray | undefined {
  const wordRegex = /\S+/g;
  let wordOnCursor;
  while ((wordOnCursor = wordRegex.exec(value)) !== null) {
    if (
      wordOnCursor.index <= selectionStart &&
      wordRegex.lastIndex >= selectionEnd
    ) {
      return wordOnCursor;
    }
  }
  return undefined;
}

type RefFromExotic<T> = T extends React.ForwardRefExoticComponent<
  React.RefAttributes<infer T2>
>
  ? T2
  : never;

type Props = {
  onMention?: (
    user: User,
    replacePosition: { start: number; end: number }
  ) => void;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaMentions = memo(
  forwardRef<HTMLTextAreaElement, Props>(({ onMention, ...props }, ref) => {
    const [searchTerm, setSearchTerm] = useState<string>();
    const [cursorPosition, setCursorPosition] = useState<{
      top: number;
      left: number;
      height: number;
    }>();
    const [replacePosition, setReplacePosition] = useState<{
      start: number;
      end: number;
    }>();
    const [show, setShow] = useState(false);
    const userAutocompleteRef = useRef<RefFromExotic<typeof UserAutocomplete>>(
      null
    );

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { currentTarget } = event;
      props.onChange?.(event);

      const wordOnCursor = findWordOnCursor(currentTarget);

      if (wordOnCursor?.[0].startsWith('@')) {
        // TODO: take into account top and left initial position of the textarea and
        // if the cursor is scrolled area (modulus operator [reminder] of cursor top position and height of the textarea)
        const cursor = getCaretCoordinates(
          currentTarget,
          currentTarget.selectionEnd -
            (currentTarget.selectionEnd - wordOnCursor.index) // calculate X, Y as if the cursor would be on the caret
        );
        setCursorPosition(cursor);
        setReplacePosition({
          start: wordOnCursor.index,
          end: wordOnCursor.index + wordOnCursor[0].length,
        });
        setSearchTerm(wordOnCursor[0].slice(1));
        setShow(true);
      } else {
        setShow(false);
        setSearchTerm(undefined);
      }
      (ref as React.MutableRefObject<HTMLTextAreaElement>).current?.focus();
    };

    const onMentionUser = (user: User) => {
      if (replacePosition === undefined) {
        return;
      }
      onMention?.(user, replacePosition);
      (ref as React.MutableRefObject<HTMLTextAreaElement>).current?.focus();

      setSearchTerm(undefined);
      setShow(false);
    };

    const handleKeys = (event: React.KeyboardEvent) => {
      if (show === false) {
        return;
      }

      if (event.key === 'Enter') {
        userAutocompleteRef.current?.selectCurrent();
        event.preventDefault();
      } else if (event.key === 'Tab') {
        userAutocompleteRef.current?.selectCurrent();
        event.preventDefault();
      } else if (event.key === 'ArrowDown') {
        userAutocompleteRef.current?.focusNext();
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        userAutocompleteRef.current?.focusPrevious();
        event.preventDefault();
      }
    };

    return (
      <>
        <UserAutocomplete
          searchTerm={searchTerm}
          onChange={onMentionUser}
          cursorPosition={cursorPosition}
          show={show}
          ref={userAutocompleteRef}
        ></UserAutocomplete>

        <textarea
          ref={ref}
          {...props}
          onChange={onChange}
          onKeyDown={handleKeys}
        ></textarea>
      </>
    );
  })
);
