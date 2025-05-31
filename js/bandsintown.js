class BandsInTown {
  constructor(artistName, appId) {
    this.artistName = artistName;
    this.appId = appId;
    this.baseUrl = 'https://rest.bandsintown.com';
    this.events = [];
  }

  async fetchEvents() {
    try {
      const response = await fetch(
        `${this.baseUrl}/artists/${encodeURIComponent(this.artistName)}/events?app_id=${this.appId}`
      );
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const rawEvents = await response.json();
      
      // Transform raw event data into a more flexible format
      this.events = rawEvents.map(event => {
        const datetime = new Date(event.datetime);
        
        return {
          id: event.id,
          datetime: {
            raw: event.datetime,
            formatted: {
              date: datetime.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              }),
              time: datetime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }).toUpperCase(),
              full: datetime.toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short'
              })
            }
          },
          venue: {
            name: event.venue.name,
            city: event.venue.city,
            region: event.venue.region,
            country: event.venue.country,
            latitude: event.venue.latitude,
            longitude: event.venue.longitude
          },
          lineup: event.lineup,
          description: event.description,
          ticketUrl: event.url,
          artist: {
            name: event.artist.name,
            imageUrl: event.artist.image_url
          }
        };
      });

      return this.events;

    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Helper methods for different view types
  getUpcomingEvents(limit = null) {
    const now = new Date();
    const upcoming = this.events
      .filter(event => new Date(event.datetime.raw) > now)
      .sort((a, b) => new Date(a.datetime.raw) - new Date(b.datetime.raw));
    
    return limit ? upcoming.slice(0, limit) : upcoming;
  }

  getEventsByMonth() {
    return this.events.reduce((acc, event) => {
      const month = new Date(event.datetime.raw).toLocaleString('en-US', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(event);
      return acc;
    }, {});
  }
}

export default BandsInTown;
