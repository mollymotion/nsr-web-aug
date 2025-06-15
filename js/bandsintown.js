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
            
            
            if (socials && Array.isArray(artist.links)) {
                socials.forEach(link => {
                    if (link.url && link.type) {
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
        this.container.innerHTML = '<div class="text-center">Loading shows...</div>';

        try {
            const response = await fetch(`https://rest.bandsintown.com/artists/${ARTIST_NAME}/events?app_id=${API_KEY}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            console.log('Shows Response:', data);

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No events found');
            }

            this.container.innerHTML = '';
            this.renderShows(data);

        } catch (error) {
            console.error('Error:', error);
            this.container.innerHTML = `<p class="text-white/60 col-span-full">
                ${error.message === 'No events found' ? 'No upcoming shows listed.' : 'Error loading shows. Try again later.'}
            </p>`;
        }
    }

    renderShows(shows) {
        shows.forEach((event) => {
            const fragment = this.template.content.cloneNode(true);
            const datetime = new Date(event.datetime);

            const showData = {
                date: datetime.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit'}),
                time: datetime.toLocaleTimeString('en-US', {hour: 'numeric', hour12: true}).toUpperCase(),
                desc: this.toSentenceCase(event.description || 'No description available'),
                venueName: event.venue.name,
                venueCity: event.venue.city,
                url: event.url,
                artistImage: event.artist.image_url || 'https://placehold.co/400'
            };

            const html = fragment.firstElementChild.innerHTML
                .replace('${date}', showData.date)
                .replace('${time}', showData.time)
                .replace('${desc}', showData.desc)
                .replace('${venueName}', showData.venueName)
                .replace('${venueCity}', showData.venueCity)
                .replace('${artistImage}', showData.artistImage)
                .replace('${url}', showData.url);

            fragment.firstElementChild.innerHTML = html;
            this.container.appendChild(fragment);
        });
    }
}
