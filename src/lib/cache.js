// TODO (you): an in-memory cache where each entry expires after a set time.
// It needs a way to get a value (counting a hit or a miss), store a value,
// and report { entries, hits, misses, ttlSeconds }. The exact counting rules
// are on the assignment page. A Map with { value, expiresAt } entries works well.

export class Cache extends Map {
    constructor(ttlSeconds) {
        super();
        this.ttlSeconds = ttlSeconds;
        this.hits = 0;
        this.misses = 0;
    }
    
    retrieve(key) {
        const entry = super.get(key);
        
        if (entry && entry.expiresAt > Date.now()) {
            console.log(`Cache hit on ${key}`);
            this.hits++;
            return entry;
            
        } else {
            console.log(`Cache missed on ${key}`);
            this.misses++;
            return null;
        }
    }
    
    store(key, value) {
        const newValue = Object.assign({}, value, {expiresAt: Date.now() + this.ttlSeconds * 1000, cached: true});
        super.set(key, newValue);
    }
    
    reportStats() {
        let entries = 0;
        
        super.forEach((value, key, map) => {
            if (value.expiresAt > Date.now()) { entries++; }
        });
        
        return {entries, hits: this.hits, misses: this.misses, ttlSeconds: this.ttlSeconds};
    }
}