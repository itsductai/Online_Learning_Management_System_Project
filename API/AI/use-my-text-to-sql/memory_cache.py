class Cache:
    def __init__(self, max_size=1000):
        self.max_size = max_size
        self.data = set()

    def add(self, item):
        if len(self.data) >= self.max_size:
            # Remove the oldest item (FIFO behavior)
            self.data.pop()
        self.data.add(item)

    def get(self):
        return self.data


cache = Cache()


async def add_to_cache(item):
    cache.add(item)
