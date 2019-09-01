## What is this all about

I did not know much about the browser device api and wanted to learn more.
This project is the result of my learning process.
Current focus was on camera devices, more may follow later.
I intentionally left out redux to keep thinks simple.

In the current state you can open/close a preview of all connected cameras and select one to display on the big screen.
Right now the code does not handle a lot of error cases, e.g. unplugging a camera.
This might be added later on.
Also the stream handling logic should be moved out of the react components.
They should only get a stream and render it.
Lets see where this is going. 


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
