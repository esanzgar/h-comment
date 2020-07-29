# h-comment

A React application that features a user autocomplete. [Demo here](https://esanzgar.github.io/h-comment/).

## Installation and running the app

In the project directory, you can run:

```
yarn
yarn start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## General comments about the application

The UserAutocomplete is a 'floating' dropdown-autocomplete component.

I have tested the dropdown-autocomplete component in a textarea for simplicity. I see no reasons why the dropdown-autocomplete component shouldn't work on other a element with a `contenteditable` attribute.

For the getting the X and Y pixel coordinates of the cursor I relied on [this small functionality](https://github.com/component/textarea-caret-position#readme).

Things that don't work yet (I haven't had the time):

- adding a mention when the content is scrolled in the textarea
- positioning the dropdown-autocomplete when it is too close to the window or 'parent' boundaries
- I sometime experienced issues moving up and down on the dropdown-autocomplete.
