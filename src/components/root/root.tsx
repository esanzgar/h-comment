import React, { useState, useRef } from 'react';

import { TextareaMentions } from '../textarea-mentions/textarea-mentions';

export function Root() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>();
  const [textAlt, setTextAlt] = useState<string>('');

  const insertMention = () => {
    let length = 0;

    setText(text => {
      if (text === undefined) {
        length = '@type'.length;
        return '@type';
      }
      length = `${text}\n@type`.length;
      return `${text}\n@type`;
    });

    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(length - 4, length);
    }, 0);
  };

  const onMention: NonNullable<
    React.ComponentProps<typeof TextareaMentions>['onMention']
  > = ({ name, username }, { start, end }) => {
    // TODO: This replacement assumes LTR language
    setText(
      text =>
        `${text?.slice(0, start)}@${username} ${text?.slice(end).trimLeft()}`
    );
    setTextAlt(
      text =>
        `${text?.slice(
          0,
          start
        )} <a href="https://hypothes.is/users/${username}" style="pointer: cursor">${name}</a> ${text
          ?.slice(end)
          .trimLeft()}`
    );
  };

  const onChange = ({
    currentTarget: { value },
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(value);
    setTextAlt(value.replace(/\n/gm, '<br>'));
  };

  return (
    <>
      <div className="h-100 row align-items-center">
        <div className="col-md-3"></div>
        <div className="col-md-6 ">
          <TextareaMentions
            ref={textareaRef}
            placeholder="Write your comment here..."
            className="container-fluid"
            rows={5}
            value={text}
            onMention={onMention}
            onChange={onChange}
          ></TextareaMentions>
          <button
            className="badge badge-secondary float-right btn"
            onClick={insertMention}
          >
            @
          </button>
        </div>
        <div className="col-md-3"></div>

        <div className="col-md-3"></div>
        <div className="col-md-6">
          <h4>Testing on contentEditable (not working yet)</h4>
          <div
            contentEditable
            // onInput={event =>
            //   event.currentTarget.textContent &&
            //   setText(event.currentTarget.textContent)
            // }
            style={{ backgroundColor: '#FFF', height: 100 }}
            dangerouslySetInnerHTML={{
              __html: `${textAlt}`,
            }}
          ></div>
          <div className="col-md-3"></div>
        </div>
      </div>
    </>
  );
}
