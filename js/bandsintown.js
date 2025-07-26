const API_KEY = '6284b825fee359c4a992c4533a3499f5';
const ARTIST_NAME = 'None%20Shall%20Remain';

export default class BandsInTown {
    constructor() {
        this.container = document.getElementById("shows-container");
        this.showTemplate = document.getElementById("tpl_shows");
        this.sectionTemplate = document.getElementById("tpl_shows_section");
        this.socialsContainer = document.getElementById("socials");
        this.socialTemplate = document.getElementById("tpl_social");

        if (!this.container || !this.showTemplate || !this.sectionTemplate) {
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
                    if (link.url && link.type && link.type.toLowerCase() !== 'website' && link.type.toLowerCase() !== 'shazam') {
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
            // Use 'upcoming' to get only future shows - much simpler!
            const response = await fetch(`https://rest.bandsintown.com/artists/${ARTIST_NAME}/events?app_id=${API_KEY}&date=upcoming`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            console.log('Upcoming shows:', data);

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No upcoming shows');
            }

            // Data is already filtered by the API, just sort by date
            const sortedShows = data.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

            this.container.innerHTML = '';
            this.renderShows(sortedShows);

        } catch (error) {
            console.error('Error:', error);
            this.container.innerHTML = `<div class="text-center text-gray-400">
                ${error.message === 'No upcoming shows' ? 'No upcoming shows listed.' : 'Error loading shows. Try again later.'}
            </div>`;
        }
    }

    renderShows(shows) {
        if (shows.length === 0) return;

        // Create the main shows section layout with artist images
        const sectionFragment = this.sectionTemplate.content.cloneNode(true);
        const thumbUrl = shows[0]?.artist?.thumb_url || '';
        const artistImage = shows[0]?.artist?.image_url || '';
        
        // Replace both image placeholders in the section template
        const sectionHtml = sectionFragment.firstElementChild.innerHTML
            .replace('${thumbUrl}', thumbUrl)
            .replace('${artistImage}', artistImage);
        sectionFragment.firstElementChild.innerHTML = sectionHtml;

        // Add the section layout to the container
        this.container.appendChild(sectionFragment);

        // Now find the shows list container within the newly added section
        const showsList = this.container.querySelector('#shows-list');
        
        // Add individual show cards to the shows list
        shows.forEach((event, index) => {
            const fragment = this.showTemplate.content.cloneNode(true);
            const datetime = new Date(event.datetime);

            const showData = {
                date: datetime.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit'}),
                time: datetime.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true}).toUpperCase(),
                desc: this.toSentenceCase(event.description),
                venueName: event.venue.name,
                venueCity: event.venue.city,
                url: event.url
            };

            console.log('Show URL:', showData.url);

            const showElement = fragment.firstElementChild;
            showElement.href = showData.url;

            const html = showElement.innerHTML
                .replace('${date}', showData.date)
                .replace('${time}', showData.time)
                .replace('${desc}', showData.desc)
                .replace('${venueName}', showData.venueName)
                .replace('${venueCity}', showData.venueCity);

            showElement.innerHTML = html;
            showsList.appendChild(fragment);
        });
    }
}
