export const normalizeQueue = (queue) => {

    if (!queue) return [];

    const { songs } = queue;
    return songs.map(song => ({
        id: song.id,
        name: song.name,
        thumbnail: song.thumbnail,
        artist: {
            name: song.uploader.name
        },
    }));
};