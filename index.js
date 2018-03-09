const gplay = require('google-play-scraper')
const request = require('axios')
const AWS = require('aws-sdk')
const fs = require('fs')
const appId = 'APPID CHANGE ME'

const ssm = new AWS.SSM({region: 'ap-southeast-2'});

const params = {
  Name: 'slackwebhook-ssm',
  WithDecryption: true
};
ssm.getParameter(params, (ssmError, slackWebhook) => {

  const slackSend = async (review) => {

    let stars = ''
    for (i = 0; i < +review.score; i++) {
      stars = stars.concat(':star:')
    }

    let barcolor = 'good'
    if (+review.score < 3) {
      barcolor = 'danger'
    }
    else if (+review.score === 3) {
      barcolor = 'warning'
    }

    return await request.post(slackWebhook.Parameter.Value, {
      channel: '#android-reviews-channel',
      username: 'Android Reviews Bot',
      icon_emoji: ':android:',
      attachments: [{
        color: barcolor,
        title: review.userName,
        text: `${review.text}\n\n${stars}`,
        thumb_url: review.userImage
      }],
    })
  }

  const getReviews = async (appId) => {
    return await gplay.reviews({appId , page: 0, sort: gplay.sort.NEWEST})
  }

  const main = (async () => {

    try {
      reviews = await getReviews(appId)
    }
    catch (error) {
      throw error
    }

    fs.readFile('ids.json', 'utf8', (err, data) => {
      if (err){
        console.log(err)
        throw err
      }
      obj = JSON.parse(data)
      for (var i = 0, l = reviews.length; i < l; i++) {
        if (obj.ids.indexOf(reviews[i].id)  === -1) {
          console.log(reviews[i].id + 'not found')
          slackSend(reviews[i])
          obj.ids.push(reviews[i].id)
          console.log(reviews[i])
        }
        fs.writeFileSync('ids.json', JSON.stringify(obj), 'utf8')
      }
    })

  })()
});
