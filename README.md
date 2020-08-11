![phaser3-parceljs-template](https://user-images.githubusercontent.com/2236153/71606463-37a0da80-2b2e-11ea-9b5f-5d26ccc84f91.png)

# Phaser3 + TypeScript + Parcel Template
> For people who want to spend time making Phaser 3 games in TypeScript instead of configuring build tools.

![License](https://img.shields.io/badge/license-MIT-green)

This is a fork of [phaser3-typescript-parcel-template](https://github.com/ourcade/phaser3-typescript-parcel-template).

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/), and [Parcel](https://parceljs.org/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js.

Install Node.js with `nvm`:

```bash
nvm install node

nvm use node
```

Then install Parcel:

```bash
yarn global add parcel-bundler
```

## Getting Started

Clone this repository to your local machine:

```bash
git clone https://github.com/edwinjoseph/template-phaser-3.git
```

This will create a folder named `template-phaser-3`. You can specify a different folder name like this:

```bash
git clone https://github.com/edwinjoseph/template-phaser-3.git my-folder-name
```

Go into your new project folder and install dependencies:

```bash
cd template-phaser-3 # or 'my-folder-name'

yarn
```

Start development server:

```
yarn start
```

To create a production build:

```
yarn build
```

Production files will be placed in the `dist` folder. Then upload those files to a web server. 🎉

## Project Structure

```
    .
    ├── dist
    ├── node_modules
    ├── public
    ├── src
    │   ├── anims
    │   ├── events
    │   ├── scenes
    │   │   ├── Game.ts
    │   ├── index.html
    │   ├── main.ts
    ├── package.json
```

This template assumes you will want to organize your code into multiple files and use TypeScript.

TypeScript files are intended for the `src` folder. `main.ts` is the entry point referenced by `index.html`.

There is a `scenes` folder in `src` where the `Game.ts`, as well as any other scenes in the game. 

You will also find an `anims` and `events` folder in src where animation and event files will sit respectively.


## Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served at http://localhost:8000/images/my-image.png

Example `public` structure:

```
    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...
```

These can be loaded by Phaser via:
```js
    // these can be loaded by Phaser via
    this.image.load('my-image', 'images/my-image.png')
```
or by importing assets and using them like so:
```js
    import images from 'public/images/*.png';

    this.image.load('my-image', images['my-image'])    
```


## TypeScript ESLint

This template uses a basic `typescript-eslint` set up for code linting.

It does not aim to be opinionated.

## Dev Server Port

You can change the dev server's port number by modifying the `start` script in `package.json`. We use Parcel's `-p` option to specify the port number.

The script looks like this:

```
parcel src/index.html -p 8000
```

Change 8000 to whatever you want.

## Other Notes

[parcel-plugin-clean-easy](https://github.com/lifuzhao100/parcel-plugin-clean-easy) is used to ensure only the latest files are in the `dist` folder. You can modify this behavior by changing `parcelCleanPaths` in `package.json`.

[parcel-plugin-static-files](https://github.com/elwin013/parcel-plugin-static-files-copy#readme) is used to copy static files from `public` into the output directory and serve it. You can add additional paths by modifying `staticFiles` in `package.json`.

## License

[MIT License](https://github.com/edwinjoseph/template-phaser-3/blob/master/LICENSE)
