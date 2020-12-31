<div align="center">
  
<a href="https://share-book-client.herokuapp.com"/>
  <img alt="ShareBook" src="./packages/client/src/assets/images/boilogo.png" />
</a>

# ShareBook - Buy or Sell books

A platform where you can buy/sell used or unused books

<a href="https://github.com/ashiqdev/bookshare/fork" target="blank">
<img src="https://img.shields.io/github/forks/ashiqdev/bookshare?style=for-the-badge" alt="sharebook forks"/>
</a>

<a href="https://github.com/ashiqdev/bookshare/stargazers" target="blank">
<img src="https://img.shields.io/github/stars/ashiqdev/bookshare?style=for-the-badge" alt="sharebook stars"/>
</a>

<a href="https://github.com/ashiqdev/bookshare/issues" target="blank">
<img src="https://img.shields.io/github/issues/ashiqdev/bookshare?style=for-the-badge" alt="sharebook issues"/>
</a>

<a href="https://github.com/ashiqdev/bookshare/pulls" target="blank">
<img src="https://img.shields.io/github/issues-pr/ashiqdev/bookshare?style=for-the-badge" alt="sharebook pull-requests"/>
</a>

<br/>
<br/>

<a href="https://share-book-client.herokuapp.com" target="_blank">View ShareBook</a> · <a href="https://github.com/ashiqdev/bookshare/issues/new/choose" target="_blank">Report Bug</a> · <a href="https://github.com/ashiqdev/bookshare/issues/new/choose" target="_blank">Request Feature</a>

✨ _Loved the project? Give this project a star to show your support._ ✨

<img src="./demo.gif" style="width: 80%"/>

</div>

---

## Sharebook is a platform project which ensures easier communtication between seller and buyer!

## Feature list

- [x] Register a user
- [x] verify email address
- [x] resend verification mail
- [x] forget password
- [x] Autocomplete search using algolia
- [x] image upload system using cloudinary
- [x] sort books by different criterias
- [x] image upload system using cloudinary
- [x] Fetch, cache and update data without touching any "global state".
- [ ] chat with seller

## Getting started

This project is deployed at https://share-book-client.herokuapp.com

Guide for local deployment -

1. Clone the repository

```bash
git clone git@github.com:ashiqdev/bookshare.git
```

2. Change the working directory

```bash
cd bookshare
```

3. Install dependencies

```bash
yarn
```

4. Update .env file

```bash
cp example.env .env
```

5. Install maildev for testing mail related services

```bash
npm i -g maildev
```

6. Run maildev in one of the instance of your terminal

```bash
maildev --incoming-user=test --incoming-pass=test
```

7. Run docker (install docker and docker-compose if you don't have those!)

```bash
npm i -g dotenv-cli
```

```bash
ENV_FILE=.env docker-compose -f docker-compose-dev.yml up --build
```

8. Run backend server

```bash
dotenv -e .env yarn build:watch
```

```bash
dotenv -e .env yarn dev:server
```

9. Run frontend

```bash
dotenv -e .env yarn dev:client
```

10. Open project at http://localhost:1234

11. Run integration test

```bash
dotenv -e .env yarn test:services
```

11. For Api Documentation open http://localhost:7777/api-docs/ (you can also send http request from here)

You are all set!

## Special Thanks

- [somikdatta](https://github.com/somikdatta/) for this cool readme template

## ❤️ Support

If you happen to love this project, leave a star on the repo. That'll keep me motivated. Let me know your thoughts with a tweet. Mention me [@ashikduit](https://twitter.com/ashikduit).

Thanks!

Contributions are welcomed!

<div align="center">
Developed with ❤️ in Bangladesh
</div>
