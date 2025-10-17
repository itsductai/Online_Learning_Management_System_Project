from fast_autocomplete import AutoComplete
from memory_cache import cache


def suggest(word):
    sentences = cache.data
    words = {item: {} for item in sentences}

    # Initialize AutoComplete
    autocomplete = AutoComplete(words=words)
    # Get suggestions
    return autocomplete.search(word, max_cost=3, size=100)
