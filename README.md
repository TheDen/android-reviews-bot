# Android Reviews SlackBot

A slackbot that pulls the latest Android reviews for your application and posts them to slack!

## Requirements

* `node 8.x` (LTS Carbon)
* A valid slack webhook, i.e, of the form `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`
* [`aws-sdk`](https://aws.amazon.com/sdk-for-node-js/)
* [`axios`](https://github.com/axios/axios)
* [`google-play-scraper`](https://github.com/facundoolano/google-play-scraper)

## Install

* `npm install`

## Run

The bot ought to run scheduled (either through `cron` or `systemd`).

* `npm start` or `node index.js`