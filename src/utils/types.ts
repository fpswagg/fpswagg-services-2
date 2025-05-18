import { Request } from 'express';
import { User } from '@supabase/supabase-js';

export interface AppRequest extends Request {
    user?: User;
    admin: boolean;
}

export type EMPTY = null | undefined;

export interface Scheduler {
    detailedName: string;
    schedules: Schedule[];
}

export interface Schedule {
    creationTime: Date;
    toPostAt: Date;
    posted: boolean;
    webhook?: string;
    content: string;
    details: Record<string, any>;
}

export type NumberPostType = string;

export interface NumberPost {
    id: number;
    number_id: string;

    time: Date;
    post_type: NumberPostType;

    destination_id: string;
    sender_id: string;

    content: Record<string, any>;
}

export interface NumberRecord {
    id: string;
    source: string;
    keywords: string[];
    saved_as?: string;
    reason?: string;
    discussionFrequency?: number;
}

export interface Meal {
    id: string;
    name: string;
    category: string;
    area: string;
    instructions: string;
    thumbnail: string;
    tags: string[];
    youtube: string;
    ingredients: Ingredient[];
    source: string;
    imageSource: string | null;
    creativeCommonsConfirmed: string | null;
    dateModified: Date | null;
}

export interface Ingredient {
    ingredient: string;
    measure: string;
}

export interface RawMeal {
    idMeal: string;
    strMeal: string;
    strDrinkAlternate: string | null;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags: string | null;
    strYoutube: string;
    strIngredient1: string;
    strIngredient2: string;
    strIngredient3: string;
    strIngredient4: string;
    strIngredient5: string;
    strIngredient6: string;
    strIngredient7: string;
    strIngredient8: string;
    strIngredient9: string;
    strIngredient10: string;
    strIngredient11: string;
    strIngredient12: string;
    strIngredient13: string;
    strIngredient14: string;
    strIngredient15: string;
    strIngredient16: string;
    strIngredient17: string;
    strIngredient18: string;
    strIngredient19: string;
    strIngredient20: string;
    strMeasure1: string;
    strMeasure2: string;
    strMeasure3: string;
    strMeasure4: string;
    strMeasure5: string;
    strMeasure6: string;
    strMeasure7: string;
    strMeasure8: string;
    strMeasure9: string;
    strMeasure10: string;
    strMeasure11: string;
    strMeasure12: string;
    strMeasure13: string;
    strMeasure14: string;
    strMeasure15: string;
    strMeasure16: string;
    strMeasure17: string;
    strMeasure18: string;
    strMeasure19: string;
    strMeasure20: string;
    strSource: string;
    strImageSource: string | null;
    strCreativeCommonsConfirmed: string | null;
    dateModified: string | null;
}

export type IddgafPostType = 'telegram' | 'whatsapp';
export type IddgafPostContentType = 'link';

export interface IddgafPost {
    id: number;
    type: IddgafPostType;
    to_id?: string;
    content_id: string;
    content_type: IddgafPostContentType;
    created_at: Date;
    metadata: Record<string, any>;
}

export interface RedditGalleryData {
    items: {
        media_id: string;
        id: number;
    }[];
}

export interface RedditMediaMetadata {
    status: string;
    e: string;
    m: string;
    o?: { y: number; x: number; u: string }[];
    p: { y: number; x: number; u: string }[];
    s: { y: number; x: number; u: string };
    id: string;
}

export interface RedditPost {
    all_awardings: Record<string, any>[];
    allow_live_comments: boolean;
    approved_at_utc: null | number;
    approved_by: null | string;
    archived: boolean;
    author: string;
    author_flair_background_color: null | string;
    author_flair_css_class: null | string;
    author_flair_richtext: Record<string, any>[];
    author_flair_template_id: null | string;
    author_flair_text: null | string;
    author_flair_text_color: null | string;
    author_flair_type: string;
    author_fullname: string;
    author_is_blocked: boolean;
    author_patreon_flair: boolean;
    author_premium: boolean;
    awarders: Record<string, any>[];
    banned_at_utc: null | number;
    banned_by: null | string;
    category: null | string;
    clicked: boolean;
    contest_mode: boolean;
    content_categories: null | string;
    created: number;
    created_utc: number;
    discussion_type: null | string;
    distinguished: null | string;
    domain: string;
    downs: number;
    edited: boolean | number;
    gallery_data?: RedditGalleryData;
    gilded: number;
    gildings: Record<string, any>;
    hide_score: boolean;
    hidden: boolean;
    id: string;
    is_created_from_ads_ui: boolean;
    is_crosspostable: boolean;
    is_meta: boolean;
    is_original_content: boolean;
    is_reddit_media_domain: boolean;
    is_robot_indexable: boolean;
    is_self: boolean;
    is_video: boolean;
    likes: null | boolean;
    link_flair_background_color: string;
    link_flair_css_class: null | string;
    link_flair_richtext: Record<string, any>[];
    link_flair_template_id: null | string;
    link_flair_text: null | string;
    link_flair_text_color: string;
    link_flair_type: string;
    locked: boolean;
    media: null | Record<string, any>;
    media_embed: Record<string, any>;
    media_only: boolean;
    media_metadata?: Record<string, RedditMediaMetadata>;
    mod_note: null | string;
    mod_reason_by: null | string;
    mod_reason_title: null | string;
    mod_reports: Record<string, any>[];
    name: string;
    no_follow: boolean;
    num_comments: number;
    num_crossposts: number;
    num_reports: null | number;
    over_18: boolean;
    permalink: string;
    pinned: boolean;
    pwls: null | number;
    quarantine: boolean;
    removal_reason: null | string;
    removed_by: null | string;
    removed_by_category: null | string;
    report_reasons: null | Record<string, any>[];
    saved: boolean;
    score: number;
    secure_media: null | Record<string, any>;
    secure_media_embed: Record<string, any>;
    selftext: string;
    selftext_html: null | string;
    send_replies: boolean;
    spoiler: boolean;
    stickied: boolean;
    subreddit: string;
    subreddit_id: string;
    subreddit_name_prefixed: string;
    subreddit_subscribers: number;
    subreddit_type: string;
    suggested_sort: null | string;
    thumbnail: string;
    thumbnail_height: null | number;
    thumbnail_width: null | number;
    title: string;
    top_awarded_type: null | string;
    total_awards_received: number;
    treatment_tags: Record<string, any>[];
    ups: number;
    upvote_ratio: number;
    url: string;
    user_reports: Record<string, any>[];
    view_count: null | number;
    visited: boolean;
    wls: null | number;
}

export interface RedditMedia {
    url: string;
    mime: string;

    width?: number;
    height?: number;

    caption?: string;
}

export type RedgifGIF = {
    id: string;
    type: number;
    userName: string;
    published: boolean;
    verified: boolean;
    views: number;
    duration: number;
    tags: string[];
    niches: string[];
    urls: RedgifUrlData;
    hls: boolean;
    hasAudio?: boolean;
};

export type RedgifUrlData = {
    hd?: string;
    sd?: string;
    thumbnail?: string;
    vthumbnail?: string;
    poster?: string;
    gif?: string;
};

export interface JSearchSearchParam {
    query: string;
    page?: number;
    num_pages?: number;
    country?: iso3166_1_alpha_2_lwr;
    date_posted?: 'all' | 'today' | '3days' | 'week' | 'month';
    work_from_home?: boolean;
    employment_types?: string;
    job_requirements?: string;
    radius?: number;
    exclude_job_publishers?: string;
    fields?: string;
    language?: iso639_language_codes;
}

export interface JSearchDetailsParam {
    job_id: string;
    country?: iso3166_1_alpha_2_lwr;
    fields?: string;
    language?: iso639_language_codes;
}

export interface JSearchJobDetails {
    job_id: string;
    job_title: string;
    employer_name: string;
    employer_logo: string | null;
    employer_website: string | null;
    job_publisher: string;
    job_employment_type: string;
    job_employment_types: string[];
    job_apply_link: string;
    job_apply_is_direct: boolean;
    apply_options: JSearchApplyOption[];
    job_description: string;
    job_is_remote: boolean | null;
    job_posted_at: string;
    job_posted_at_timestamp: number;
    job_posted_at_datetime_utc: string;
    job_location: string;
    job_city: string;
    job_state: string;
    job_country: string;
    job_latitude: number;
    job_longitude: number;
    job_benefits: string[] | null;
    job_google_link: string;
    job_salary: number | null;
    job_min_salary: number | null;
    job_max_salary: number | null;
    job_salary_period: string | null;
    job_highlights: JSearchJobHighlights;
    job_onet_soc: string;
    job_onet_job_zone: string;
}

export interface JSearchJobData {
    job_id: string;
    employer_name: string;
    employer_logo: string | null;
    employer_website: string | null;
    employer_company_type: string | null;
    employer_linkedin: string | null;
    job_publisher: string;
    job_employment_type: string;
    job_employment_types: string[];
    job_employment_type_text: string;
    job_title: string;
    job_apply_link: string;
    job_apply_is_direct: boolean;
    job_apply_quality_score: number | null;
    apply_options: JSearchApplyOption[];
    job_description: string;
    job_is_remote: boolean;
    job_posted_human_readable: string;
    job_posted_at_timestamp: number;
    job_posted_at_datetime_utc: string;
    job_location: string;
    job_city: string;
    job_state: string;
    job_country: string;
    job_latitude: number;
    job_longitude: number;
    job_benefits: string[] | null;
    job_google_link: string;
    job_offer_expiration_datetime_utc: string | null;
    job_offer_expiration_timestamp: number | null;
    job_required_experience: JSearchJobRequiredExperience;
    job_salary: number | null;
    job_min_salary: number | null;
    job_max_salary: number | null;
    job_salary_currency: string | null;
    job_salary_period: string | null;
    job_highlights: JSearchJobHighlights;
    job_job_title: string | null;
    job_posting_language: string | null;
    job_onet_soc: string;
    job_onet_job_zone: string;
    job_occupational_categories: string | null;
    job_naics_code: string | null;
    job_naics_name: string | null;
}

export interface JSearchApplyOption {
    publisher: string;
    apply_link: string;
    is_direct: boolean;
}

export interface JSearchJobRequiredExperience {
    no_experience_required: boolean;
    required_experience_in_months: number | null;
    experience_mentioned: boolean;
    experience_preferred: boolean;
}

export interface JSearchJobHighlights {
    Qualifications: string[];
    Responsibilities: string[];
    Benefits?: string[];
}

export type CriteriaFunction<T = any> = (object: T) => boolean;

export type VariableType = 'string' | 'function' | 'number' | 'boolean' | 'object' | 'undefined' | 'symbol' | 'bigint';

export type iso3166_1_alpha_2 =
    | 'AD'
    | 'AE'
    | 'AF'
    | 'AG'
    | 'AI'
    | 'AL'
    | 'AM'
    | 'AO'
    | 'AQ'
    | 'AR'
    | 'AS'
    | 'AT'
    | 'AU'
    | 'AW'
    | 'AX'
    | 'AZ'
    | 'BA'
    | 'BB'
    | 'BD'
    | 'BE'
    | 'BF'
    | 'BG'
    | 'BH'
    | 'BI'
    | 'BJ'
    | 'BL'
    | 'BM'
    | 'BN'
    | 'BO'
    | 'BQ'
    | 'BR'
    | 'BS'
    | 'BT'
    | 'BV'
    | 'BW'
    | 'BY'
    | 'BZ'
    | 'CA'
    | 'CC'
    | 'CD'
    | 'CF'
    | 'CG'
    | 'CH'
    | 'CI'
    | 'CK'
    | 'CL'
    | 'CM'
    | 'CN'
    | 'CO'
    | 'CR'
    | 'CU'
    | 'CV'
    | 'CW'
    | 'CX'
    | 'CY'
    | 'CZ'
    | 'DE'
    | 'DJ'
    | 'DK'
    | 'DM'
    | 'DO'
    | 'DZ'
    | 'EC'
    | 'EE'
    | 'EG'
    | 'EH'
    | 'ER'
    | 'ES'
    | 'ET'
    | 'FI'
    | 'FJ'
    | 'FK'
    | 'FM'
    | 'FO'
    | 'FR'
    | 'GA'
    | 'GB'
    | 'GD'
    | 'GE'
    | 'GF'
    | 'GG'
    | 'GH'
    | 'GI'
    | 'GL'
    | 'GM'
    | 'GN'
    | 'GP'
    | 'GQ'
    | 'GR'
    | 'GS'
    | 'GT'
    | 'GU'
    | 'GW'
    | 'GY'
    | 'HK'
    | 'HM'
    | 'HN'
    | 'HR'
    | 'HT'
    | 'HU'
    | 'ID'
    | 'IE'
    | 'IL'
    | 'IM'
    | 'IN'
    | 'IO'
    | 'IQ'
    | 'IR'
    | 'IS'
    | 'IT'
    | 'JE'
    | 'JM'
    | 'JO'
    | 'JP'
    | 'KE'
    | 'KG'
    | 'KH'
    | 'KI'
    | 'KM'
    | 'KN'
    | 'KP'
    | 'KR'
    | 'KW'
    | 'KY'
    | 'KZ'
    | 'LA'
    | 'LB'
    | 'LC'
    | 'LI'
    | 'LK'
    | 'LR'
    | 'LS'
    | 'LT'
    | 'LU'
    | 'LV'
    | 'LY'
    | 'MA'
    | 'MC'
    | 'MD'
    | 'ME'
    | 'MF'
    | 'MG'
    | 'MH'
    | 'MK'
    | 'ML'
    | 'MM'
    | 'MN'
    | 'MO'
    | 'MP'
    | 'MQ'
    | 'MR'
    | 'MS'
    | 'MT'
    | 'MU'
    | 'MV'
    | 'MW'
    | 'MX'
    | 'MY'
    | 'MZ'
    | 'NA'
    | 'NC'
    | 'NE'
    | 'NF'
    | 'NG'
    | 'NI'
    | 'NL'
    | 'NO'
    | 'NP'
    | 'NR'
    | 'NU'
    | 'NZ'
    | 'OM'
    | 'PA'
    | 'PE'
    | 'PF'
    | 'PG'
    | 'PH'
    | 'PK'
    | 'PL'
    | 'PM'
    | 'PN'
    | 'PR'
    | 'PS'
    | 'PT'
    | 'PW'
    | 'PY'
    | 'QA'
    | 'RE'
    | 'RO'
    | 'RS'
    | 'RU'
    | 'RW'
    | 'SA'
    | 'SB'
    | 'SC'
    | 'SD'
    | 'SE'
    | 'SG'
    | 'SH'
    | 'SI'
    | 'SJ'
    | 'SK'
    | 'SL'
    | 'SM'
    | 'SN'
    | 'SO'
    | 'SR'
    | 'SS'
    | 'ST'
    | 'SV'
    | 'SX'
    | 'SY'
    | 'SZ'
    | 'TC'
    | 'TD'
    | 'TF'
    | 'TG'
    | 'TH'
    | 'TJ'
    | 'TK'
    | 'TL'
    | 'TM'
    | 'TN'
    | 'TO'
    | 'TR'
    | 'TT'
    | 'TV'
    | 'TW'
    | 'TZ'
    | 'UA'
    | 'UG'
    | 'UM'
    | 'US'
    | 'UY'
    | 'UZ'
    | 'VA'
    | 'VC'
    | 'VE'
    | 'VG'
    | 'VI'
    | 'VN'
    | 'VU'
    | 'WF'
    | 'WS'
    | 'YE'
    | 'YT'
    | 'ZA'
    | 'ZM'
    | 'ZW';
export type iso3166_1_alpha_2_lwr = Lowercase<iso3166_1_alpha_2>;

export type iso639_language_codes =
    | 'ab'
    | 'aa'
    | 'af'
    | 'ak'
    | 'sq'
    | 'am'
    | 'ar'
    | 'an'
    | 'hy'
    | 'as'
    | 'av'
    | 'ae'
    | 'ay'
    | 'az'
    | 'bm'
    | 'ba'
    | 'eu'
    | 'be'
    | 'bn'
    | 'bi'
    | 'bs'
    | 'br'
    | 'bg'
    | 'my'
    | 'ca'
    | 'ch'
    | 'ce'
    | 'ny'
    | 'zh'
    | 'cu'
    | 'cv'
    | 'kw'
    | 'co'
    | 'cr'
    | 'hr'
    | 'cs'
    | 'da'
    | 'dv'
    | 'nl'
    | 'dz'
    | 'en'
    | 'eo'
    | 'et'
    | 'ee'
    | 'fo'
    | 'fj'
    | 'fi'
    | 'fr'
    | 'fy'
    | 'ff'
    | 'gd'
    | 'gl'
    | 'lg'
    | 'ka'
    | 'de'
    | 'el'
    | 'kl'
    | 'gn'
    | 'gu'
    | 'ht'
    | 'ha'
    | 'he'
    | 'hz'
    | 'hi'
    | 'ho'
    | 'hu'
    | 'is'
    | 'io'
    | 'ig'
    | 'id'
    | 'ia'
    | 'ie'
    | 'iu'
    | 'ik'
    | 'ga'
    | 'it'
    | 'ja'
    | 'jv'
    | 'kn'
    | 'kr'
    | 'ks'
    | 'kk'
    | 'km'
    | 'ki'
    | 'rw'
    | 'ky'
    | 'kv'
    | 'kg'
    | 'ko'
    | 'kj'
    | 'ku'
    | 'lo'
    | 'la'
    | 'lv'
    | 'li'
    | 'ln'
    | 'lt'
    | 'lu'
    | 'lb'
    | 'mk'
    | 'mg'
    | 'ms'
    | 'ml'
    | 'mt'
    | 'gv'
    | 'mi'
    | 'mr'
    | 'mh'
    | 'mn'
    | 'na'
    | 'nv'
    | 'nd'
    | 'nr'
    | 'ng'
    | 'ne'
    | 'no'
    | 'nb'
    | 'nn'
    | 'oc'
    | 'oj'
    | 'or'
    | 'om'
    | 'os'
    | 'pi'
    | 'ps'
    | 'fa'
    | 'pl'
    | 'pt'
    | 'pa'
    | 'qu'
    | 'ro'
    | 'rm'
    | 'rn'
    | 'ru'
    | 'se'
    | 'sm'
    | 'sg'
    | 'sa'
    | 'sc'
    | 'sr'
    | 'sn'
    | 'sd'
    | 'si'
    | 'sk'
    | 'sl'
    | 'so'
    | 'st'
    | 'es'
    | 'su'
    | 'sw'
    | 'ss'
    | 'sv'
    | 'tl'
    | 'ty'
    | 'tg'
    | 'ta'
    | 'tt'
    | 'te'
    | 'th'
    | 'bo'
    | 'ti'
    | 'to'
    | 'ts'
    | 'tn'
    | 'tr'
    | 'tk'
    | 'tw'
    | 'ug'
    | 'uk'
    | 'ur'
    | 'uz'
    | 've'
    | 'vi'
    | 'vo'
    | 'wa'
    | 'cy'
    | 'wo'
    | 'xh'
    | 'ii'
    | 'yi'
    | 'yo'
    | 'za'
    | 'zu';
export type iso639_language_codes_upr = Uppercase<iso639_language_codes>;
