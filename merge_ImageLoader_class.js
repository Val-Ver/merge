class ImageLoader {
    constructor() {
        this.cache = new Map();   // key -> HTMLImageElement
        this.loading = new Map(); // key -> Promise
    }

    // Загрузить одно изображение
    loadImage(url) {
        if (this.cache.has(url)) return Promise.resolve(this.cache.get(url));
        if (this.loading.has(url)) return this.loading.get(url);

        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(url, img);
                this.loading.delete(url);
                resolve(img);
            };
            img.onerror = () => {
                this.loading.delete(url);
                reject(new Error(`Failed to load image: ${url}`));
            };
            img.src = url;
        });
        this.loading.set(url, promise);
        return promise;
    }

    // Загрузить несколько изображений
    loadAll(images) {
        return Promise.all(images.map(url => this.loadImage(url)));
    }

    getImage(url) {
        return this.cache.get(url);
    }
}

class AssetManager {
    constructor(itemDefinitions) {
        this.imageLoader = new ImageLoader();
        this.imagePaths = this.collectAllImagePaths(itemDefinitions);
    }

    collectAllImagePaths(items) {
        const paths = new Set();
        for (const category of Object.values(items)) {
            if (category.set) {
                for (const level of Object.values(category.set)) {
                    if (level.pic && typeof level.pic === 'string' && level.pic.endsWith('.png')) {
                        paths.add(level.pic);
                    }
                    // Если есть breed-версии
                    if (level.blackDragon?.pic) paths.add(level.blackDragon.pic);
                    if (level.redDragon?.pic) paths.add(level.redDragon.pic);
                }
            }
        }
        return Array.from(paths);
    }

    async loadAll() {
        await this.imageLoader.loadAll(this.imagePaths);
    }

    getImage(picPath) {
        return this.imageLoader.getImage(picPath);
    }
}