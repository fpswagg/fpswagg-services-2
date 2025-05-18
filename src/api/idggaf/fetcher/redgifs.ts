import axios from 'axios';

import { CriteriaFunction, RedgifGIF, RedgifUrlData } from 'src/utils/types';

export async function authenticate(): Promise<string> {
    const response = await axios.get<{ token: string }>('https://api.redgifs.com/v2/auth/temporary');

    return response.data.token;
}

export function extractId(link: string) {
    if (/^https:\/\/www.redgifs.com\/watch\//.test(link)) {
        return link.match(/(?<=https:\/\/www.redgifs.com\/watch\/).*/)?.[0]?.replace(/(#|\?).*/g, '') ?? null;
    } else return null;
}

export function hasID(link: string) {
    return !!(extractId(link) ?? false);
}

export async function getGIFs(ids?: string[] | string): Promise<{ gifs: RedgifGIF[]; error?: Error }> {
    try {
        const token = await authenticate();
        const response = await axios.get<{ gifs: RedgifGIF[] }>(
            ids
                ? `https://api.redgifs.com/v2/gifs?ids=${(typeof ids === 'string' ? [ids] : ids).join()}`
                : `https://api.redgifs.com/v2/feeds/trending/popular`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return { gifs: response.data.gifs };
    } catch (error) {
        return { gifs: [], error: error as Error };
    }
}

export function extractURL(urls: RedgifUrlData) {
    return (
        urls.sd ||
        urls.vthumbnail ||
        urls.hd ||
        Object.values(urls).find((value) =>
            ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'].some((ext) => value.toLowerCase().endsWith('.' + ext)),
        )
    );
}

export function extractThumbnail(urls: RedgifUrlData) {
    return (
        urls.thumbnail ||
        urls.poster ||
        Object.values(urls).find((value) =>
            ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'svg'].some((ext) => value.toLowerCase().endsWith('.' + ext)),
        )
    );
}

export const hasAudioCriteria: CriteriaFunction<RedgifGIF> = (x) => !!(x.hasAudio && x.urls);

export const niches = {
    ebony: ['african-queen', 'african-chicks'],
};

export type NicheType = keyof typeof niches;

export async function getNicheGIFs(
    niche: NicheType = Object.keys(niches)[0] as NicheType,
    criteria: CriteriaFunction<RedgifGIF> = hasAudioCriteria,
): Promise<{ gifs: RedgifGIF[]; error?: Error }> {
    try {
        const token = await authenticate();

        return {
            gifs: (
                await Promise.all(
                    niches[niche].map(async function (niche) {
                        const response = await axios.get<{ gifs: RedgifGIF[] }>(
                            `https://api.redgifs.com/v2/niches/${niche}/gifs`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            },
                        );

                        return response.data.gifs.filter(criteria);
                    }),
                )
            ).flat(),
        };
    } catch (error) {
        return { gifs: [], error: error as Error };
    }
}
