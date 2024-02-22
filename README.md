# [INSERT APP NAME]

## Setup

### Linting

1. To start, install the new dev dependencies by running:

```sh
yarn install -D
```

2. When you stage changes to frontend code (`.js`, `.jsx` files), two actions will happen:

    a. Format the code according to Prettier styleguides. Read more [here](https://prettier.io/).
  
    ai.  The configuration file can be found [here](.prettierrc)
  
    b. Lint the code and report any errors, using [Eslint](https://eslint.org/)
    
    bi. The configuration file can be found [here](.eslintrc.json)

3. Start a commit by running:

```sh
git add . && git commit -asm "<COMMIT MESSAGE>"
```

Your changes should run the above two actions.
