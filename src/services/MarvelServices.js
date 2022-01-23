class MarvelServices {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=ffb6264e66978431e1886839251560ad';
    _baseOffsetCharacter = 210;

    getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    getAllCharacters = async (offset = this._baseOffsetCharacter) => {
        const res = await this.getResource(
            `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
        );
        return res.data.results.map(this._transformCharacter);
    };

    getCharacter = async (id) => {
        const res = await this.getResource(
            `${this._apiBase}characters/${id}?${this._apiKey}`
        );

        return this._transformCharacter(res.data.results[0]);
    };

    _transformCharacter = (res) => {
        return {
            id: res.id,
            name: res.name,
            description: res.description
                ? `${res.description.slice(0, 200)}...`
                : 'there is no data about the character',
            thumbnail: res.thumbnail.path + '.' + res.thumbnail.extension,
            homepage: res.urls[0].url,
            wiki: res.urls[1].url,
            comics: res.comics.items.slice(0, 10),
        };
    };
}

export default MarvelServices;
