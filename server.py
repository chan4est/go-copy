from flask import Flask, jsonify
import requests
import html
import re
from collections import OrderedDict

app = Flask(__name__)
pokemon_names = None

class PokemonNames():
    def __init__(self) -> None:
        self.pokemon_dict = {}
        self.length = 0
        self.bulbaurl = 'https://bulbapedia.bulbagarden.net/wiki/List_of_{}_Pok%C3%A9mon_names'
        ## Test the REGEX on https://regex101.com/
        self.languages = [
            {'name': 'English', 'searchregex': 'title=\\"([^(]*) \\(Pokémon\\)', 'tlc': 'EN'},
            {'name': 'Japanese', 'searchregex': '.*title="ja:([^(]*)".*', 'tlc': 'JP'},
            {'name': 'Korean', 'searchregex': '.*lang="ko">([^(]*).*', 'tlc': 'KR'}
        ]
        self.initialize_list()
    
    def initialize_list(self) -> None:
        for language in self.languages:
            pokemon_html = requests.get(self.bulbaurl.format(language['name']))
            pokemon_html = html.unescape(pokemon_html.text)
            pokemon_names = []
            for line in pokemon_html.splitlines():
                individual_pokemon = re.findall(language['searchregex'], line)
                if individual_pokemon:
                    pokemon_names.append(individual_pokemon[0])
            ## Initialilize dict w/ English data
            if language['name'] == 'English':
                ## Trim off the first because it's Victini for some reason
                pokemon_names = pokemon_names[1:len(pokemon_names)]
                ## Remove the duplicate forms (ex: Alolan Rattata)
                pokemon_names = list(OrderedDict.fromkeys(pokemon_names))
                for i in range(len(pokemon_names)):
                    english_name = pokemon_names[i]
                    ## Lowercase for the images on pokemondb.net
                    english_name_html = english_name.lower()
                    ## Replace the spaces for Paradox Pokemon (ex: "iron bundle" -> "iron-bundle")
                    if (" " in english_name):
                        english_name_html = english_name_html.replace(" ", "-")
                    ## Replace the apostrophe for Pokemon like Farfetch'd (ex: farfetch'd -> "farfetchd")
                    if ("\'" in english_name):
                        english_name_html = english_name_html.replace("\'", "")
                    pokemon_data = {
                        "number": i+1,
                        "EN_name": english_name,
                        "sprite_image": "https://img.pokemondb.net/sprites/home/normal/{}.png".format(english_name_html)
                    }
                    self.pokemon_dict[i+1] = pokemon_data
            ## Run through the remaining languages
            else:
                for i in range(len(pokemon_names)):
                    self.pokemon_dict[i+1]['{}_name'.format(language['tlc'])] = pokemon_names[i]

@app.route('/pokemon_names', methods=['GET'])
def pokemon_names():
    resp = jsonify(pokemon_names.pokemon_dict)
    resp.status_code = 200
    return resp

if __name__ == "__main__":
    pokemon_names = PokemonNames()
    app.run()