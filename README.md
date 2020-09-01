## What is this all about

A version of the page is can be accessed at https://signed.github.io/device-demonstrator/.

I did not know much about the browser device api and wanted to learn more.
This project is the result of my learning process.
Current focus was on camera devices, more may follow later.

In the current state you can open/close a preview of all connected cameras and select one to display on the big screen.
Right now the code does not handle a lot of error cases, e.g. unplugging a camera.
This might be added later on.
Also the stream handling logic should be moved out of the react components.
They should only get a stream and render it.
Lets see where this is going. 

## [MediaStream API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API)

## [Settings vs. constraints](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints)
Constraints are a way to specify what values you need, want, and are willing to accept for the various constrainable properties.
Settings are the actual values of each constrainable property at the current time. 

## Opportunities
- deploy the sample app as github pages of this project
- automate deployment with github actions

## Available Scripts

In the project directory, you can run:

### `HTTPS=true yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Why support chrome 79

The fakes library emits ES2020 that contains the nullish coalescing operator.
When running `yarn start` only supporting the latest browsers this results in the error:
```
Module parse failed: Unexpected token (100:65)
File was processed with these loaders:
 * ./node_modules/react-scripts/node_modules/babel-loader/lib/index.js
You may need an additional loader to handle the result of these loaders.
```
Reason is, that cra does not include the babel plugins to transpile this syntax down.
Chrome added support for this syntax in version 80.
Setting the Chrome version to 79 in browserslist ensures that cra adds the necessary babel plugins, and the code is transpiled.

Babel caches the transpiled code between builds that has to be deleted when making changes to the browserslist.
```shell
rm -rf node_modules/.cache/babel-loader && yarn start
```
