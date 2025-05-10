import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from "express";

import { JSearchSearchParam, JSearchDetailsParam } from "src/types";

import JSearch from "./job_search";
import * as Reddit from "./reddit";
import * as Redgifs from "./redgifs";

@Controller('fetcher')
export class FetcherController {
    @Get("job")
    async job(
            @Query('query') query: string, 
            @Query('page') raw_page: string, 
            @Query('num_pages') raw_num_pages: string, 
            @Query('country') country: string, 
            @Query('date_posted') date_posted: string, 
            @Query('work_from_home') work_from_home: string, 
            @Query('employment_types') employment_types: string, 
            @Query('job_requirements') job_requirements: string, 
            @Query('radius') raw_radius: string, 
            @Query('exclude_job_publishers') exclude_job_publishers: string, 
            @Query('fields') fields: string, 
            @Query('language') language: string,
            @Res() res: Response
        ) {
        try {
            if (!query)
                throw new Error("No query!");

            const page = raw_page ? parseInt(raw_page) : undefined;

            if (raw_page && isNaN(page as number))
                throw new Error("Invalid page!");

            const num_pages = raw_num_pages ? parseInt(raw_num_pages) : undefined;

            if (raw_num_pages && isNaN(num_pages as number))
                throw new Error("Invalid num page!");

            const radius = raw_radius ? parseInt(raw_radius) : undefined;

            if (raw_radius && isNaN(radius as number))
                throw new Error("Invalid radius!");

            const params = {
                query,
                page,
                num_pages,
                country: country || undefined,
                date_posted: date_posted || undefined,
                work_from_home: work_from_home ? (work_from_home === "true") : undefined,
                employment_types: employment_types || undefined,
                job_requirements: job_requirements || undefined,
                radius: radius || undefined,
                exclude_job_publishers: exclude_job_publishers || undefined,
                fields: fields || undefined,
                language: language || undefined,
            } as JSearchSearchParam;

            const results = await JSearch.search(params);

            return res.status(200).json({ results });
        } catch (error: unknown) {
            console.log("Error on searching for jobs:", error);
    
            return res.status(400).json({ error });
        }
    }

    @Get("job_details")
    async jobDetails(
        @Query('id') id: string, 
        @Query('country') country: string, 
        @Query('fields') fields: string, 
        @Query('language') language: string, 
        @Res() res: Response
    ) {
        try {
            if (!id)
                throw new Error("No id!");

            const params = {
                job_id: id,
                country: country || undefined,
                fields: fields || undefined,
                language: language || undefined,
            } as JSearchDetailsParam;

            const result = await JSearch.details(params);

            return res.status(200).json({ result });
        } catch (error: unknown) {
            console.log("Error on fetching job details:", error);
    
            return res.status(400).json({ error });
        }
    }

    @Get("reddit")
    async reddit(
        @Query('subreddit') subreddit_: string, 
        @Query('limit') limit_: string, 
        @Query('type') type_: string, 
        @Res() res: Response
    ) {
        try {
            const subreddit = subreddit_ || undefined;
            const limit = limit_ ? parseInt(limit_) : undefined;

            if (limit !== undefined && isNaN(limit))
                throw new Error("Invalid limit!");

            const type = type_ ? (type_ as Reddit.PostType) : undefined;

            const { data, error } = await Reddit.getRedditPosts(subreddit, limit, type);

            if (error)
                throw error;

            return res.status(200).json({ results: data });
        } catch (error: unknown) {
            console.log("Error on fetching reddit data:", error);
    
            return res.status(400).json({ error });
        }
    }

    @Get("redgifs/niches")
    redgifsNiches() {
        return Redgifs.niches;
    }

    @Get("redgifs/hasId")
    redgifsHasId(
        @Query('url') url: string, 
        @Res() res: Response
    ) {
        try {
            if (!url)
                throw new Error("No url!");

            return res.status(200).json({ flag: Redgifs.hasID(url) });
        } catch (error: unknown) {
            console.log("Error on checking on id:", error);
    
            return res.status(400).json({ error });
        }
    }

    @Get("redgifs/gifs")
    async redgifsGifs(
        @Query('id') id: string, 
        @Query('ids') _ids: string, 
        @Query('niche') niche: string, 
        @Query('hasAudio') hasAudio: string, 
        @Res() res: Response
    ) {
        try {
            const ids = id ? [ id ] : ( _ids ? _ids.split(",") : []);

            if (ids.length <= 0 && !niche)
                throw new Error("No id or niche!");
            else if (ids.length > 0) {
                const { gifs: results, error } = await Redgifs.getGIFs(ids);

                if (error)
                    throw error;

                return res.status(200).json({ results });
            } else {
                const { gifs: results, error } = await Redgifs.getNicheGIFs(niche as Redgifs.NicheType, (hasAudio && hasAudio === "true")?Redgifs.hasAudioCriteria:(()=>true));

                if (error)
                    throw error;

                return res.status(200).json({ results });
            }
        } catch (error: unknown) {
            console.log("Error on fetching gifs:", error);
    
            return res.status(400).json({ error });
        }
    }
}