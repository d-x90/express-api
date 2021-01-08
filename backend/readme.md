# Express api configurations

### For dev and prod

1. Create `.env` file based on `.env.example`
2. Install dependencies with `npm i`
3. Create `docker-compose.yml` file based on `docker-compose.example.yml`
4. Run `docker-compose up`
5. Start dev server with `npm start` or run `npm serve` in prod

### For test

1. Make sure every test.js starts with `require('./.test-variables.js');` for overwriting (`.env`) environment variables
2. Obviously add required environment variables to this `.test-variables.js` file
3. Run `npm test`
