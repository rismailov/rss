import { differenceInMinutes, formatDistance } from 'date-fns'
import { format, toZonedTime } from 'date-fns-tz'
import dedent from 'dedent'
import cron from 'node-cron'
import TelegramBot from 'node-telegram-bot-api'
import Parser from 'rss-parser'
import config from '../services/config'
import prisma from '../services/prisma'

const EXCLUDED_COUNTRIES = ['India', 'Pakistan', 'Africa']

interface IJobPost {
    id: string
    title: string
    country: string
    skills: string[]
    category: string
    payment: string
    description: string
    publishedAt: Date
}

// returns substring between two substrings
function getValue(content: string, property: string): string | null {
    const start = `<b>${property}</b>:`
    const end = property === 'Category' ? '<br />' : '(<br />|\r\n|\n|\r)'

    const result = content.match(new RegExp(`${start}(.*)${end}`))

    return result ? result[1] : null
}

async function parse() {
    console.log('Checking for notifications...')

    if (!config.RSS_URL) {
        throw new Error('Missing Upwork RSS Feed URL')
    }

    if (!config.TELEGRAM.TOKEN || !config.TELEGRAM.CHAT_ID) {
        throw new Error('Missing Telegram token or chat ID')
    }

    const parser = new Parser({
        customFields: {
            item: ['title', 'content', 'link', 'pubDate'],
        },
    })

    const { items } = await parser.parseURL(config.RSS_URL)

    for (const item of items.reverse()) {
        // =====================================================
        // Check if job post already exists in DB
        // =====================================================
        const exists = await prisma.jobPost.findUnique({
            where: { id: item.link },
            select: { id: true },
        })

        if (exists) {
            continue
        }

        // =====================================================
        // Filter out country
        // =====================================================
        const country = getValue(item.content, 'Country')?.trim() || 'N/A'

        if (EXCLUDED_COUNTRIES.includes(country)) {
            continue
        }

        // =====================================================
        // Filter out posts that were published more than X minutes ago
        // =====================================================
        const diff = differenceInMinutes(new Date(item.pubDate), Date.now())

        if (Math.abs(diff) > 30) {
            continue
        }

        // =====================================================
        // Shape up job post entity
        // =====================================================
        const title = item.title.replace(' - Upwork', '').trim()
        const category = getValue(item.content, 'Category')?.trim() || 'N/A'
        const skills =
            getValue(item.content, 'Skills')
                ?.split(',')
                .map((s) => s.trim()) || []

        // payment
        const budget = getValue(item.content, 'Budget')?.trim()
        const hourly = getValue(item.content, 'Hourly Range')?.trim()
        const payment = `${budget ? 'Fixed: ' : hourly ? 'Hourly: ' : ''}${budget || hourly || 'N/A'}`

        // description
        const desc = (item.content as string).split(
            `<b>${budget ? 'Budget' : 'Hourly Range'}</b>`,
        )[0]

        const descExcerpt =
            desc.length > 400 ? desc.substring(0, 400) + '...' : desc

        const jobPost: IJobPost = {
            id: item.link,
            title,
            country,
            skills,
            category,
            payment,
            description: descExcerpt,
            publishedAt: new Date(item.pubDate),
        }

        // =====================================================
        // Save job post in database
        // =====================================================
        let newJobPost: IJobPost | undefined

        try {
            newJobPost = await prisma.jobPost.create({
                data: jobPost,
            })
        } catch (error) {
            console.log('Failed to save job post in DB: ', error)

            continue
        }

        // =====================================================
        // Handle job post date
        // =====================================================

        // convert date to local timezone
        const tzDate = toZonedTime(newJobPost.publishedAt, 'Asia/Baku')

        // format full date
        const fullDate = format(tzDate, 'MMM do, HH:mm:ss')

        // get relative time
        const relativeTime = formatDistance(Date.now(), Number(tzDate), {
            includeSeconds: true,
        })

        // put it all together
        const publishedAt = `${relativeTime} ago (${fullDate})`

        // =====================================================
        // Send Telegram notification
        // =====================================================
        const bot = new TelegramBot(config.TELEGRAM.TOKEN, {
            polling: false,
        })

        // build message for Telegram
        const message = dedent`
            <b>${newJobPost.title}</b>

            💰 ${newJobPost.payment}
            🌎 ${newJobPost.country}
            ⏳ ${publishedAt}

            ${newJobPost.description.replaceAll('<br /><br />', '<br />').replaceAll('<br />', '\n')}

            🔗 ${newJobPost.id}
        `

        try {
            await bot.sendMessage(config.TELEGRAM.CHAT_ID, message, {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            })
        } catch (error) {
            console.log('Error sending message to Telegram: ', error)
        }
    }
}

// perform initial run
;(async () => {
    await parse()
})()

// run every 10 seconds
cron.schedule('*/10 * * * * *', parse, { scheduled: true })
