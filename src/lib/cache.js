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
        
        this.retrieve = (key) => {
            const entry = super.get(key);
            if (entry && entry.expiresAt > Date.now()) {
                hits++;
                return entry;
            } else {
                misses++;
                return null;
            }
        }
        
        this.store = (key, value) => {
            value.cached = true;
            super.set(key, value);
        }
        
        this.reportStats = () => {
            let entries = 0;
            
            super.forEach((value, key, map) => {
                if (value.expiresAt > Date.now()) { entries++; }
            });
            
            return {entries, hits, misses, ttlSeconds};
        }
    }
}