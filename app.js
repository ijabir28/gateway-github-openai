const express = require('express');
const app = express();
const axios = require("axios");

const mongo = require('./models/index');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/api', function (req, res) {
    res.status(200).json('API');
});

app.get('/api/:owner/:repo/:author', async function (req, res) {
    const {owner, repo, author} = req.params;
    console.log({owner, repo, author});

    try {
        const githubApiResponse = await axios.get(
            `http://localhost:3000/api/github/${owner}/${repo}/issues/${author}`
        );

        console.log(githubApiResponse.data.data);

        if(githubApiResponse.data.data.length !== 0) {
            for (const issue of githubApiResponse.data.data) {

                const posted = await mongo.is_posted(issue);

                if(!posted) {
                    const twitterApiResponse = await axios.post(
                        `http://localhost:3030/api/twitter/tweet`, {
                            content: issue.url
                        }
                    );

                    if(twitterApiResponse.data.message === 'success') {
                        console.log(twitterApiResponse.data);

                        issue.posted_on_twitter = true;

                        await mongo.update_log(issue);
                    }
                }

            }
        }

        res.status(200).json('TWITTER_UPDATED');

    } catch (err) {
        console.log(err);

        res.status(400).json(err.message);
    }

});

const listener = app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on ' + `http://localhost:${listener.address().port}/api`);
});
