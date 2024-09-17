# Setting up Web

Setting up React Native for Web with react-native-cli needs some configuration.
Although each web framework will be a little different but the generic setup is same.

We will be using Vite with React + Typescript for this.
Let's start.

## Web Directory

1. Create a web directory in root.
2. Create index.html
3. Create a src folder in web directory.
4. Create main.tsx file in src.

Now we have the the basic web directory set.

## Packages

Install the following packages

- React
- React DOM
- React Native Web
  And Dev dependency
- Vite
- @vitejs/plugin-react
- @types/react-dom
- @eslint/js
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- globals
- typescript-eslint

In the root directory run

```bash
npm install react react-dom react-native-web
npm install -D vite @vitejs/plugin-react @types/react-dom @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript-eslint
```

## Vite Config

Create vite.config.ts in root directory. And paste the following code.

```typescript
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const port = 5173;

const extensions = [
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.css',
  '.json',
  '.mjs',
];

// https://vitejs.dev/config/
export default defineConfig({
  root: './web',
  publicDir: './public',
  plugins: [react()],
  resolve: {
    extensions: extensions,
    alias: {
      'react-native': 'react-native-web',
    },
  },
  server: {
    host: true,
    port,
  },
  build: {
    outDir: './dist',
  },
});
```

Let's see what we changed from normal vite.config file.

- We created extensions for files to be resolved by vite when building application.
- We defined path to root directory of our web with root.
- We defined path to public directory to be used by vite.
- In resolve, we added the alias for react-native to use react-native-web instead when used by vite.
- We defined path to outDir for our web build.

**Note**
All directories are referenced with root. Like build will be provided in ./web/dist not is ./dist

## Web Entry file

We already created the index.html in web and main.tsx in src folder.
Now let's add main.tsx in our index.html file so it can load.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React Native + TS</title>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**And add some code in main.tsx so it uses the react-native code**

```typescript
import {AppRegistry} from 'react-native';
import App from '../../App';

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});
```

As you can see I imported the `App` from the root project file.
For running the application we use `rootTag` and `document` to access the div with id root in my `index.html` file.
**Remember when vite will run, it will use `react-native-web` instead of react-native directly**

## Linting and TypeScript Config

Before moving forward, we need to make sure the our eslint and typescript will work without any issues.
Let's create `eslint.config.ts` `tsconfig.node.json` and `tsconfig.web.json` in our web folder.
Add the following in respective files.

### *eslint.config.ts*

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {ignores: ['dist']},
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true},
      ],
    },
  },
);
```

---

### *tsconfig.node.json*

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["../vite.config.ts"]
}
```

---

### *tsconfig.web.json*

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "./web/src",
    "./**/*.web.tsx",
    "./**/*.web.ts",
    "./**/*.tsx",
    "./**/*.ts"
  ]
}
```
## Web scripts
We have all the neccessary files and configurations. Now we will be adding the scripts in our package.json to run our web application.

`"web": "vite",`
`"build-web": "tsc -b && vite build",`
`"preview": "vite preview"`

## Final Steps
Now let's run `npm run web` and check if it's working.
Oh no! it's not working.
Worry not let's resolve it.

### ERROR - NewAppScreen
We need to understand why this issue arise even though everything is set. 
The thing is that we are importing components from `react-native/Libraries/NewAppScreen` in `App.tsx`. This is not part of public API. 
You can explore it in details [here](https://github.com/necolas/react-native-web/discussions/2052#discussioncomment-853683).

So lets remove the code that uses the imports from `react-native/Libraries/NewAppScreen` and remove these imports.

## Run on Browser
Let's run it.
`npm run web`

**Congratulations!! :):D**
You have successfully configured the react native for web. Now you can use same code, use build command for web to build the website.