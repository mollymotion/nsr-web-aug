const API_KEY = '6284b825fee359c4a992c4533a3499f5';
const ARTIST_NAME = 'None%20Shall%20Remain';

export default class BandsInTown {
    constructor() {
        this.container = document.getElementById("shows-grid");
        this.template = document.getElementById("tpl_shows");
        this.socialsContainer = document.getElementById("socials");
        this.socialTemplate = document.getElementById("tpl_social");

        if (!this.container || !this.template) {
            console.error("Required DOM elements not found");
            return;
        }
    }

    async init() {
        await this.loadShows();
        await this.loadArtistInfo();
    }

    async loadArtistInfo() {
        try {
            const response = await fetch(`https://rest.bandsintown.com/artists/${ARTIST_NAME}?app_id=${API_KEY}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const artist = await response.json();
            console.log('Artist Info Response:', artist);

            const socials = artist.links || [];
            console.log('socialssss:', socials);
            
            // Manually add Bandcamp link
            const bandcampLink = {
                type: 'bandcamp',
                url: 'http://none-shall-remain.bandcamp.com'
            };
            socials.push(bandcampLink);
            
            // Define preferred order for social media icons
            const preferredOrder = ['bandcamp', 'spotify', 'itunes', 'instagram', 'facebook', 'youtube' ];

            // Sort socials by preferred order
            const sortedSocials = socials.sort((a, b) => {
                const aIndex = preferredOrder.indexOf(a.type.toLowerCase());
                const bIndex = preferredOrder.indexOf(b.type.toLowerCase());
                
                // If both are in preferred order, sort by index
                if (aIndex !== -1 && bIndex !== -1) {
                    return aIndex - bIndex;
                }
                // If only one is in preferred order, prioritize it
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;
                // If neither is in preferred order, maintain original order
                return 0;
            });
            
            if (sortedSocials && Array.isArray(sortedSocials)) {
                sortedSocials.forEach(link => {
                    if (link.url && link.type && link.type.toLowerCase() !== 'website') {
                      this.addSocialLink(link.type, link.url);
                    }
                });
            }

        } catch (error) {
            console.error('Error loading artist info:', error);
        }
    }

    addSocialLink(type, url) {
        if (!this.socialsContainer || !this.socialTemplate) return;
        
        const fragment = this.socialTemplate.content.cloneNode(true);
        const element = fragment.firstElementChild;

        element.href = url;
        
        // Fix: Uncomment and ensure the SVG use element's href is set
        const useElement = element.querySelector('use');

        if (useElement) {
            useElement.setAttribute('href', `#icon-${type.toLowerCase()}`);
        }
        
        console.log(`Adding ${type} social link:`, url);
        this.socialsContainer.appendChild(element);
    }

    toSentenceCase(str) {
        return str.split('\n')
            .map(line => line
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            )
            .map((line, idx, arr) => idx < arr.length - 1 ? line + ' &bullet; ' : line)
            .join('');
    }

    async loadShows() {
        this.container.innerHTML = '<div class="text-center text-gray-400">Loading shows...</div>';

        try {
            // Get all shows and filter on client side
            const response = await fetch(`https://rest.bandsintown.com/artists/${ARTIST_NAME}/events?app_id=${API_KEY}&date=all`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            console.log('All shows:', data);

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No events found');
            }

            // Filter for upcoming shows only
            const now = new Date();
            const upcomingShows = data
                .filter(event => {
                    const eventDate = new Date(event.datetime);
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                    return eventDay >= today;
                })
                .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

            console.log('Filtered upcoming shows:', upcomingShows);
            
            if (upcomingShows.length === 0) {
                throw new Error('No upcoming shows');
            }

            this.container.innerHTML = '';
            this.renderShows(upcomingShows);

        } catch (error) {
            console.error('Error:', error);
            this.container.innerHTML = `<div class="text-center text-gray-400">
                ${error.message === 'No upcoming shows' ? 'No upcoming shows listed.' : 'Error loading shows. Try again later.'}
            </div>`;
        }
    }

    renderShows(shows) {
        shows.forEach((event, index) => {
            const fragment = this.template.content.cloneNode(true);
            const datetime = new Date(event.datetime);

            const showData = {
                date: datetime.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit'}),
                time: datetime.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true}).toUpperCase(),
                desc: this.toSentenceCase(event.description || 'No description available'),
                venueName: event.venue.name,
                venueCity: event.venue.city,
                url: event.url,
                artistImage: event?.artist?.image_url || './images/hero/hero-1.png'
            };

            // Wrap each show in its own card with 75% width
            // const cardDiv = document.createElement('div');
            // cardDiv.className = `p-6 pt-6 text-gray-100 w-3/4 position-relative ${index < shows.length - 1 ? 'mb-8' : ''}`;
            // cardDiv.style.backgroundColor = '#0e0e0e';

            const html = fragment.firstElementChild.innerHTML
                .replace('${date}', showData.date)
                .replace('${time}', showData.time)
                .replace('${desc}', showData.desc)
                .replace('${venueName}', showData.venueName)
                .replace('${venueCity}', showData.venueCity)
                .replace('${artistImage}', showData.artistImage)
                .replace('${url}', showData.url);

            fragment.firstElementChild.innerHTML = html;
            // cardDiv.appendChild(fragment);
            this.container.appendChild(fragment);
        });
    }
}
