import { Scraper } from './dist/default/esm/index.mjs';
import dotenv from 'dotenv';

dotenv.config();

async function scrapeProfile(username) {
  console.log(`🚀 Scraping Twitter Profile: @${username}\n`);

  const scraper = new Scraper();

  try {
    console.log('📝 Logging in...');
    await scraper.login(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL
    );

    console.log('✅ Logged in successfully!\n');

    // Get the profile
    console.log(`👤 Fetching profile for @${username}...\n`);
    const profile = await scraper.getProfile(username);

    console.log('='.repeat(60));
    console.log('PROFILE INFORMATION');
    console.log('='.repeat(60));
    console.log(`Name: ${profile.name}`);
    console.log(`Username: @${profile.username}`);
    console.log(`User ID: ${profile.userId}`);
    console.log(`Bio: ${profile.biography || 'N/A'}`);
    console.log(`Location: ${profile.location || 'N/A'}`);
    console.log(`Website: ${profile.website || 'N/A'}`);
    console.log(`Joined: ${profile.joined ? new Date(profile.joined).toLocaleDateString() : 'N/A'}`);
    console.log(`Followers: ${profile.followersCount?.toLocaleString() || 0}`);
    console.log(`Following: ${profile.followingCount?.toLocaleString() || 0}`);
    console.log(`Tweets: ${profile.tweetsCount?.toLocaleString() || 0}`);
    console.log(`Likes: ${profile.likesCount?.toLocaleString() || 0}`);
    console.log(`Verified: ${profile.isVerified ? 'Yes' : 'No'}`);
    console.log(`Private: ${profile.isPrivate ? 'Yes' : 'No'}`);
    console.log(`Blue Verified: ${profile.isBlueVerified ? 'Yes' : 'No'}`);
    console.log('='.repeat(60));

    // Get recent tweets
    console.log(`\n📱 Fetching recent tweets from @${username}...\n`);
    const tweets = [];
    for await (const tweet of scraper.getTweets(username, 10)) {
      tweets.push(tweet);
    }

    console.log('='.repeat(60));
    console.log(`RECENT TWEETS (${tweets.length} tweets)`);
    console.log('='.repeat(60));

    tweets.forEach((tweet, index) => {
      console.log(`\n[${index + 1}] Tweet ID: ${tweet.id}`);
      console.log(`Date: ${tweet.timestamp ? new Date(tweet.timestamp * 1000).toLocaleString() : 'N/A'}`);
      console.log(`Text: ${tweet.text || 'N/A'}`);
      console.log(`Likes: ${tweet.likes?.toLocaleString() || 0} | Retweets: ${tweet.retweets?.toLocaleString() || 0} | Replies: ${tweet.replies?.toLocaleString() || 0}`);
      console.log(`URL: https://twitter.com/${username}/status/${tweet.id}`);
      if (tweet.isRetweet) console.log(`🔁 This is a retweet`);
      if (tweet.isReply) console.log(`💬 This is a reply`);
      console.log('-'.repeat(60));
    });

    console.log('\n🎉 Scraping completed successfully!');

    // Save to JSON file
    const fs = await import('fs');
    const data = {
      profile,
      tweets: tweets.map(t => ({
        id: t.id,
        text: t.text,
        timestamp: t.timestamp,
        likes: t.likes,
        retweets: t.retweets,
        replies: t.replies,
        isRetweet: t.isRetweet,
        isReply: t.isReply,
        url: `https://twitter.com/${username}/status/${t.id}`
      })),
      scrapedAt: new Date().toISOString()
    };

    fs.writeFileSync(`${username}_data.json`, JSON.stringify(data, null, 2));
    console.log(`\n💾 Data saved to ${username}_data.json`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

const targetUsername = 'paoloanzn';
scrapeProfile(targetUsername);
