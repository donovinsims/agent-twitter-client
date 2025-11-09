import { Scraper } from './dist/default/esm/index.mjs';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🚀 Testing Twitter Client...\n');

  const scraper = new Scraper();

  try {
    console.log('📝 Logging in...');
    await scraper.login(
      process.env.TWITTER_USERNAME,
      process.env.TWITTER_PASSWORD,
      process.env.TWITTER_EMAIL
    );

    console.log('✅ Logged in successfully!\n');

    // Check if we're logged in
    const isLoggedIn = await scraper.isLoggedIn();
    console.log(`🔐 Login status: ${isLoggedIn}\n`);

    // Get your own profile
    console.log('👤 Fetching your profile...');
    const profile = await scraper.getProfile(process.env.TWITTER_USERNAME);
    console.log(`Name: ${profile.name}`);
    console.log(`Username: @${profile.username}`);
    console.log(`Followers: ${profile.followersCount}`);
    console.log(`Following: ${profile.followingCount}`);
    console.log(`Tweets: ${profile.tweetsCount}\n`);

    console.log('🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

main();
