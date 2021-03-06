# node_trie_dictionary

The following sample code uses a trie as the basis for a dictionary of place names.  
The goal being to escape these words before submitting them to a translation service. This would then be used with some form of NLP like https://LUIS.ai.  
The dictionary is loaded from a static file "dict.txt", but this could just as easily be provided as a module containing the ready made array of dictionary entries.  

The logic used in the dictionary check is based on the compound place names found in Germany, but can be readily modified to be used with other cultures; the addition of a cultural modifier would be a simple change to allow a different logical processing of the input text.  

The goal was to quickly process short utterances, not long texts, and as such this is not optimized for escaping extremely long texts.  

The tradenames Rossmanns and Kaufland remain the property of their respective owners, and are only used to show how a common brand name can be used within the dictionary as an
additional "non-translatable" word.

The sample uses the resig-trie npm package, which is provided with an MIT license.
