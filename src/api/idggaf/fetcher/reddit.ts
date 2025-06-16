import axios from 'axios';
import * as qs from 'qs';

import { RedditPost } from '@fpswagg/my-database/types';
import { minutes, wait } from 'src/utils/functions';
import { redditAppName, redditID, redditSecret } from 'src/utils/variables';

export type PostType = 'hot' | 'new' | 'top' | 'rising' | 'controversial';

export async function getRedditPosts(
    subreddit = 'all',
    limit?: number,
    type: PostType = 'new',
): Promise<{ data: RedditPost[]; error?: Error }> {
    try {
        const token = await getRedditToken();
        const defaultLimit = 100;

        if (!token) throw new Error('There is no token!');

        const { data } = await axios.get<{
            data?: {
                children?: {
                    data: RedditPost;
                }[];
            };
        }>(`https://oauth.reddit.com/${subreddit.startsWith('user/') ? subreddit : `r/${subreddit}`}/${type}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                limit: limit == undefined ? defaultLimit : Math.min(defaultLimit, Math.max(0, limit)),
            },
        });

        if (data?.data?.children)
            return {
                data: data.data.children.map((post) => post.data),
            };
        else throw new Error('There are no posts!');
    } catch (error) {
        return { data: [], error: error as Error };
    }
}

export let lastTokenFetchTime: number | null = null;

export async function getRedditToken() {
    const timeDelay = minutes(1 / 100);

    while (lastTokenFetchTime !== null && Date.now() - lastTokenFetchTime < timeDelay)
        await wait(timeDelay + Date.now() - lastTokenFetchTime);

    lastTokenFetchTime = Date.now();

    const authHeader = Buffer.from(`${redditID}:${redditSecret}`).toString('base64');

    const data = qs.stringify({
        grant_type: 'client_credentials',
    });

    try {
        const response = await axios.post<{ access_token: string }>(
            'https://www.reddit.com/api/v1/access_token',
            data,
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': redditAppName + '/1.0.0',
                },
            },
        );

        return response.data.access_token;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error('There was a problem while fetching the token.');
    }
}
